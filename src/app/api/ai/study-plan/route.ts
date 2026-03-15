import { NextRequest } from 'next/server';
import { POST as chatHandler } from '../../chat/route';

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Override feature to study-plan and ensure streaming
  const modifiedBody = {
    ...body,
    feature: 'study-plan',
    stream: true,
    messages: body.messages || [{ role: 'user', content: 'Create a personalized study plan based on my current tasks, assignments, and schedule.' }],
  };

  // Create a new request with modified body
  const modifiedRequest = new NextRequest(request.url, {
    method: 'POST',
    headers: request.headers,
    body: JSON.stringify(modifiedBody),
  });

  return chatHandler(modifiedRequest);
}
