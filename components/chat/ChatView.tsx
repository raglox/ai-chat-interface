
import React, { useRef, useEffect } from 'react';
import { useChat } from '../../hooks/useChat.ts';
import ChatMessage from './ChatMessage.tsx';
import ChatInput from './ChatInput.tsx';
import { Message, ChatHistoryItem } from '../../types.ts';
import { ICONS } from '../../constants.tsx';

interface ChatViewProps {
  chat: ChatHistoryItem;
  onUpdate: (updatedMessages: Message[]) => void;
  initialPrompt: string | null;
  onPromptHandled: () => void;
}

const QuickToolButton: React.FC<{ icon: React.ElementType; label: string }> = ({ icon: Icon, label }) => (
  <button className="flex items-center gap-2 p-3 rounded-lg bg-white dark:bg-dark-sidebar border border-light-border dark:border-dark-border hover:shadow-md hover:-translate-y-0.5 transition-all text-sm font-medium">
    <Icon className="w-5 h-5 text-accent" />
    <span>{label}</span>
  </button>
);

const ChatView: React.FC<ChatViewProps> = ({ chat, onUpdate, initialPrompt, onPromptHandled }) => {
  const { messages, isLoading, error, sendMessage } = useChat(chat.messages);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt && messages.length === 0) {
      sendMessage(initialPrompt);
      onPromptHandled();
    }
  }, [initialPrompt, sendMessage, onPromptHandled, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Sync local state changes back up to the parent (App.tsx)
    if (messages !== chat.messages) {
      onUpdate(messages);
    }
  }, [messages, onUpdate, chat.messages]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="h-full flex flex-col justify-center items-center">
        <div className="w-full max-w-3xl mx-auto px-4 flex flex-col items-center flex-grow justify-center">
          <h1 className="text-4xl font-bold text-light-text dark:text-dark-text mb-4">Hi, Jad Bar</h1>
          <div className="w-full">
            <ChatInput 
              onSendMessage={(content) => sendMessage(content)} 
              isLoading={isLoading}
              id={`chat-input-${chat.id}`}
            />
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <QuickToolButton icon={ICONS.presentation} label="AI Slides" />
            <QuickToolButton icon={ICONS.layers} label="Full-Stack" />
            <QuickToolButton icon={ICONS.sparkles} label="Magic Design" />
            <QuickToolButton icon={ICONS.code} label="Write Code" />
            <QuickToolButton icon={ICONS.search} label="Deep Research" />
          </div>
        </div>
      </div>
    );
  }

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
      <div className="sticky bottom-0 w-full px-4 md:px-6 pb-4 bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-sm">
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
