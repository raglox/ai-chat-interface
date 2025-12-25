
import React, { useRef, useEffect } from 'react';
import { useChat } from '../../hooks/useChat.ts';
import ChatMessage from './ChatMessage.tsx';
import ChatInput from './ChatInput.tsx';
import { Message, ChatHistoryItem } from '../../types.ts';

interface ChatViewProps {
  chat: ChatHistoryItem;
  onUpdate: (updatedMessages: Message[]) => void;
}

const ChatView: React.FC<ChatViewProps> = ({ chat, onUpdate }) => {
  const { messages, isLoading, error, sendMessage } = useChat(chat.messages);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Sync local state changes back up to the parent (App.tsx)
    onUpdate(messages);
  }, [messages, onUpdate]);

  return (
    <div className="h-full flex flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
        <div className="max-w-3xl mx-auto w-full">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {error && (
            <div className="text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-md mt-4">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
      </div>
      <div className="px-4 md:px-6 pb-4 bg-light-bg dark:bg-dark-bg">
        <div className="max-w-3xl mx-auto">
          <ChatInput 
            onSendMessage={(content) => sendMessage(content)} 
            isLoading={isLoading}
            id={`chat-input-${chat.id}`}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatView;
