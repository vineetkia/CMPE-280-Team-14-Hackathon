import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPTS: Record<string, string> = {
  chat: `You are StudyPilot AI, a knowledgeable and encouraging study assistant for college students. You help students understand concepts, prepare for exams, write essays, and solve problems. Be concise but thorough. Use markdown formatting (headers, bullets, bold) for structure. If the student shares their study data, reference specific items to give personalized advice.`,

  'study-plan': `You are StudyPilot AI's study planner. Given the student's current todos, assignments, and calendar events, create a detailed, prioritized study plan. Organize by day with specific time blocks. Consider assignment due dates, exam dates, and existing commitments. Use markdown formatting with headers for each day and checkboxes for action items.`,

  'assignment-helper': `You are StudyPilot AI's assignment helper. The student needs help with a specific assignment. Provide guidance, explain relevant concepts, suggest approaches, and help them think through the problem. Do NOT write the entire assignment for them — teach them to understand the material. Use examples and analogies.`,

  'todo-suggestions': `You are StudyPilot AI's task planner. Given the student's upcoming assignments, exams, and calendar events, suggest specific, actionable todo items they should create to stay on track. Return ONLY a JSON array (no other text) with objects having these fields: title (string), description (string), priority ("low" | "medium" | "high"), category ("study" | "assignment" | "exam" | "project" | "other"), dueDate (ISO date string or null). Suggest 3-6 relevant todos.`,
};

function buildContextMessage(context: Record<string, unknown> | undefined): string {
  if (!context) return '';

  const parts: string[] = [];

  if (context.todos && Array.isArray(context.todos) && context.todos.length > 0) {
    parts.push('**Current Todos:**');
    for (const todo of context.todos) {
      const t = todo as Record<string, unknown>;
      parts.push(`- [${t.completed ? 'x' : ' '}] ${t.title} (${t.priority} priority, ${t.category})${t.dueDate ? ` — due ${t.dueDate}` : ''}`);
    }
  }

  if (context.assignments && Array.isArray(context.assignments) && context.assignments.length > 0) {
    parts.push('\n**Current Assignments:**');
    for (const assignment of context.assignments) {
      const a = assignment as Record<string, unknown>;
      parts.push(`- ${a.title} [${a.subject}] — ${a.status}, ${a.priority} priority, due ${a.dueDate}${a.description ? `: ${a.description}` : ''}`);
    }
  }

  if (context.events && Array.isArray(context.events) && context.events.length > 0) {
    parts.push('\n**Upcoming Events:**');
    for (const event of context.events) {
      const e = event as Record<string, unknown>;
      parts.push(`- ${e.title} (${e.type}) — ${e.date}`);
    }
  }

  return parts.length > 0 ? '\n\nHere is the student\'s current study data:\n' + parts.join('\n') : '';
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'cmpe-280-gpt-5.2-chat';

    if (!apiKey || !endpoint) {
      return NextResponse.json(
        { error: 'API key not configured', fallback: true },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { messages, context, feature = 'chat', stream = true } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array required' },
        { status: 400 }
      );
    }

    const systemPrompt = SYSTEM_PROMPTS[feature] || SYSTEM_PROMPTS.chat;
    const contextStr = buildContextMessage(context);

    // Build messages array for Chat Completions API
    const chatMessages = [
      { role: 'system', content: systemPrompt + contextStr },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    // Use Chat Completions API: {endpoint}chat/completions
    const apiUrl = `${endpoint.replace(/\/+$/, '')}/chat/completions`;

    const azureResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        model: deployment,
        messages: chatMessages,
        stream,
      }),
      signal: AbortSignal.timeout(60000),
    });

    if (!azureResponse.ok) {
      const status = azureResponse.status;
      const errorText = await azureResponse.text().catch(() => 'Unknown error');

      if (status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please wait a moment.', fallback: true },
          { status: 429 }
        );
      }
      if (status === 401) {
        return NextResponse.json(
          { error: 'Invalid API key', fallback: true },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: `Azure API error: ${errorText}`, fallback: true },
        { status: status }
      );
    }

    // Non-streaming mode
    if (!stream) {
      const data = await azureResponse.json();
      const text = data.choices?.[0]?.message?.content || '';
      return NextResponse.json({ text });
    }

    // Streaming mode - pipe Azure SSE through to client
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        const reader = azureResponse.body?.getReader();
        if (!reader) {
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith('data: ')) continue;

              const data = trimmed.slice(6);
              if (data === '[DONE]') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                continue;
              }

              try {
                const parsed = JSON.parse(data);
                // Chat Completions streaming format: choices[0].delta.content
                const textDelta = parsed.choices?.[0]?.delta?.content;

                if (textDelta) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ text: textDelta })}\n\n`)
                  );
                }
              } catch {
                // Skip malformed JSON
              }
            }
          }
        } catch (error) {
          console.error('Stream processing error:', error);
        } finally {
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
          reader.releaseLock();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', fallback: true },
      { status: 500 }
    );
  }
}
