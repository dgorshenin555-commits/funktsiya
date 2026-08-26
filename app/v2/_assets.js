/* Картинки варианта Б.

   Пути собраны через статические импорты, а не строками: на GitHub Pages
   у проекта basePath = '/funktsiya', и строковый путь вида
   "/hero-private.png" там ведёт в никуда. Импорт отдаёт готовый .src
   с префиксом и хешем — так же, как это сделано в варианте А
   (см. app/_orders/shared.tsx). */

import caparolLogo from '@/public/caparol-logo.webp';
import heroCommercial2 from '@/public/hero-commercial-2.png';
import heroIndustrial2 from '@/public/hero-industrial-2.png';
import heroPrivate2 from '@/public/hero-private-2.png';
import heroPrivate from '@/public/hero-private.png';
import knaufAquapanel from '@/public/knauf-aquapanel.jpg';
import me from '@/public/me.jpg';
import nemen from '@/public/nemen.png';
import proAtWork from '@/public/pro-at-work.png';
import ridanHex from '@/public/ridan-hex.jpg';
import ridan from '@/public/ridan.webp';
import tehnosferaLogo from '@/public/tehnosfera-logo.jpg';
import vandjordStation from '@/public/vandjord-station.jpg';
import vandjord from '@/public/vandjord.jpg';

export const IMG = {
  'caparol-logo.webp': caparolLogo.src,
  'hero-commercial-2.png': heroCommercial2.src,
  'hero-industrial-2.png': heroIndustrial2.src,
  'hero-private-2.png': heroPrivate2.src,
  'hero-private.png': heroPrivate.src,
  'knauf-aquapanel.jpg': knaufAquapanel.src,
  'me.jpg': me.src,
  'nemen.png': nemen.src,
  'pro-at-work.png': proAtWork.src,
  'ridan-hex.jpg': ridanHex.src,
  'ridan.webp': ridan.src,
  'tehnosfera-logo.jpg': tehnosferaLogo.src,
  'vandjord-station.jpg': vandjordStation.src,
  'vandjord.jpg': vandjord.src,
};
