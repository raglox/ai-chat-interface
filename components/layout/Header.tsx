
import React from 'react';
import Dropdown from '../ui/Dropdown.tsx';
import { MODELS, ICONS } from '../../constants.tsx';
import { useSettings } from '../../hooks/useTheme.ts';

interface HeaderProps {
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => {
  const { selectedModel, setSelectedModel } = useSettings();

  const userMenuItems = [
    { label: 'Settings', icon: ICONS.settings, action: onSettingsClick },
    { label: 'Archived Chats', icon: ICONS.archive, action: () => {} },
    { label: 'Sign Out', icon: ICONS.logOut, action: () => {}, isDanger: true },
  ];

  return (
    <header className="sticky top-0 z-20 flex-shrink-0 h-16 flex items-center justify-between px-6 bg-light-bg/90 dark:bg-dark-bg/80 backdrop-blur-sm border-b border-light-border/80 dark:border-dark-border/50">
      <div className="flex items-center gap-2">
        <Dropdown
          trigger={
            <button className="flex items-center gap-2 text-sm font-medium p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
              <span>{selectedModel.name}</span>
              <ICONS.chevronDown className="w-4 h-4" />
            </button>
          }
        >
          <div className="p-1">
            <p className="px-3 py-1.5 text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary">Model</p>
            {MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model)}
                className="w-full text-left flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div>
                  <p className="font-medium flex items-center gap-2">
                    {model.name}
                    {model.isNew && <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-1.5 py-0.5 rounded-full">NEW</span>}
                  </p>
                  <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">{model.description}</p>
                </div>
                {selectedModel.id === model.id && <ICONS.check className="w-4 h-4 text-accent" />}
              </button>
            ))}
          </div>
        </Dropdown>
      </div>
      <div className="flex items-center gap-4">
        <button className="hidden sm:flex items-center gap-2 text-sm font-medium p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
          <ICONS.share className="w-4 h-4" />
          <span>Share Session</span>
        </button>
        <Dropdown
          trigger={
            <button className="w-8 h-8 flex items-center justify-center bg-accent text-white rounded-full font-semibold text-sm">
              J
            </button>
          }
          align="right"
        >
          <div className="p-1">
            {userMenuItems.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className={`w-full text-left flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${item.isDanger ? 'text-red-600 dark:text-red-400' : ''}`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </Dropdown>
      </div>
    </header>
  );
};

export default Header;
