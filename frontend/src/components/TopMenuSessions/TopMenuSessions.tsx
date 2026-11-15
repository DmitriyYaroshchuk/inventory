'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useTranslations } from 'next-intl';
import { API_URL } from '@/services/api';

const TopMenuSessions = () => {
  const [sessions, setSessions] = useState<number | null>(null);
  const t = useTranslations('topMenu');

  useEffect(() => {
    const socket = io(API_URL);
    socket.on('activeSessions', (count: number) => setSessions(count));

    return () => {
      socket.disconnect();
    };
  }, []);

  if (sessions === null) return null;

  return (
    <div className="top-menu__sessions" title={t('sessions')}>
      <svg
        className="top-menu__sessions-icon"
        viewBox="0 0 20 20"
        width="20"
        height="20"
        aria-hidden="true"
      >
        <circle cx="10" cy="6.5" r="3.5" fill="currentColor" />
        <path d="M3 17c0-3.9 3.1-6 7-6s7 2.1 7 6z" fill="currentColor" />
      </svg>
      {sessions}
    </div>
  );
};

export default TopMenuSessions;
