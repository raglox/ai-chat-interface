
import React, { useState } from 'react';
import Modal from '../ui/Modal.tsx';
// Fix: Corrected import path to point to the actual file name `useTheme.ts`.
import { useSettings } from '../../hooks/useTheme.ts';
import { ICONS } from '../../constants.tsx';
import { Theme } from '../../types.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { themeSetting, setThemeSetting } = useSettings();
  const [activeTab, setActiveTab] = useState('General');

  const tabs = ['General', 'Interface', 'Connections', 'Dialogue', 'Account', 'About'];

  const ThemeButton: React.FC<{ label: string; value: Theme; icon: React.ElementType }> = ({ label, value, icon: Icon }) => (
    <button
      onClick={() => setThemeSetting(value)}
      className={`flex-1 p-3 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
        themeSetting === value
          ? 'border-accent bg-indigo-50 dark:bg-indigo-900/30'
          : 'border-light-border dark:border-dark-border hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="System settings">
      <div className="flex flex-col sm:flex-row">
        <aside className="w-full sm:w-1/4 sm:pr-6 sm:border-r border-b sm:border-b-0 sm:border-r-light-border dark:sm:border-r-dark-border pb-4 sm:pb-0 mb-4 sm:mb-0">
          <nav className="flex flex-row sm:flex-col gap-1 overflow-x-auto sm:overflow-x-visible">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-3 py-2 text-sm rounded-md flex-shrink-0 ${
                  activeTab === tab
                    ? 'bg-gray-100 dark:bg-gray-700 font-semibold'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </aside>
        <main className="w-full sm:w-3/4 sm:pl-6">
          {activeTab === 'General' && (
            <div>
              <div className="flex items-center gap-4">
                <ThemeButton label="System Mode" value="system" icon={ICONS.laptop} />
                <ThemeButton label="Light Mode" value="light" icon={ICONS.sun} />
                <ThemeButton label="Dark Mode" value="dark" icon={ICONS.moon} />
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium mb-1">Language settings</label>
                <select className="w-full p-2 border border-light-border dark:border-dark-border rounded-md bg-transparent focus:ring-2 focus:ring-accent focus:border-accent outline-none">
                  <option>English (US)</option>
                </select>
              </div>
            </div>
          )}
          {activeTab !== 'General' && (
            <div className="flex items-center justify-center h-full text-light-text-secondary dark:text-dark-text-secondary">
              <p>{activeTab} settings will be here.</p>
            </div>
          )}
        </main>
      </div>
      <div className="flex justify-end mt-6 pt-4 border-t border-light-border dark:border-dark-border">
        <button onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black rounded-md hover:opacity-90">
          Save
        </button>
      </div>
    </Modal>
  );
};

export default SettingsModal;
