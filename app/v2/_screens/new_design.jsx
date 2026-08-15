"use client";

/* Экран варианта Б. Источник: design-handoff-v2/new_design.jsx
   Файл сгенерирован из выгрузки Cloud Design — правки вносить в источник. */
import * as React from "react";
import { SCREENS } from "./registry";
import { IMG } from "../_assets";
const { useState } = React;

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

const Init = ({ n, bg = "#E8E5DD", c = "#14161A", size = 30 }) => (
  <div className="num" style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: 99, background: bg, color: c, display: "grid", placeItems: "center", fontSize: size * 0.36, fontWeight: 500, letterSpacing: 0 }}>{n}</div>
);

/* ---------------- data ---------------- */
const CAPS = [
  { n: "01", t: "Заявка вместо тендера", c: "var(--acid)", d: "Описание своими словами, разделы подскажет платформа. Публикация бесплатна, отклики приходят только от организаций с действующим СРО.", cta: "Создать заявку", go: "new" },
  { n: "02", t: "Сравнение откликов", c: "var(--signal)", d: "Цена, срок, состав работ и субподряд — в одной таблице. Видно, что именно входит в предложение, а что вынесено за скобки.", cta: "Открыть сравнение", go: "detail" },
  { n: "03", t: "Индекс доверия", c: "var(--moss)", d: "СРО, страхование, история сделок и соблюдение сроков сводятся в одну оценку — без сбора справок вручную.", cta: "Как считается", go: "trust" },
  { n: "04", t: "Подбор решений", c: "var(--plum)", d: "По разделу проекта платформа предлагает оборудование и материалы из каталога производителей, включая аналоги под замену.", cta: "Подобрать решение", go: "ai" },
  { n: "05", t: "Экспертиза разделов", c: "var(--clay)", d: "Замечания приходят с привязкой к листу и пункту норматива, история правок сохраняется по каждому разделу.", cta: "Смотреть замечания", go: "exp" },
  { n: "06", t: "Нормативы под рукой", c: "var(--ink)", d: "Актуальные редакции СП и ГОСТ с отметкой изменений — ссылка на пункт вставляется прямо в замечание или переписку.", cta: "Открыть нормативы", go: "norm" },
];

const FLOW = [
  { t: "Заявка", d: "Три шага в форме — разделы подскажем сами.", v: (<><div className="ln m" /><div className="ln s" /><div className="ln a s" /></>) },
  { t: "Отклики", d: "Предложения от исполнителей с СРО и историей сделок.", v: (<><div className="avs"><i /><i /><i className="a" /><i /></div><div className="ln s" /></>) },
  { t: "Выбор", d: "Сравнение рядом: цена, срок, доверие.", v: (<><div className="row-mini"><span className="b">1</span>Цена<span className="spacer" /><span className="num">1,15 млн</span></div><div className="mini-pipe"><i className="a" /><i className="on" /><i /></div></>) },
  { t: "Работа", d: "Статусы и файлы по каждому разделу.", v: (<><div className="mini-pipe"><i className="on" /><i className="on" /><i className="a" /><i /></div><div className="ln m" /></>) },
  { t: "Экспертиза", d: "Замечания, правки и заключение.", v: (<><span className="stamp"><b>✓</b>заключение</span><div className="ln s" /></>) },
];

const TILES = [
  {
    t: "Заявки на проектирование", go: "reqs", cta: "Смотреть заявки", bg: "#E9E6DC",
    d: "Опишите объект — разделы по ПП РФ №87 подставятся сами, останется выбрать срок и бюджет.",
    v: (<><span className="chipmini">ПРОЕКТИРОВАНИЕ</span><div className="cardstub"><span className="t">Котельная 4,2 МВт</span><div className="row g8">{["ОВ", "ЭОМ", "АР"].map(s => <span className="tag" key={s} style={{ height: 20, fontSize: 11 }}>{s}</span>)}</div></div><div className="row-mini"><span className="b">3</span>отклика<span className="spacer" /><span className="num">45 дней</span></div></>),
  },
  {
    t: "Подбор исполнителей", go: "pick", cta: "Смотреть исполнителей", bg: "#E2E7F4",
    d: "У каждого — СРО, страховка и история сделок. Индекс доверия показывает риск одной цифрой.",
    v: (<><span className="chipmini">ИНДЕКС ДОВЕРИЯ</span><div className="row-mini"><span className="b">ТС</span>ООО «Техносфера»<span className="spacer" /><span className="num">91</span></div><div className="row-mini"><span className="b">ИГ</span>ИнжГрупп<span className="spacer" /><span className="num">84</span></div></>),
  },
  {
    t: "Экспертиза и сдача", go: "exp", cta: "Посмотреть трекер", bg: "#F2E3D9",
    d: "Видно, на каком шаге проект, что требует вашего ответа и сколько осталось до заключения.",
    v: (<><span className="chipmini">2-Я ИТЕРАЦИЯ</span><div className="cardstub"><span className="t">Замечания эксперта — 2</span><div className="mini-pipe"><i className="on" /><i className="on" /><i className="a" /><i /><i /></div></div><span className="stamp"><b>✓</b>до 20 августа</span></>),
  },
];

const FAQ = [
  { q: "Сколько стоит для заказчика?", a: "Для заказчика платформа бесплатна: публикация заявок, отклики, сравнение и переписка не тарифицируются. Подписку оплачивают исполнители — за доступ к заявкам." },
  { q: "А если я не знаю, какие разделы мне нужны?", a: "Выберите тип объекта — состав разделов по ПП РФ №87 подставится автоматически. Лишнее можно убрать, а если сомневаетесь — оставьте как есть, исполнители уточнят в откликах." },
  { q: "Кто проверяет исполнителей?", a: "Платформа сверяет ИНН и выписку ЕГРЮЛ, членство в СРО по реестру НОПРИЗ, полис страхования и историю сделок. Из этого собирается индекс доверия от 0 до 100." },
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
    resp: 3, tr: 87, publ: "11 августа", kind: "Проектирование", hot: true,
    bids: [
      { n: "ТС", name: "ООО «Техносфера»", note: "СРО · 14 лет · 62 проекта", price: "1 150 000 ₽", d: "42 дня", tr: 91, best: ["tr"] },
      { n: "ПБ", name: "ПБ «Вектор»", note: "СРО · 9 лет · 38 проектов", price: "980 000 ₽", d: "50 дней", tr: 78, best: ["price"] },
      { n: "ИГ", name: "ИнжГрупп", note: "СРО · 11 лет · 51 проект", price: "1 240 000 ₽", d: "38 дней", tr: 84, best: ["d"] },
    ],
  },
  {
    id: 2, t: "ЖК «Северный», корпус 3 — прохождение экспертизы", city: "Казань", type: "Жилой объект",
    stage: "Экспертиза · 2-я итерация", secs: ["АР", "КЖ", "ВК", "СС"], budget: "по итерациям", days: "до 20 авг",
    resp: 2, tr: 92, publ: "10 августа", kind: "Экспертиза", warn: "2 замечания",
    bids: [
      { n: "ЭЦ", name: "ЭЦ «Проектстандарт»", note: "Аккредитация · 2 216 заключений", price: "310 000 ₽", d: "14 дней", tr: 94, best: ["tr", "d"] },
      { n: "НГ", name: "НЭ «Гарант»", note: "Аккредитация · 1 480 заключений", price: "285 000 ₽", d: "18 дней", tr: 88, best: ["price"] },
    ],
  },
  {
    id: 3, t: "Обследование производственного корпуса, 8 400 м²", city: "Екатеринбург", type: "Обследование",
    stage: "Техническое заключение", secs: ["ТО", "КЖ"], budget: "640 000 ₽", days: "30 дней",
    resp: 5, tr: 81, publ: "08 августа", kind: "Обследование",
    bids: [
      { n: "СП", name: "«СтройПроект-Э»", note: "Лаборатория · 22 года", price: "610 000 ₽", d: "26 дней", tr: 89, best: ["price", "tr", "d"] },
      { n: "ГК", name: "ГК «Ресурс»", note: "СРО · 7 лет", price: "700 000 ₽", d: "34 дня", tr: 72, best: [] },
    ],
  },
  {
    id: 4, t: "Склад-холодильник 12 000 м² — КЖ, КМ, ТХ", city: "Краснодар", type: "Промышленный объект",
    stage: "Рабочая документация", secs: ["КЖ", "КМ", "ТХ", "ЭОМ", "АУПТ"], budget: "2 900 000 ₽", days: "90 дней",
    resp: 7, tr: 76, publ: "05 августа", kind: "Проектирование",
    bids: [
      { n: "МП", name: "«МегаПроект»", note: "СРО · 18 лет · 140 проектов", price: "2 750 000 ₽", d: "84 дня", tr: 90, best: ["price", "tr", "d"] },
      { n: "АБ", name: "АБ «Форма»", note: "СРО · 6 лет · 24 проекта", price: "3 100 000 ₽", d: "96 дней", tr: 69, best: [] },
    ],
  },
];


const FILTERS = {
  "Тип заявки": [["Проектирование", 96], ["Экспертиза", 31], ["Обследование", 21]],
  "Стадия": [["Проектная (П)", 58], ["Рабочая (Р)", 44], ["Обоснование инвестиций", 12]],
  "Раздел": [["АР", 74], ["КЖ / КМ", 66], ["ОВ / ВК", 51], ["ЭОМ / СС", 47]],
};

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
      {[["Техносфера", "ТС", 91], ["ИнжГрупп", "ИГ", 84], ["ПроектСтрой", "ПС", 78]].map(([n, ab, v]) => (
        <div key={n}>{n === "Техносфера" ? <span className="wc__logo wc__logo--s"><img src={IMG["tehnosfera-logo.jpg"]} alt="" /></span> : <Init n={ab} size={22} />}<span>{n}</span><em className="num">{v}</em></div>
      ))}
    </div>
    <div className="wc__link">Показать все отклики <Arr s={12} /></div></>) },
  { t: "Выбор исполнителя", d: "Вы сравниваете индекс, цену и срок.", c: (
    <><div className="wc__co"><span className="wc__logo"><img src={IMG["tehnosfera-logo.jpg"]} alt="Техносфера" /></span><b>ООО «Техносфера»</b></div>
    <div className="wc__kv"><span>Индекс доверия</span><b className="wc__big">91 <i>/ 100</i></b></div>
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

function Home({ go }) {
  const [open, setOpen] = useState(null);
  const [capOpen, setCapOpen] = useState(0);
  return (
    <div className="scroll">
      <div className="wrap">
        <section className="hero2">
          <div className="hero__eyebrow"><span className="dot" style={{ background: "var(--acid)" }} /><span className="lbl">Единая платформа ПИР · 2026</span></div>
          <h1>Проектирование<br />без <em>слепых зон</em></h1>
          <p>Заявка, отклики, выбор исполнителя, экспертиза и расчёты — один контур с прозрачными сроками и проверенной репутацией участников.</p>
          <div className="hero__cta">
            <button className="btn btn-acid btn-lg" onClick={() => go("new")}>Создать заявку <Arr /></button>
            <button className="btn btn-ink btn-lg" onClick={() => go("new")}>Зарегистрироваться</button>
            <button className="btn btn-ghost" onClick={() => go("reqs")}>Смотреть заявки <Arr s={13} /></button>
          </div>
          <div className="hero__note"><span className="dot" style={{ background: "var(--moss)" }} />Публикация заявки бесплатна · отклики только от проверенных: СРО у организаций, НРС и диплом у частных специалистов</div>
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
        <section>
          <div className="roles">
            <div className="role">
              <span className="lbl">Заказчику</span>
              <h3>Найти исполнителя без тендера</h3>
              <div className="role__list">
                {["Публикация заявки бесплатная", "Отклики только от проверенных организаций", "Сравнение цен и сроков в одной таблице", "Статус проекта и экспертизы в одном окне"].map(x => <span className="role__li" key={x}>{x}</span>)}
              </div>
              <div className="row g8" style={{ marginTop: 4, flexWrap: "wrap" }}>
                <button className="btn btn-ink" onClick={() => go("new")}>Создать заявку</button>
                <button className="btn btn-line" onClick={() => go("pick")}>Посмотреть исполнителей</button>
              </div>
            </div>
            <div className="role dark">
              <span className="lbl">Исполнителю</span>
              <h3>Получать заказы без холодных звонков</h3>
              <div className="role__list">
                {["Открытые заявки с подтверждённым заданием", "Индекс доверия вместо портфолио в почте", "Вся переписка и файлы по сделке в платформе", "Оплата по этапам, без авансов на словах"].map(x => <span className="role__li" key={x}>{x}</span>)}
              </div>
              <div className="row g8" style={{ marginTop: 4, flexWrap: "wrap" }}>
                <button className="btn btn-acid" onClick={() => go("reqs")}>Смотреть заявки</button>
                <button className="btn btn-line" onClick={() => go("trust")}>Как работает индекс</button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="ticker">
        {[0, 1].map(k => (
          <div className="ticker__t" key={k} aria-hidden={k === 1}>
            {TICK.map(t => <span key={t}><i className="dot" style={{ background: "var(--ink-3)" }} />{t}</span>)}
          </div>
        ))}
      </div>

      <div className="wrap">
        <section className="statline">
          <div className="sec-h" style={{ paddingTop: 8 }}>
            <div><span className="lbl">Инструменты площадки</span><h2 style={{ marginTop: 8 }}>Что закрывает Функция вместо почты и таблиц</h2></div>
          </div>
          <div className="tools">
            {CAPS.map((c, i) => (
              <div className={"tool" + (capOpen === i ? " on" : "")} key={c.t} style={{ "--c": c.c }} onClick={() => setCapOpen(i)}>
                <span className="tool__n">{c.n}</span>
                <div className="tool__main">
                  <h3>{c.t}</h3>
                  <div className="tool__body"><div>
                    <p>{c.d}</p>
                    <button className="btn btn-line btn-sm" onClick={e => { e.stopPropagation(); go(c.go); }}>{c.cta} <Arr s={12} /></button>
                  </div></div>
                </div>
                <span className="tool__pl" />
              </div>
            ))}
          </div>
          <div className="stat" style={{ marginTop: 0 }}>
            <div><p className="stat__t" style={{ margin: 0, maxWidth: "22ch" }}>Каталог решений производителей — подбор аналогов прямо в разделе проекта</p></div>
            <div className="logos logos--inline">
              <span className="brand"><img src={IMG["ridan.webp"]} alt="Ridan" /></span>
              <span className="brand"><img src={IMG["caparol-logo.webp"]} alt="Caparol" style={{ height: 28 }} /></span>
              <span className="brand"><img src={IMG["vandjord.jpg"]} alt="Vandjord" /></span>
              <span className="brand"><img src={IMG["nemen.png"]} alt="Немен" /></span>
              <span className="lbl">и ещё 382 производителя</span>
            </div>
          </div>
        </section>

        <section className="work">
          <div className="sec-h">
            <div><span className="lbl">Ваш контур</span><h2 style={{ marginTop: 8 }}>Сегодня в работе</h2></div>
            <button className="btn btn-line btn-sm" onClick={() => go("reqs")}>Все заявки <Arr s={13} /></button>
          </div>
          <div className="mini">
            {MINI.map(m => (
              <div key={m.l} className="card mini__c">
                <span className="lbl">{m.l}</span>
                <b style={{ fontSize: m.small ? 26 : undefined, color: m.c }}>{m.b}</b>
                <div className="spark">{m.s.map((v, i) => <i key={i} style={{ height: `${v * 7}%`, background: i === m.s.length - 1 ? (m.c || "var(--ink)") : undefined }} />)}</div>
              </div>
            ))}
          </div>
          <div className="feed">
            {FEED.map(f => (
              <div className="frow" key={f.t} onClick={() => go(f.tag === "Экспертиза" ? "exp" : "reqs")}>
                <span className="lbl">{f.d}</span>
                <div><h4>{f.t}</h4><p>{f.p}</p></div>
                <div className="row g16">
                  <div className="pipe">{f.st.map((s, i) => <i key={i} className={s === 1 ? "on" : s === 2 ? "warn" : ""} />)}</div>
                  <span className="tag solid" style={{ color: f.warn ? "var(--clay)" : undefined }}>{f.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="how">
          <div className="sec-h">
            <div><span className="lbl">Как это работает</span><h2 style={{ marginTop: 8 }}>Пять шагов от заявки до заключения</h2></div>
            <button className="btn btn-line btn-sm" onClick={() => go("new")}>Начать <Arr s={13} /></button>
          </div>
          <div className="wtrack">
            {WSTEPS.map((s, i) => (
              <div className={"wstep" + (s.fin ? " wstep--fin" : "")} key={s.t}>
                <span className="wstep__n">{String(i + 1).padStart(2, "0")}</span>
                <h4>{s.t}</h4>
                <p>{s.d}</p>
                <div className="wstep__rail"><span className="wstep__node" /></div>
                <div className="wstep__card">{s.c}</div>
              </div>
            ))}
          </div>
          <div className="wbar">
            {["Все проекты в одном месте", "Проверенные исполнители", "Прозрачные сроки и цены", "Экспертиза онлайн", "История изменений и версий"].map(t => <span key={t}>{t}</span>)}
            <button className="btn btn-acid btn-sm" onClick={() => go("new")}>Разместить проект <Arr s={13} /></button>
          </div>
          <div className="tiles">
            {TILES.map(t => (
              <button className="tile" key={t.t} onClick={() => go(t.go)}>
                <div className="tile__top" style={{ "--tb": t.bg }}>{t.v}</div>
                <div className="tile__b">
                  <h3>{t.t}</h3>
                  <p>{t.d}</p>
                  <span className="tile__go">{t.cta} <i><Arr s={12} /></i></span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="shot">
          <div className="sec-h">
            <div><span className="lbl">Один экран</span><h2 style={{ marginTop: 8 }}>Заявка, отклики и экспертиза — без переписки в почте</h2></div>
            <button className="btn btn-line btn-sm" onClick={() => go("detail")}>Открыть пример <Arr s={13} /></button>
          </div>
          <div className="frame">
            <div className="frame__bar"><i /><i /><i /><span className="lbl">Заявка №148 · Склад класса А, Домодедово</span></div>
            <div className="frame__body">
              <div className="fnav">
                {[["Заявки", 1], ["Отклики", 0], ["Экспертиза", 0], ["Нормативы", 0], ["Сообщения", 0]].map(([l, on]) => <span key={l} className={on ? "on" : ""}>{l}</span>)}
              </div>
              <div style={{ display: "grid", gap: 12, alignContent: "start" }}>
                <div className="row g8" style={{ flexWrap: "wrap" }}>
                  <span className="tag solid">Проектирование</span><span className="tag">АР</span><span className="tag">КЖ</span><span className="tag">ОВ</span>
                </div>
                <div className="vis" style={{ height: 92, borderRadius: 12, background: "var(--paper)", border: "1px solid var(--line)", padding: 12, display: "grid", gap: 8, alignContent: "center" }}>
                  <div className="ln a m" /><div className="ln" /><div className="ln s" />
                </div>
                <div className="mini-pipe"><i className="on" /><i className="on" /><i className="a" /><i /><i /></div>
                <span className="lbl">Этап 3 из 5 · согласование разделов</span>
              </div>
              <div style={{ display: "grid", gap: 4, alignContent: "start" }}>
                <span className="lbl" style={{ marginBottom: 6 }}>Отклики · 7</span>
                {[["Ситипроект", "СП", "2,4 млн · 45 дн", "92"], ["Гипрострой", "ГС", "2,8 млн · 38 дн", "88"], ["Аркада", "АР", "2,1 млн · 60 дн", "74"]].map(([n, ab, p, t]) => (
                  <div className="fbid" key={n}><Init n={ab} size={26} /><div><h5>{n}</h5><span>{p}</span></div><span className="num">{t}</span></div>
                ))}
              </div>
            </div>
          </div>

          <div className="bento">
            <div className="bento__dark">
              <span className="lbl">Заказы от застройщиков</span>
              <h3>Работа с заявками<br />от проверенных заказчиков</h3>
              <p>Бюджет и сроки указаны до отклика, переписка и файлы — внутри сделки, оплата по этапам.</p>
              <div className="row g8" style={{ flexWrap: "wrap" }}>
                <button className="btn btn-acid" onClick={() => go("reqs")}>Смотреть заявки</button>
                <button className="btn btn-line" onClick={() => go("trust")}>Как это работает</button>
              </div>
            </div>
            <div className="bento__img">
              <img src={IMG["hero-private.png"]} alt="" />
              <div className="bento__badge"><b>Экспертиза</b><span>Замечания с привязкой к листу проекта и пункту норматива, история правок сохраняется</span></div>
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
function Reqs({ go, pubs = [], flash, onFlashOff, openMine }) {
  const [tab, setTab] = useState(pubs.length ? "Мои" : "Все");
  const [on, setOn] = useState(["Проектирование"]);
  const toggle = v => setOn(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);
  const all = [...pubs, ...REQS];
  const list = all.filter(r => tab === "Все" ? true : tab === "Мои" ? (r.mine || r.id < 3) : r.resp > 2);

  return (
    <div className="scroll">
      <div className="wrap">
        <div className="rhead">
          <div className="rhead__l">
            <span className="lbl">Заявки заказчиков</span>
            <h1>Проектирование<br />и экспертиза</h1>
            <p>Задание, бюджет и срок указаны до отклика. Переписка, файлы и оплата по этапам — внутри сделки.</p>
            <div className="row g8" style={{ flexWrap: "wrap" }}>
              <button className="btn btn-acid btn-sm" onClick={() => go("new")}>Новая заявка</button>
              <button className="btn btn-line btn-sm" onClick={() => go("trust")}>Индекс доверия</button>
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
      <div className="wrap reqs">
        <aside className="rail">
          <div className="rail__g">
            <span className="lbl">Поиск</span>
            <div className="omni" style={{ minWidth: 0 }}><Search /> Раздел, город, объект</div>
          </div>
          {Object.entries(FILTERS).map(([g, items]) => (
            <div className="rail__g" key={g}>
              <span className="lbl">{g}</span>
              {items.map(([v, n]) => (
                <div className={"fchk" + (on.includes(v) ? " on" : "")} key={v} onClick={() => toggle(v)}><i />{v}<em>{n}</em></div>
              ))}
            </div>
          ))}
          <div className="rail__g">
            <span className="lbl">Индекс доверия</span>
            <div className="row g8" style={{ height: 8, background: "var(--paper-2)", borderRadius: 99, position: "relative" }}>
              <div style={{ position: "absolute", left: "35%", right: 0, top: 0, bottom: 0, background: "var(--ink)", borderRadius: 99 }} />
            </div>
            <div className="row" style={{ justifyContent: "space-between" }}><span className="lbl">от 70</span><span className="lbl">100</span></div>
          </div>
          <button className="btn btn-line btn-sm">Сбросить фильтры</button>
        </aside>

        <main>
          <div className="sec-h">
            <div><span className="lbl">Открытые заявки</span><h2 style={{ marginTop: 8 }}>Подбор по вашим разделам</h2></div>
            <div className="row g12">
              <div className="seg">{["Все", "Мои", "Горячие"].map(t => <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>{t}</button>)}</div>
            </div>
          </div>

          <div style={{ display: "grid", gap: 14 }}>
            {list.map(r => (
              <article className={"card rcard" + (r.mine ? " rcard--mine" : "")} key={r.id} onClick={() => r.mine ? (openMine && openMine(r)) : go(r.kind === "Экспертиза" ? "exp" : r.id === 1 ? "detail" : "order")}>
                <div className="rcard__top">
                  <div style={{ minWidth: 0 }}>
                    <div className="row g8" style={{ marginBottom: 10, flexWrap: "wrap" }}>
                      <span className="stage" style={{ color: r.kind === "Экспертиза" ? "var(--clay)" : r.kind === "Обследование" ? "var(--signal)" : "var(--ink)" }}>
                        <span className="dot" style={{ background: "currentColor" }} />{r.kind}
                      </span>
                      <span className="lbl">· {r.stage}</span>
                      {r.mine && <span className="best">ваша заявка</span>}
                      {r.hot && <span className="best">срочно</span>}
                      {r.warn && <span className="tag" style={{ color: "var(--clay)", borderColor: "rgba(220,90,42,.35)" }}>{r.warn}</span>}
                    </div>
                    <h3>{r.t}</h3>
                    <div className="rcard__meta">
                      <span className="tag solid">{r.city}</span>
                      <span className="tag solid">{r.type}</span>
                      {r.secs.map(s => <span className="tag" key={s}>{s}</span>)}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flex: "0 0 auto" }}>
                    <span className="trust"><span className="dot" style={{ background: r.tr >= 85 ? "var(--moss)" : r.tr >= 75 ? "var(--acid-d)" : "var(--clay)" }} />Индекс <b>{r.tr}</b></span>
                    <div className="lbl" style={{ marginTop: 8 }}>Опубликовано {r.publ}</div>
                  </div>
                </div>
                <div className="rcard__grid">
                  <div className="f"><span>Бюджет</span><b>{r.budget}</b></div>
                  <div className="f"><span>Срок</span><b>{r.days}</b></div>
                  <div className="f"><span>Разделов</span><b>{r.secs.length}</b></div>
                  <div className="f"><span>Отклики</span>
                    {r.resp > 0 ? (
                      <div className="row" style={{ gap: 0, marginTop: 2 }}>
                        {r.bids.slice(0, 3).map((b, i) => <div key={b.n} style={{ marginLeft: i ? -7 : 0, border: "2px solid var(--card)", borderRadius: 99 }}><Init n={b.n} size={26} /></div>)}
                        <span className="num" style={{ marginLeft: 9, fontSize: 13 }}>{r.resp}</span>
                      </div>
                    ) : <b style={{ color: "var(--ink-3)" }}>ждём</b>}
                  </div>
                  <div className="f" style={{ justifySelf: "end", alignSelf: "end" }}>
                    <button className="btn btn-line btn-sm">{r.mine ? "Ход заявки" : "Смотреть отклики"} <Arr s={13} /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>

    </div>
  );
}

/* ---------------- shell ---------------- */
function NewApp() {
  const [scr, setScr] = useState("home");
  const [menu, setMenu] = useState(false);
  const [pubs, setPubs] = useState([]);
  const [flash, setFlash] = useState(null);
  const [cur, setCur] = useState(null);
  const go = k => { setMenu(false); setScr(k); };
  const publish = req => { setPubs(p => [req, ...p]); setFlash(req.t); setCur(req); setScr("reqs"); };
  const openMine = req => { if (!req) return; setCur(req); setScr("track"); };
  const NAVS = [["home", "Главная"], ["reqs", "Заявки"], ["pick", "Исполнители"], ["cat", "Производители"]];
  const MORE = [["exp", "Экспертиза", "2 замечания"], ["norm", "Нормативы", ""], ["msg", "Сообщения", "3"], ["an", "Аналитика рынка", ""], ["trust", "Доверие", "78"], ["price", "Тарифы", ""], ["set", "Настройки", ""]];
  const SCR = {
    home: () => <Home go={go} />,
    reqs: () => <Reqs go={go} pubs={pubs} flash={flash} onFlashOff={() => setFlash(null)} openMine={openMine} />,
    track: () => <SCREENS.ReqTrack go={go} req={cur} />,
    detail: () => <SCREENS.OrderDetail go={go} />, order: () => <SCREENS.OrderCard go={go} />, prof: () => <SCREENS.ProProfile go={go} />,
    pick: () => <SCREENS.Pick go={go} />, solo: () => <SCREENS.SoloProfile go={go} />, cat: () => <SCREENS.Cat />,
    new: () => <SCREENS.OrderNew go={go} onPublish={publish} />, exp: () => <SCREENS.Expertise go={go} />,
    norm: () => <SCREENS.Standards />, msg: () => <SCREENS.Messages />, an: () => <SCREENS.Analytics />,
    trust: () => <SCREENS.Trust />, price: () => <SCREENS.Pricing />, set: () => <SCREENS.Settings />,
    ai: () => <SCREENS.AiPick />,
  };
  return (
    <div className="nd" onClick={() => menu && setMenu(false)}>
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
            </div>
          )}
        </div>
        <span className="spacer" />
        <div className="omni"><Search />Поиск по заявкам и нормативам<kbd>⌘K</kbd></div>
        <button className="btn btn-ink btn-sm" onClick={() => go("new")}>Создать заявку</button>
        <img className="ava" src={IMG["me.jpg"]} alt="" onClick={() => go("set")} style={{ cursor: "pointer" }} />
      </header>
      {(SCR[scr] || SCR.home)()}
    </div>
  );
}

Object.assign(SCREENS, { NewApp });
