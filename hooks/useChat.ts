
import { useState, useCallback } from 'react';
import { Message } from '../types.ts';
import { geminiService } from '../lib/gemini.ts';
// Fix: Corrected import path to point to the actual file name `useTheme.ts`.
import { useSettings } from './useTheme.ts';

export const useChat = (initialMessages: Message[]) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedModel } = useSettings();

  const sendMessage = useCallback(async (content: string, onUpdate?: (messages: Message[]) => void) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
    };

    const currentMessages = onUpdate ? initialMessages : messages;
    const updatedMessages = [...currentMessages, userMessage];
    
    setMessages(updatedMessages);
    if (onUpdate) onUpdate(updatedMessages);

    setIsLoading(true);
    setError(null);

    const modelMessageId = `model-${Date.now()}`;
    
    setMessages(prev => [...prev, { id: modelMessageId, role: 'model', content: '', isStreaming: true }]);
    if (onUpdate) onUpdate([...updatedMessages, { id: modelMessageId, role: 'model', content: '', isStreaming: true }]);


    await geminiService.streamMessage(
      updatedMessages,
      selectedModel.id,
      (chunk) => {
        setMessages(prev => {
          const newMessages = prev.map(msg =>
            msg.id === modelMessageId
              ? { ...msg, content: msg.content + chunk }
              : msg
          );
          if (onUpdate) onUpdate(newMessages);
          return newMessages;
        });
      },
      (err) => {
        setError(err);
        setMessages(prev => {
            const newMessages = prev.filter(msg => msg.id !== modelMessageId);
            if(onUpdate) onUpdate(newMessages);
            return newMessages;
        });
        setIsLoading(false);
      }
    );

    setMessages(prev => {
        const newMessages = prev.map(msg =>
            msg.id === modelMessageId ? { ...msg, isStreaming: false } : msg
        );
        if (onUpdate) onUpdate(newMessages);
        return newMessages;
    });
    setIsLoading(false);
  }, [messages, selectedModel, initialMessages]);

  return { messages, isLoading, error, sendMessage };
};
