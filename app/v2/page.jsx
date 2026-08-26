'use client';

/* Точка входа варианта Б.

   Модули импортируются ради побочного эффекта: каждый при загрузке кладёт
   свои экраны в реестр SCREENS. Порядок здесь НЕ произвольный — он в точности
   повторяет порядок скриптов в прототипе Cloud Design (index.html выгрузки).

   Это важно по двум причинам: request_form читают на верхнем уровне модуля,
   то есть в момент импорта; а несколько модулей регистрируют экраны с
   одинаковыми именами (например ProProfile есть и в pro_profile, и в
   new_design_detail) — кто позже, тот и побеждает. Переставишь строки —
   поедет вид. */

import { SCREENS } from './_screens/registry';

import './_screens/request_form';
import './_screens/notify_block';
import './_screens/pro_profile';
import './_screens/client_profile';
import './_screens/new_design_pad';
import './_screens/new_design_dirs';
import './_screens/new_design_detail';
import './_screens/new_design_extra';
import './_screens/new_design_flow';
import './_screens/new_design_more';
import './_screens/new_design_scrub';
import './_screens/new_design_solo';
import './_screens/new_design_order';
import './_screens/new_design_wizard';
import './_screens/live_order';
import './_screens/new_design_client';
import './_screens/new_design_land';
import './_screens/new_design_land2';
import './_screens/new_design_land3';
import './_screens/new_design_signup';
import './_screens/client_reg';
import './_screens/auth_panel';
import './_screens/client_intro';
import './_screens/client_work';
import './_screens/pro_work';
import './_screens/new_design';

export default function V2Page() {
  const NewApp = SCREENS.NewApp;
  if (!NewApp) return null;
  return <NewApp />;
}
