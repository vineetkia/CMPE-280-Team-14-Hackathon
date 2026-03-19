/**
 * GLSL Shaders for the Siri-style voice orb.
 *
 * The fragment shader creates a glowing sphere with:
 *  - Signed-distance-field sphere with smooth edge
 *  - Simplex noise-driven fluid colour bands (pink/cyan/green/purple)
 *  - Bright white-hot core bloom
 *  - Glass specular highlight
 *  - Sphere rim darkening + rim light
 *  - Ambient particles
 *  - State-driven intensity, speed, and colour temperature
 */

// ─── Vertex shader (passthrough fullscreen quad) ─────────────
export const vertexShader = /* glsl */ `
  attribute vec2 a_position;
  varying vec2 v_uv;

  void main() {
    v_uv = a_position * 0.5 + 0.5;       // 0..1
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// ─── Fragment shader ─────────────────────────────────────────
export const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 v_uv;

  uniform float u_time;
  uniform float u_intensity;       // 0.0 = idle … 1.0 = max active
  uniform float u_speed;           // animation speed multiplier
  uniform vec2  u_resolution;
  uniform vec3  u_color1;          // primary shard colour
  uniform vec3  u_color2;          // secondary
  uniform vec3  u_color3;          // tertiary
  uniform vec3  u_color4;          // quaternary
  uniform vec3  u_coreColor;       // centre bloom tint
  uniform float u_audioLevel;      // 0..1 from microphone / TTS

  // ── Simplex 3D noise ──────────────────────────────────────
  vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 1.0 / 7.0;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x  = x_ * ns.x + ns.yyyy;
    vec4 y  = y_ * ns.x + ns.yyyy;
    vec4 h  = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  // ── Fractional Brownian Motion (layered noise) ────────────
  float fbm(vec3 p) {
    float val = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    for (int i = 0; i < 5; i++) {
      val += amp * snoise(p * freq);
      freq *= 2.0;
      amp *= 0.5;
    }
    return val;
  }

  // ── Hash for particles ────────────────────────────────────
  float hash(vec2 p) {
    float h = dot(p, vec2(127.1, 311.7));
    return fract(sin(h) * 43758.5453);
  }

  void main() {
    // Normalised coordinates centred at origin
    vec2 uv = (v_uv - 0.5) * 2.0;
    float aspect = u_resolution.x / u_resolution.y;
    uv.x *= aspect;

    float t = u_time * u_speed;
    float dist = length(uv);

    // Audio-reactive radius modulation
    float audioBoost = u_audioLevel * 0.08 * u_intensity;
    float sphereR = 0.72 + audioBoost;

    // ── Sphere SDF with noise distortion ────────────────
    float noiseScale = 2.5 + u_intensity * 1.5;
    float noiseAmp = 0.03 + u_intensity * 0.04 + u_audioLevel * 0.03;
    float surfaceNoise = snoise(vec3(uv * noiseScale, t * 0.4)) * noiseAmp;
    float sdf = dist - sphereR - surfaceNoise;

    // Smooth sphere edge
    float sphere = 1.0 - smoothstep(-0.015, 0.025, sdf);

    if (sphere < 0.001) {
      // ── Outside sphere: particles + atmosphere ────────
      float atmo = exp(-max(sdf, 0.0) * 6.0) * 0.25 * (0.5 + u_intensity * 0.5);
      vec3 atmoColor = mix(u_color1, u_color2, 0.5) * atmo;

      // Particles
      float particles = 0.0;
      for (int i = 0; i < 20; i++) {
        float fi = float(i);
        float angle = fi * 2.399 + t * (0.15 + fi * 0.01);
        float radius = 0.82 + 0.15 * hash(vec2(fi, 1.0)) + 0.05 * sin(t * 0.5 + fi);
        vec2 pPos = vec2(cos(angle), sin(angle)) * radius;
        float d = length(uv - pPos);
        float size = 0.004 + 0.003 * hash(vec2(fi, 2.0));
        float brightness = smoothstep(size, 0.0, d) * (0.3 + 0.7 * u_intensity);
        brightness *= (0.5 + 0.5 * sin(t * 2.0 + fi * 3.14));
        particles += brightness;
      }

      vec3 particleColor = mix(u_color2, u_color3, 0.5) * particles;
      gl_FragColor = vec4(atmoColor + particleColor, max(atmo, particles * 0.8));
      return;
    }

    // ── Inside the sphere ───────────────────────────────

    // Normalised position within sphere (0 at centre, 1 at edge)
    float r = dist / sphereR;

    // ── 1. Deep background ──────────────────────────────
    vec3 bg = vec3(0.05, 0.03, 0.12);

    // ── 2. Fluid colour bands (noise-driven) ────────────
    // Multiple noise layers at different scales create the flowing
    // prismatic bands visible in the Siri reference
    vec3 noiseCoord1 = vec3(uv * 1.8, t * 0.3);
    vec3 noiseCoord2 = vec3(uv.yx * 2.2 + 3.0, t * 0.25 + 10.0);
    vec3 noiseCoord3 = vec3(uv * 3.0 + 7.0, t * 0.4 + 5.0);

    float n1 = fbm(noiseCoord1) * 0.5 + 0.5;
    float n2 = fbm(noiseCoord2) * 0.5 + 0.5;
    float n3 = snoise(noiseCoord3) * 0.5 + 0.5;

    // Blend colours using noise as weight
    vec3 fluidColor = mix(u_color1, u_color2, n1);
    fluidColor = mix(fluidColor, u_color3, n2 * 0.6);
    fluidColor = mix(fluidColor, u_color4, n3 * 0.4);

    // Create sharp-ish bands for the crystalline look
    float bandMask = smoothstep(0.35, 0.65, n1) + smoothstep(0.3, 0.7, n2) * 0.7;
    bandMask = clamp(bandMask, 0.0, 1.0);

    // Intensity modulation — boosted for vibrancy at small sizes
    float colorStrength = bandMask * (0.8 + 0.5 * u_intensity) * (1.0 + u_audioLevel * 0.4);
    vec3 bands = fluidColor * colorStrength * 1.3;

    // ── 3. Directional light streaks ────────────────────
    float streak1Angle = t * 0.5;
    float streak2Angle = t * 0.35 + 2.094;
    float streak3Angle = t * 0.45 + 4.188;

    vec2 streakDir1 = vec2(cos(streak1Angle), sin(streak1Angle));
    vec2 streakDir2 = vec2(cos(streak2Angle), sin(streak2Angle));
    vec2 streakDir3 = vec2(cos(streak3Angle), sin(streak3Angle));

    float s1 = pow(max(dot(normalize(uv), streakDir1), 0.0), 4.0 + u_intensity * 4.0);
    float s2 = pow(max(dot(normalize(uv), streakDir2), 0.0), 5.0 + u_intensity * 3.0);
    float s3 = pow(max(dot(normalize(uv), streakDir3), 0.0), 6.0 + u_intensity * 2.0);

    vec3 streaks = u_color1 * s1 * 0.7
                 + u_color3 * s2 * 0.55
                 + u_color2 * s3 * 0.5;
    streaks *= (0.6 + 0.5 * u_intensity) * (1.0 - r * 0.4);

    // ── 4. Core bloom ───────────────────────────────────
    float coreR = 0.2 + 0.06 * sin(t * 1.5) + u_audioLevel * 0.1;
    float core = exp(-r * r / (coreR * coreR)) * (0.8 + 0.3 * u_intensity);
    vec3 coreGlow = mix(vec3(1.0), u_coreColor, 0.25) * core;

    // White hot centre dot
    float dot_ = exp(-r * r / 0.004) * (0.9 + 0.2 * u_intensity);
    coreGlow += vec3(1.0) * dot_;

    // ── 5. Specular highlight ───────────────────────────
    vec2 specPos = vec2(-0.22, -0.28) * sphereR;
    float specDist = length(uv - specPos);
    float spec = exp(-specDist * specDist / (0.06 * sphereR * sphereR));
    spec *= 0.35;
    vec3 specular = vec3(1.0) * spec;

    // ── 6. Rim darkening + rim light ────────────────────
    float rim = smoothstep(0.55, 1.0, r);
    float rimDark = rim * 0.5;
    float rimLight = pow(rim, 3.0) * 0.25 * (0.5 + 0.5 * u_intensity);

    // ── Combine all layers ──────────────────────────────
    vec3 color = bg;
    color += bands;
    color += streaks;
    color += coreGlow;
    color += specular;
    color += vec3(0.6, 0.7, 1.0) * rimLight;
    color *= (1.0 - rimDark);

    // Final alpha with smooth sphere edge
    float alpha = sphere;

    // Subtle vignette inside sphere
    color *= 1.0 - r * r * 0.1;

    // Tone mapping (Reinhard — tuned for vibrancy)
    color = color / (color + vec3(0.6));
    color = pow(color, vec3(0.9));

    gl_FragColor = vec4(color, alpha);
  }
`;
