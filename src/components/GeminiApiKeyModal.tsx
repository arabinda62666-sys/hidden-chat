import React, { useState } from 'react';
import { Key, Sparkles, X, Check, Eye, EyeOff, ShieldCheck, Cpu } from 'lucide-react';

interface GeminiApiKeyModalProps {
  onSaveKey: (key: string) => void;
  onClose: () => void;
  currentKey?: string;
  isFirstInstall?: boolean;
}

export const GeminiApiKeyModal: React.FC<GeminiApiKeyModalProps> = ({
  onSaveKey,
  onClose,
  currentKey = '',
  isFirstInstall = false,
}) => {
  const [apiKey, setApiKey] = useState(currentKey);
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSaveKey(apiKey.trim());
      setSavedSuccess(true);
      setTimeout(() => {
        onClose();
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0e0e0e] border border-[#d4af37]/40 w-full max-w-md rounded-3xl p-6 space-y-5 relative shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif italic text-lg font-bold text-white">
                  Gemini API Key
                </h3>
                {isFirstInstall && (
                  <span className="bg-[#d4af37] text-black text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase">
                    New Setup
                  </span>
                )}
              </div>
              <p className="text-xs text-white/60">
                {isFirstInstall
                  ? 'New app installation detected. Please enter your Gemini API key.'
                  : 'Configure your Gemini AI API Key for intelligence features.'}
              </p>
            </div>
          </div>

          {!isFirstInstall && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-mono tracking-wider text-[#d4af37] mb-1.5 font-semibold">
              Enter Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-[#141414] border border-white/15 rounded-xl py-3 pl-10 pr-10 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:border-[#d4af37] transition-all"
                required
              />
              <Key className="w-4 h-4 text-white/40 absolute left-3 top-3.5" />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-3 text-white/40 hover:text-white/80 p-0.5"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-white/40 mt-1.5 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#d4af37]" />
              Your API key is securely encrypted & stored locally on this phone.
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="submit"
              disabled={!apiKey.trim()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8952b] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-40 shadow gold-glow"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>API Key Saved!</span>
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4 stroke-[2.5]" />
                  <span>Save Gemini API Key</span>
                </>
              )}
            </button>

            {isFirstInstall && (
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white/60 hover:text-white font-medium text-xs transition-all"
              >
                Skip for now
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
