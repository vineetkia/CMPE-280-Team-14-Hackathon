import { NextResponse } from 'next/server';

/**
 * GET /api/speech-token
 * Exchanges the Azure Speech API key for a short-lived token (~10 min).
 * The browser gets a token instead of the raw key — secure pattern.
 */
export async function GET() {
  const speechKey = process.env.AZURE_SPEECH_KEY;
  const speechRegion = process.env.AZURE_SPEECH_REGION;

  if (!speechKey || !speechRegion) {
    return NextResponse.json(
      { error: 'Speech service not configured' },
      { status: 503 }
    );
  }

  try {
    const tokenResponse = await fetch(
      `https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': speechKey,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': '0',
        },
        body: '',
      }
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('[speech-token] Token fetch failed:', tokenResponse.status, errorText);
      return NextResponse.json(
        { error: 'Failed to get speech token' },
        { status: tokenResponse.status }
      );
    }

    const token = await tokenResponse.text();
    return NextResponse.json({ token, region: speechRegion });
  } catch (error) {
    console.error('[speech-token] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
