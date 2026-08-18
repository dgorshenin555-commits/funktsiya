'use client';

/* Вариант Б: Land3. Экран из Cloud Design, перенесён скриптами tools/.
   Живёт отдельным маршрутом, потому что с главной оболочки не вызывается. */

import { SCREENS } from '../_screens/registry';
import '../_screens/new_design_land3';
import '../land3.css';

export default function Page() {
  const C = SCREENS.Land3;
  return C ? <C /> : null;
}
