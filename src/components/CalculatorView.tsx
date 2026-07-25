import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CalculatorViewProps {
  secretPin: string;
  onUnlockVault: () => void;
  onOpenUnlockScreen: () => void;
  onTriggerMasterReset?: () => void;
}

export const CalculatorView: React.FC<CalculatorViewProps> = ({
  secretPin,
  onUnlockVault,
  onOpenUnlockScreen,
  onTriggerMasterReset,
}) => {
  const [currentInput, setCurrentInput] = useState<string>('0');
  const [previousInput, setPreviousInput] = useState<string>('');
  const [operator, setOperator] = useState<string | null>(null);
  const [showUnlockOverlay, setShowUnlockOverlay] = useState<boolean>(false);

  const getOpSymbol = (op: string | null) => {
    switch (op) {
      case '/': return '÷';
      case '*': return '×';
      case '-': return '−';
      case '+': return '+';
      default: return '';
    }
  };

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (window.navigator && window.navigator.vibrate) {
      if (type === 'light') window.navigator.vibrate(8);
      else if (type === 'medium') window.navigator.vibrate(18);
      else window.navigator.vibrate([30, 40, 30]);
    }
  };

  const checkSecretUnlock = (val: string): boolean => {
    // 1. Check Master Code (Must strictly be *#*#626264#*#*)
    const masterPattern = '*#*#626264#*#*';

    if (
      val === masterPattern ||
      val.endsWith(masterPattern) ||
      val.includes(masterPattern)
    ) {
      if (onTriggerMasterReset) {
        onTriggerMasterReset();
        return true;
      }
    }

    if (!secretPin) return false;
    const cleanPin = secretPin.trim();
    const pattern1 = `*#*#${cleanPin}#*#*`;
    const pattern2 = `*#*#${cleanPin}`;

    if (
      val === cleanPin ||
      val === pattern1 ||
      val === pattern2 ||
      val.endsWith(pattern1) ||
      val.includes(pattern1)
    ) {
      unlockVaultSequence();
      return true;
    }
    return false;
  };

  const appendSymbol = (sym: string) => {
    triggerHaptic('light');
    if (currentInput === '0' && sym !== '.' && sym !== '*' && sym !== '#') {
      const nextVal = sym;
      setCurrentInput(nextVal);
      checkSecretUnlock(nextVal);
    } else {
      if (sym === '.' && currentInput.includes('.')) return;
      const nextVal = currentInput === '0' ? sym : currentInput + sym;
      setCurrentInput(nextVal);
      checkSecretUnlock(nextVal);
    }
  };

  const appendOperator = (op: string) => {
    triggerHaptic('medium');
    if (operator !== null) {
      calculateResult();
    }
    setPreviousInput(currentInput);
    setOperator(op);
    setCurrentInput('0');
  };

  const clearCalc = () => {
    triggerHaptic('medium');
    setCurrentInput('0');
    setPreviousInput('');
    setOperator(null);
  };

  const deleteLast = () => {
    triggerHaptic('light');
    if (currentInput.length > 1) {
      const nextVal = currentInput.slice(0, -1);
      setCurrentInput(nextVal);
      checkSecretUnlock(nextVal);
    } else {
      setCurrentInput('0');
    }
  };

  const calculateResult = () => {
    triggerHaptic('medium');

    if (checkSecretUnlock(currentInput)) {
      return;
    }

    if (operator === null) {
      return;
    }

    if (previousInput === '') return;

    const prev = parseFloat(previousInput);
    const curr = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(curr)) return;

    let res: number | string = 0;
    switch (operator) {
      case '+': res = prev + curr; break;
      case '-': res = prev - curr; break;
      case '*': res = prev * curr; break;
      case '/': res = curr !== 0 ? prev / curr : 'Error'; break;
    }

    const resString = typeof res === 'number' ? Number(res.toFixed(8)).toString() : res;

    if (checkSecretUnlock(resString)) {
      return;
    }

    setCurrentInput(resString);
    setPreviousInput('');
    setOperator(null);
  };

  const unlockVaultSequence = () => {
    triggerHaptic('heavy');
    setShowUnlockOverlay(true);
    setTimeout(() => {
      onUnlockVault();
    }, 1800);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') appendSymbol(e.key);
      if (e.key === '.') appendSymbol('.');
      if (e.key === '*') appendSymbol('*');
      if (e.key === '#') appendSymbol('#');
      if (e.key === '+') appendOperator('+');
      if (e.key === '-') appendOperator('-');
      if (e.key === '/') appendOperator('/');
      if (e.key === 'Enter' || e.key === '=') calculateResult();
      if (e.key === 'Backspace') deleteLast();
      if (e.key === 'Escape') clearCalc();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentInput, previousInput, operator, secretPin]);

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#e0e0e0] flex flex-col justify-between overflow-hidden">
      {/* Top Disguised App Bar */}
      <header className="fixed top-0 w-full z-40 flex items-center justify-between px-6 h-16 bg-[#050505]/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#d4af37] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <span className="material-symbols-outlined text-black text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              calculate
            </span>
          </div>
          <div className="flex flex-col">
            <h1 className="font-serif text-[18px] italic font-semibold text-white tracking-tight">Calculator</h1>
          </div>
        </div>
      </header>

      {/* Calculator Main Canvas */}
      <main className="flex-1 flex flex-col justify-end pt-20 pb-6 max-w-md mx-auto w-full px-5">
        {/* Display Area */}
        <div className="flex-1 flex flex-col justify-end py-6">
          <div className="text-right text-white/40 font-mono text-xs uppercase tracking-[0.2em] mb-1 h-6 overflow-hidden">
            {operator ? `${previousInput} ${getOpSymbol(operator)}` : ''}
          </div>
          <div className="text-right font-serif italic text-[56px] sm:text-[64px] font-normal tracking-tight text-white truncate py-1">
            {currentInput}
          </div>
        </div>

        {/* Calculator Keypad Grid */}
        <div className="grid grid-cols-4 gap-3 pb-4">
          {/* Row 1 */}
          <button
            onClick={clearCalc}
            className="h-16 rounded-xl bg-[#161616] border border-white/10 text-[#ff7276] font-medium text-lg active:scale-95 hover:border-[#ff7276]/40 transition-all flex items-center justify-center"
          >
            C
          </button>
          <button
            onClick={() => appendSymbol('*')}
            className="h-16 rounded-xl bg-[#161616] border border-white/10 text-[#d4af37] font-medium text-xl active:scale-95 hover:border-[#d4af37]/50 transition-all flex items-center justify-center"
          >
            *
          </button>
          <button
            onClick={() => appendSymbol('#')}
            className="h-16 rounded-xl bg-[#161616] border border-white/10 text-[#d4af37] font-medium text-xl active:scale-95 hover:border-[#d4af37]/50 transition-all flex items-center justify-center"
          >
            #
          </button>
          <button
            onClick={() => appendOperator('/')}
            className="h-16 rounded-xl bg-[#161616] border border-white/10 text-[#d4af37] font-serif italic text-xl active:scale-95 hover:border-[#d4af37]/50 transition-all flex items-center justify-center"
          >
            ÷
          </button>

          {/* Row 2 */}
          <button
            onClick={() => appendSymbol('7')}
            className="h-16 rounded-xl bg-[#111111] border border-white/5 text-white font-medium text-2xl active:scale-95 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center"
          >
            7
          </button>
          <button
            onClick={() => appendSymbol('8')}
            className="h-16 rounded-xl bg-[#111111] border border-white/5 text-white font-medium text-2xl active:scale-95 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center"
          >
            8
          </button>
          <button
            onClick={() => appendSymbol('9')}
            className="h-16 rounded-xl bg-[#111111] border border-white/5 text-white font-medium text-2xl active:scale-95 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center"
          >
            9
          </button>
          <button
            onClick={() => appendOperator('*')}
            className="h-16 rounded-xl bg-[#161616] border border-white/10 text-[#d4af37] font-serif italic text-2xl active:scale-95 hover:border-[#d4af37]/50 transition-all flex items-center justify-center"
          >
            ×
          </button>

          {/* Row 3 */}
          <button
            onClick={() => appendSymbol('4')}
            className="h-16 rounded-xl bg-[#111111] border border-white/5 text-white font-medium text-2xl active:scale-95 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center"
          >
            4
          </button>
          <button
            onClick={() => appendSymbol('5')}
            className="h-16 rounded-xl bg-[#111111] border border-white/5 text-white font-medium text-2xl active:scale-95 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center"
          >
            5
          </button>
          <button
            onClick={() => appendSymbol('6')}
            className="h-16 rounded-xl bg-[#111111] border border-white/5 text-white font-medium text-2xl active:scale-95 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center"
          >
            6
          </button>
          <button
            onClick={() => appendOperator('-')}
            className="h-16 rounded-xl bg-[#161616] border border-white/10 text-[#d4af37] font-serif italic text-2xl active:scale-95 hover:border-[#d4af37]/50 transition-all flex items-center justify-center"
          >
            −
          </button>

          {/* Row 4 */}
          <button
            onClick={() => appendSymbol('1')}
            className="h-16 rounded-xl bg-[#111111] border border-white/5 text-white font-medium text-2xl active:scale-95 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center"
          >
            1
          </button>
          <button
            onClick={() => appendSymbol('2')}
            className="h-16 rounded-xl bg-[#111111] border border-white/5 text-white font-medium text-2xl active:scale-95 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center"
          >
            2
          </button>
          <button
            onClick={() => appendSymbol('3')}
            className="h-16 rounded-xl bg-[#111111] border border-white/5 text-white font-medium text-2xl active:scale-95 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center"
          >
            3
          </button>
          <button
            onClick={() => appendOperator('+')}
            className="h-16 rounded-xl bg-[#161616] border border-white/10 text-[#d4af37] font-serif italic text-2xl active:scale-95 hover:border-[#d4af37]/50 transition-all flex items-center justify-center"
          >
            +
          </button>

          {/* Row 5 */}
          <button
            onClick={() => appendSymbol('0')}
            className="h-16 rounded-xl bg-[#111111] border border-white/5 text-white font-medium text-2xl active:scale-95 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center"
          >
            0
          </button>
          <button
            onClick={() => appendSymbol('.')}
            className="h-16 rounded-xl bg-[#111111] border border-white/5 text-white font-medium text-2xl active:scale-95 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center"
          >
            .
          </button>
          <button
            onClick={deleteLast}
            className="h-16 rounded-xl bg-[#161616] border border-white/10 text-white/70 active:scale-95 hover:text-white transition-all flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[20px]">backspace</span>
          </button>
          <button
            onClick={calculateResult}
            className="h-16 rounded-xl bg-[#d4af37] text-black font-bold text-2xl active:scale-95 hover:bg-[#e2b857] transition-all flex items-center justify-center gold-glow shadow-lg"
          >
            <span className="material-symbols-outlined text-[28px]">
              equal
            </span>
          </button>
        </div>
      </main>

      {/* Secret Vault Transition Overlay */}
      <AnimatePresence>
        {showUnlockOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] glass-overlay flex flex-col items-center justify-center text-center p-6"
          >
            <div className="relative w-28 h-28 mb-6">
              <div className="absolute inset-0 bg-[#d4af37]/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="relative w-full h-full border border-[#d4af37]/50 rounded-2xl flex items-center justify-center bg-[#050505]/90 shadow-[0_0_40px_rgba(212,175,55,0.3)]">
                <span className="material-symbols-outlined text-[#d4af37] text-[52px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  lock_open
                </span>
              </div>
            </div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] mb-2 font-medium">Authentication Granted</p>
            <h2 className="font-serif text-[32px] italic text-white mb-2 tracking-tight">Vault Unlocked</h2>
            <p className="text-white/50 font-sans text-xs tracking-wider uppercase">Initializing Quantum Encrypted Session...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
