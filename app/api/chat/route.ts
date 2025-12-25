
import { GoogleGenAI, Content, Part } from '@google/genai';
import { Message, Role } from '../../../types';

// This is a placeholder for a server environment that can handle this route.
// In a Next.js app, this file would be a Route Handler.
// The execution environment must provide the process.env.API_KEY.

// Helper to convert client-side messages to Gemini API format
const toGeminiMessages = (messages: Message[]): Content[] => {
  const history: Content[] = [];
  let currentParts: Part[] = [];

  for (const msg of messages) {
    if (msg.role === 'user') {
      // If there are pending model parts, push them as a model message first
      if (currentParts.length > 0) {
        history.push({ role: 'model', parts: currentParts });
        currentParts = [];
      }
      history.push({ role: 'user', parts: [{ text: msg.content }] });
    } else if (msg.role === 'model') {
      currentParts.push({ text: msg.content });
    }
  }
  // Push any remaining model parts
  if (currentParts.length > 0) {
     history.push({ role: 'model', parts: currentParts });
  }

  return history;
};


// This function simulates a POST request handler for the path /api/chat
// In a real server environment (like Next.js, Express, etc.), you would export this.
export async function POST(req: { json: () => Promise<{ messages: Message[], modelId: string }> }): Promise<Response> {
  try {
    const { messages, modelId } = await req.json();

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages are required' }), { status: 400 });
    }
    
    if (!modelId) {
        return new Response(JSON.stringify({ error: 'modelId is required' }), { status: 400 });
    }

    // TODO: Check if user has an active subscription or sufficient credits.

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error('API_KEY environment variable not set on the server.');
    }

    const ai = new GoogleGenAI({ apiKey, vertexai: true });
    
    const geminiMessages = toGeminiMessages(messages.slice(0, -1));
    const lastMessage = messages[messages.length - 1];

    const chat = ai.chats.create({
        model: modelId,
        history: geminiMessages,
    });

    const result = await chat.sendMessageStream({ message: lastMessage.content });

    // Create a ReadableStream to send back to the client
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of result) {
          const text = chunk.text;
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });

  } catch (error) {
    console.error('/api/chat error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: 'Failed to process chat stream.', details: errorMessage }), { status: 500 });
  }
}

// In a non-Next.js environment, you might need a simple server like this:
/*
import { createServer } from 'http';

const server = createServer(async (req, res) => {
  if (req.url === '/api/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      const mockReq = { json: async () => JSON.parse(body) };
      const response = await POST(mockReq);
      
      res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
      if (response.body) {
        for await (const chunk of response.body) {
          res.write(chunk);
        }
      }
      res.end();
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
*/
// The above server is commented out as the execution environment handles routing.
