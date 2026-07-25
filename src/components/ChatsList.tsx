import React, { useState } from 'react';
import { Contact } from '../types';

interface ChatsListProps {
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
  onOpenNewChat: () => void;
  onOpenSearch: () => void;
  userAvatarUrl: string;
  onLockApp: () => void;
}

export const ChatsList: React.FC<ChatsListProps> = ({
  contacts,
  onSelectContact,
  onOpenNewChat,
  onOpenSearch,
  userAvatarUrl,
  onLockApp,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const pinnedContacts = contacts.filter((c) => c.isPinned);
  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.lastMessage && c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-20 pb-32 px-4 max-w-2xl mx-auto">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#050505]/95 backdrop-blur-xl border-b border-white/10 h-16 flex items-center justify-between px-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          <div
            onClick={onLockApp}
            className="w-9 h-9 rounded-lg overflow-hidden border border-[#d4af37]/40 cursor-pointer transition-transform active:scale-95 relative group"
            title="Click to Lock App into Calculator"
          >
            <img src={userAvatarUrl} alt="User" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span className="material-symbols-outlined text-[#d4af37] text-[16px]">lock</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#d4af37] font-medium">Encrypted Vault</span>
            <h1 className="font-serif italic text-[18px] text-white font-semibold tracking-tight">Calculator</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Stealth Lock button */}
          <button
            onClick={onLockApp}
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 hover:border-[#d4af37] hover:bg-[#d4af37] hover:text-black text-[11px] uppercase tracking-[0.15em] text-[#d4af37] flex items-center gap-1.5 transition-all active:scale-95"
            title="Stealth Lock"
          >
            <span className="material-symbols-outlined text-[15px]">visibility_off</span>
            <span>Stealth Lock</span>
          </button>

          <button
            onClick={onOpenSearch}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>
        </div>
      </header>

      {/* Pinned Section */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-3 text-[#d4af37]">
          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            push_pin
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Pinned Conversations</span>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {pinnedContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => onSelectContact(contact)}
              className="flex flex-col items-center gap-1.5 min-w-[72px] cursor-pointer group shrink-0"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#d4af37] ring-2 ring-[#d4af37]/20 transition-transform group-active:scale-90 bg-[#111111] flex items-center justify-center">
                  {contact.avatarUrl ? (
                    <img src={contact.avatarUrl} alt={contact.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-serif italic text-[#d4af37]">{contact.name.slice(0, 2)}</span>
                  )}
                </div>
                {contact.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#d4af37] rounded-full border-2 border-[#050505]"></div>
                )}
                {contact.isAi && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#d4af37] text-black rounded-full border-2 border-[#050505] flex items-center justify-center">
                    <span className="material-symbols-outlined text-black text-[12px]">auto_awesome</span>
                  </div>
                )}
              </div>
              <span className="text-xs font-medium text-white/90 truncate w-18 text-center mt-1">
                {contact.name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Search Input Bar */}
      <div className="mb-6">
        <div className="relative flex items-center bg-[#111111] rounded-xl border border-white/10 px-4 py-3 focus-within:border-[#d4af37]/50 transition-colors">
          <span className="material-symbols-outlined text-white/40 mr-3 text-[18px]">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="bg-transparent border-none focus:outline-none w-full text-xs uppercase tracking-wider text-white placeholder:text-white/30"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-white/40 hover:text-white">
              <span className="material-symbols-outlined text-[18px]">cancel</span>
            </button>
          )}
        </div>
      </div>

      {/* Chat List */}
      <section className="space-y-1.5">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            onClick={() => onSelectContact(contact)}
            className="flex items-center gap-4 p-3.5 rounded-xl bg-[#0a0a0a] border border-white/5 hover:border-[#d4af37]/30 hover:bg-[#111111] transition-all cursor-pointer group active:scale-[0.98]"
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-13 h-13 rounded-xl overflow-hidden bg-[#161616] border border-white/10 flex items-center justify-center">
                {contact.avatarUrl ? (
                  <img src={contact.avatarUrl} alt={contact.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-base font-serif italic text-[#d4af37]">{contact.name.slice(0, 2)}</span>
                )}
              </div>
              {contact.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#d4af37] rounded-full border-2 border-[#050505]"></div>
              )}
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-1.5 truncate">
                  <h3 className="font-title-lg text-sm text-white font-medium truncate">
                    {contact.name}
                  </h3>
                  {contact.isAi && (
                    <span className="px-1.5 py-0.5 rounded bg-[#d4af37]/20 border border-[#d4af37]/30 text-[#d4af37] text-[9px] font-bold uppercase tracking-widest">
                      AI
                    </span>
                  )}
                  {contact.isGroup && (
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-white/60 text-[9px] font-medium uppercase tracking-widest">
                      Group
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] uppercase tracking-wider ${
                    contact.unreadCount ? 'text-[#d4af37] font-semibold' : 'text-white/40'
                  }`}
                >
                  {contact.lastMessageTime || ''}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-xs text-white/50 truncate pr-3 font-light">
                  {contact.lastMessage || contact.statusText}
                </p>
                {contact.unreadCount && contact.unreadCount > 0 ? (
                  <div className="w-5 h-5 rounded-full bg-[#d4af37] text-black flex items-center justify-center shrink-0 shadow-sm font-bold text-[10px]">
                    {contact.unreadCount}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ))}

        {filteredContacts.length === 0 && (
          <div className="py-12 text-center text-white/40">
            <span className="material-symbols-outlined text-[36px] mb-2 text-[#d4af37]">chat_bubble_outline</span>
            <p className="text-xs uppercase tracking-widest">No conversations found for "{searchQuery}"</p>
          </div>
        )}
      </section>

      {/* Floating New Chat FAB */}
      <button
        onClick={onOpenNewChat}
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#d4af37] text-black rounded-xl shadow-[0_8px_30px_rgba(212,175,55,0.3)] gold-glow flex items-center justify-center transition-all duration-300 hover:scale-105 hover:bg-[#e2b857] active:scale-90 z-30"
        title="New Chat"
      >
        <span className="material-symbols-outlined text-[26px]">
          edit
        </span>
      </button>
    </div>
  );
};
