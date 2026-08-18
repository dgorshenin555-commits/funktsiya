'use client';

/* Вариант Б: Client. Экран из Cloud Design, перенесён скриптами tools/.
   Живёт отдельным маршрутом, потому что с главной оболочки не вызывается. */

import { SCREENS } from '../_screens/registry';
import '../_screens/new_design_client';

export default function Page() {
  const C = SCREENS.Client;
  return C ? <C /> : null;
}
