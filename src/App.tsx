import React, { useState, useEffect } from 'react';
import { fetchVaultData, syncVaultData } from './lib/api';
import {
  AppMode,
  VaultTab,
  Contact,
  Message,
  CallLog,
  MediaItem,
  SecuritySettings,
  ActiveCallState,
  Poll,
  AuthUser,
} from './types';
import {
  INITIAL_CONTACTS,
  INITIAL_MESSAGES,
  INITIAL_CALL_LOGS,
  INITIAL_MEDIA_ITEMS,
  INITIAL_SETTINGS,
} from './data/mockData';
import { AuthView } from './components/AuthView';
import { CalculatorView } from './components/CalculatorView';
import { UnlockView } from './components/UnlockView';
import { ChatsList } from './components/ChatsList';
import { ChatDetailView } from './components/ChatDetailView';
import { ContactsView } from './components/ContactsView';
import { CallsView } from './components/CallsView';
import { CallScreen } from './components/CallScreen';
import { StatusView } from './components/StatusView';
import { SettingsView } from './components/SettingsView';
import { BottomNav } from './components/BottomNav';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('calc_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [appMode, setAppMode] = useState<AppMode>(() => {
    const savedUser = localStorage.getItem('calc_user');
    return savedUser ? 'calculator' : 'login';
  });

  const [currentTab, setCurrentTab] = useState<VaultTab>('chats');
  const [activeContact, setActiveContact] = useState<Contact | null>(null);

  // App state
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('calcchat_contacts');
    const loaded: Contact[] = saved ? JSON.parse(saved) : INITIAL_CONTACTS;
    return loaded.filter(
      (c) => c.id !== 'ai-assistant' && !c.isAi && !c.name.toLowerCase().includes('gemini')
    );
  });

  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    const saved = localStorage.getItem('calcchat_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [callLogs, setCallLogs] = useState<CallLog[]>(() => {
    const saved = localStorage.getItem('calcchat_call_logs');
    return saved ? JSON.parse(saved) : INITIAL_CALL_LOGS;
  });

  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem('calcchat_media_items');
    return saved ? JSON.parse(saved) : INITIAL_MEDIA_ITEMS;
  });

  const [settings, setSettings] = useState<SecuritySettings>(() => {
    const saved = localStorage.getItem('calcchat_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [activeCall, setActiveCall] = useState<ActiveCallState | null>(null);

  const userAvatarUrl =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBl0ktFuvB6GR61Z1QpJdi9XFplnWRTA-Ne-fTVjYIwDgAwB-4GjNDG-Zgjg02gzF-fyJ47tm3knadv69FYrBqrTRyThkjg0kVOoNNHcNlGXa-UTQA-n1yxO39VqG4jzTX4sF8sSaCjVmkYPo5f5F_8gL1QnFeX46u2VDVo4iKO_yKhdXurxTS4FAYVFz8lR6AMMyTTPbb9Ph3p9mGbxiUbl0XAiw1gccbiT4XJRTNVinbLoeDuTnTUn-jd2VoTxc1Pu-ftLibq';

  // Load and periodically sync from server database for multi-user live chat
  useEffect(() => {
    const syncFromBackend = async () => {
      const serverDb = await fetchVaultData();
      if (serverDb) {
        if (serverDb.contacts && serverDb.contacts.length > 0) {
          setContacts(
            serverDb.contacts.filter(
              (c: any) => c.id !== 'ai-assistant' && !c.isAi && !c.name?.toLowerCase().includes('gemini')
            )
          );
        }
        if (serverDb.messages) setMessages(serverDb.messages);
        if (serverDb.callLogs) setCallLogs(serverDb.callLogs);
        if (serverDb.settings) setSettings((prev) => ({ ...prev, ...serverDb.settings }));
      }
    };

    syncFromBackend();
    const interval = setInterval(syncFromBackend, 3000); // Live poll every 3 seconds for 2-3 devices
    return () => clearInterval(interval);
  }, []);

  // Persistence and backend sync effects
  useEffect(() => {
    localStorage.setItem('calcchat_contacts', JSON.stringify(contacts));
    syncVaultData({ contacts });
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('calcchat_messages', JSON.stringify(messages));
    syncVaultData({ messages });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('calcchat_settings', JSON.stringify(settings));
    syncVaultData({ settings });
  }, [settings]);

  // Auth Handlers
  const handleLoginSuccess = (user: AuthUser, secretPassword?: string) => {
    setCurrentUser(user);
    localStorage.setItem('calc_user', JSON.stringify(user));
    if (secretPassword) {
      setSettings((prev) => {
        const updated = { ...prev, secretPin: secretPassword };
        localStorage.setItem('calcchat_settings', JSON.stringify(updated));
        return updated;
      });
    }
    setAppMode('calculator');
  };

  const handleLogout = () => {
    localStorage.removeItem('calc_user');
    setCurrentUser(null);
    setActiveContact(null);
    setAppMode('login');
  };

  // Handlers
  const handleLockApp = () => {
    setActiveContact(null);
    setAppMode('calculator');
  };

  const handleUnlockVault = () => {
    setAppMode('vault');
  };

  const handleSelectContact = (contact: Contact) => {
    // Clear unread count for this contact
    setContacts((prev) =>
      prev.map((c) => (c.id === contact.id ? { ...c, unreadCount: 0 } : c))
    );
    setActiveContact(contact);
  };

  const handleSendMessage = (
    text: string,
    attachment?: Message['attachment'],
    poll?: Poll
  ) => {
    if (!activeContact) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'user',
      senderName: 'You',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOutgoing: true,
      status: 'sent',
      attachment,
      poll,
    };

    const contactId = activeContact.id;
    const currentList = messages[contactId] || [];
    const updatedList = [...currentList, newMsg];

    setMessages((prev) => ({
      ...prev,
      [contactId]: updatedList,
    }));

    // Update last message in contacts
    const displaySnippet = text || (attachment ? `Shared ${attachment.type}` : poll ? 'New Poll' : '');
    setContacts((prev) =>
      prev.map((c) =>
        c.id === contactId
          ? {
              ...c,
              lastMessage: displaySnippet,
              lastMessageTime: 'Just now',
            }
          : c
      )
    );

    // If attachment is an image, add to media gallery automatically
    if (attachment?.type === 'image' && attachment.url) {
      const newMedia: MediaItem = {
        id: `m-${Date.now()}`,
        title: attachment.fileName || 'Encrypted Photo',
        type: 'images',
        url: attachment.url,
        fileSize: attachment.fileSize || '2.1 MB',
        timestamp: 'Just now',
        senderName: 'You',
      };
      setMediaItems((prev) => [newMedia, ...prev]);
    }
  };

  const handleStartCall = (contact: Contact, type: 'voice' | 'video') => {
    setActiveCall({
      isActive: true,
      type,
      contactName: contact.name,
      avatarUrl: contact.avatarUrl,
      isMuted: false,
      isSpeaker: true,
      isVideoOn: type === 'video',
      isBackgroundBlurred: false,
      durationSeconds: 0,
    });

    // Add to call logs
    const newLog: CallLog = {
      id: `call-${Date.now()}`,
      contactId: contact.id,
      contactName: contact.name,
      avatarUrl: contact.avatarUrl,
      type,
      direction: 'outgoing',
      timestamp: 'Just now',
      duration: '00:01',
    };
    setCallLogs((prev) => [newLog, ...prev]);
  };

  const handleEndCall = () => {
    setActiveCall(null);
  };

  const handleAddNewContact = (newContact: Partial<Contact>) => {
    const contact: Contact = {
      id: `contact-${Date.now()}`,
      name: newContact.name || 'New Contact',
      avatarUrl: newContact.avatarUrl || '',
      statusText: newContact.statusText || 'Available',
      isOnline: true,
      phone: newContact.phone || '+1 555-0000',
      categoryLetter: (newContact.name || 'N').charAt(0).toUpperCase(),
    };
    setContacts((prev) => [contact, ...prev]);
  };

  const handleResetVaultData = () => {
    setContacts(INITIAL_CONTACTS);
    setMessages(INITIAL_MESSAGES);
    setCallLogs(INITIAL_CALL_LOGS);
    setMediaItems(INITIAL_MEDIA_ITEMS);
    setSettings(INITIAL_SETTINGS);
    localStorage.clear();
    handleLockApp();
  };

  const unreadTotal = contacts.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  return (
    <div className="min-h-screen bg-[#000000] text-[#e2e2e2] font-sans antialiased selection:bg-[#4d8eff]/30 selection:text-[#ffffff]">
      {/* 0. INITIAL AUTH / LOGIN MODE */}
      {appMode === 'login' && (
        <AuthView
          onLoginSuccess={handleLoginSuccess}
          initialSecretPin={settings.secretPin}
          onSkipToApp={() => setAppMode('calculator')}
        />
      )}

      {/* 1. DISGUISED CALCULATOR MODE */}
      {appMode === 'calculator' && (
        <CalculatorView
          secretPin={settings.secretPin}
          onUnlockVault={handleUnlockVault}
          onOpenUnlockScreen={() => setAppMode('unlock')}
          onTriggerMasterReset={() => {
            alert('🔐 Master Code (*#*#626264#*#*) Accepted! Passcode reset mode activated.');
            setSettings((prev) => ({ ...prev, secretPin: '1234' }));
            setAppMode('login');
          }}
        />
      )}

      {/* 2. BIOMETRIC / PIN UNLOCK SCREEN */}
      {appMode === 'unlock' && (
        <UnlockView
          secretPin={settings.secretPin}
          onUnlockVault={handleUnlockVault}
          onBackToCalculator={() => setAppMode('calculator')}
        />
      )}

      {/* 3. UNLOCKED VAULT MESSAGING SUITE */}
      {appMode === 'vault' && (
        <>
          {/* Active Chat Detail Screen */}
          {activeContact ? (
            <ChatDetailView
              contact={activeContact}
              messages={messages[activeContact.id] || []}
              onBack={() => setActiveContact(null)}
              onSendMessage={handleSendMessage}
              onStartCall={handleStartCall}
            />
          ) : (
            <>
              {currentTab === 'chats' && (
                <ChatsList
                  contacts={contacts}
                  onSelectContact={handleSelectContact}
                  onOpenNewChat={() => setCurrentTab('contacts')}
                  onOpenSearch={() => {}}
                  userAvatarUrl={userAvatarUrl}
                  onLockApp={handleLockApp}
                />
              )}

              {currentTab === 'contacts' && (
                <ContactsView
                  contacts={contacts}
                  onSelectContact={handleSelectContact}
                  onAddNewContact={handleAddNewContact}
                  onLockApp={handleLockApp}
                />
              )}

              {currentTab === 'calls' && (
                <CallsView
                  callLogs={callLogs}
                  contacts={contacts}
                  onStartCall={handleStartCall}
                  onLockApp={handleLockApp}
                />
              )}

              {currentTab === 'status' && (
                <StatusView
                  currentUser={currentUser}
                  onLockApp={handleLockApp}
                  onSendDirectMessage={(contactId, text) => {
                    const contact = contacts.find((c) => c.id === contactId);
                    if (contact) {
                      setActiveContact(contact);
                      handleSendMessage(text);
                    }
                  }}
                />
              )}

              {currentTab === 'settings' && (
                <SettingsView
                  settings={settings}
                  onUpdateSettings={(newSet) => setSettings((prev) => ({ ...prev, ...newSet }))}
                  userAvatarUrl={userAvatarUrl}
                  onLockApp={handleLockApp}
                  onResetVaultData={handleResetVaultData}
                  currentUser={currentUser}
                  onLogout={handleLogout}
                />
              )}

              {/* Bottom Navigation */}
              <BottomNav
                currentTab={currentTab}
                onTabChange={setCurrentTab}
                unreadTotal={unreadTotal}
                onLockApp={handleLockApp}
              />
            </>
          )}
        </>
      )}

      {/* Active Call Overlay Screen */}
      {activeCall && (
        <CallScreen
          callState={activeCall}
          onEndCall={handleEndCall}
          onToggleMute={() =>
            setActiveCall((prev) => (prev ? { ...prev, isMuted: !prev.isMuted } : null))
          }
          onToggleSpeaker={() =>
            setActiveCall((prev) => (prev ? { ...prev, isSpeaker: !prev.isSpeaker } : null))
          }
          onToggleVideo={() =>
            setActiveCall((prev) => (prev ? { ...prev, isVideoOn: !prev.isVideoOn } : null))
          }
          onToggleBlur={() =>
            setActiveCall((prev) =>
              prev ? { ...prev, isBackgroundBlurred: !prev.isBackgroundBlurred } : null
            )
          }
        />
      )}
    </div>
  );
};

export default App;
