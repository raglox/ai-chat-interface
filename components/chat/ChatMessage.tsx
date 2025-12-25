
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '../../types.ts';
import { ICONS } from '../../constants.tsx';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === 'model';

  const Avatar = () => (
    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${isModel ? 'bg-indigo-100 dark:bg-indigo-900' : 'bg-accent text-white'}`}>
      {isModel ? <ICONS.brainCircuit className="w-5 h-5 text-accent" /> : <span className="font-semibold text-sm">J</span>}
    </div>
  );

  return (
    <div className={`flex items-start gap-3 my-6 ${isModel ? '' : 'justify-end'}`}>
      {isModel && <Avatar />}
      <div className={`max-w-[85%] rounded-lg px-4 py-2 shadow-sm ${isModel ? 'bg-white dark:bg-dark-sidebar' : 'bg-accent text-white'}`}>
        <div className="prose prose-sm prose-zinc dark:prose-invert max-w-none data-[is-model=false]:text-white">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
          {message.isStreaming && <span className="inline-block w-2 h-4 bg-zinc-700 dark:bg-zinc-300 animate-pulse ml-1" />}
        </div>
      </div>
      {!isModel && <Avatar />}
    </div>
  );
};

export default ChatMessage;
