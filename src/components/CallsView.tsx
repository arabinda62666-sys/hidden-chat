import React from 'react';
import { CallLog, Contact } from '../types';

interface CallsViewProps {
  callLogs: CallLog[];
  contacts: Contact[];
  onStartCall: (contact: Contact, type: 'voice' | 'video') => void;
  onLockApp: () => void;
}

export const CallsView: React.FC<CallsViewProps> = ({
  callLogs,
  contacts,
  onStartCall,
  onLockApp,
}) => {
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
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#d4af37] font-medium">Log</span>
            <h1 className="font-serif italic text-[18px] text-white font-semibold tracking-tight">Call History</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (contacts.length > 0) onStartCall(contacts[0], 'voice');
            }}
            className="px-3 py-1.5 rounded-lg bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-1 active:scale-95 transition-all gold-glow"
          >
            <span className="material-symbols-outlined text-[16px]">add_call</span>
            <span>New Call</span>
          </button>
        </div>
      </header>

      <main className="space-y-6">
        {/* Quick Quick Start Dial Row */}
        <section className="space-y-2">
          <h2 className="text-[10px] text-[#d4af37] px-1 uppercase tracking-[0.2em] font-semibold">
            Quick Dial
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {contacts.slice(0, 6).map((c) => (
              <div
                key={c.id}
                className="bg-[#0a0a0a] border border-white/10 p-3 rounded-xl min-w-[140px] flex flex-col items-center text-center gap-2 shrink-0 hover:border-[#d4af37]/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#161616] border border-white/10 flex items-center justify-center">
                  {c.avatarUrl ? (
                    <img src={c.avatarUrl} alt={c.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-serif italic text-[#d4af37]">{c.name.slice(0, 2)}</span>
                  )}
                </div>
                <div className="truncate w-full">
                  <p className="text-xs font-medium text-white truncate">{c.name}</p>
                </div>
                <div className="flex gap-2 w-full pt-1">
                  <button
                    onClick={() => onStartCall(c, 'voice')}
                    className="flex-1 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-[#d4af37] hover:bg-[#d4af37] hover:text-black text-[#d4af37] flex items-center justify-center transition-colors"
                    title="Voice Call"
                  >
                    <span className="material-symbols-outlined text-[15px]">call</span>
                  </button>
                  <button
                    onClick={() => onStartCall(c, 'video')}
                    className="flex-1 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-[#d4af37] hover:bg-[#d4af37] hover:text-black text-[#d4af37] flex items-center justify-center transition-colors"
                    title="Video Call"
                  >
                    <span className="material-symbols-outlined text-[15px]">videocam</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call Logs List */}
        <section className="space-y-2">
          <h2 className="text-[10px] text-white/40 px-1 uppercase tracking-[0.2em] font-semibold">
            Recent Activity
          </h2>

          <div className="space-y-2">
            {callLogs.map((log) => {
              const targetContact = contacts.find((c) => c.id === log.contactId) || {
                id: log.contactId,
                name: log.contactName,
                avatarUrl: log.avatarUrl,
                statusText: '',
                isOnline: false,
              };

              const isMissed = log.direction === 'missed';

              return (
                <div
                  key={log.id}
                  className="bg-[#0a0a0a] border border-white/5 p-3.5 rounded-xl flex items-center justify-between gap-3 hover:bg-[#111111] hover:border-[#d4af37]/30 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-lg overflow-hidden bg-[#161616] border border-white/10 shrink-0 flex items-center justify-center">
                      {log.avatarUrl ? (
                        <img src={log.avatarUrl} alt={log.contactName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-serif italic text-[#d4af37]">{log.contactName.slice(0, 2)}</span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className={`font-title-lg text-sm font-medium truncate ${isMissed ? 'text-[#ff7276]' : 'text-white'}`}>
                        {log.contactName}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[11px] text-white/40 uppercase tracking-wider">
                        <span
                          className={`material-symbols-outlined text-[13px] ${
                            isMissed ? 'text-[#ff7276]' : 'text-[#d4af37]'
                          }`}
                        >
                          {log.direction === 'incoming' ? 'call_received' : log.direction === 'outgoing' ? 'call_made' : 'call_missed'}
                        </span>
                        <span>{log.type === 'video' ? 'Video' : 'Voice'}</span>
                        <span>•</span>
                        <span>{log.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {log.duration && (
                      <span className="font-mono text-xs text-white/40 mr-1">{log.duration}</span>
                    )}
                    <button
                      onClick={() => onStartCall(targetContact as Contact, log.type)}
                      className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-[#d4af37] hover:bg-[#d4af37] hover:text-black flex items-center justify-center transition-all active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {log.type === 'video' ? 'videocam' : 'call'}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};
