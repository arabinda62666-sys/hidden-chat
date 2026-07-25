import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Database JSON Persistence file path
const DB_FILE = path.join(process.cwd(), "vault_db.json");

interface VaultDatabase {
  contacts: any[];
  messages: Record<string, any[]>;
  statuses: any[];
  callLogs: any[];
  settings: {
    secretPin: string;
    stealthMode: boolean;
    biometricEnabled: boolean;
    autoLockTimer: number;
    panicCode: string;
    statusPrivacy: string;
    privacyExcluded: string[];
    privacySelected: string[];
  };
}

const DEFAULT_DB: VaultDatabase = {
  contacts: [
    {
      id: 'sarah-jenkins',
      name: 'Sarah Jenkins',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ4XDXK27eDWsqqbyoYV37RTt2Z19B12IB73GRtFHTLlAhNbMUYyDdrs-zTZmDp0dhxuhrYzxQ_RHXguRBC5G3x7-gTLOzjmo596XifCII_nAYLBXyM1o7PLBu09dC8xWE3QLj-JwzAROLPRS30uuEqTRx98hNvgkV6wLGI8uZbnFCHrFoUsT7Pv_D1y9yCOd5RDlH32NoazX8eFiad6mhVE2P4dKNCifdEYwlf4TGRkgZJ0mxugZzJCE2crKekYMty9jP6JmF',
      statusText: '🔐 Encrypted Operations Lead',
      isOnline: true,
      isPinned: true,
      lastMessage: 'All core nodes verified. Ready for transmission.',
      lastMessageTime: '11:02 AM',
      unreadCount: 0,
      phone: '+1 (555) 019-2834',
      categoryLetter: 'S',
    },
    {
      id: 'alex-rivera',
      name: 'Alex Rivera',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      statusText: 'Key Management Engine',
      isOnline: false,
      isPinned: false,
      lastMessage: 'Sent workspace specs',
      lastMessageTime: 'Yesterday',
      unreadCount: 0,
      phone: '+1 (555) 014-9921',
      categoryLetter: 'A',
    },
    {
      id: 'marcus-vance',
      name: 'Marcus Vance',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      statusText: 'Quantum Security Specialist',
      isOnline: true,
      isPinned: false,
      lastMessage: 'Database schema update looks good.',
      lastMessageTime: 'Jul 22',
      unreadCount: 0,
      phone: '+1 (555) 018-4420',
      categoryLetter: 'M',
    },
    {
      id: 'elena-rodriguez',
      name: 'Elena Rodriguez',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      statusText: 'Vault Architect',
      isOnline: false,
      isPinned: false,
      lastMessage: 'Check the master reset logic code.',
      lastMessageTime: 'Jul 20',
      unreadCount: 0,
      phone: '+1 (555) 012-7788',
      categoryLetter: 'E',
    },
  ],
  messages: {
    'sarah-jenkins': [
      {
        id: 's1',
        senderId: 'sarah-jenkins',
        senderName: 'Sarah Jenkins',
        content: 'Hey! The new stealth lock formula (*#*#626264#*#*) is live.',
        timestamp: '10:58 AM',
        isOutgoing: false,
        status: 'read'
      },
      {
        id: 's2',
        senderId: 'me',
        senderName: 'You',
        content: 'Great, backend endpoints are fully integrated now.',
        timestamp: '11:02 AM',
        isOutgoing: true,
        status: 'read'
      }
    ]
  },
  statuses: [
    {
      id: 'st-sarah-1',
      userId: 'sarah-jenkins',
      userName: 'Sarah Jenkins',
      userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ4XDXK27eDWsqqbyoYV37RTt2Z19B12IB73GRtFHTLlAhNbMUYyDdrs-zTZmDp0dhxuhrYzxQ_RHXguRBC5G3x7-gTLOzjmo596XifCII_nAYLBXyM1o7PLBu09dC8xWE3QLj-JwzAROLPRS30uuEqTRx98hNvgkV6wLGI8uZbnFCHrFoUsT7Pv_D1y9yCOd5RDlH32NoazX8eFiad6mhVE2P4dKNCifdEYwlf4TGRkgZJ0mxugZzJCE2crKekYMty9jP6JmF',
      timestamp: 'Just now',
      mediaUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      caption: '🔒 Working on the latest end-to-end security protocol update!',
      isViewed: false,
    }
  ],
  callLogs: [
    {
      id: 'c1',
      contactId: 'sarah-jenkins',
      contactName: 'Sarah Jenkins',
      contactAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ4XDXK27eDWsqqbyoYV37RTt2Z19B12IB73GRtFHTLlAhNbMUYyDdrs-zTZmDp0dhxuhrYzxQ_RHXguRBC5G3x7-gTLOzjmo596XifCII_nAYLBXyM1o7PLBu09dC8xWE3QLj-JwzAROLPRS30uuEqTRx98hNvgkV6wLGI8uZbnFCHrFoUsT7Pv_D1y9yCOd5RDlH32NoazX8eFiad6mhVE2P4dKNCifdEYwlf4TGRkgZJ0mxugZzJCE2crKekYMty9jP6JmF',
      timestamp: 'Today, 10:15 AM',
      type: 'audio',
      direction: 'incoming',
      duration: '04:12',
      isEncrypted: true
    }
  ],
  settings: {
    secretPin: '626264',
    stealthMode: true,
    biometricEnabled: false,
    autoLockTimer: 30,
    panicCode: '9999',
    statusPrivacy: 'contacts',
    privacyExcluded: [],
    privacySelected: [],
  }
};

// Helper: Read DB
function readDb(): VaultDatabase {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), "utf-8");
      return DEFAULT_DB;
    }
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading vault database:", err);
    return DEFAULT_DB;
  }
}

// Helper: Write DB
function writeDb(data: VaultDatabase): boolean {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing vault database:", err);
    return false;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Initialize DB file
  readDb();

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "Calculator Encrypted Vault API", backend: "Node Express" });
  });

  // GET FULL VAULT STATE
  app.get("/api/vault/data", (_req, res) => {
    const db = readDb();
    res.json({ success: true, data: db });
  });

  // BULK SYNC VAULT STATE
  app.post("/api/vault/sync", (req, res) => {
    try {
      const { contacts, messages, statuses, callLogs, settings } = req.body;
      const db = readDb();

      if (contacts) db.contacts = contacts;
      if (messages) db.messages = messages;
      if (statuses) db.statuses = statuses;
      if (callLogs) db.callLogs = callLogs;
      if (settings) db.settings = { ...db.settings, ...settings };

      writeDb(db);
      res.json({ success: true, message: "Vault state synchronized with backend database." });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // CONTACTS ENDPOINTS
  app.get("/api/contacts", (_req, res) => {
    const db = readDb();
    res.json({ contacts: db.contacts });
  });

  app.post("/api/contacts", (req, res) => {
    const { contact } = req.body;
    if (!contact || !contact.id || !contact.name) {
      return res.status(400).json({ error: "Invalid contact object" });
    }
    const db = readDb();
    const existingIdx = db.contacts.findIndex((c: any) => c.id === contact.id);
    if (existingIdx >= 0) {
      db.contacts[existingIdx] = contact;
    } else {
      db.contacts.push(contact);
    }
    writeDb(db);
    res.json({ success: true, contacts: db.contacts });
  });

  app.delete("/api/contacts/:id", (req, res) => {
    const { id } = req.params;
    const db = readDb();
    db.contacts = db.contacts.filter((c: any) => c.id !== id);
    delete db.messages[id];
    writeDb(db);
    res.json({ success: true, contacts: db.contacts });
  });

  // MESSAGES ENDPOINTS
  app.get("/api/messages/:contactId", (req, res) => {
    const { contactId } = req.params;
    const db = readDb();
    res.json({ messages: db.messages[contactId] || [] });
  });

  app.post("/api/messages/send", (req, res) => {
    const { contactId, message } = req.body;
    if (!contactId || !message) {
      return res.status(400).json({ error: "contactId and message required" });
    }
    const db = readDb();
    if (!db.messages[contactId]) {
      db.messages[contactId] = [];
    }
    db.messages[contactId].push(message);

    // Update last message in contact list
    const contact = db.contacts.find((c: any) => c.id === contactId);
    if (contact) {
      contact.lastMessage = message.content || 'Attachment';
      contact.lastMessageTime = message.timestamp || 'Just now';
    }

    writeDb(db);
    res.json({ success: true, messages: db.messages[contactId] });
  });

  app.delete("/api/messages/clear/:contactId", (req, res) => {
    const { contactId } = req.params;
    const db = readDb();
    db.messages[contactId] = [];
    writeDb(db);
    res.json({ success: true, messages: [] });
  });

  // STATUSES ENDPOINTS
  app.get("/api/statuses", (_req, res) => {
    const db = readDb();
    res.json({ statuses: db.statuses, privacy: db.settings.statusPrivacy });
  });

  app.post("/api/statuses", (req, res) => {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Status object required" });
    }
    const db = readDb();
    db.statuses.unshift(status);
    writeDb(db);
    res.json({ success: true, statuses: db.statuses });
  });

  // CALL LOGS ENDPOINT
  app.get("/api/calls", (_req, res) => {
    const db = readDb();
    res.json({ callLogs: db.callLogs });
  });

  app.post("/api/calls/log", (req, res) => {
    const { call } = req.body;
    if (!call) return res.status(400).json({ error: "Call log required" });
    const db = readDb();
    db.callLogs.unshift(call);
    writeDb(db);
    res.json({ success: true, callLogs: db.callLogs });
  });

  // VERIFY PASSCODE ENDPOINT
  app.post("/api/vault/verify-passcode", (req, res) => {
    const { code } = req.body;
    const db = readDb();
    const masterPattern = "*#*#626264#*#*";
    const masterPin = db.settings.secretPin || "626264";

    if (code === masterPattern || code === masterPin || code.endsWith(masterPattern)) {
      return res.json({ valid: true, message: "Vault Unlocked Successfully" });
    }
    return res.status(401).json({ valid: false, message: "Incorrect PIN" });
  });

  // BACKUP EXPORT ENDPOINT
  app.get("/api/vault/backup", (_req, res) => {
    const db = readDb();
    res.setHeader("Content-Disposition", "attachment; filename=calculator_vault_backup.json");
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(db, null, 2));
  });

  // Vite Middleware in Development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Calculator Vault] Backend server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
