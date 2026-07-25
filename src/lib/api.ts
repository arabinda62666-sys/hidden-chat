// API Bridge for Calculator Encrypted Vault Backend

export async function fetchVaultData() {
  try {
    const res = await fetch('/api/vault/data');
    if (!res.ok) throw new Error('Failed to fetch vault data');
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('Backend API offline, falling back to local storage', err);
    return null;
  }
}

export async function syncVaultData(state: {
  contacts?: any[];
  messages?: Record<string, any[]>;
  statuses?: any[];
  callLogs?: any[];
  settings?: any;
}) {
  try {
    const res = await fetch('/api/vault/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to sync state with backend server', err);
    return null;
  }
}

export async function sendBackendMessage(contactId: string, message: any) {
  try {
    const res = await fetch('/api/messages/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactId, message }),
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to send message to backend', err);
    return null;
  }
}

export async function createBackendStatus(status: any) {
  try {
    const res = await fetch('/api/statuses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to post status to backend', err);
    return null;
  }
}

export async function verifyPasscodeBackend(code: string) {
  try {
    const res = await fetch('/api/vault/verify-passcode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    return await res.json();
  } catch (err) {
    console.warn('Backend verification offline', err);
    return { valid: false };
  }
}
