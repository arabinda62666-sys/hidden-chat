import React, { useState } from 'react';
import { Contact } from '../types';

interface ContactsViewProps {
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
  onAddNewContact: (contact: Partial<Contact>) => void;
  onLockApp: () => void;
}

export const ContactsView: React.FC<ContactsViewProps> = ({
  contacts,
  onSelectContact,
  onAddNewContact,
  onLockApp,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  const recentContacts = contacts.slice(0, 5);

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group contacts by category letter
  const groupedContacts = filteredContacts.reduce((acc, contact) => {
    const letter = (contact.categoryLetter || contact.name.charAt(0)).toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(contact);
    return acc;
  }, {} as Record<string, Contact[]>);

  const sortedLetters = Object.keys(groupedContacts).sort();

  const handleCreateContact = () => {
    if (!newContactName.trim()) return;
    const name = newContactName.trim();
    onAddNewContact({
      name,
      phone: newContactPhone || '+1 (555) ' + Math.floor(1000 + Math.random() * 9000),
      statusText: 'Available on Calculator',
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
      isOnline: true,
      categoryLetter: name.charAt(0).toUpperCase(),
    });
    setNewContactName('');
    setNewContactPhone('');
    setShowAddContactModal(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-20 pb-32 px-4 max-w-2xl mx-auto">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#050505]/95 backdrop-blur-xl border-b border-white/10 h-16 flex items-center justify-between px-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={onLockApp}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:border-[#d4af37] hover:text-[#d4af37] active:scale-95 transition-all text-white/80"
            title="Stealth Lock"
          >
            <span className="material-symbols-outlined text-[20px]">visibility_off</span>
          </button>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#d4af37] font-medium">Directory</span>
            <h1 className="font-serif italic text-[18px] text-white font-semibold tracking-tight">Encrypted Contacts</h1>
          </div>
        </div>

        <button
          onClick={() => setShowAddContactModal(true)}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#d4af37] text-black font-bold active:scale-95 shadow-sm gold-glow"
          title="Add Contact"
        >
          <span className="material-symbols-outlined text-[20px]">person_add</span>
        </button>
      </header>

      <main className="space-y-6">
        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-white/40 group-focus-within:text-[#d4af37] transition-colors text-[18px]">
              person_search
            </span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts..."
            className="w-full h-12 pl-12 pr-4 bg-[#111111] rounded-xl border border-white/10 focus:border-[#d4af37]/50 transition-all text-xs uppercase tracking-wider text-white placeholder:text-white/30 focus:outline-none"
          />
        </div>

        {/* Quick Grid Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowAddContactModal(true)}
            className="flex items-center gap-3 p-3 bg-[#0a0a0a] rounded-xl border border-white/10 hover:border-[#d4af37]/40 hover:bg-[#111111] transition-all active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#d4af37] text-[18px]">group_add</span>
            </div>
            <span className="font-title-lg text-xs uppercase tracking-wider text-white font-semibold">New Group</span>
          </button>

          <button
            onClick={() => alert('Invite link copied to clipboard: https://calculator.app/invite/encrypted')}
            className="flex items-center gap-3 p-3 bg-[#0a0a0a] rounded-xl border border-white/10 hover:border-[#d4af37]/40 hover:bg-[#111111] transition-all active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center">
              <span className="material-symbols-outlined text-white/80 text-[18px]">share</span>
            </div>
            <span className="font-title-lg text-xs uppercase tracking-wider text-white font-semibold">Invite Friends</span>
          </button>
        </div>

        {/* Recent Chats Horizontal Row */}
        <section className="space-y-2">
          <h2 className="text-[10px] text-[#d4af37] px-1 uppercase tracking-[0.2em] font-semibold">
            Recent Contacts
          </h2>
          <div className="flex overflow-x-auto gap-4 pb-2 no-scrollbar">
            {recentContacts.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectContact(item)}
                className="flex flex-col items-center gap-1.5 min-w-[72px] cursor-pointer shrink-0 transition-transform active:scale-90"
              >
                <div className="w-14 h-14 rounded-xl border border-[#d4af37]/40 overflow-hidden bg-[#111111] flex items-center justify-center">
                  {item.avatarUrl ? (
                    <img src={item.avatarUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-base font-serif italic text-[#d4af37]">{item.name.slice(0, 2)}</span>
                  )}
                </div>
                <span className="text-xs text-white/80 truncate w-16 text-center">
                  {item.name.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Alphabetical Contact Groups */}
        <section className="space-y-4">
          <h2 className="text-[10px] text-white/40 px-1 uppercase tracking-[0.2em] font-semibold">
            All Contacts ({filteredContacts.length})
          </h2>

          {sortedLetters.map((letter) => (
            <div key={letter} className="space-y-1">
              <span className="font-serif italic text-[#d4af37] text-lg sticky top-16 bg-[#050505]/95 backdrop-blur-md py-1 block z-10 border-b border-white/10">
                {letter}
              </span>
              <div className="space-y-1 pt-1">
                {groupedContacts[letter].map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => onSelectContact(contact)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#0a0a0a] hover:bg-[#111111] hover:border-[#d4af37]/30 transition-all cursor-pointer border border-white/5"
                  >
                    <div className="w-11 h-11 rounded-lg overflow-hidden bg-[#161616] border border-white/10 flex items-center justify-center shrink-0">
                      {contact.avatarUrl ? (
                        <img src={contact.avatarUrl} alt={contact.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-serif italic text-[#d4af37]">{contact.name.slice(0, 2)}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-title-lg text-sm text-white font-medium truncate">
                        {contact.name}
                      </div>
                      <div className="text-xs text-white/40 truncate font-light">{contact.statusText}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* Add Contact Modal */}
      {showAddContactModal && (
        <div className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-white/10 w-full max-w-sm rounded-2xl p-6 space-y-4">
            <h3 className="font-serif italic text-xl font-bold text-white">Add New Contact</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-xs text-white placeholder:text-white/30 focus:border-[#d4af37]"
              />
              <input
                type="text"
                placeholder="Phone Number (e.g. +1 555 1234)"
                value={newContactPhone}
                onChange={(e) => setNewContactPhone(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-xs text-white placeholder:text-white/30 focus:border-[#d4af37]"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowAddContactModal(false)}
                className="flex-1 py-2.5 rounded-lg border border-white/10 text-xs text-white/60 uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateContact}
                className="flex-1 py-2.5 rounded-lg bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-wider"
              >
                Save Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
