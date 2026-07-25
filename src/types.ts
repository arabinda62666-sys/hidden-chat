export type AppMode = 'login' | 'calculator' | 'unlock' | 'vault';

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  authMethod: 'google' | 'phone' | 'email' | 'guest';
  avatarUrl?: string;
}

export type VaultTab = 'chats' | 'contacts' | 'calls' | 'status' | 'settings';

export interface StatusItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  timestamp: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  text?: string;
  bgColor?: string;
  caption?: string;
  isViewed?: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  votedUserIds: string[];
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
}

export interface Attachment {
  type: 'image' | 'voice' | 'file';
  url?: string;
  fileName?: string;
  fileSize?: string;
  duration?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  avatarUrl?: string;
  content: string;
  timestamp: string;
  isOutgoing: boolean;
  status: 'sent' | 'delivered' | 'read';
  attachment?: Attachment;
  poll?: Poll;
}

export interface Contact {
  id: string;
  name: string;
  avatarUrl: string;
  statusText: string;
  isOnline: boolean;
  isPinned?: boolean;
  isGroup?: boolean;
  isAi?: boolean;
  groupMembersCount?: number;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  phone?: string;
  categoryLetter?: string;
}

export interface CallLog {
  id: string;
  contactId: string;
  contactName: string;
  avatarUrl: string;
  type: 'voice' | 'video';
  direction: 'incoming' | 'outgoing' | 'missed';
  timestamp: string;
  duration?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  type: 'images' | 'videos' | 'documents';
  url: string;
  fileSize: string;
  timestamp: string;
  senderName: string;
}

export interface ActiveCallState {
  isActive: boolean;
  type: 'voice' | 'video';
  contactName: string;
  avatarUrl: string;
  location?: string;
  isMuted: boolean;
  isSpeaker: boolean;
  isVideoOn: boolean;
  isBackgroundBlurred: boolean;
  durationSeconds: number;
}

export interface SecuritySettings {
  stealthMode: boolean; // hide online & read receipts
  ghostVault: boolean;  // require lock on startup
  autoLockMinutes: number;
  secretPin: string;
  messageDecay: boolean;
  darkMode: boolean;
  hapticFeedback: boolean;
  messageAlerts: boolean;
  cloudSync: boolean;
}
