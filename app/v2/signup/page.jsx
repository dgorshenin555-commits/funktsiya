'use client';

/* Вариант Б: Signup. Экран из Cloud Design, перенесён скриптами tools/.
   Живёт отдельным маршрутом, потому что с главной оболочки не вызывается. */

import { SCREENS } from '../_screens/registry';
import '../_screens/new_design_signup';
import '../signup.css';

export default function Page() {
  const C = SCREENS.Signup;
  return C ? <C /> : null;
}
