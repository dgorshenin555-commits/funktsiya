import type { Metadata } from 'next';
import { Unbounded, Golos_Text, JetBrains_Mono } from 'next/font/google';
import './v2.css';
import './fonts.css';
import './auth_panel.css';
import './stages_flow.css';
import './land.css';
import './land2.css';
import './land3.css';
import './signup.css';
import './client_intro.css';
import './client_work.css';
import './pro_work.css';
import './pro_home.css';
import './pro_profile.css';
import './client_profile.css';
import './work_extra.css';

/* Вариант Б — второй дизайн платформы, живёт параллельно с основным.
   Свои стили и свои шрифты: v2.css целиком заскоуплен под класс .nd,
   поэтому со стилями варианта А не пересекается. */

const display = Unbounded({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500'],
  variable: '--font-display',
  display: 'swap',
});

const body = Golos_Text({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Функция — вариант Б',
  description: 'Второй дизайн платформы проектно-изыскательских работ.',
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable}`}>
      {children}
    </div>
  );
}
