
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Sidebar from './components/layout/Sidebar.tsx';
import Header from './components/layout/Header.tsx';
import WelcomeScreen from './components/chat/WelcomeScreen.tsx';
import ChatView from './components/chat/ChatView.tsx';
import SettingsModal from './components/settings/SettingsModal.tsx';
// Fix: Corrected import path to point to the actual file name `useTheme.ts`.
import { useSettings } from './hooks/useTheme.ts';
import { ChatHistoryItem, Message } from './types.ts';
import { useChat } from './hooks/useChat.ts';

const CHATS_STORAGE_KEY = 'gemini-ai-chats';

export default function App() {
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const { theme } = useSettings();

  const [chats, setChats] = useState<ChatHistoryItem[]>(() => {
    try {
      const savedChats = localStorage.getItem(CHATS_STORAGE_KEY);
      return savedChats ? JSON.parse(savedChats) : [];
    } catch (error) {
      console.error("Failed to parse chats from localStorage", error);
      return [];
    }
  });

  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
    } catch (error) {
      console.error("Failed to save chats to localStorage", error);
    }
  }, [chats]);

  const activeChat = useMemo(() => chats.find(c => c.id === activeChatId), [chats, activeChatId]);

  const handleNewChat = useCallback(() => {
    const newChat: ChatHistoryItem = {
      id: `chat-${Date.now()}`,
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  }, []);

  const handleSelectChat = useCallback((chatId: string) => {
    setActiveChatId(chatId);
  }, []);

  const handleUpdateChatMessages = useCallback((chatId: string, messages: Message[]) => {
    setChats(prev =>
      prev.map(c => {
        if (c.id === chatId) {
          const newTitle = c.title === 'New Chat' && messages.length > 0 ? messages[0].content.substring(0, 40) : c.title;
          return { ...c, messages, title: newTitle };
        }
        return c;
      })
    );
  }, []);

  const { sendMessage } = useChat([]); // A detached instance for starting new chats

  const handleStartChat = useCallback(async (messageContent: string) => {
    const newChat: ChatHistoryItem = {
      id: `chat-${Date.now()}`,
      title: messageContent.substring(0, 40),
      messages: [],
      createdAt: new Date().toISOString(),
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    
    // We need to wait for the state to update before sending the message
    // A small timeout allows React to re-render with the new active chat
    setTimeout(() => {
        const chatViewInstance = document.getElementById(`chat-input-${newChat.id}`);
        if (chatViewInstance) {
            // This is a bit of a hack to trigger the sendMessage of the newly mounted ChatView
            // A more robust solution might involve a command queue or context-based actions
            sendMessage(messageContent, (updatedMessages) => handleUpdateChatMessages(newChat.id, updatedMessages));
        }
    }, 100);

  }, [sendMessage, handleUpdateChatMessages]);

  const chatHistoryByDate = useMemo(() => {
    const groups: { [key: string]: ChatHistoryItem[] } = {
      Today: [],
      Yesterday: [],
      'Previous 7 Days': [],
      'Older': [],
    };
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    chats.forEach(chat => {
      const chatDate = new Date(chat.createdAt);
      if (chatDate >= today) {
        groups.Today.push(chat);
      } else if (chatDate >= yesterday) {
        groups.Yesterday.push(chat);
      } else if (chatDate >= sevenDaysAgo) {
        groups['Previous 7 Days'].push(chat);
      } else {
        groups.Older.push(chat);
      }
    });

    return Object.entries(groups)
      .filter(([, chats]) => chats.length > 0)
      .map(([period, chats]) => ({ period, chats }));
  }, [chats]);


  return (
    <div className={`flex h-screen w-full text-light-text dark:text-dark-text bg-light-bg dark:bg-dark-bg`}>
      <Sidebar 
        chatHistory={chatHistoryByDate} 
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        activeChatId={activeChatId}
      />
      <div className="flex flex-1 flex-col min-w-0">
        <Header onSettingsClick={() => setSettingsOpen(true)} />
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {activeChat ? (
            <ChatView 
              key={activeChat.id} 
              chat={activeChat}
              onUpdate={(messages) => handleUpdateChatMessages(activeChat.id, messages)}
            />
          ) : (
            <WelcomeScreen onStartChat={handleStartChat} />
          )}
        </main>
      </div>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
