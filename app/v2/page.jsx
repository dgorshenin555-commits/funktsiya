'use client';

/* Точка входа варианта Б.

   Модули ниже импортируются ради побочного эффекта: каждый при загрузке
   кладёт свои экраны в реестр SCREENS (это замена регистрации в window,
   которая была в исходниках Cloud Design).

   request_form идёт первым не для порядка: мастер заявки и каталоги читают
   из него данные на верхнем уровне модуля, то есть в момент импорта. Если
   он загрузится позже, они получат undefined. Остальные обращаются друг
   к другу только во время рендера, поэтому их порядок не важен.

   Навигация внутри Б своя, на useState в NewApp, поэтому весь вариант
   живёт на одном маршруте /v2. */

import { SCREENS } from './_screens/registry';

import './_screens/request_form';

import './_screens/new_design';
import './_screens/new_design_scrub';
import './_screens/new_design_pad';
import './_screens/new_design_detail';
import './_screens/new_design_order';
import './_screens/new_design_dirs';
import './_screens/new_design_solo';
import './_screens/new_design_flow';
import './_screens/new_design_wizard';
import './_screens/live_order';
import './_screens/new_design_more';
import './_screens/new_design_extra';

export default function V2Page() {
  const NewApp = SCREENS.NewApp;
  if (!NewApp) return null;
  return <NewApp />;
}
