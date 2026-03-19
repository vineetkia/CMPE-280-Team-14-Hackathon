/**
 * OrbRenderer — lightweight WebGL2 renderer for the Siri orb shader.
 *
 * Draws a fullscreen quad and passes uniforms for time, state, colours,
 * and audio level to the fragment shader.  No Three.js dependency.
 */

import { vertexShader, fragmentShader } from '../shaders/siri-orb.glsl';

// ── Types ────────────────────────────────────────────────────
export interface OrbConfig {
  intensity: number;       // 0..1   how "active" the orb looks
  speed: number;           // animation speed multiplier (1 = normal)
  colors: [string, string, string, string];  // 4 hex colours
  coreColor: string;       // hex — centre bloom tint
  audioLevel: number;      // 0..1   microphone / TTS amplitude
}

const DEFAULT_CONFIG: OrbConfig = {
  intensity: 0.4,
  speed: 1.0,
  colors: ['#f472b6', '#38bdf8', '#34d399', '#a78bfa'],
  coreColor: '#e0e7ff',
  audioLevel: 0.0,
};

// ── Helpers ──────────────────────────────────────────────────
function hexToVec3(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
}

function compileShader(gl: WebGL2RenderingContext, src: string, type: number): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile error: ${log}`);
  }
  return shader;
}

function createProgram(gl: WebGL2RenderingContext, vs: string, fs: string): WebGLProgram {
  const program = gl.createProgram()!;
  const vertShader = compileShader(gl, vs, gl.VERTEX_SHADER);
  const fragShader = compileShader(gl, fs, gl.FRAGMENT_SHADER);
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Program link error: ${log}`);
  }
  // Detach & delete shaders after linking (they're baked into the program)
  gl.detachShader(program, vertShader);
  gl.detachShader(program, fragShader);
  gl.deleteShader(vertShader);
  gl.deleteShader(fragShader);
  return program;
}

// ── Uniform cache ────────────────────────────────────────────
interface Uniforms {
  u_time: WebGLUniformLocation | null;
  u_intensity: WebGLUniformLocation | null;
  u_speed: WebGLUniformLocation | null;
  u_resolution: WebGLUniformLocation | null;
  u_color1: WebGLUniformLocation | null;
  u_color2: WebGLUniformLocation | null;
  u_color3: WebGLUniformLocation | null;
  u_color4: WebGLUniformLocation | null;
  u_coreColor: WebGLUniformLocation | null;
  u_audioLevel: WebGLUniformLocation | null;
}

// ── Renderer class ───────────────────────────────────────────
export class OrbRenderer {
  private gl: WebGL2RenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private vao: WebGLVertexArrayObject | null = null;
  private raf = 0;
  private startTime = 0;
  private running = false;
  private canvas: HTMLCanvasElement;
  private uniforms: Uniforms | null = null;
  private size: number;  // explicit pixel size

  // Current config (lerped for smooth transitions)
  private current: OrbConfig = { ...DEFAULT_CONFIG };
  private target: OrbConfig = { ...DEFAULT_CONFIG };

  constructor(canvas: HTMLCanvasElement, size = 120) {
    this.canvas = canvas;
    this.size = size;
    this.init();
  }

  // ── Initialisation ──────────────────────────────────────
  private init() {
    const gl = this.canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: false,
      antialias: true,
      powerPreference: 'high-performance',
    });

    if (!gl) {
      // Try WebGL1 as final fallback
      console.warn('[OrbRenderer] WebGL2 not available');
      return;
    }
    this.gl = gl;

    // Compile program
    try {
      this.program = createProgram(gl, vertexShader, fragmentShader);
    } catch (e) {
      console.error('[OrbRenderer] Shader compilation failed:', e);
      this.gl = null;
      return;
    }

    gl.useProgram(this.program);

    // Cache uniform locations
    this.uniforms = {
      u_time: gl.getUniformLocation(this.program, 'u_time'),
      u_intensity: gl.getUniformLocation(this.program, 'u_intensity'),
      u_speed: gl.getUniformLocation(this.program, 'u_speed'),
      u_resolution: gl.getUniformLocation(this.program, 'u_resolution'),
      u_color1: gl.getUniformLocation(this.program, 'u_color1'),
      u_color2: gl.getUniformLocation(this.program, 'u_color2'),
      u_color3: gl.getUniformLocation(this.program, 'u_color3'),
      u_color4: gl.getUniformLocation(this.program, 'u_color4'),
      u_coreColor: gl.getUniformLocation(this.program, 'u_coreColor'),
      u_audioLevel: gl.getUniformLocation(this.program, 'u_audioLevel'),
    };

    // Fullscreen quad geometry: two triangles forming a quad (TRIANGLE_STRIP)
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);

    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(this.program, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    gl.bindVertexArray(null);

    // Blending for alpha
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Set initial canvas size immediately (don't wait for CSS layout)
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const px = Math.round(this.size * dpr);
    this.canvas.width = px;
    this.canvas.height = px;

    this.startTime = performance.now() / 1000;
  }

  // ── Public API ──────────────────────────────────────────
  get isAvailable() { return !!this.gl && !!this.program; }

  setConfig(config: Partial<OrbConfig>) {
    Object.assign(this.target, config);
  }

  start() {
    if (this.running || !this.gl) return;
    this.running = true;
    this.loop();
  }

  stop() {
    this.running = false;
    if (this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
  }

  destroy() {
    this.stop();
    if (this.gl && this.program) {
      this.gl.deleteProgram(this.program);
    }
    this.gl = null;
    this.program = null;
    this.uniforms = null;
  }

  // ── Render loop ─────────────────────────────────────────
  private loop = () => {
    if (!this.running) return;
    this.render();
    this.raf = requestAnimationFrame(this.loop);
  };

  private render() {
    const gl = this.gl;
    const u = this.uniforms;
    if (!gl || !this.program || !u) return;

    // Smooth lerp current → target
    this.current.intensity += (this.target.intensity - this.current.intensity) * 0.06;
    this.current.speed += (this.target.speed - this.current.speed) * 0.06;
    this.current.audioLevel += (this.target.audioLevel - this.current.audioLevel) * 0.15;
    this.current.colors = this.target.colors;
    this.current.coreColor = this.target.coreColor;

    // Resize canvas to CSS size × DPR
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    // Use clientWidth if available, otherwise fall back to explicit size
    const cssW = this.canvas.clientWidth || this.size;
    const cssH = this.canvas.clientHeight || this.size;
    const w = Math.round(cssW * dpr);
    const h = Math.round(cssH * dpr);

    // Skip render if dimensions are somehow zero
    if (w === 0 || h === 0) return;

    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }

    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(this.program);

    // Set uniforms
    const elapsed = performance.now() / 1000 - this.startTime;
    gl.uniform1f(u.u_time, elapsed);
    gl.uniform1f(u.u_intensity, this.current.intensity);
    gl.uniform1f(u.u_speed, this.current.speed);
    gl.uniform2f(u.u_resolution, w, h);
    gl.uniform1f(u.u_audioLevel, this.current.audioLevel);

    const [r1, g1, b1] = hexToVec3(this.current.colors[0]);
    const [r2, g2, b2] = hexToVec3(this.current.colors[1]);
    const [r3, g3, b3] = hexToVec3(this.current.colors[2]);
    const [r4, g4, b4] = hexToVec3(this.current.colors[3]);
    const [cr, cg, cb] = hexToVec3(this.current.coreColor);

    gl.uniform3f(u.u_color1, r1, g1, b1);
    gl.uniform3f(u.u_color2, r2, g2, b2);
    gl.uniform3f(u.u_color3, r3, g3, b3);
    gl.uniform3f(u.u_color4, r4, g4, b4);
    gl.uniform3f(u.u_coreColor, cr, cg, cb);

    // Draw fullscreen quad
    gl.bindVertexArray(this.vao);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.bindVertexArray(null);
  }
}
