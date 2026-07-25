import React, { useState, useRef, useEffect } from 'react';
import { Contact, Message, Poll, PollOption } from '../types';

interface ChatDetailViewProps {
  contact: Contact;
  messages: Message[];
  onBack: () => void;
  onSendMessage: (text: string, attachment?: Message['attachment'], poll?: Poll) => void;
  onStartCall: (contact: Contact, type: 'voice' | 'video') => void;
}

export const ChatDetailView: React.FC<ChatDetailViewProps> = ({
  contact,
  messages,
  onBack,
  onSendMessage,
  onStartCall,
}) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [selectedImageModal, setSelectedImageModal] = useState<string | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceRecordTime, setVoiceRecordTime] = useState(0);
  const [showPollModal, setShowPollModal] = useState(false);
  
  // Poll creation state
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOption1, setPollOption1] = useState('');
  const [pollOption2, setPollOption2] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const voiceTimerRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const textToSend = inputText.trim();
    setInputText('');
    setShowAttachMenu(false);

    onSendMessage(textToSend);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onSendMessage('', {
          type: 'image',
          url: reader.result as string,
          fileName: file.name,
          fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVoiceRecordToggle = () => {
    if (!isRecordingVoice) {
      setIsRecordingVoice(true);
      setVoiceRecordTime(0);
      voiceTimerRef.current = setInterval(() => {
        setVoiceRecordTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(voiceTimerRef.current);
      setIsRecordingVoice(false);
      const seconds = voiceRecordTime || 3;
      onSendMessage('Voice Note', {
        type: 'voice',
        duration: `0:${seconds < 10 ? '0' : ''}${seconds}`,
      });
      setVoiceRecordTime(0);
    }
  };

  const handleCreatePoll = () => {
    if (!pollQuestion.trim() || !pollOption1.trim() || !pollOption2.trim()) return;

    const newPoll: Poll = {
      id: `poll-${Date.now()}`,
      question: pollQuestion,
      totalVotes: 0,
      options: [
        { id: 'opt-1', text: pollOption1, votes: 0, votedUserIds: [] },
        { id: 'opt-2', text: pollOption2, votes: 0, votedUserIds: [] },
      ],
    };

    onSendMessage('', undefined, newPoll);
    setShowPollModal(false);
    setPollQuestion('');
    setPollOption1('');
    setPollOption2('');
  };

  const handleVotePoll = (messageId: string, optionId: string) => {
    // Local vote simulation
    const msg = messages.find((m) => m.id === messageId);
    if (!msg || !msg.poll) return;

    const poll = msg.poll;
    const option = poll.options.find((o) => o.id === optionId);
    if (!option) return;

    const alreadyVoted = option.votedUserIds.includes('user');
    if (!alreadyVoted) {
      option.votes += 1;
      option.votedUserIds.push('user');
      poll.totalVotes += 1;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-[#e0e0e0] chat-pattern font-body-lg overflow-hidden">
      {/* Top App Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#050505]/95 backdrop-blur-xl border-b border-white/10 h-16 flex items-center justify-between px-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-lg hover:bg-white/10 text-white/80 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>

          <div
            onClick={() => setShowGroupModal(true)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-lg border border-[#d4af37]/40 overflow-hidden bg-[#111111] flex items-center justify-center">
                {contact.avatarUrl ? (
                  <img src={contact.avatarUrl} alt={contact.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-base font-serif italic text-[#d4af37]">{contact.name.slice(0, 2)}</span>
                )}
              </div>
              {contact.isOnline && (
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#d4af37] border-2 border-[#050505] rounded-full"></div>
              )}
            </div>

            <div className="flex flex-col">
              <span className="font-title-lg text-sm font-medium text-white group-hover:text-[#d4af37] transition-colors leading-tight">
                {contact.name}
              </span>
              <div className="flex items-center gap-1 text-white/40">
                <span className="material-symbols-outlined text-[12px] text-[#d4af37]">lock</span>
                <span className="text-[10px] uppercase tracking-wider">
                  {contact.isGroup ? `${contact.groupMembersCount || 6} members` : 'Quantum Encrypted'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onStartCall(contact, 'voice')}
            className="p-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-[#d4af37] transition-all active:scale-95"
            title="Voice Call"
          >
            <span className="material-symbols-outlined text-[20px]">call</span>
          </button>
          <button
            onClick={() => onStartCall(contact, 'video')}
            className="p-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-[#d4af37] transition-all active:scale-95"
            title="Video Call"
          >
            <span className="material-symbols-outlined text-[20px]">videocam</span>
          </button>
          <button
            onClick={() => setShowGroupModal(true)}
            className="p-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-[#d4af37] transition-all active:scale-95"
            title="Info"
          >
            <span className="material-symbols-outlined text-[20px]">more_vert</span>
          </button>
        </div>
      </header>

      {/* Main Messages Stream */}
      <main className="flex-1 overflow-y-auto px-4 pt-20 pb-24 space-y-4 scroll-smooth max-w-2xl mx-auto w-full">
        {/* Date Pill */}
        <div className="flex justify-center my-2">
          <span className="px-3 py-1 rounded-full bg-[#111111] border border-white/10 text-[#d4af37] text-[10px] font-mono tracking-[0.2em] uppercase">
            TODAY
          </span>
        </div>

        {messages.map((msg) => {
          const isOutgoing = msg.isOutgoing;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isOutgoing ? 'items-end ml-auto' : 'items-start'} max-w-[85%]`}
            >
              {/* Message Content Container */}
              <div
                className={`p-3.5 rounded-xl ${
                  isOutgoing
                    ? 'bg-[#d4af37] text-black font-medium rounded-tr-none gold-glow'
                    : 'bg-[#111111] text-white rounded-tl-none border border-white/10'
                }`}
              >
                {!isOutgoing && contact.isGroup && (
                  <span className="text-[10px] font-bold text-[#d4af37] uppercase tracking-wider block mb-1">
                    {msg.senderName}
                  </span>
                )}

                {msg.content && <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>}

                {/* Attachment: Image */}
                {msg.attachment?.type === 'image' && (
                  <div
                    onClick={() => msg.attachment?.url && setSelectedImageModal(msg.attachment.url)}
                    className="mt-2 rounded-lg overflow-hidden border border-black/20 cursor-pointer max-w-xs group relative"
                  >
                    <img
                      src={msg.attachment.url}
                      alt={msg.attachment.fileName || 'Shared Image'}
                      className="w-full h-auto max-h-60 object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="material-symbols-outlined text-[#d4af37] text-[28px]">zoom_in</span>
                    </div>
                  </div>
                )}

                {/* Attachment: Voice Note */}
                {msg.attachment?.type === 'voice' && (
                  <div className={`mt-2 flex items-center gap-3 w-56 p-2 rounded-lg ${isOutgoing ? 'bg-black/10' : 'bg-white/5'}`}>
                    <button className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 active:scale-90 transition-transform ${isOutgoing ? 'bg-black text-[#d4af37]' : 'bg-[#d4af37] text-black'}`}>
                      <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        play_arrow
                      </span>
                    </button>
                    <div className="flex-1 h-6 flex items-center gap-[3px]">
                      <div className={`h-2 w-1 rounded-full ${isOutgoing ? 'bg-black' : 'bg-[#d4af37]'}`}></div>
                      <div className={`h-4 w-1 rounded-full ${isOutgoing ? 'bg-black' : 'bg-[#d4af37]'}`}></div>
                      <div className={`h-6 w-1 rounded-full ${isOutgoing ? 'bg-black' : 'bg-[#d4af37]'}`}></div>
                      <div className={`h-3 w-1 rounded-full ${isOutgoing ? 'bg-black' : 'bg-[#d4af37]'}`}></div>
                      <div className={`h-5 w-1 rounded-full ${isOutgoing ? 'bg-black/60' : 'bg-[#d4af37]/60'}`}></div>
                      <div className={`h-2 w-1 rounded-full ${isOutgoing ? 'bg-black/40' : 'bg-[#d4af37]/40'}`}></div>
                    </div>
                    <span className="text-xs font-mono opacity-80">{msg.attachment.duration || '0:24'}</span>
                  </div>
                )}

                {/* Interactive Poll */}
                {msg.poll && (
                  <div className="mt-2 bg-black/20 p-3 rounded-lg space-y-3 min-w-[240px] border border-white/10">
                    <div className="flex items-center gap-2 text-[#d4af37] font-semibold text-xs uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[16px]">how_to_vote</span>
                      <span>{msg.poll.question}</span>
                    </div>
                    <div className="space-y-2">
                      {msg.poll.options.map((opt) => {
                        const hasVoted = opt.votedUserIds.includes('user');
                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleVotePoll(msg.id, opt.id)}
                            className={`w-full p-2.5 rounded-lg border text-left text-xs flex items-center justify-between transition-all ${
                              hasVoted
                                ? 'border-[#d4af37] bg-[#d4af37]/20 font-bold text-white'
                                : 'border-white/10 hover:border-[#d4af37]/50 text-white/80'
                            }`}
                          >
                            <span>{opt.text} ({opt.votes} votes)</span>
                            {hasVoted && (
                              <span className="material-symbols-outlined text-[#d4af37] text-[18px]">
                                check_circle
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Timestamp & Status */}
              <div className="flex items-center gap-1 mt-1 text-[9px] uppercase tracking-wider text-white/40">
                <span>{msg.timestamp}</span>
                {isOutgoing && (
                  <span className="material-symbols-outlined text-[13px] text-[#d4af37]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    done_all
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* AI Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-[#111111] border border-white/10 px-4 py-2.5 rounded-full flex gap-1.5 items-center">
              <div className="typing-dot w-1.5 h-1.5 bg-[#d4af37] rounded-full"></div>
              <div className="typing-dot w-1.5 h-1.5 bg-[#d4af37] rounded-full"></div>
              <div className="typing-dot w-1.5 h-1.5 bg-[#d4af37] rounded-full"></div>
            </div>
            <span className="text-xs text-white/40 italic">{contact.name} is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Bottom Message Input Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#050505]/95 backdrop-blur-xl border-t border-white/10 p-3 max-w-2xl mx-auto flex flex-col gap-2">
        {/* Attachment menu popup */}
        {showAttachMenu && (
          <div className="bg-[#111111] border border-white/10 rounded-xl p-3 grid grid-cols-3 gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/10 text-[#d4af37] text-xs uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-[22px]">image</span>
              <span>Photo</span>
            </button>
            <button
              onClick={() => setShowPollModal(true)}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/10 text-[#d4af37] text-xs uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-[22px]">poll</span>
              <span>Poll</span>
            </button>
            <button
              onClick={handleVoiceRecordToggle}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/10 text-[#d4af37] text-xs uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-[22px]">mic</span>
              <span>Voice</span>
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Plus / Attach Button */}
          <button
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            className={`p-2 rounded-lg transition-transform active:scale-90 ${
              showAttachMenu ? 'bg-[#d4af37] text-black' : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
            title="Attach Media or Poll"
          >
            <span className="material-symbols-outlined text-[22px]">
              {showAttachMenu ? 'close' : 'add_circle'}
            </span>
          </button>

          {/* Voice Recording Active indicator or Text Input */}
          {isRecordingVoice ? (
            <div className="flex-1 bg-[#ff7276]/10 border border-[#ff7276]/40 rounded-xl px-4 py-2 flex items-center justify-between animate-pulse">
              <span className="text-xs text-[#ff7276] font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff7276]"></span>
                Recording Voice Note ({voiceRecordTime}s)...
              </span>
              <button
                onClick={handleVoiceRecordToggle}
                className="text-xs font-bold text-[#ff7276] uppercase tracking-wider underline"
              >
                Send Voice
              </button>
            </div>
          ) : (
            <div className="flex-1 bg-[#111111] rounded-xl px-4 py-2 flex items-center gap-2 border border-white/10 focus-within:border-[#d4af37]/50">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="w-full bg-transparent border-none focus:outline-none text-xs text-white placeholder:text-white/30"
              />
              <button
                onClick={() => setInputText((prev) => prev + ' 😊')}
                className="text-[#d4af37] hover:text-white"
              >
                <span className="material-symbols-outlined text-[18px]">mood</span>
              </button>
            </div>
          )}

          {/* Send or Voice Trigger */}
          {inputText.trim() ? (
            <button
              onClick={handleSend}
              className="w-10 h-10 rounded-lg bg-[#d4af37] text-black flex items-center justify-center gold-glow active:scale-90 transition-transform"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                send
              </span>
            </button>
          ) : (
            <button
              onClick={handleVoiceRecordToggle}
              className={`w-10 h-10 rounded-lg flex items-center justify-center active:scale-90 transition-transform ${
                isRecordingVoice ? 'bg-red-500 text-white' : 'bg-[#d4af37] text-black gold-glow'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                mic
              </span>
            </button>
          )}
        </div>
      </footer>

      {/* Lightbox Modal */}
      {selectedImageModal && (
        <div
          onClick={() => setSelectedImageModal(null)}
          className="fixed inset-0 z-[90] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <img src={selectedImageModal} alt="Preview" className="max-w-full max-h-[85vh] rounded-xl object-contain border border-white/10" />
        </div>
      )}

      {/* Group / Contact Info Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#111111] border border-white/10 w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 relative animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4 sm:hidden"></div>
            <div className="text-center space-y-3">
              <div className="w-20 h-20 rounded-xl mx-auto overflow-hidden border border-[#d4af37]/40 shadow-lg bg-[#050505] flex items-center justify-center">
                {contact.avatarUrl ? (
                  <img src={contact.avatarUrl} alt={contact.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-serif italic text-[#d4af37]">{contact.name.slice(0, 2)}</span>
                )}
              </div>
              <div>
                <h2 className="font-serif italic text-2xl font-bold text-white">{contact.name}</h2>
                <p className="text-xs text-white/50">{contact.statusText}</p>
                <p className="text-[11px] font-mono text-[#d4af37] mt-1">{contact.phone}</p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-4 gap-2 py-3 border-y border-white/10">
                <button
                  onClick={() => onStartCall(contact, 'voice')}
                  className="flex flex-col items-center gap-1 text-xs text-white/70 hover:text-[#d4af37]"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">call</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider">Voice</span>
                </button>
                <button
                  onClick={() => onStartCall(contact, 'video')}
                  className="flex flex-col items-center gap-1 text-xs text-white/70 hover:text-[#d4af37]"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">videocam</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider">Video</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-xs text-white/70 hover:text-[#d4af37]">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">security</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider">Verify</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-xs text-[#ff7276]">
                  <div className="w-10 h-10 rounded-lg bg-[#ff7276]/10 border border-[#ff7276]/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">block</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider">Block</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowGroupModal(false)}
              className="mt-6 w-full py-3 rounded-xl bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-[0.15em]"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Poll Creation Modal */}
      {showPollModal && (
        <div className="fixed inset-0 z-[85] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-white/10 w-full max-w-sm rounded-2xl p-6 space-y-4">
            <h3 className="font-serif italic text-lg text-white">Create Instant Poll</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Question (e.g. Lunch choice?)"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-xs text-white placeholder:text-white/30 focus:border-[#d4af37]"
              />
              <input
                type="text"
                placeholder="Option 1 (e.g. Pizza)"
                value={pollOption1}
                onChange={(e) => setPollOption1(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-xs text-white placeholder:text-white/30 focus:border-[#d4af37]"
              />
              <input
                type="text"
                placeholder="Option 2 (e.g. Sushi)"
                value={pollOption2}
                onChange={(e) => setPollOption2(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-xs text-white placeholder:text-white/30 focus:border-[#d4af37]"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPollModal(false)}
                className="flex-1 py-2.5 rounded-lg border border-white/10 text-xs text-white/60 uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePoll}
                className="flex-1 py-2.5 rounded-lg bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-wider"
              >
                Send Poll
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
