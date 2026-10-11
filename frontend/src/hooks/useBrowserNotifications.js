import { useEffect, useRef } from 'react';

export default function useBrowserNotifications() {
  const requested = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (requested.current) return;
    requested.current = true;

    if (Notification.permission === 'default') {
      const t = setTimeout(() => Notification.requestPermission(), 3000);
      return () => clearTimeout(t);
    }
  }, []);
}