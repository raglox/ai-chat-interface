
import React, { useState } from 'react';
import { ChatHistoryGroup, ChatHistoryItem } from '../../types.ts';
import { ICONS } from '../../constants.tsx';

interface SidebarProps {
  chatHistory: ChatHistoryGroup[];
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  activeChatId: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ chatHistory, onNewChat, onSelectChat, activeChatId }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`flex flex-col bg-light-sidebar dark:bg-dark-sidebar border-r border-light-border dark:border-dark-border transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4 flex items-center justify-between border-b border-light-border dark:border-dark-border h-16">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-black rounded-md flex items-center justify-center font-bold text-xl">Z</div>
          </div>
        )}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
          <ICONS.moreHorizontal className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-2">
        <button 
          onClick={onNewChat}
          className="w-full flex items-center justify-center sm:justify-start gap-2 p-2 rounded-md border border-light-border dark:border-dark-border hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ICONS.edit className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">New Chat</span>}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {chatHistory.map((group) => (
          <div key={group.period} className="mb-4">
            {!isCollapsed && <h3 className="px-2 text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider mb-2">{group.period}</h3>}
            <ul>
              {group.chats.map((chat) => (
                <li key={chat.id}>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); onSelectChat(chat.id); }}
                    className={`flex items-center gap-2 px-2 py-1.5 text-sm rounded-md truncate ${
                      activeChatId === chat.id 
                        ? 'bg-gray-100 dark:bg-gray-700 font-semibold' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {!isCollapsed && <span className="truncate">{chat.title}</span>}
                    {isCollapsed && <span className="w-5 h-5 text-center">#</span>}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
