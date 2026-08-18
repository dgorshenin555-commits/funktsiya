/* Картинки варианта Б.

   Пути собраны через статические импорты, а не строками: на GitHub Pages
   у проекта basePath = '/funktsiya', и строковый путь вида
   "/hero-private.png" там ведёт в никуда. Импорт отдаёт готовый .src
   с префиксом и хешем — так же, как это сделано в варианте А
   (см. app/_orders/shared.tsx). */

import caparolLogo from '@/public/caparol-logo.webp';
import heroPrivate from '@/public/hero-private.png';
import knaufAquapanel from '@/public/knauf-aquapanel.jpg';
import me from '@/public/me.jpg';
import nemen from '@/public/nemen.png';
import ridanHex from '@/public/ridan-hex.jpg';
import ridan from '@/public/ridan.webp';
import vandjordStation from '@/public/vandjord-station.jpg';
import vandjord from '@/public/vandjord.jpg';

/* ВРЕМЕННЫЕ ПОДСТАНОВКИ.
   Четыре картинки не удалось выгрузить из Cloud Design: API отдаёт файлы
   не больше 256 КБ, а эти крупнее. Пока подставлены ближайшие аналоги
   варианта А, чтобы сборка проходила и страницы отрисовывались.
   Когда оригиналы окажутся в public/, заменить импорты на настоящие:
     hero-commercial-2.png, hero-industrial-2.png,
     hero-private-2.png, tehnosfera-logo.jpg */
import heroCommercial from '@/public/hero-commercial.png';
import heroIndustrial from '@/public/hero-industrial.png';

export const IMG = {
  'caparol-logo.webp': caparolLogo.src,
  'hero-private.png': heroPrivate.src,
  'knauf-aquapanel.jpg': knaufAquapanel.src,
  'me.jpg': me.src,
  'nemen.png': nemen.src,
  'ridan-hex.jpg': ridanHex.src,
  'ridan.webp': ridan.src,
  'vandjord-station.jpg': vandjordStation.src,
  'vandjord.jpg': vandjord.src,

  // временные подстановки — см. комментарий выше
  'hero-commercial-2.png': heroCommercial.src,
  'hero-industrial-2.png': heroIndustrial.src,
  'hero-private-2.png': heroPrivate.src,
  'tehnosfera-logo.jpg': caparolLogo.src,
  'pro-at-work.png': heroIndustrial.src,
};
