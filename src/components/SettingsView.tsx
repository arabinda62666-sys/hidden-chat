import React, { useState } from 'react';
import { SecuritySettings, AuthUser } from '../types';

interface SettingsViewProps {
  settings: SecuritySettings;
  onUpdateSettings: (newSettings: Partial<SecuritySettings>) => void;
  userAvatarUrl: string;
  onLockApp: () => void;
  onResetVaultData: () => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  userAvatarUrl,
  onLockApp,
  onResetVaultData,
  currentUser,
  onLogout,
}) => {
  const [showPinModal, setShowPinModal] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');

  const handleChangePin = () => {
    if (newPin.length < 4) {
      setPinError('PIN must be at least 4 digits.');
      return;
    }
    if (newPin !== confirmPin) {
      setPinError('PINs do not match.');
      return;
    }
    onUpdateSettings({ secretPin: newPin });
    setShowPinModal(false);
    setNewPin('');
    setConfirmPin('');
    setPinError('');
    alert('Secret Vault PIN successfully updated!');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-20 pb-32 px-4 max-w-2xl mx-auto space-y-6">
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
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#d4af37] font-medium">Security</span>
            <h1 className="font-serif italic text-[18px] text-white font-semibold tracking-tight">Vault Settings</h1>
          </div>
        </div>

        <button
          onClick={onLockApp}
          className="px-3 py-1.5 rounded-lg bg-[#ff7276]/10 text-[#ff7276] border border-[#ff7276]/30 text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[15px]">lock</span>
          <span>Lock Vault</span>
        </button>
      </header>

      {/* User Profile Card */}
      <section className="bg-[#0a0a0a] p-5 rounded-2xl border border-white/10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#d4af37] shadow-md bg-[#111111]">
              <img
                src={currentUser?.avatarUrl || userAvatarUrl}
                alt={currentUser?.name || "User"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#d4af37] rounded-full border-2 border-[#050505] flex items-center justify-center text-black">
              <span className="material-symbols-outlined text-black text-[12px]">verified_user</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="font-serif italic text-lg font-bold text-white truncate">
              {currentUser?.name || "Alex Rivera"}
            </h2>
            <p className="text-xs text-[#d4af37] font-mono truncate">
              {currentUser?.email || currentUser?.phone || "alex.rivera@calculator.vault"}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-white/40 mt-0.5">
              Auth: {currentUser?.authMethod ? currentUser.authMethod.toUpperCase() : "ENCRYPTED"}
            </p>
          </div>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-white/60 hover:text-red-400 text-xs font-medium flex flex-col items-center gap-1 transition-all shrink-0"
            title="Sign Out"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span className="text-[9px] uppercase tracking-wider">Sign Out</span>
          </button>
        )}
      </section>

      {/* Stealth & Vault Security Controls */}
      <section className="space-y-3">
        <h3 className="text-[10px] text-[#d4af37] px-1 uppercase tracking-[0.2em] font-semibold">
          Stealth & Security Controls
        </h3>

        <div className="bg-[#0a0a0a] rounded-2xl p-1 divide-y divide-white/5 border border-white/10">
          {/* Stealth Mode */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#d4af37]">
                <span className="material-symbols-outlined text-[20px]">visibility_off</span>
              </div>
              <div>
                <h4 className="font-medium text-sm text-white">Stealth Mode</h4>
                <p className="text-xs text-white/40 font-light">Hide online status & read receipts</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.stealthMode}
                onChange={(e) => onUpdateSettings({ stealthMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-black after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]"></div>
            </label>
          </div>

          {/* Ghost Vault Default */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#d4af37]">
                <span className="material-symbols-outlined text-[20px]">calculate</span>
              </div>
              <div>
                <h4 className="font-medium text-sm text-white">Disguise on Startup</h4>
                <p className="text-xs text-white/40 font-light">Boot directly as a precision calculator</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.ghostVault}
                onChange={(e) => onUpdateSettings({ ghostVault: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-black after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]"></div>
            </label>
          </div>

          {/* Change Secret PIN */}
          <div
            onClick={() => setShowPinModal(true)}
            className="p-3.5 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#d4af37]">
                <span className="material-symbols-outlined text-[20px]">pin</span>
              </div>
              <div>
                <h4 className="font-medium text-sm text-white">Secret Vault PIN</h4>
                <p className="text-xs text-white/40 font-light">Current: {settings.secretPin.replace(/./g, '•')}</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#d4af37] text-[20px]">chevron_right</span>
          </div>

          {/* Auto Lock Timer */}
          <div className="p-3.5 space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#d4af37]">
                  <span className="material-symbols-outlined text-[20px]">timer</span>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-white">Auto-Lock Inactivity</h4>
                  <p className="text-xs text-white/40 font-light">Auto lock when idle</p>
                </div>
              </div>
              <span className="font-mono text-xs text-[#d4af37] font-bold">
                {settings.autoLockMinutes} min
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              value={settings.autoLockMinutes}
              onChange={(e) => onUpdateSettings({ autoLockMinutes: parseInt(e.target.value, 10) })}
              className="w-full accent-[#d4af37]"
            />
          </div>
        </div>
      </section>

      {/* Preferences */}
      <section className="space-y-3">
        <h3 className="text-[10px] text-white/40 px-1 uppercase tracking-[0.2em] font-semibold">
          Preferences
        </h3>

        <div className="bg-[#0a0a0a] rounded-2xl p-1 divide-y divide-white/5 border border-white/10">
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
                <span className="material-symbols-outlined text-[20px]">vibration</span>
              </div>
              <div>
                <h4 className="font-medium text-sm text-white">Haptic Feedback</h4>
                <p className="text-xs text-white/40 font-light">Keypad and unlock vibrations</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.hapticFeedback}
                onChange={(e) => onUpdateSettings({ hapticFeedback: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-black after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]"></div>
            </label>
          </div>

          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
                <span className="material-symbols-outlined text-[20px]">notifications</span>
              </div>
              <div>
                <h4 className="font-medium text-sm text-white">Discreet Notifications</h4>
                <p className="text-xs text-white/40 font-light">Show benign calculation banners</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.messageAlerts}
                onChange={(e) => onUpdateSettings({ messageAlerts: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-black after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]"></div>
            </label>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="pt-2">
        <button
          onClick={() => {
            if (confirm('Are you sure you want to clear all local vault chats and reset settings?')) {
              onResetVaultData();
            }
          }}
          className="w-full py-3.5 rounded-xl bg-[#ff7276]/10 border border-[#ff7276]/30 text-[#ff7276] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#ff7276]/20 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">delete_forever</span>
          <span>Clear Vault Cache & Messages</span>
        </button>
      </section>

      {/* PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-white/10 w-full max-w-sm rounded-2xl p-6 space-y-4">
            <h3 className="font-serif italic text-lg font-bold text-white">Change Secret Vault PIN</h3>
            {pinError && <p className="text-xs text-[#ff7276]">{pinError}</p>}
            <div className="space-y-3">
              <input
                type="password"
                maxLength={6}
                placeholder="New PIN (4-6 digits)"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-xs text-white text-center font-mono text-lg tracking-widest focus:border-[#d4af37]"
              />
              <input
                type="password"
                maxLength={6}
                placeholder="Confirm New PIN"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-xs text-white text-center font-mono text-lg tracking-widest focus:border-[#d4af37]"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowPinModal(false)}
                className="flex-1 py-2.5 rounded-lg border border-white/10 text-xs text-white/60 uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePin}
                className="flex-1 py-2.5 rounded-lg bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-wider"
              >
                Update PIN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
