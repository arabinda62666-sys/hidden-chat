import {
  collection,
  doc,
  setDoc,
  getDoc,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Contact, Message, CallLog, StatusItem, MediaItem, AuthUser } from '../types';

// Save or sync user profile in Firestore
export async function syncUserProfile(user: AuthUser) {
  try {
    const userRef = doc(db, 'users', user.id);
    await setDoc(
      userRef,
      {
        userId: user.id,
        name: user.name || 'User',
        email: user.email || '',
        phone: user.phone || '',
        authMethod: user.authMethod || 'google',
        avatarUrl: user.avatarUrl || '',
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Failed to sync user profile:', err);
  }
}

// Fetch user profile from Firestore
export async function getUserProfileFromFirestore(userId: string): Promise<AuthUser | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        id: userId,
        name: data.name || 'User',
        email: data.email || undefined,
        phone: data.phone || undefined,
        authMethod: data.authMethod || 'google',
        avatarUrl: data.avatarUrl || undefined,
      };
    }
  } catch (err) {
    console.warn('Failed to fetch user profile from Firestore:', err);
  }
  return null;
}


// Real-time messages listener for a given chat ID
export function subscribeToChatMessages(
  chatId: string,
  onUpdate: (messages: Message[]) => void
) {
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  const q = query(messagesRef, orderBy('createdAt', 'asc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const msgs: Message[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          senderId: data.senderId || 'user',
          senderName: data.senderName || 'Anonymous',
          content: data.content || '',
          timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOutgoing: data.isOutgoing ?? true,
          status: data.status || 'read',
          attachment: data.attachment,
          poll: data.poll,
        };
      });
      onUpdate(msgs);
    },
    (err) => {
      console.warn(`Firestore messages subscription error for chat ${chatId}:`, err);
    }
  );
}

// Send message to real-time Firestore chat
export async function sendMessageToFirestore(chatId: string, message: Omit<Message, 'id'>) {
  const path = `chats/${chatId}/messages`;
  try {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    await addDoc(messagesRef, {
      ...message,
      createdAt: serverTimestamp(),
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

// Real-time statuses listener
export function subscribeToStatuses(onUpdate: (statuses: StatusItem[]) => void) {
  const statusesRef = collection(db, 'statuses');
  const q = query(statusesRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const list: StatusItem[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          userId: data.userId || 'unknown',
          userName: data.userName || 'User',
          userAvatar: data.userAvatar || '',
          timestamp: data.timestamp || 'Just now',
          mediaUrl: data.mediaUrl,
          mediaType: data.mediaType,
          text: data.text,
          bgColor: data.bgColor,
          caption: data.caption,
        };
      });
      onUpdate(list);
    },
    (err) => {
      console.warn('Firestore statuses subscription error:', err);
    }
  );
}

// Add status story to Firestore
export async function addStatusToFirestore(status: Omit<StatusItem, 'id'>) {
  const path = 'statuses';
  try {
    const statusesRef = collection(db, 'statuses');
    await addDoc(statusesRef, {
      ...status,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

// Sync user call logs
export function subscribeToUserCalls(
  userId: string,
  onUpdate: (calls: CallLog[]) => void
) {
  const callsRef = collection(db, 'users', userId, 'calls');
  const q = query(callsRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const calls: CallLog[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          contactId: data.contactId,
          contactName: data.contactName,
          avatarUrl: data.avatarUrl,
          type: data.type,
          direction: data.direction,
          timestamp: data.timestamp,
          duration: data.duration,
        };
      });
      onUpdate(calls);
    },
    (err) => {
      console.warn('Firestore calls subscription error:', err);
    }
  );
}

// Add call log to Firestore
export async function addCallLogToFirestore(userId: string, callLog: Omit<CallLog, 'id'>) {
  const path = `users/${userId}/calls`;
  try {
    const callsRef = collection(db, 'users', userId, 'calls');
    await addDoc(callsRef, {
      ...callLog,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}
