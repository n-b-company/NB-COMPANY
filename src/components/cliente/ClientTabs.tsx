'use client';

import React from 'react';
import { ClientTabsProps } from '@/types';
import { motion } from 'framer-motion';

export default function ClientTabs({ tabs, activeTab, onTabChange }: ClientTabsProps) {
  return (
    <div className="mt-4 border-b border-zinc-800">
      <div className="flex w-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`relative flex-1 py-3 text-[11px] font-black tracking-tighter uppercase transition-all ${
                isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab}
              {isActive && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="bg-primary absolute right-0 bottom-0 left-0 h-0.5"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
