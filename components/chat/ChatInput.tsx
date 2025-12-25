
import React, { useState, useRef, useEffect } from 'react';
import { ICONS } from '../../constants.tsx';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  id?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, id }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <form id={id} onSubmit={handleSubmit} className="bg-white/80 dark:bg-dark-sidebar/80 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-xl p-2 shadow-lg ring-1 ring-black/5">
      <div className="flex items-start gap-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="How can I help you today?"
          className="flex-1 bg-transparent focus:outline-none resize-none text-sm p-2 max-h-48 custom-scrollbar"
          rows={1}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-accent text-white disabled:bg-accent/50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          aria-label="Send message"
        >
          {isLoading ? (
            <ICONS.loader className="w-4 h-4 animate-spin" />
          ) : (
            <ICONS.arrowUp className="w-5 h-5" />
          )}
        </button>
      </div>
      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-light-border dark:border-dark-border">
        <button type="button" className="flex items-center gap-1.5 text-sm p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
          <ICONS.plus className="w-4 h-4" />
        </button>
        <button type="button" className="flex items-center gap-1.5 text-sm p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
          <ICONS.search className="w-4 h-4" />
          <span className="hidden sm:inline">Search</span>
        </button>
        <button type="button" className="flex items-center gap-1.5 text-sm p-1.5 rounded-md bg-indigo-50 dark:bg-indigo-900/50 text-accent dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900">
          <ICONS.sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">Deep Think</span>
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
