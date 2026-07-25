import React, { useState, useEffect } from 'react';
import { ActiveCallState } from '../types';

interface CallScreenProps {
  callState: ActiveCallState;
  onEndCall: () => void;
  onToggleMute: () => void;
  onToggleSpeaker: () => void;
  onToggleVideo: () => void;
  onToggleBlur: () => void;
}

export const CallScreen: React.FC<CallScreenProps> = ({
  callState,
  onEndCall,
  onToggleMute,
  onToggleSpeaker,
  onToggleVideo,
  onToggleBlur,
}) => {
  const [seconds, setSeconds] = useState(callState.durationSeconds || 0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] text-white flex flex-col justify-between p-6 select-none overflow-hidden">
      {/* Background Video or Gradient */}
      {callState.type === 'video' ? (
        <div className="absolute inset-0 z-0">
          <img
            src={callState.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800'}
            alt="Video Call Stream"
            className={`w-full h-full object-cover transition-all duration-500 ${
              callState.isBackgroundBlurred ? 'blur-2xl scale-110' : ''
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/95"></div>

          {/* Picture in Picture (Local Video) */}
          <div className="absolute top-6 right-6 w-28 h-40 rounded-xl overflow-hidden border border-[#d4af37]/40 shadow-2xl bg-black/80 z-20">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBl0ktFuvB6GR61Z1QpJdi9XFplnWRTA-Ne-fTVjYIwDgAwB-4GjNDG-Zgjg02gzF-fyJ47tm3knadv69FYrBqrTRyThkjg0kVOoNNHcNlGXa-UTQA-n1yxO39VqG4jzTX4sF8sSaCjVmkYPo5f5F_8gL1QnFeX46u2VDVo4iKO_yKhdXurxTS4FAYVFz8lR6AMMyTTPbb9Ph3p9mGbxiUbl0XAiw1gccbiT4XJRTNVinbLoeDuTnTUn-jd2VoTxc1Pu-ftLibq"
              alt="You"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-1.5 left-1.5 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-medium text-[#d4af37]">
              You
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0a0a] via-[#050505] to-[#0a0a0a]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-[120px] animate-pulse"></div>
        </div>
      )}

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/10">
          <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping"></span>
          <span className="text-[10px] font-mono tracking-widest text-[#d4af37] uppercase">
            ENCRYPTED ({formatTime(seconds)})
          </span>
        </div>

        <button
          onClick={onToggleBlur}
          className={`p-2.5 rounded-lg backdrop-blur-md border transition-all ${
            callState.isBackgroundBlurred ? 'bg-[#d4af37] text-black border-[#d4af37] gold-glow' : 'bg-black/60 border-white/10 text-white/80'
          }`}
          title="Blur Background"
        >
          <span className="material-symbols-outlined text-[18px]">blur_on</span>
        </button>
      </header>

      {/* Center Caller Profile */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center my-auto space-y-6">
        {callState.type === 'voice' && (
          <div className="relative">
            <div className="absolute inset-0 bg-[#d4af37]/20 rounded-full blur-2xl animate-ping scale-150"></div>
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 border-[#d4af37] shadow-[0_0_50px_rgba(212,175,55,0.25)] relative z-10 bg-[#111111] flex items-center justify-center">
              {callState.avatarUrl ? (
                <img src={callState.avatarUrl} alt={callState.contactName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-serif italic text-[#d4af37]">{callState.contactName.slice(0, 2)}</span>
              )}
            </div>
          </div>
        )}

        <div>
          <h2 className="font-serif italic text-2xl sm:text-3xl font-bold text-white tracking-tight drop-shadow-md">
            {callState.contactName}
          </h2>
          <p className="text-xs uppercase tracking-[0.2em] text-[#d4af37] font-medium mt-1">
            {callState.type === 'video' ? 'Secure Video Call' : 'Secure Voice Call'}
          </p>
        </div>

        {/* Live Audio Visualizer Wave */}
        {callState.type === 'voice' && (
          <div className="flex items-center gap-1.5 h-8">
            <div className="waveform-bar h-3 bg-[#d4af37] animate-pulse"></div>
            <div className="waveform-bar h-6 bg-[#d4af37] animate-pulse"></div>
            <div className="waveform-bar h-8 bg-[#d4af37] animate-pulse"></div>
            <div className="waveform-bar h-4 bg-[#d4af37] animate-pulse"></div>
            <div className="waveform-bar h-7 bg-[#d4af37] animate-pulse"></div>
            <div className="waveform-bar h-2 bg-[#d4af37] animate-pulse"></div>
          </div>
        )}
      </main>

      {/* Bottom Controls */}
      <footer className="relative z-10 max-w-md w-full mx-auto space-y-6">
        <div className="bg-[#111111]/90 rounded-2xl p-4 grid grid-cols-4 gap-3 border border-white/10 backdrop-blur-2xl">
          <button
            onClick={onToggleMute}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${
              callState.isMuted ? 'bg-[#ff7276] text-black' : 'bg-white/5 border border-white/10 hover:border-[#d4af37] text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {callState.isMuted ? 'mic_off' : 'mic'}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider">{callState.isMuted ? 'Muted' : 'Mute'}</span>
          </button>

          <button
            onClick={onToggleSpeaker}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${
              callState.isSpeaker ? 'bg-[#d4af37] text-black gold-glow' : 'bg-white/5 border border-white/10 hover:border-[#d4af37] text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {callState.isSpeaker ? 'volume_up' : 'volume_down'}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider">Speaker</span>
          </button>

          <button
            onClick={onToggleVideo}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${
              callState.isVideoOn ? 'bg-[#d4af37] text-black gold-glow' : 'bg-white/5 border border-white/10 hover:border-[#d4af37] text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {callState.isVideoOn ? 'videocam' : 'videocam_off'}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider">Video</span>
          </button>

          <button
            onClick={onEndCall}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[#ff7276] hover:bg-red-600 text-black font-bold transition-transform active:scale-90"
          >
            <span className="material-symbols-outlined text-[20px]">call_end</span>
            <span className="text-[10px] uppercase tracking-wider">End</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
