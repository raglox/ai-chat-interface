
export type Role = 'user' | 'model';

export interface Message {
  id: string;
  role: Role;
  content: string;
  isStreaming?: boolean;
}

export interface Model {
  id: string;
  name: string;
  description: string;
  isNew?: boolean;
}

export interface ChatHistoryItem {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string; // ISO 8601 date string
}

export interface ChatHistoryGroup {
  period: string;
  chats: ChatHistoryItem[];
}

export type Theme = 'light' | 'dark' | 'system';
