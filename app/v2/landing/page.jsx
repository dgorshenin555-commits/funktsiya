'use client';

/* Вариант Б: Land. Экран из Cloud Design, перенесён скриптами tools/.
   Живёт отдельным маршрутом, потому что с главной оболочки не вызывается. */

import { SCREENS } from '../_screens/registry';
import '../_screens/new_design_land';
import '../land.css';

export default function Page() {
  const C = SCREENS.Land;
  return C ? <C /> : null;
}
