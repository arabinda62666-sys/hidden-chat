import React from 'react';
import { VaultTab } from '../types';

interface BottomNavProps {
  currentTab: VaultTab;
  onTabChange: (tab: VaultTab) => void;
  unreadTotal: number;
  onLockApp: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  unreadTotal,
  onLockApp,
}) => {
  const tabs: { id: VaultTab; label: string; icon: string; badge?: number }[] = [
    { id: 'chats', label: 'Chats', icon: 'chat', badge: unreadTotal },
    { id: 'contacts', label: 'Contacts', icon: 'contacts' },
    { id: 'calls', label: 'Calls', icon: 'call' },
    { id: 'status', label: 'Status', icon: 'donut_large' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#080808]/95 backdrop-blur-2xl border-t border-white/10 h-20 px-3 flex justify-around items-center max-w-2xl mx-auto">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 relative ${
              isActive ? 'text-[#d4af37]' : 'text-white/40 hover:text-white'
            }`}
          >
            <div
              className={`p-1.5 rounded-lg transition-all ${
                isActive ? 'bg-[#d4af37]/15 border border-[#d4af37]/30 scale-105 shadow-[0_0_15px_rgba(212,175,55,0.15)]' : ''
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {tab.icon}
              </span>
            </div>

            <span className={`text-[10px] uppercase tracking-[0.15em] font-medium mt-1 ${isActive ? 'font-bold text-[#d4af37]' : ''}`}>
              {tab.label}
            </span>

            {tab.badge && tab.badge > 0 ? (
              <span className="absolute top-0 right-2 w-4 h-4 rounded-full bg-[#d4af37] text-black font-bold text-[9px] flex items-center justify-center shadow-md">
                {tab.badge}
              </span>
            ) : null}
          </button>
        );
      })}

      {/* Quick Lock floating lock key */}
      <button
        onClick={onLockApp}
        className="ml-1 p-2.5 rounded-lg bg-white/5 border border-white/15 text-white/70 hover:text-white hover:bg-[#d4af37] hover:border-[#d4af37] hover:text-black active:scale-90 transition-all duration-200 flex items-center justify-center"
        title="Instant Stealth Lock"
      >
        <span className="material-symbols-outlined text-[18px]">lock</span>
      </button>
    </nav>
  );
};
