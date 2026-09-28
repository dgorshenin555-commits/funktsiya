'use client';

/* Отдельная регистрация исполнителя закрыта (замечание Дениса-4: «форма
   регистрации исполнителя задвоена, эта не нужна»). Аккаунт на платформе
   один, и заводится он на /v2/auth — там же выбирается роль. Маршрут
   оставлен переходом, чтобы старые ссылки и закладки не упирались в 404;
   сам экран из Cloud Design остаётся в _screens как исходник дизайна. */

import { useEffect } from 'react';
import { authUrl } from '../_screens/links';

export default function Page() {
  useEffect(() => { window.location.replace(authUrl('register', 'executor')); }, []);
  return (
    <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', fontSize: 15 }}>
      Открываем регистрацию…
    </div>
  );
}
