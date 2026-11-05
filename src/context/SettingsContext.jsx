import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { loadFromStorage, saveToStorage, removeFromStorage } from '../utils/storage.js';
import { api, isSupabaseEnabled } from '../lib/supabase.js';
import { sanitizeOwnerContact } from '../utils/storedData.js';
import { useToast } from './ToastContext.jsx';

export const SettingsContext = createContext(null);

const KEY = 'ahs_owner_contact_v1';
const empty = { phone: '', email: '' };

/**
 * Owner contact details (phone + email) that receive new-order details.
 * With Supabase configured they live in the `owner_contact` table (so every customer's phone can
 * send the order to the owner); otherwise they are kept in this browser only.
 * Reset deletes both completely.
 */
export function SettingsProvider({ children }) {
  const { showToast } = useToast();
  const [ownerContact, setOwnerContact] = useState(() => (isSupabaseEnabled ? empty : sanitizeOwnerContact(loadFromStorage(KEY, null))));

  useEffect(() => {
    if (isSupabaseEnabled) return;
    if (ownerContact.phone || ownerContact.email) saveToStorage(KEY, ownerContact);
    else removeFromStorage(KEY);
  }, [ownerContact]);

  useEffect(() => {
    if (!isSupabaseEnabled) return;
    api('owner_contact?select=phone,email&id=eq.1')
      .then((rows) => {
        if (rows && rows[0]) setOwnerContact({ phone: rows[0].phone || '', email: rows[0].email || '' });
      })
      .catch((err) => showToast(`Could not load the store contact details: ${err.message}`, 'error'));
  }, [showToast]);

  const saveOwnerContact = useCallback(async (data) => {
    const next = { phone: (data.phone || '').trim(), email: (data.email || '').trim() };
    if (isSupabaseEnabled) {
      await api('owner_contact?on_conflict=id', {
        method: 'POST',
        body: { id: 1, ...next, updated_at: new Date().toISOString() },
        prefer: 'resolution=merge-duplicates,return=minimal',
      });
    }
    setOwnerContact(next);
  }, []);

  const resetOwnerContact = useCallback(async () => {
    if (isSupabaseEnabled) await api('owner_contact?id=eq.1', { method: 'DELETE' });
    setOwnerContact(empty);
  }, []);

  const value = useMemo(() => ({ ownerContact, saveOwnerContact, resetOwnerContact }), [ownerContact, saveOwnerContact, resetOwnerContact]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
