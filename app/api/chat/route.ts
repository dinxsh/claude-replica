import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages, model } = await req.json();

  const result = await streamText({
    model: anthropic(model || 'claude-3-5-sonnet-20240620'),
    messages,
    maxTokens: 1024,
  });

  return result.toDataStreamResponse();
} 