import React, { useState } from 'react';
import { AuthUser } from '../types';
import { 
  Lock, 
  Smartphone, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface AuthViewProps {
  onLoginSuccess: (user: AuthUser, secretPassword?: string) => void;
  onSkipToApp?: () => void;
  initialSecretPin?: string;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess, onSkipToApp, initialSecretPin = '1234' }) => {
  const [step, setStep] = useState<'auth' | 'set_password'>('auth');
  const [pendingUser, setPendingUser] = useState<AuthUser | null>(null);
  const [secretPassword, setSecretPassword] = useState(initialSecretPin);
  const [showSecretPass, setShowSecretPass] = useState(false);

  const [activeMethod, setActiveMethod] = useState<'google' | 'phone' | 'email'>('google');
  
  // Email state
  const [emailMode, setEmailMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Phone state
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(30);

  // Status & loading
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const proceedToPasswordSetup = (user: AuthUser) => {
    setPendingUser(user);
    setStep('set_password');
  };

  const handleFinishAuthWithPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretPassword || secretPassword.trim().length === 0) {
      setErrorMessage('Please enter a secret password');
      return;
    }
    setErrorMessage('');
    if (pendingUser) {
      onLoginSuccess(pendingUser, secretPassword.trim());
    } else {
      const guestUser: AuthUser = {
        id: `usr-guest-${Date.now()}`,
        name: 'Guest User',
        authMethod: 'guest',
      };
      onLoginSuccess(guestUser, secretPassword.trim());
    }
  };

  // Google Sign In Handler
  const handleGoogleLogin = (selectedAccount?: { name: string; email: string; avatar: string }) => {
    setIsLoading(true);
    setErrorMessage('');
    
    setTimeout(() => {
      setIsLoading(false);
      setShowGoogleModal(false);
      const user: AuthUser = {
        id: `usr-g-${Date.now()}`,
        name: selectedAccount?.name || 'Google User',
        email: selectedAccount?.email || 'user@gmail.com',
        authMethod: 'google',
        avatarUrl: selectedAccount?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      };
      proceedToPasswordSetup(user);
    }, 1000);
  };

  // Phone OTP Handler
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 8) {
      setErrorMessage('Please enter a valid mobile number');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      let count = 30;
      const interval = setInterval(() => {
        count -= 1;
        setOtpTimer(count);
        if (count <= 0) clearInterval(interval);
      }, 1000);
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 6) {
      setErrorMessage('Please enter complete 6-digit OTP code');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const user: AuthUser = {
        id: `usr-p-${Date.now()}`,
        name: `User ${phoneNumber.slice(-4)}`,
        phone: `${countryCode} ${phoneNumber}`,
        authMethod: 'phone',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      };
      proceedToPasswordSetup(user);
    }, 1000);
  };

  // Email / Password Handler
  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }
    if (emailMode === 'signup' && !name.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const user: AuthUser = {
        id: `usr-e-${Date.now()}`,
        name: emailMode === 'signup' ? name : (email.split('@')[0] || 'User'),
        email: email,
        authMethod: 'email',
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
      };
      proceedToPasswordSetup(user);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col justify-between items-center px-4 py-8 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-[#d4af37]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-[#4d8eff]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header / Branding */}
      <div className="w-full max-w-sm flex flex-col items-center pt-6 text-center z-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border border-[#d4af37]/40 flex items-center justify-center shadow-2xl mb-4 relative group">
          <span className="material-symbols-outlined text-[#d4af37] text-3xl group-hover:scale-110 transition-transform">
            calculate
          </span>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#d4af37] rounded-full flex items-center justify-center text-black">
            <Lock className="w-3 h-3 stroke-[2.5]" />
          </div>
        </div>
        <h1 className="text-2xl font-serif italic font-bold tracking-tight text-white mb-1">
          Calculator
        </h1>
        <p className="text-xs text-white/50 tracking-wider uppercase font-mono">
          Security Login System
        </p>
      </div>

      {/* Main Authentication / Password Setup Card */}
      <div className="w-full max-w-sm my-auto bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl z-10">
        {step === 'set_password' ? (
          <form onSubmit={handleFinishAuthWithPassword} className="space-y-4">
            <div className="text-center mb-2">
              <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] mx-auto flex items-center justify-center mb-2">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white font-serif italic">
                Set Secret Vault Password
              </h2>
              <p className="text-xs text-white/60 mt-1 leading-relaxed">
                Choose a secret password. You will use this formula on your Calculator to unlock hidden chats.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1 font-mono">
                Enter Secret Password (Digits or Code)
              </label>
              <div className="relative">
                <input
                  type={showSecretPass ? 'text' : 'password'}
                  placeholder="1234"
                  value={secretPassword}
                  onChange={(e) => setSecretPassword(e.target.value.replace(/\s/g, ''))}
                  className="w-full bg-[#141414] border border-[#d4af37]/50 rounded-xl px-3.5 py-3 text-sm text-white font-mono placeholder-white/20 focus:outline-none focus:border-[#d4af37] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowSecretPass(!showSecretPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  {showSecretPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Secret Formula Card */}
            <div className="p-3.5 rounded-xl bg-[#111111] border border-[#d4af37]/30 text-center space-y-2">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">
                  Your Secret Dial Formula
                </span>
                <div className="text-lg font-mono font-bold text-[#d4af37] tracking-wider py-0.5 select-all">
                  *#*#{secretPassword || '1234'}#*#*
                </div>
              </div>

              {/* Master Recovery Code Badge */}
              <div className="pt-2 border-t border-white/10 text-left bg-black/40 p-2.5 rounded-lg">
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#d4af37] mb-0.5">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Forgot Password Master Code</span>
                  </span>
                  <span className="font-mono bg-[#d4af37]/20 px-1.5 py-0.5 rounded text-[10px]">
                    *#*#626264#*#*
                  </span>
                </div>
                <p className="text-[10px] text-white/60 leading-tight">
                  If you ever forget your password, type <span className="text-white font-mono">*#*#626264#*#*</span> on the calculator to verify OTP & reset password.
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8952b] text-black font-semibold text-sm flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-lg mt-2"
            >
              <span>Save Password & Launch App</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <>
            {/* Method Switcher Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-[#141414] p-1 rounded-xl mb-6 border border-white/5">
          <button
            type="button"
            onClick={() => { setActiveMethod('google'); setErrorMessage(''); }}
            className={`py-2 px-1 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeMethod === 'google'
                ? 'bg-[#222222] text-[#d4af37] shadow-sm border border-[#d4af37]/30'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveMethod('phone'); setErrorMessage(''); }}
            className={`py-2 px-1 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeMethod === 'phone'
                ? 'bg-[#222222] text-[#d4af37] shadow-sm border border-[#d4af37]/30'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveMethod('email'); setErrorMessage(''); }}
            className={`py-2 px-1 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeMethod === 'email'
                ? 'bg-[#222222] text-[#d4af37] shadow-sm border border-[#d4af37]/30'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </button>
        </div>

        {/* Error Notification Pill */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* METHOD 1: GOOGLE SIGN IN */}
        {activeMethod === 'google' && (
          <div className="flex flex-col items-center py-2 space-y-4">
            <p className="text-xs text-white/60 text-center leading-relaxed font-light">
              Fast, encrypted access using your Google Account. No password needed.
            </p>

            <button
              type="button"
              onClick={() => setShowGoogleModal(true)}
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-white text-black font-medium text-sm flex items-center justify-center gap-3 hover:bg-white/90 active:scale-[0.98] transition-all shadow-lg cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isLoading ? 'Connecting...' : 'Sign in with Google'}</span>
            </button>

            <div className="flex items-center gap-1.5 text-[11px] text-white/40 pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Protected by Google OAuth Authentication</span>
            </div>
          </div>
        )}

        {/* METHOD 2: MOBILE NUMBER + OTP */}
        {activeMethod === 'phone' && (
          <div>
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <p className="text-xs text-white/60 leading-relaxed font-light">
                  Enter your mobile number to receive a 6-digit verification code.
                </p>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1 font-mono">
                    Mobile Number
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-[#141414] border border-white/10 rounded-xl px-2.5 py-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+880">🇧🇩 +880</option>
                      <option value="+92">🇵🇰 +92</option>
                      <option value="+971">🇦🇪 +971</option>
                    </select>

                    <input
                      type="tel"
                      placeholder="9876543210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      className="flex-1 bg-[#141414] border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8952b] text-black font-semibold text-sm flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-lg"
                >
                  <span>{isLoading ? 'Sending OTP...' : 'Send OTP Code'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="text-center">
                  <p className="text-xs text-white/60">
                    OTP sent to <span className="text-[#d4af37] font-mono">{countryCode} {phoneNumber}</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-[11px] text-white/40 hover:text-white underline mt-1"
                  >
                    Change Number
                  </button>
                </div>

                {/* 6-Digit OTP Input */}
                <div className="flex justify-between gap-1.5 py-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-field-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        const newOtp = [...otp];
                        newOtp[idx] = val;
                        setOtp(newOtp);
                        if (val && idx < 5) {
                          const nextField = document.getElementById(`otp-field-${idx + 1}`);
                          nextField?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
                          const prevField = document.getElementById(`otp-field-${idx - 1}`);
                          prevField?.focus();
                        }
                      }}
                      className="w-11 h-12 text-center bg-[#141414] border border-white/15 rounded-xl text-lg font-bold text-white focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8952b] text-black font-semibold text-sm flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-lg"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isLoading ? 'Verifying...' : 'Verify & Continue'}</span>
                </button>

                <div className="text-center text-[11px] text-white/40 pt-1">
                  {otpTimer > 0 ? (
                    <span>Resend OTP in {otpTimer}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setOtpTimer(30);
                        // trigger resend
                      }}
                      className="text-[#d4af37] underline hover:text-white"
                    >
                      Resend OTP Code
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        )}

        {/* METHOD 3: EMAIL & PASSWORD */}
        {activeMethod === 'email' && (
          <form onSubmit={handleEmailAuth} className="space-y-3.5">
            <div className="flex bg-[#141414] p-1 rounded-xl mb-3 border border-white/5">
              <button
                type="button"
                onClick={() => setEmailMode('signin')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  emailMode === 'signin'
                    ? 'bg-[#222] text-white shadow-sm'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setEmailMode('signup')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  emailMode === 'signup'
                    ? 'bg-[#222] text-white shadow-sm'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {emailMode === 'signup' && (
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1 font-mono">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1 font-mono">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1 font-mono">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#d4af37] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8952b] text-black font-semibold text-sm flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-lg mt-2"
            >
              <span>{isLoading ? 'Processing...' : emailMode === 'signin' ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
          </>
        )}
      </div>

      {/* Guest Mode / Skip Option */}
      <div className="w-full max-w-sm flex flex-col items-center gap-2 pt-4 z-10">
        <button
          type="button"
          onClick={() => {
            if (onSkipToApp) {
              onSkipToApp();
            } else {
              const guestUser: AuthUser = {
                id: `usr-guest-${Date.now()}`,
                name: 'Guest User',
                authMethod: 'guest',
              };
              onLoginSuccess(guestUser);
            }
          }}
          className="text-xs text-white/50 hover:text-white flex items-center gap-1.5 transition-colors group cursor-pointer py-2 px-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/5"
        >
          <UserCheck className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Continue as Guest (Use Calculator directly)</span>
        </button>

        <p className="text-[10px] text-white/30 tracking-widest font-mono uppercase">
          Calculator Security Protocol v2.4
        </p>
      </div>

      {/* SIMULATED GOOGLE ACCOUNT CHOOSER MODAL */}
      {showGoogleModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-[#111111] border border-white/15 rounded-2xl p-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span className="text-xs font-semibold text-white">Choose a Google Account</span>
              </div>
              <button
                onClick={() => setShowGoogleModal(false)}
                className="text-white/40 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => handleGoogleLogin({
                  name: 'Arabinda Kumar',
                  email: 'arabinda62666@gmail.com',
                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                })}
                className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-3 transition-colors text-left group"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover border border-white/20"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white group-hover:text-[#d4af37]">Arabinda Kumar</p>
                  <p className="text-[11px] text-white/50 truncate">arabinda62666@gmail.com</p>
                </div>
              </button>

              <button
                onClick={() => handleGoogleLogin({
                  name: 'Alex Rivera',
                  email: 'alex.rivera@gmail.com',
                  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
                })}
                className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-3 transition-colors text-left group"
              >
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover border border-white/20"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white group-hover:text-[#d4af37]">Alex Rivera</p>
                  <p className="text-[11px] text-white/50 truncate">alex.rivera@gmail.com</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
