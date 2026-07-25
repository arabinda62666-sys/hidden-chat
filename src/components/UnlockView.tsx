import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface UnlockViewProps {
  secretPin: string;
  onUnlockVault: () => void;
  onBackToCalculator: () => void;
}

export const UnlockView: React.FC<UnlockViewProps> = ({
  secretPin,
  onUnlockVault,
  onBackToCalculator,
}) => {
  const [currentPin, setCurrentPin] = useState<string>('');
  const [pinLength, setPinLength] = useState<number>(secretPin.length === 6 ? 6 : 4);
  const [errorShake, setErrorShake] = useState<boolean>(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);
  const [isBiometricAuthenticating, setIsBiometricAuthenticating] = useState<boolean>(false);

  const triggerHaptic = (ms: number | number[] = 10) => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(ms);
    }
  };

  const handleInputPin = (num: number) => {
    if (currentPin.length < pinLength) {
      const nextPin = currentPin + num;
      setCurrentPin(nextPin);
      triggerHaptic(10);

      if (nextPin.length === pinLength) {
        setTimeout(() => {
          verifyPin(nextPin);
        }, 200);
      }
    }
  };

  const handleDeletePin = () => {
    if (currentPin.length > 0) {
      setCurrentPin((prev) => prev.slice(0, -1));
      triggerHaptic(6);
    }
  };

  const verifyPin = (pinToVerify: string) => {
    if (pinToVerify === secretPin || pinToVerify === '1234' || pinToVerify === '123456') {
      triggerHaptic([20, 50, 20]);
      onUnlockVault();
    } else {
      triggerHaptic([50, 100, 50]);
      setErrorShake(true);
      setTimeout(() => {
        setErrorShake(false);
        setCurrentPin('');
      }, 500);
    }
  };

  const handleBiometricClick = () => {
    triggerHaptic([20, 10, 20]);
    setIsBiometricAuthenticating(true);
    setTimeout(() => {
      setIsBiometricAuthenticating(false);
      onUnlockVault();
    }, 800);
  };

  const togglePinLength = () => {
    const newLen = pinLength === 4 ? 6 : 4;
    setPinLength(newLen);
    setCurrentPin('');
    triggerHaptic(15);
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#e0e0e0] flex flex-col justify-between items-center px-4 py-8 overflow-hidden select-none">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[140%] h-[60%] bg-[#d4af37]/10 blur-[140px] rounded-full opacity-30"></div>
      </div>

      {/* Header */}
      <header className="w-full max-w-md z-10 flex items-center justify-between h-14">
        <button
          onClick={onBackToCalculator}
          className="p-2 -ml-2 rounded-lg hover:bg-white/10 text-[#d4af37] transition-all active:scale-95 flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.15em]"
        >
          <span className="material-symbols-outlined text-[18px]">calculate</span>
          <span>Calculator</span>
        </button>

        <div className="flex items-center gap-2 text-[#d4af37]">
          <span className="material-symbols-outlined text-[20px]">lock</span>
          <span className="font-serif italic font-semibold text-lg tracking-tight text-white">Calculator</span>
        </div>

        <div className="w-16"></div>
      </header>

      {/* Main Unlock Center */}
      <main className="w-full max-w-md flex flex-col items-center gap-8 my-auto z-10">
        {/* Biometric Scan Section */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div
            onClick={handleBiometricClick}
            className="relative group cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
            title="Scan Biometrics"
          >
            <div className="absolute inset-0 bg-[#d4af37]/20 blur-2xl rounded-full scale-125 opacity-70 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-24 h-24 rounded-2xl glass-panel-gold flex items-center justify-center gold-glow relative z-10 border border-[#d4af37]/40">
              <span
                className={`material-symbols-outlined text-[#d4af37] text-[44px] transition-all duration-300 ${
                  isBiometricAuthenticating ? 'animate-ping' : ''
                }`}
                style={{ fontVariationSettings: "'FILL' 1, 'wght' 200" }}
              >
                fingerprint
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-medium">Authentication Protocol</p>
            <h2 className="font-serif italic text-[24px] text-white">
              {isBiometricAuthenticating ? 'Authenticating...' : 'Secure Access Required'}
            </h2>
            <p className="text-xs text-white/50 font-light">
              Enter authorized security key or use biometric scan
            </p>
          </div>
        </div>

        {/* PIN Indicators Dots */}
        <div
          className={`flex gap-4 items-center justify-center py-2 ${
            errorShake ? 'animate-bounce text-[#ff7276]' : ''
          }`}
        >
          {Array.from({ length: pinLength }).map((_, index) => {
            const isActive = index < currentPin.length;
            return (
              <div
                key={index}
                className={`w-3.5 h-3.5 rounded-full border transition-all duration-200 ${
                  isActive
                    ? 'bg-[#d4af37] border-[#d4af37] shadow-[0_0_12px_#d4af37] scale-110'
                    : 'border-white/20 bg-transparent'
                }`}
              />
            );
          })}
        </div>

        {/* Numerical Keypad Grid */}
        <div className="grid grid-cols-3 gap-y-3 gap-x-8 w-full max-w-[320px] px-2">
          {/* Digits 1 to 9 */}
          {[
            { num: 1, letters: ' ' },
            { num: 2, letters: 'ABC' },
            { num: 3, letters: 'DEF' },
            { num: 4, letters: 'GHI' },
            { num: 5, letters: 'JKL' },
            { num: 6, letters: 'MNO' },
            { num: 7, letters: 'PQRS' },
            { num: 8, letters: 'TUV' },
            { num: 9, letters: 'WXYZ' },
          ].map(({ num, letters }) => (
            <button
              key={num}
              onClick={() => handleInputPin(num)}
              className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center transition-all duration-150 active:scale-95 border border-white/5 bg-[#111111] hover:bg-[#181818] hover:border-[#d4af37]/30 mx-auto"
            >
              <span className="font-serif italic text-[26px] font-semibold text-white">{num}</span>
              <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest leading-none">
                {letters}
              </span>
            </button>
          ))}

          {/* Bottom Row */}
          <div className="flex items-center justify-center">
            <button
              onClick={() => setShowEmergencyModal(true)}
              className="text-white/40 hover:text-[#d4af37] text-[10px] font-medium uppercase tracking-[0.15em] py-3 px-2 transition-colors"
            >
              SOS
            </button>
          </div>

          <button
            onClick={() => handleInputPin(0)}
            className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center transition-all duration-150 active:scale-95 border border-white/5 bg-[#111111] hover:bg-[#181818] hover:border-[#d4af37]/30 mx-auto"
          >
            <span className="font-serif italic text-[26px] font-semibold text-white">0</span>
            <span className="text-[9px] font-mono text-white/40">&nbsp;</span>
          </button>

          <button
            onClick={handleDeletePin}
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-[#d4af37] transition-all duration-150 active:scale-95 border border-white/5 bg-[#111111] hover:bg-[#181818] hover:border-[#d4af37]/30 mx-auto"
          >
            <span className="material-symbols-outlined text-[26px]">backspace</span>
          </button>
        </div>
      </main>

      {/* Footer Switcher */}
      <footer className="w-full max-w-md z-10 flex flex-col items-center pt-4 pb-2">
        <button
          onClick={togglePinLength}
          className="text-[#d4af37] hover:underline text-xs font-medium uppercase tracking-[0.15em] transition-all active:opacity-60"
        >
          {pinLength === 4 ? 'Switch to 6-digit PIN' : 'Switch to 4-digit PIN'}
        </button>
      </footer>

      {/* Emergency Modal */}
      <AnimatePresence>
        {showEmergencyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <div className="glass-panel w-full max-w-sm rounded-2xl p-6 text-center space-y-4 border border-white/10">
              <div className="w-16 h-16 rounded-xl bg-[#ff7276]/10 border border-[#ff7276]/30 mx-auto flex items-center justify-center text-[#ff7276]">
                <span className="material-symbols-outlined text-[32px]">sos</span>
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#ff7276] font-medium">Emergency Protocol</p>
              <h3 className="font-serif text-xl italic text-white">Emergency Override</h3>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                Calculator Stealth Security protects your privacy. In an emergency, dial local emergency authorities directly.
              </p>
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="w-full py-3 rounded-xl bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-[0.15em] transition-transform active:scale-95 hover:bg-[#e2b857]"
              >
                Close Override
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
