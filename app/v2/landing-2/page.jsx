'use client';

/* Вариант Б: Land2. Экран из Cloud Design, перенесён скриптами tools/.
   Живёт отдельным маршрутом, потому что с главной оболочки не вызывается. */

import { SCREENS } from '../_screens/registry';
import '../_screens/new_design_land2';
import '../land2.css';

export default function Page() {
  const C = SCREENS.Land2;
  return C ? <C /> : null;
}
