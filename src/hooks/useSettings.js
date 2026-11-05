import { useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext.jsx';

export default function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside <SettingsProvider>');
  return ctx;
}
