
import React from 'react';
import { ICONS } from '../../constants.tsx';
import ChatInput from './ChatInput.tsx';

interface WelcomeScreenProps {
  onStartChat: (message: string) => void;
}

const QuickToolButton: React.FC<{ icon: React.ElementType; label: string }> = ({ icon: Icon, label }) => (
  <button className="flex items-center gap-2 p-3 rounded-lg bg-white dark:bg-dark-sidebar border border-light-border dark:border-dark-border hover:shadow-md hover:-translate-y-0.5 transition-all text-sm font-medium">
    <Icon className="w-5 h-5 text-accent" />
    <span>{label}</span>
  </button>
);

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartChat }) => {
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <div className="w-full max-w-3xl mx-auto px-4 flex flex-col items-center flex-grow justify-center">
        <h1 className="text-4xl font-bold text-light-text dark:text-dark-text mb-4">Hi, Jad Bar</h1>
        <div className="w-full">
          <ChatInput onSendMessage={onStartChat} isLoading={false} />
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
};

export default WelcomeScreen;
