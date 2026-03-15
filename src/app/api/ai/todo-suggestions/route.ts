import { NextRequest } from 'next/server';
import { POST as chatHandler } from '../../chat/route';

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Override to todo-suggestions feature, non-streaming for JSON parsing
  const modifiedBody = {
    ...body,
    feature: 'todo-suggestions',
    stream: false,
    messages: body.messages || [{ role: 'user', content: 'Based on my current assignments, events, and existing todos, suggest new todos I should create to stay on track.' }],
  };

  const modifiedRequest = new NextRequest(request.url, {
    method: 'POST',
    headers: request.headers,
    body: JSON.stringify(modifiedBody),
  });

  return chatHandler(modifiedRequest);
}
