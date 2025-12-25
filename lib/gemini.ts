
import { GoogleGenAI, Chat } from '@google/genai';
import { Message, Role } from '../types.ts';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY, vertexai: true });

class GeminiService {
  private initializeChat(history: { role: Role; parts: { text: string }[] }[], modelId: string): Chat {
    return ai.chats.create({
      model: modelId,
      history: history,
      config: {
        systemInstruction: 'You are a helpful and creative AI assistant.',
      },
    });
  }

  async streamMessage(
    messages: Message[],
    modelId: string,
    onChunk: (chunk: string) => void,
    onError: (error: string) => void
  ) {
    if (!API_KEY) {
      onError("API key is not configured. Please set the API_KEY environment variable.");
      return;
    }

    const history = messages.slice(0, -1).map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }));

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'user') {
      onError("Invalid message sequence. Last message must be from the user.");
      return;
    }

    try {
      const chat = this.initializeChat(history, modelId);
      const result = await chat.sendMessageStream({ message: lastMessage.content });

      for await (const chunk of result) {
        // In streaming mode, the response is just the text.
        onChunk(chunk.text);
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      onError(error instanceof Error ? error.message : 'An unknown error occurred.');
    }
  }
}

export const geminiService = new GeminiService();
