import React from 'react';

interface ClientTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function ClientTabs({ tabs, activeTab, onTabChange }: ClientTabsProps) {
  return (
    <div className="no-scrollbar mt-6 flex w-full overflow-x-auto border-b border-zinc-800 px-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === tab
              ? 'border-primary border-b-2 text-white'
              : 'border-b-2 border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
