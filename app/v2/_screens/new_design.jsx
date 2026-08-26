"use client";

/* Экран варианта Б. Источник: design-handoff-v2/new_design.jsx
   Первоначально импортирован скриптом tools/transform_jsx.py, но это был
   разовый перенос: дальше экран дописывается прямо здесь. Повторно
   генератор не гоняем — он вернёт файл к состоянию выгрузки. */
import * as React from "react";
import { SCREENS } from "./registry";
import { IMG } from "../_assets";
import { useApp } from "@/lib/store";
import { OBJECT_TYPE_LABELS, STAGE_LABELS } from "@/lib/constants";
import { useRouter } from "next/navigation";
const { useState, useEffect } = React;

/* Заявка общего хранилища → карточка списка Б. Поле live отличает настоящие
   заявки от демо-витрины REQS. */
const SCALE_RU = { single: "Один специалист", team: "Команда", org: "Организация" };
const fmtDate = iso => {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? String(iso) : d.toLocaleDateString("ru-RU");
};
const fmtPubl = iso => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "недавно";
  return d.toDateString() === new Date().toDateString() ? "сегодня" : d.toLocaleDateString("ru-RU");
};
const orderToCard = (o, uid) => ({
  id: o.id, live: true, mine: !!uid && o.customerId === uid,
  t: o.title, city: o.region || "Регион не указан",
  type: OBJECT_TYPE_LABELS[o.objectType] || o.objectType,
  stage: STAGE_LABELS[o.stage] || o.stage,
  secs: o.sections || [], budget: o.budget || "ждём предложений",
  days: o.deadline ? "до " + fmtDate(o.deadline) : "по согласованию",
  resp: o.responsesCount || 0, bids: [], publ: fmtPubl(o.createdAt),
  kind: "Проектирование", attract: SCALE_RU[o.scale] || o.scale,
  note: o.description || "", files: 0, objType: OBJECT_TYPE_LABELS[o.objectType] || o.objectType,
});

const Mark = ({ s = 26 }) => (
  <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="11" fill="#14161A" />
    <rect x="13" y="10" width="4.4" height="21" rx="2.2" fill="#C9F24A" />
    <rect x="13" y="10" width="17" height="4.4" rx="2.2" fill="#C9F24A" />
    <rect x="13" y="18.5" width="12" height="4.4" rx="2.2" fill="#C9F24A" />
  </svg>
);
const Arr = ({ s = 14 }) => (
  <svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
);
const Search = ({ s = 15 }) => (
  <svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="7" cy="7" r="4.4" /><path d="M10.4 10.4L14 14" /></svg>
);
const X = () => (<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M4 4l8 8M12 4l-8 8" /></svg>);
const Chk = ({ s = 12 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5l3.5 3.5L13 4.5" /></svg>);

/* Инициалы по первым буквам слов: «Андрей Кузнецов» → «АК», «ООО «Техносфера»» → «ОТ». */
const userInitials = s => {
  const w = (s || "").split(/[^А-Яа-яA-Za-z]+/).filter(Boolean);
  return (w.length > 1 ? w[0][0] + w[1][0] : (w[0] || "").slice(0, 2)).toUpperCase() || "??";
};

const Init = ({ n, bg = "#E8E5DD", c = "#14161A", size = 30 }) => (
  <div className="num" style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: 99, background: bg, color: c, display: "grid", placeItems: "center", fontSize: size * 0.36, fontWeight: 500, letterSpacing: 0 }}>{n}</div>
);

/* ---------------- data ---------------- */
const CAPS = [
  { n: "01", t: "Заявка вместо тендера", c: "var(--acid)", d: "Описание своими словами, разделы подскажет платформа. Публикация бесплатна, отклики приходят только от организаций с действующим СРО.", cta: "Создать заявку", go: "new" },
  { n: "02", t: "Сравнение откликов", c: "var(--signal)", d: "Цена, срок, состав работ и субподряд — в одной таблице. Видно, что именно входит в предложение, а что вынесено за скобки.", cta: "Открыть сравнение", go: "detail" },
  { n: "03", t: "Проверенные исполнители", c: "var(--moss)", d: "Платформа сверяет ИНН и выписку ЕГРЮЛ, членство в СРО по реестру НОПРИЗ и полис страхования — без сбора справок вручную.", cta: "Каталог исполнителей", go: "pick" },
  { n: "04", t: "Подбор решений", c: "var(--plum)", d: "По разделу проекта платформа предлагает оборудование и материалы из каталога производителей, включая аналоги под замену.", cta: "Подобрать решение", go: "ai" },
  { n: "05", t: "Экспертиза разделов", c: "var(--clay)", d: "Замечания приходят с привязкой к листу и пункту норматива, история правок сохраняется по каждому разделу.", cta: "Смотреть замечания", go: "exp" },
  { n: "06", t: "Нормативы под рукой", c: "var(--ink)", d: "Актуальные редакции СП и ГОСТ с отметкой изменений — ссылка на пункт вставляется прямо в замечание или переписку.", cta: "Открыть нормативы", go: "norm" },
];

const FLOW = [
  { t: "Заявка", d: "Три шага в форме — разделы подскажем сами.", v: (<><div className="ln m" /><div className="ln s" /><div className="ln a s" /></>) },
  { t: "Отклики", d: "Предложения от исполнителей с СРО и историей сделок.", v: (<><div className="avs"><i /><i /><i className="a" /><i /></div><div className="ln s" /></>) },
  { t: "Выбор", d: "Сравнение рядом: цена, срок, опыт.", v: (<><div className="row-mini"><span className="b">1</span>Цена<span className="spacer" /><span className="num">1,15 млн</span></div><div className="mini-pipe"><i className="a" /><i className="on" /><i /></div></>) },
  { t: "Работа", d: "Статусы и файлы по каждому разделу.", v: (<><div className="mini-pipe"><i className="on" /><i className="on" /><i className="a" /><i /></div><div className="ln m" /></>) },
  { t: "Экспертиза", d: "Замечания, правки и заключение.", v: (<><span className="stamp"><b>✓</b>заключение</span><div className="ln s" /></>) },
];

const TILES = [
  {
    t: "Заявки на проектирование", go: "reqs", cta: "Смотреть заявки", bg: "#E9E6DC",
    d: "Опишите объект — разделы по ПП РФ №87 подставятся сами, останется выбрать срок и бюджет.",
    v: (<><span className="chipmini">ПРОЕКТИРОВАНИЕ</span><div className="cardstub"><span className="t">Котельная 4,2 МВт</span><div className="row g8">{["ОВ", "ЭОМ", "АР"].map(s => <span className="tag" key={s} style={{ height: 20, fontSize: 11 }}>{s}</span>)}</div></div><div className="row-mini"><span className="b">3</span>отклика<span className="spacer" /><span className="num">45 дней</span></div></>) },
  {
    t: "Подбор исполнителей", go: "pick", cta: "Смотреть исполнителей", bg: "#E2E7F4",
    d: "У каждого — СРО, страховка и история сделок. Индекс доверия показывает риск одной цифрой.",
    v: (<><span className="chipmini">ИНДЕКС ДОВЕРИЯ</span><div className="row-mini"><span className="b">ТС</span>ООО «Техносфера»<span className="spacer" /><span className="num">91</span></div><div className="row-mini"><span className="b">ИГ</span>ИнжГрупп<span className="spacer" /><span className="num">84</span></div></>) },
  {
    t: "Экспертиза и сдача", go: "exp", cta: "Посмотреть трекер", bg: "#F2E3D9",
    d: "Видно, на каком шаге проект, что требует вашего ответа и сколько осталось до заключения.",
    v: (<><span className="chipmini">2-Я ИТЕРАЦИЯ</span><div className="cardstub"><span className="t">Замечания эксперта — 2</span><div className="mini-pipe"><i className="on" /><i className="on" /><i className="a" /><i /><i /></div></div><span className="stamp"><b>✓</b>до 20 августа</span></>) },
];

const FAQ = [
  { q: "Сколько стоит для заказчика?", a: "Для заказчика платформа бесплатна: публикация заявок, отклики, сравнение и переписка не тарифицируются. Подписку оплачивают исполнители — за доступ к заявкам." },
  { q: "А если я не знаю, какие разделы мне нужны?", a: "Выберите тип объекта — состав разделов по ПП РФ №87 подставится автоматически. Лишнее можно убрать, а если сомневаетесь — оставьте как есть, исполнители уточнят в откликах." },
  { q: "Кто проверяет исполнителей?", a: "Платформа сверяет ИНН и выписку ЕГРЮЛ, членство в СРО по реестру НОПРИЗ, полис страхования и историю сделок — до того, как исполнитель сможет откликнуться на заявку." },
  { q: "Можно ли вести в платформе экспертизу?", a: "Да. Подача, замечания, правки и заключение идут одним трекером со сроками по каждой итерации — видно, чей сейчас шаг." },
];

const TICK = ["Заявок в работе — 148", "Средний срок отклика — 4 ч", "Проектировщиков с СРО — 1 240", "Экспертиз пройдено — 96", "Разделов по ПП 87 — 12", "Регионов — 74"];

const MINI = [
  { b: "6", l: "Заявки в работе", s: [4, 6, 5, 8, 7, 9, 12] },
  { b: "23", l: "Новых отклика", s: [7, 5, 9, 6, 11, 8, 14] },
  { b: "2", l: "Замечания экспертизы", s: [2, 3, 1, 4, 3, 2, 5], c: "var(--clay)" },
  { b: "4,8 млн ₽", l: "В расчётах по этапам", s: [3, 5, 4, 7, 6, 8, 10], small: true },
];

const FEED = [
  { d: "11 авг", t: "Реконструкция котельной, 4,2 МВт", p: "3 новых отклика · ОВ, ЭОМ, АР", st: [1, 1, 0, 0], tag: "Отклики" },
  { d: "10 авг", t: "ЖК «Северный», корпус 3 — стадия П", p: "Замечания экспертизы: 2 раздела", st: [1, 1, 2, 0], tag: "Экспертиза", warn: true },
  { d: "08 авг", t: "Обследование производственного корпуса", p: "Исполнитель выбран · ООО «Техносфера»", st: [1, 1, 1, 0], tag: "В работе" },
  { d: "05 авг", t: "Склад 12 000 м² — КЖ, КМ", p: "Заключение получено · положительное", st: [1, 1, 1, 1], tag: "Закрыта" },
];

const REQS = [
  {
    id: 1, t: "Реконструкция котельной 4,2 МВт", city: "Нижний Новгород", type: "Промышленный объект",
    stage: "Проектная документация", secs: ["ОВ", "ЭОМ", "АР", "ТХ"], budget: "1 200 000 ₽", days: "45 дней",
    resp: 3, publ: "11 августа", kind: "Проектирование", hot: true,
    bids: [
      { n: "ТС", name: "ООО «Техносфера»", note: "СРО · 14 лет · 62 проекта", price: "1 150 000 ₽", d: "42 дня", best: [] },
      { n: "ПБ", name: "ПБ «Вектор»", note: "СРО · 9 лет · 38 проектов", price: "980 000 ₽", d: "50 дней", best: ["price"] },
      { n: "ИГ", name: "ИнжГрупп", note: "СРО · 11 лет · 51 проект", price: "1 240 000 ₽", d: "38 дней", best: ["d"] },
    ],
  },
  {
    id: 2, t: "ЖК «Северный», корпус 3 — прохождение экспертизы", city: "Казань", type: "Жилой объект",
    stage: "Экспертиза · 2-я итерация", secs: ["АР", "КЖ", "ВК", "СС"], budget: "по итерациям", days: "до 20 авг",
    resp: 2, publ: "10 августа", kind: "Экспертиза", warn: "2 замечания",
    bids: [
      { n: "ЭЦ", name: "ЭЦ «Проектстандарт»", note: "Аккредитация · 2 216 заключений", price: "310 000 ₽", d: "14 дней", best: ["d"] },
      { n: "НГ", name: "НЭ «Гарант»", note: "Аккредитация · 1 480 заключений", price: "285 000 ₽", d: "18 дней", best: ["price"] },
    ],
  },
  {
    id: 3, t: "Обследование производственного корпуса, 8 400 м²", city: "Екатеринбург", type: "Обследование",
    stage: "Техническое заключение", secs: ["ТО", "КЖ"], budget: "640 000 ₽", days: "30 дней",
    resp: 5, publ: "08 августа", kind: "Обследование",
    bids: [
      { n: "СП", name: "«СтройПроект-Э»", note: "Лаборатория · 22 года", price: "610 000 ₽", d: "26 дней", best: ["price", "d"] },
      { n: "ГК", name: "ГК «Ресурс»", note: "СРО · 7 лет", price: "700 000 ₽", d: "34 дня", best: [] },
    ],
  },
  {
    id: 4, t: "Склад-холодильник 12 000 м² — КЖ, КМ, ТХ", city: "Краснодар", type: "Промышленный объект",
    stage: "Рабочая документация", secs: ["КЖ", "КМ", "ТХ", "ЭОМ", "АУПТ"], budget: "2 900 000 ₽", days: "90 дней",
    resp: 7, publ: "05 августа", kind: "Проектирование",
    bids: [
      { n: "МП", name: "«МегаПроект»", note: "СРО · 18 лет · 140 проектов", price: "2 750 000 ₽", d: "84 дня", best: ["price", "d"] },
      { n: "АБ", name: "АБ «Форма»", note: "СРО · 6 лет · 24 проекта", price: "3 100 000 ₽", d: "96 дней", best: [] },
    ],
  },
];


/* Гостю точную сумму не показываем — только диапазон. */
const budRange = b => {
  const n = parseInt(String(b).replace(/\s/g, "").replace(/[^0-9]/g, ""), 10);
  if (!n || n < 1000) return "по договорённости";
  const mln = n / 1e6;
  const lo = Math.max(0.1, mln * 0.85), hi = mln * 1.15;
  const f = v => v.toFixed(v < 1 ? 2 : 1).replace(".", ",");
  return f(lo) + "–" + f(hi) + " млн ₽";
};

/* Фильтры собираются из самих заявок, а не из выдуманных чисел: иначе счётчики
   врут, а галочки ничего не меняют (замечание Дениса «фильтр не работает»).
   Внутри группы условия складываются по ИЛИ, между группами — по И. */
const FILTER_GROUPS = [
  { g: "Тип заявки", val: r => [r.kind].filter(Boolean) },
  { g: "Стадия", val: r => [r.stage].filter(Boolean) },
  { g: "Раздел", val: r => r.secs || [] },
];

function buildFilters(list) {
  return FILTER_GROUPS.map(({ g, val }) => {
    const count = new Map();
    list.forEach(r => val(r).forEach(v => count.set(v, (count.get(v) || 0) + 1)));
    const opts = [...count.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])));
    // Разделов много — показываем самые частые, иначе рельс уезжает на два экрана.
    return { g, val, opts: g === "Раздел" ? opts.slice(0, 10) : opts };
  });
}

/* ---------------- главная ---------------- */
/* ---------------- рельс шагов (magnify scrubber) ---------------- */
const RAIL_STEPS = [
  ...FLOW.map((f, i) => ({ id: "s" + i, meta: "Шаг " + (i + 1), t: f.t, d: f.d, v: f.v })),
  { id: "fin", meta: "Финал", t: "Заключение", d: "Комплект разделов сдан, замечания закрыты, история правок сохранена.", fin: true },
];
const ROWS = 9, ROW_H = 13, REST = 22, PEAK = 132, RADIUS = 7;

function StepRail({ go }) {
  const total = RAIL_STEPS.length * ROWS;
  const [ptr, setPtr] = useState(ROWS * 0.5);
  const [live, setLive] = useState(false);
  const railRef = React.useRef(null);
  const bump = d => d >= RADIUS ? 0 : 0.5 * (1 + Math.cos(Math.PI * (d / RADIUS)));
  const move = e => {
    const r = railRef.current.getBoundingClientRect();
    setPtr(Math.max(0, Math.min(total - 1, (e.clientY - r.top) / ROW_H - .5)));
    setLive(true);
  };
  const active = Math.max(0, Math.min(RAIL_STEPS.length - 1, Math.round((ptr + .5) / ROWS - .5)));
  const cur = RAIL_STEPS[active];
  const cardH = 168;
  const top = Math.max(0, Math.min(total * ROW_H - cardH, (ptr + .5) * ROW_H - cardH / 2));

  return (
    <div className="srail" onPointerLeave={() => setLive(false)}>
      <div className="srail__rail" ref={railRef} onPointerMove={move} style={{ height: total * ROW_H }}>
        {Array.from({ length: total }, (_, i) => {
          const rise = (live ? 1 : 0) * bump(Math.abs(i - ptr));
          const si = Math.floor(i / ROWS);
          const anchor = i % ROWS === Math.floor(ROWS / 2);
          return <span className={"srail__t" + (anchor ? " anc" : "")} key={i} style={{ width: REST + rise * (PEAK - REST), opacity: (anchor ? .5 : .16) + rise * (1 - (anchor ? .5 : .16)), background: si === active && live ? "var(--ink)" : undefined }} />;
        })}
      </div>
      <div className="srail__labels">
        {RAIL_STEPS.map((s, i) => (
          <button className={"srail__lb" + (i === active && live ? " on" : "")} key={s.id} style={{ top: (i * ROWS + Math.floor(ROWS / 2)) * ROW_H + ROW_H / 2 - 11 }} onClick={() => go("new")}>
            <em>{i === RAIL_STEPS.length - 1 ? "✓" : i + 1}</em>{s.t}
          </button>
        ))}
      </div>
      <div className={"srail__card" + (live ? " on" : "")} style={{ top, height: cardH }}>
        <span className="lbl">{cur.meta}</span>
        <h4>{cur.t}</h4>
        <p>{cur.d}</p>
        {cur.fin ? <div className="vis vis--fin"><b>Готово</b></div> : <div className="vis">{cur.v}</div>}
      </div>
    </div>
  );
}

const WSTEPS = [
  { t: "Заявка", d: "Вы создаёте заявку с разделами и сроками.", c: (
    <><b className="wc__t">Котельная 4,2 МВт</b><span className="wc__s">Москва, ул. Лесная, 12</span>
    <div className="wc__tags"><span className="tag">ОВ</span><span className="tag">ЭОМ</span><span className="tag">АР</span></div>
    <div className="wc__foot"><span>7 откликов</span><span>45 дней</span></div></>) },
  { t: "Отклики", d: "Исполнители присылают предложения и условия.", c: (
    <><b className="wc__t">7 предложений</b><span className="wc__s">от 860 000 ₽</span>
    <div className="wc__list">
      {[["Техносфера", "ТС"], ["ИнжГрупп", "ИГ"], ["ПроектСтрой", "ПС"]].map(([n, ab]) => (
        <div key={n}>{n === "Техносфера" ? <span className="wc__logo wc__logo--s"><img src={IMG["tehnosfera-logo.jpg"]} alt="" /></span> : <Init n={ab} size={22} />}<span>{n}</span><em>СРО</em></div>
      ))}
    </div>
    <div className="wc__link">Показать все отклики <Arr s={12} /></div></>) },
  { t: "Выбор исполнителя", d: "Вы сравниваете цену, срок и опыт.", c: (
    <><div className="wc__co"><span className="wc__logo"><img src={IMG["tehnosfera-logo.jpg"]} alt="Техносфера" /></span><b>ООО «Техносфера»</b></div>
    <div className="wc__kv"><span>Предложение</span><b>1 150 000 ₽</b></div>
    <div className="wc__kv"><span>Срок</span><b>45 дней</b></div>
    <div className="wc__link">Профиль исполнителя <Arr s={12} /></div></>) },
  { t: "Проектирование", d: "Исполнитель загружает файлы, вы видите прогресс.", c: (
    <><span className="wc__s">Статус проекта</span><b className="wc__big">72%</b>
    <div className="wc__bar"><i style={{ width: "72%" }} /></div>
    <div className="wc__kv"><span>Загружено файлов</span><b>18</b></div>
    <div className="wc__kv"><span>Обновлено</span><b>2 часа назад</b></div>
    <div className="wc__link">Перейти к проекту <Arr s={12} /></div></>) },
  { t: "Экспертиза", d: "Вы получаете замечания и работаете над ними.", c: (
    <><span className="wc__s">Замечания эксперта</span><b className="wc__big">2</b>
    <span className="wc__s">2-я итерация</span>
    <div className="wc__pips">{[1, 1, 0, 0, 0].map((v, i) => <i key={i} className={v ? "on" : ""} />)}</div>
    <div className="wc__kv"><span>Срок до ответа</span><b>до 20 августа</b></div>
    <div className="wc__link">Открыть экспертизу <Arr s={12} /></div></>) },
  { t: "Заключение", d: "Проект проходит экспертизу и сдаётся.", fin: true, c: (
    <><span className="wc__check">✓</span><b className="wc__fin">Заключение<br />получено</b><span className="wc__s">20 августа 2026</span>
    <div className="wc__link">Скачать комплект <Arr s={12} /></div></>) },
];

/* Цифры 1–5 на сетке 3×5: единица — блок на месте, ноль — блок ушёл. */
const DIGITS = {
  1: [0,1,0, 1,1,0, 0,1,0, 0,1,0, 1,1,1],
  2: [1,1,1, 0,0,1, 1,1,1, 1,0,0, 1,1,1],
  3: [1,1,1, 0,0,1, 1,1,1, 0,0,1, 1,1,1],
  4: [1,0,1, 1,0,1, 1,1,1, 0,0,1, 0,0,1],
  5: [1,1,1, 1,0,0, 1,1,1, 0,0,1, 1,1,1],
};
const STAGES = [
  ["Заявка", "Заказчик описывает объект своими словами — состав разделов платформа подставляет по ПП РФ №87."],
  ["Отклики", "Предложения приходят только от исполнителей с действующим СРО или НРС: цена, срок, состав работ."],
  ["Выбор", "Отклики сравниваются в одной таблице; выбранный исполнитель закрепляется за разделами."],
  ["Работа", "Файлы, замечания и версии — в заявке. Сумма этапа резервируется до старта."],
  ["Приёмка", "Принятый этап уходит в выплату. История правок и решений остаётся в проекте."],
];

function Stages() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setN(v => (v + 1) % STAGES.length), 3400);
    return () => clearInterval(t);
  }, []);
  const map = DIGITS[n + 1];
  return (
    <section className="wayx">
      <div className="wayx__l">
        <span className="lbl">Этапы работы платформы</span>
        <h2>Пять шагов от заявки<br />до подписанного этапа</h2>
        <div className="wayx__grid" aria-hidden="true">
          {map.map((v, i) => {
            const lit = map.reduce((a, x, j) => (x && j <= i ? a + 1 : a), 0);
            const acc = v && (lit === 3 || lit === 7);
            return <i key={i} className={(v ? "on" : "") + (acc ? " acc" : "")} style={{ transitionDelay: (i % 3) * 40 + Math.floor(i / 3) * 26 + "ms" }} />;
          })}
        </div>
        <div className="wayx__dots">
          {STAGES.map(([t], i) => (
            <button key={t} className={i === n ? "on" : ""} onClick={() => setN(i)} aria-label={t} />
          ))}
        </div>
      </div>

      <div className="wstack" onMouseEnter={e => e.currentTarget.classList.add("hold")} onMouseLeave={e => e.currentTarget.classList.remove("hold")}>
        {STAGES.map(([t, d], i) => {
          const slot = (i - n + STAGES.length) % STAGES.length;
          return (
            <article key={t} className={"wcard slot-" + slot} onClick={() => setN(i)}>
              <div className="wcard__h"><b className="num">{"0" + (i + 1)}</b><span>{t}</span></div>
              <p>{d}</p>
              <div className="wcard__f">
                <span className="lbl">Шаг {i + 1} из {STAGES.length}</span>
                <i />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* Две двери на входе: заказчик и исполнитель. У каждой — своя регистрация
   и свой способ «сначала посмотреть», без обязательного аккаунта. */
const GATES = [
  {
    k: "cli", v: "01 · Заказчику", t: "Нужен проект, экспертиза или обследование",
    li: ["Заявка вместо тендера — разделы подскажет платформа", "Отклики только от проверенных: СРО, НРС, страховка", "Публикация и переписка бесплатны"],
    cta: "Зарегистрироваться как заказчик", sec: "Посмотреть исполнителей", secGo: "pick",
  },
  {
    k: "pro", v: "02 · Исполнителю", t: "Проектируете, считаете, обследуете",
    li: ["Заявки по вашим разделам и региону", "Задание, бюджет и срок видны до отклика", "Расчёты по этапам, без авансов на словах"],
    cta: "Зарегистрироваться как исполнитель", sec: "Смотреть открытые заявки", secGo: "reqs",
  },
];

function Home({ go, goPro, goCli, regCli, regPro }) {
  const [open, setOpen] = useState(null);
  const [capOpen, setCapOpen] = useState(0);
  return (
    <div className="scroll">
      <div className="wrap">
        <section className="hero2 hero2--gate">
          <div className="hero__eyebrow"><span className="dot" style={{ background: "var(--acid)" }} /><span className="lbl">Единая платформа ПИР · 2026</span></div>
          <h1>Проектирование<br />без <em>слепых зон</em></h1>
          <p>Заявка, отклики, выбор исполнителя, экспертиза и расчёты — один контур с прозрачными сроками и проверенной репутацией участников.</p>
          <div className="gate">
            {GATES.map(g => (
              <div className={"gate__c gate__c--" + g.k} key={g.k}>
                <span className="gate__v">{g.v}</span>
                <h3>{g.t}</h3>
                <div className="gate__li">
                  {g.li.map(x => <span key={x}><i><Chk s={10} /></i>{x}</span>)}
                </div>
                <div className="gate__act">
                  <button className={"btn btn-lg " + (g.k === "cli" ? "btn-ink" : "btn-acid")} onClick={g.k === "cli" ? regCli : regPro}>{g.cta} <Arr /></button>
                  <button className="gate__sec" onClick={() => g.k === "cli" ? go(g.secGo) : go("reqs")}>{g.sec} <Arr s={13} /></button>
                </div>
              </div>
            ))}
          </div>
          <div className="peek__f">
            <p>Заявки и профили исполнителей открыты всем. Аккаунт нужен только чтобы откликнуться или опубликовать свою заявку.</p>
            <div className="row g8" style={{ flexWrap: "wrap" }}>
              <button className="btn btn-ink btn-sm" onClick={regCli}>Я заказчик</button>
              <button className="btn btn-acid btn-sm" onClick={regPro}>Я исполнитель</button>
            </div>
          </div>
          <div className="hero__note">
            <span className="dot" style={{ background: "var(--moss)" }} />Регистрация занимает минуту. Смотреть заявки и исполнителей можно и без аккаунта.
            <button className="gate__in" onClick={() => go("set")}>Уже есть аккаунт — войти</button>
          </div>
        </section>
      </div>

      <div className="hstrip">
        {[[IMG["hero-industrial-2.png"], "Промышленные объекты", "КЖ, ОВ, ЭОМ"], [IMG["hero-commercial-2.png"], "Коммерция и склады", "Полный комплект ПИР"], [IMG["hero-private-2.png"], "Жильё и благоустройство", "АР, ГП, ВК"]].map(([src, t, d]) => (
          <figure className="hstrip__i" key={t}>
            <img src={src} alt="" />
            <figcaption><b>{t}</b><span>{d}</span></figcaption>
          </figure>
        ))}
      </div>

      <div className="wrap">
        <section className="peek">
          <div className="sec-h">
            <div><span className="lbl">Витрина без регистрации</span><h2 style={{ marginTop: 8 }}>Что на платформе прямо сейчас</h2></div>
            <button className="btn btn-line btn-sm" onClick={() => go("reqs")}>Все 148 заявок <Arr s={13} /></button>
          </div>
          <div className="peek__g">
            {REQS.map(r => (
              <button className="peek__c" key={r.id} onClick={() => go("reqs")}>
                <span className="stage" style={{ color: r.kind === "Экспертиза" ? "var(--clay)" : r.kind === "Обследование" ? "var(--signal)" : "var(--ink)" }}><span className="dot" style={{ background: "currentColor" }} />{r.kind}</span>
                <h4>{r.t}</h4>
                <div className="peek__tags"><span className="tag solid">{r.city}</span>{r.secs.slice(0, 3).map(s => <span className="tag" key={s}>{s}</span>)}</div>
                <div className="peek__kv"><span>{r.budget}</span><span>{r.days}</span><b className="num">{r.resp} откл.</b></div>
              </button>
            ))}
          </div>
          <div className="glook">
            <div className="glook__l"><span className="lbl">Без регистрации</span><b>Открытые заявки — 148</b></div>
            <div className="glook__c">
              {[["Проектирование", 96], ["Экспертиза", 31], ["Обследование", 21]].map(([t, n]) => (
                <button key={t} onClick={() => go("reqs")}>{t}<em className="num">{n}</em></button>
              ))}
            </div>
            <button className="btn btn-line btn-sm" onClick={() => go("reqs")}>Открыть витрину <Arr s={13} /></button>
          </div>
        </section>
      </div>

      <div className="wrap"><Stages /></div>
      <div className="wrap">
        <section className="shot">
          <div className="bento">
            <div className="bento__dark">
              <span className="lbl">Заказы от застройщиков</span>
              <h3>Работа с заявками<br />от проверенных заказчиков</h3>
              <p>Бюджет и сроки указаны до отклика, переписка и файлы — внутри сделки, оплата по этапам.</p>
              <div className="row g8" style={{ flexWrap: "wrap" }}>
                <button className="btn btn-acid" onClick={() => go("reqs")}>Смотреть заявки</button>
              </div>
            </div>
            <div className="bento__safe">
              <span className="lbl">Деньги и проверки</span>
              <h3>Как платформа держит сделку</h3>
              <div className="bsafe">
                {[["01", "Проверка до отклика", "ИНН и ЕГРЮЛ, СРО по реестру НОПРИЗ, НРС и полис — сверяем сами"],
                  ["02", "Резерв по этапам", "заказчик резервирует сумму до старта, исполнитель видит её в заявке"],
                  ["03", "Выплата после акта", "принятый этап уходит в выплату, спор фиксируется в переписке"]].map(([n, t, d]) => (
                  <div className="bsafe__r" key={n}>
                    <b className="num">{n}</b>
                    <div><span className="bsafe__t">{t}</span><span className="bsafe__d">{d}</span></div>
                  </div>
                ))}
              </div>
              <button className="btn btn-line btn-sm" onClick={() => go("price")}>Тарифы и комиссия <Arr s={13} /></button>
            </div>
          </div>
        </section>

        <section>
          <div className="faq">
            {FAQ.map((f, i) => (
              <div className={"qa" + (open === i ? " on" : "")} key={f.q}>
                <button onClick={() => setOpen(open === i ? null : i)}>{f.q}<i>+</i></button>
                {open === i && <p>{f.a}</p>}
              </div>
            ))}
          </div>

          <div className="cta">
            <div>
              <h2>Первая заявка — пять минут</h2>
              <p>Не знаете, какие разделы нужны — подскажем по типу объекта. Описание можно оставить своими словами.</p>
            </div>
            <button className="btn btn-ink" onClick={() => go("new")}>Создать заявку <Arr /></button>
          </div>
        </section>

        <footer className="foot">
          <div className="row g12"><Mark s={22} /><span className="lbl">Функция — платформа проектно-изыскательских работ</span></div>
          <div className="row g16"><a href="#" className="lbl" style={{ color: "var(--ink-2)" }}>Документы</a><a href="#" className="lbl" style={{ color: "var(--ink-2)" }}>Поддержка</a><a href="#" className="lbl" style={{ color: "var(--ink-2)" }}>API</a></div>
        </footer>
      </div>
    </div>
  );
}

/* ---------------- заявки ---------------- */
function Reqs({ go, pubs = [], flash, onFlashOff, openMine, openLive, goCli, regPro, regCli, user, isExecutor, canOrder }) {
  const [tab, setTab] = useState(pubs.some(r => r.mine) ? "Мои" : "Все");
  /* Ничего не отмечено по умолчанию: предвыбранная галочка выглядела как поломка —
     список ей не соответствовал. */
  const [on, setOn] = useState([]);
  const [q, setQ] = useState("");
  const toggle = v => setOn(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);
  const all = [...pubs, ...REQS];
  const groups = buildFilters(all);
  const query = q.trim().toLowerCase();

  /* «Мои» у вошедшего — только его настоящие заявки: у заказчика опубликованные им,
     у исполнителя — где он назначен или откликался. Демо-подмешивание (r.id < 3)
     оставлено гостю, иначе вкладка на витрине пустая. */
  const list = all
    .filter(r => tab === "Все" ? true : tab === "Мои" ? (user ? r.mine : (r.mine || r.id < 3)) : r.resp > 2)
    .filter(r => groups.every(({ val, opts }) => {
      const active = opts.map(([v]) => v).filter(v => on.includes(v));
      return active.length === 0 || val(r).some(v => active.includes(v));
    }))
    .filter(r => !query || [r.t, r.city, r.type, r.stage, ...(r.secs || [])].join(" ").toLowerCase().includes(query));

  return (
    <div className="scroll">
      <div className="wrap">
        <div className="rhead">
          <div className="rhead__l">
            <span className="lbl">{isExecutor ? "Заявки для отклика" : "Заявки заказчиков"}</span>
            <h1>Проектирование<br />и экспертиза</h1>
            <p>Задание, бюджет и срок указаны до отклика. Переписка, файлы и оплата по этапам — внутри сделки.</p>
            <div className="row g8" style={{ flexWrap: "wrap" }}>
              <button className="btn btn-acid btn-sm" onClick={() => goCli ? goCli() : go("new")}>Новая заявка</button>
            </div>
          </div>
          <div className="rhead__r">
            {[["Проектирование", "АР, КЖ, ОВ, ВК, ЭОМ"], ["Экспертиза", "Замечания по нормативам"], ["Обследование", "Выезд и обмеры"]].map(([t, d]) => (
              <div className="rhead__row" key={t}><b>{t}</b><span>{d}</span></div>
            ))}
          </div>
        </div>
      </div>
      {flash && (
        <div className="wrap"><div className="flash">
          <span className="flash__ic"><Chk s={13} /></span>
          <div><b>Заявка опубликована</b><span>«{flash}» появилась в списке и в разделе «Мои». Исполнители с СРО видят её сразу.</span></div>
          <button className="btn btn-line btn-sm" onClick={() => openMine && openMine(pubs[0])}>Открыть заявку</button>
          <button className="flash__x" onClick={onFlashOff}>✕</button>
        </div></div>
      )}
      <div className="wrap">
        <div className="gbar">
          <span className="gbar__t">Вы смотрите заявки как гость</span>
          <p>Список, разделы и сроки открыты всем. Аккаунт нужен, чтобы откликнуться или опубликовать свою.</p>
          <div className="row g8" style={{ flexWrap: "wrap" }}>
            <button className="btn btn-acid btn-sm" onClick={() => regPro && regPro()}>Регистрация исполнителя</button>
            <button className="btn btn-line btn-sm" onClick={() => regCli && regCli()}>Регистрация заказчика</button>
          </div>
        </div>
      </div>
      <div className="wrap reqs">
        <aside className="rail">
          <div className="rail__g">
            <span className="lbl">Поиск</span>
            <input className="inp" style={{ height: 42, fontSize: 14 }} placeholder="Раздел, город, объект"
              value={q} onChange={e => setQ(e.target.value)} />
          </div>
          {groups.map(({ g, opts }) => opts.length > 0 && (
            <div className="rail__g" key={g}>
              <span className="lbl">{g}</span>
              {opts.map(([v, n]) => (
                <div className={"fchk" + (on.includes(v) ? " on" : "")} key={v} onClick={() => toggle(v)}><i />{v}<em>{n}</em></div>
              ))}
            </div>
          ))}
          <button className="btn btn-line btn-sm" onClick={() => { setOn([]); setQ(""); }}>Сбросить фильтры</button>
        </aside>

        <main>
          <div className="sec-h">
            {/* Гостю — витринный заголовок Дениса, вошедшему — по его роли.
                Вкладка «Мои» появляется только когда есть чьи заявки показывать. */}
            <div>
              <span className="lbl">{user ? "Открытые заявки" : "Открытые заявки · упрощённый вид"}</span>
              <h2 style={{ marginTop: 8 }}>
                {!user ? "Что публикуют заказчики" : isExecutor ? "Подбор по вашим разделам" : "Заявки на площадке"}
              </h2>
            </div>
            <div className="row g12">
              <div className="seg">{(user ? ["Все", "Мои", "Горячие"] : ["Все", "Горячие"]).map(t => <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>{t}</button>)}</div>
            </div>
          </div>

          {/* Настоящие заявки (r.live) открываются в LiveOrder на реальных данных;
              демо-витрина ведёт на демо-экраны как раньше. */}
          <div style={{ display: "grid", gap: 14 }}>
            {list.map(r => (
              <article className="card rcard rcard--guest" key={r.id} onClick={() => r.live ? (openLive && openLive(r.id)) : go(r.kind === "Экспертиза" ? "exp" : "detail")}>
                <div className="rcard__top">
                  <div style={{ minWidth: 0 }}>
                    <div className="row g8" style={{ marginBottom: 10, flexWrap: "wrap" }}>
                      <span className="stage" style={{ color: r.kind === "Экспертиза" ? "var(--clay)" : r.kind === "Обследование" ? "var(--signal)" : "var(--ink)" }}>
                        <span className="dot" style={{ background: "currentColor" }} />{r.kind}
                      </span>
                      <span className="lbl">· {r.stage}</span>
                      {r.hot && <span className="best">срочно</span>}
                    </div>
                    <h3>{r.t}</h3>
                    <div className="rcard__meta">
                      <span className="tag solid">{r.city}</span>
                      <span className="tag solid">{r.type}</span>
                      {r.secs.map(s => <span className="tag" key={s}>{s}</span>)}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flex: "0 0 auto" }}>
                    <div className="lbl">Опубликовано {r.publ}</div>
                  </div>
                </div>
                <div className="rcard__grid">
                  <div className="f"><span>Бюджет</span><b>{budRange(r.budget)}</b></div>
                  <div className="f"><span>Срок</span><b>{r.days}</b></div>
                  <div className="f"><span>Разделов</span><b>{r.secs.length}</b></div>
                  <div className="f"><span>Отклики</span><b>{r.resp > 0 ? r.resp : "ждём"}</b></div>
                  <div className="f" style={{ justifySelf: "end", alignSelf: "end" }}>
                    <button className="btn btn-line btn-sm" onClick={e => { e.stopPropagation(); regPro && regPro(); }}>Откликнуться <Arr s={13} /></button>
                  </div>
                </div>
                <div className="rlock">
                  <span>Заказчик, полное задание и файлы — после входа исполнителем</span>
                  <button onClick={e => { e.stopPropagation(); regPro && regPro(); }}>Войти как исполнитель <Arr s={12} /></button>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>

    </div>
  );
}

/* ---------------- рабочая главная исполнителя ----------------
   Вошедшему исполнителю маркетинговый лендинг не нужен — он уже внутри.
   Показываем то, ради чего он пришёл: подходящие заявки и свои работы. */
function ExecHome({ go, user, cards, openLive }) {
  const secs = user.specializations || [];
  const mine = cards.filter(r => r.mine);
  const rec = cards.filter(r => !r.mine && (secs.length === 0 || (r.secs || []).some(s => secs.includes(s))));

  const Row = ({ r }) => (
    <button className="team__row" onClick={() => openLive && openLive(r.id)}>
      <span style={{ minWidth: 0, textAlign: "left" }}>
        <b style={{ display: "block", fontWeight: 500 }}>{r.t}</b>
        <span className="lbl">{r.city} · {r.stage || "стадия не указана"} · {(r.secs || []).join(", ") || "разделы не указаны"}</span>
      </span>
      <span className="num" style={{ marginLeft: "auto", flex: "0 0 auto" }}>{r.budget}</span>
    </button>
  );

  return (
    <div className="scroll">
      <div className="wrap page">
        <div className="page__h">
          <span className="lbl">Рабочий стол исполнителя</span>
          <h1>{user.name}</h1>
          <p>{secs.length
            ? "Ваши разделы: " + secs.join(", ") + ". По ним подбираем заявки."
            : "Разделы не выбраны — укажите их в настройках, и подбор заявок станет точнее."}</p>
        </div>
        <div className="two">
          <div style={{ display: "grid", gap: 14 }}>
            <div className="box">
              <div className="row" style={{ justifyContent: "space-between", marginBottom: 10 }}>
                <h3 style={{ margin: 0 }}>Подходящие заявки</h3>
                <span className="lbl">{rec.length}</span>
              </div>
              {rec.length === 0
                ? <p>Пока нет открытых заявок по вашим разделам. Загляните в общий список — там есть и другие.</p>
                : <div className="team">{rec.slice(0, 6).map(r => <Row r={r} key={r.id} />)}</div>}
              <button className="btn btn-line btn-sm" style={{ marginTop: 12 }} onClick={() => go("reqs")}>Все заявки</button>
            </div>
            <div className="box">
              <div className="row" style={{ justifyContent: "space-between", marginBottom: 10 }}>
                <h3 style={{ margin: 0 }}>Мои отклики и работы</h3>
                <span className="lbl">{mine.length}</span>
              </div>
              {mine.length === 0
                ? <p>Вы ещё не откликались. Отклик отправляется со страницы заявки.</p>
                : <div className="team">{mine.map(r => <Row r={r} key={r.id} />)}</div>}
            </div>
          </div>
          <div className="box" style={{ display: "grid", gap: 12 }}>
            <span className="lbl">Быстрые действия</span>
            <button className="btn btn-acid" onClick={() => go("reqs")}>Найти заявки</button>
            <button className="btn btn-line" onClick={() => go("set")}>Разделы и стадии</button>
            <button className="btn btn-line" onClick={() => go("norm")}>Нормативы</button>
            <button className="btn btn-line" onClick={() => go("msg")}>Сообщения</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- shell ---------------- */
function NewApp() {
  const { user, orders, responses, logout } = useApp();

  /* Кто смотрит: гость видит витрину целиком, вошедший — интерфейс своей роли.
     Исполнитель определяется по категориям (модель в.18), legacy-роли — по role. */
  const cats = user?.executorCategories ?? [];
  const isExecutor = !!user && (cats.length > 0 || user.role === "designer" || user.role === "expert");
  const isMaker = user?.role === "manufacturer";
  const canOrder = !user || user.role === "customer";

  /* Переход к общему аккаунту — через роутер Next, а не через
     window.location: сайт лежит на GitHub Pages в подпапке, и
     абсолютный «/auth» уводил мимо неё, на 404. Роутер сам
     подставляет basePath из next.config. */
  const router = useRouter();
  const [scr, setScr] = useState("home");
  const [menu, setMenu] = useState(false);
  const [lmenu, setLmenu] = useState(false);
  const [flash, setFlash] = useState(null);
  const [cur, setCur] = useState(null);
  const [cli, setCli] = useState(null);   /* что заполнили в короткой анкете */
  const [pro, setPro] = useState(null);   /* что заполнили в анкете исполнителя */
  const go = k => { setMenu(false); setLmenu(false); setScr(k); };
  /* Реальные заявки из общего хранилища: опубликованные — всем, свои — в любом
     статусе. Демо-витрина REQS остаётся ниже реальных. */
  const myResp = user ? responses.filter(r => r.designerId === user.id).map(r => r.orderId) : [];
  const liveCards = orders
    .filter(o => o.status === "published" || (user && (o.customerId === user.id || o.assignedDesignerId === user.id)))
    .map(o => {
      const c = orderToCard(o, user?.id);
      // «Мои» у заказчика — его заявки, у исполнителя — где он назначен или откликался.
      return isExecutor
        ? { ...c, mine: o.assignedDesignerId === user.id || myResp.includes(o.id) }
        : c;
    });
  const publish = req => { setFlash(req.t); setCur(req); setScr("reqs"); };
  const openMine = req => { if (!req) return; setCur(req); setScr("track"); };
  /* Деталь настоящей заявки (LiveOrder) — по id из хранилища. */
  const [liveId, setLiveId] = useState(null);
  const openLive = id => {
    const o = orders.find(x => x.id === id);
    if (o && /Парк Резиденс/.test(o.title || "")) { setScr("order"); return; }
    setLiveId(id); setScr("live");
  };
  /* Контур исполнителя: первый переход — быстрая регистрация по телефону
     (Land), дальше сразу выбор работ и разделов (Signup). Признак того, что
     исполнитель уже регистрировался, держим в localStorage. */
  const [proPhone, setProPhone] = useState("");
  const proSeen = () => { try { return localStorage.getItem("fn.pro.reg"); } catch (e) { return null; } };
  /* Контур заказчика: первый раз — регистрация, дальше сразу к заявке. */
  /* Регистрация идёт через общий аккаунт платформы (/auth), а не через локальную
     анкету: иначе в браузере заводится «профиль», которого нет в системе — он не
     сможет ни опубликовать заявку, ни откликнуться. Экраны входного контура
     (creg/cint/pro) остаются в сборке как дизайн — их подключение к хранилищу
     запланировано следующим заходом. */
  const toAuth = mode => { setMenu(false); setLmenu(false); router.push(mode ? "/auth?mode=" + mode : "/auth"); };
  const goCli = () => { setMenu(false); if (!user) return toAuth("register"); setScr("new"); };
  const regCli = () => toAuth("register");
  const regPro = () => toAuth("register");
  const goPro = () => { setMenu(false); if (!user) return toAuth("register"); setScr(isExecutor ? "reqs" : "home"); };
  const proDone = ph => {
    setProPhone(ph || "");
    try { localStorage.setItem("fn.pro.reg", ph || "1"); } catch (e) {}
    setScr("prowork");
  };
  /* Каталог исполнителей нужен заказчику; самому исполнителю и производителю —
     нет (замечание Дениса от 20.08). «Производители» оставлены всем по решению
     заказчика от 20.08 (вопрос 21). */
  const NAVS = [
    ["home", "Главная"],
    ...(isMaker ? [] : [["reqs", "Заявки"]]),
    ...(isExecutor || isMaker ? [] : [["pick", "Исполнители"]]),
    ["cat", "Производители"],
  ];
  const MORE = [["exp", "Экспертиза", "2 замечания"], ["norm", "Нормативы", ""], ["msg", "Сообщения", "3"], ["an", "Аналитика рынка", ""], ["price", "Тарифы", ""], ["set", "Настройки", ""]];
  const SCR = {
    home: () => isExecutor
      ? <ExecHome go={go} user={user} cards={liveCards} openLive={openLive} />
      : <Home go={go} goPro={goPro} goCli={goCli} regCli={regCli} regPro={regPro} />,
    creg: () => <SCREENS.ClientReg go={go} onPro={regPro} onDone={ph => { try { localStorage.setItem("fn.cli.reg", ph || "1"); } catch (e) {} setScr("cint"); }} />,
    cint: () => <SCREENS.ClientIntro go={go} onDone={d => { setCli(d); setScr("cwork"); }} onSkip={() => setScr("cwork")} />,
    cwork: () => <SCREENS.ClientWork go={go} cli={cli} onProfile={() => setScr("cprof")} />,
    cprof: () => <SCREENS.ClientProfile go={go} onBack={() => setScr("cwork")} />,
    reqs: () => <Reqs go={go} pubs={liveCards} flash={flash} onFlashOff={() => setFlash(null)} openMine={openMine} openLive={openLive} goCli={goCli} regPro={regPro} regCli={regCli} user={user} isExecutor={isExecutor} canOrder={canOrder} />,
    live: () => <SCREENS.LiveOrder go={go} orderId={liveId} />,
    track: () => <SCREENS.ReqTrack go={go} req={cur} />,
    detail: () => <SCREENS.OrderDetail go={go} />, order: () => <SCREENS.OrderCard go={go} />, prof: () => <SCREENS.ProProfile go={go} />,
    pick: () => <SCREENS.Pick go={go} />, solo: () => <SCREENS.SoloProfile go={go} />, cat: () => <SCREENS.Cat />,
    new: () => <SCREENS.OrderNew go={go} onPublish={publish} />, exp: () => <SCREENS.Expertise go={go} />,
    norm: () => <SCREENS.Standards />, msg: () => <SCREENS.Messages />, an: () => <SCREENS.Analytics />,
    price: () => <SCREENS.Pricing />, set: () => <SCREENS.Settings />,
    ai: () => <SCREENS.AiPick />,
    pro: () => <SCREENS.Land go={go} onDone={proDone} />,
    prowork: () => <SCREENS.Signup go={go} phone={proPhone} onDone={d => { setPro(d); setScr("pwork"); }} />,
    pwork: () => <SCREENS.ProWork go={go} pro={pro} onProfile={() => setScr("pprof")} />,
    pprof: () => <SCREENS.ProProfileFull go={go} onBack={() => setScr("pwork")} />,
  };
  /* Сайт для исполнителей — отдельный интерфейс со своей шапкой:
     возвращаем его целиком, без оболочки заказчика. */
  if (scr === "pro" || scr === "prowork" || scr === "creg" || scr === "cint" || scr === "cwork" || scr === "pwork" || scr === "cprof" || scr === "pprof") return SCR[scr]();
  return (
    <div className="nd" onClick={() => { if (menu) setMenu(false); if (lmenu) setLmenu(false); }}>
      <header className="topbar">
        <div className="mark" onClick={() => go("home")}><Mark s={28} /><b>Функция</b></div>
        <nav className="nav">
          {NAVS.map(([k, l]) => <button key={k} className={scr === k ? "on" : ""} onClick={() => go(k)}>{l}</button>)}
        </nav>
        <div className="more">
          <button className={"navbtn" + (MORE.some(m => m[0] === scr) ? " on" : "")} onClick={e => { e.stopPropagation(); setMenu(!menu); }}>Ещё ▾</button>
          {menu && (
            <div className="menu" onClick={e => e.stopPropagation()}>
              {MORE.map(([k, l, n]) => <button key={k} onClick={() => go(k)}>{l}{n && <span>{n}</span>}</button>)}
              <button className="menu__pro" onClick={goPro}>Сайт для исполнителей<span>вход</span></button>
            </div>
          )}
        </div>
        <span className="spacer" />
        <div className="omni"><Search />Поиск по заявкам и нормативам<kbd>⌘K</kbd></div>
        {/* Шапка показывает реальное состояние входа. Фото из демо-выгрузки убрано:
            гость выглядел как чужой залогиненный профиль (замечание Дениса-2). */}
        {user ? (
          <div className="more">
            <button className="ava" title={user.name} onClick={e => { e.stopPropagation(); setLmenu(!lmenu); }}
              style={{ display: "grid", placeItems: "center", padding: 0, background: "var(--ink)", color: "var(--acid)", fontSize: 12.5, cursor: "pointer" }}>
              {userInitials(user.name)}
            </button>
            {lmenu && (
              <div className="menu" onClick={e => e.stopPropagation()}>
                <button onClick={() => go("set")}>Настройки<span>{user.email}</span></button>
                <button onClick={() => { setLmenu(false); logout(); }}>Выйти</button>
              </div>
            )}
          </div>
        ) : (
          <div className="more">
            <button className="signin" onClick={e => { e.stopPropagation(); setLmenu(!lmenu); }}>Войти <Arr s={12} /></button>
            {lmenu && (
              <SCREENS.AuthPanel
                onEnterClient={() => { setLmenu(false); router.push("/auth"); }}
                onEnterPro={() => { setLmenu(false); router.push("/auth"); }}
                onRegClient={() => { setLmenu(false); router.push("/auth?mode=register"); }}
                onRegPro={() => { setLmenu(false); router.push("/auth?mode=register"); }}
                onClose={() => setLmenu(false)} />
            )}
          </div>
        )}
      </header>
      {(SCR[scr] || SCR.home)()}
    </div>
  );
}

Object.assign(SCREENS, { NewApp });
