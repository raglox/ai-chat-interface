
import { Message } from '../types.ts';

class ApiService {
  async streamMessage(
    messages: Message[],
    modelId: string,
    onChunk: (chunk: string) => void,
    onError: (error: string) => void
  ) {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages, modelId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || `Request failed with status ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Response body is empty.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        onChunk(chunk);
      }
    } catch (error) {
      console.error('API stream error:', error);
      onError(error instanceof Error ? error.message : 'An unknown error occurred while fetching the stream.');
    }
  }
}

export const apiService = new ApiService();
