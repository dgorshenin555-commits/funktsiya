"use client";

/* Экран варианта Б. Источник: design-handoff-v2/client_work.jsx
   Первоначально импортирован скриптом tools/transform_jsx.py, но это был
   разовый перенос: дальше экран дописывается прямо здесь. Повторно
   генератор не гоняем — он вернёт файл к состоянию выгрузки. */
import * as React from "react";
import { SCREENS } from "./registry";
import { IMG } from "../_assets";
const { useState } = React;

const plural = (n, one, few, many) => {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
  return many;
};
const Arr = ({ s = 14 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>);

/* Заказчик: организация или частное лицо — визитка одна. */
const ME = {
  name: "ООО «Северный дом»", role: "Застройщик · Москва", ini: "СД",
  score: 62, level: "Надёжный", reviews: 7, rate: 4.8,
  stats: [["Объектов", "3"], ["Оплачено", "13,6 млн ₽"], ["Средний срок приёмки", "3 дня"]],
  factors: [["Оплата этапов в срок", 30, 26], ["Приёмка без затягивания", 25, 18], ["Оценки исполнителей", 20, 12], ["Полнота задания", 15, 6], ["Ответы на отклики", 10, 0]],
};

const REVIEWS = [
  ["Бюро «Контур»", "Квартал «Северный»", 5, "Задание внятное, приёмка без затягивания. Оплата пришла на следующий день после акта."],
  ["ИП Соколов А. В.", "Квартал «Северный»", 5, "Отвечали быстро, замечания формулировали по делу."],
  ["ПИ «Мостпроект»", "ЖК «Парк Резиденс»", 4, "По ТЗ пришлось уточнять состав в процессе, но сроки не сдвигали."],
];

/* Заявки в работе. Всё, что глубже, открывается по клику. */
const LIVE = [
  {
    t: "ЖК «Парк Резиденс»", city: "Москва", stage: "Проектная документация",
    due: "до 01.09.2026", prog: 39, todo: 4, ex: 3, secs: "7 разделов",
    money: "3,6 млн ₽ в резерве",
    act: ["Принять раздел АР", "срок истекает через 1 день"],
    rows: [["АР", "Бюро «Контур»", "на приёмке", 100], ["КР", "Бюро «Контур»", "замечания", 80], ["ЭОМ", "ИП Соколов А. В.", "в работе", 45], ["ВК", "ИП Соколов А. В.", "в работе", 30], ["ОВиК", "ПИ «Мостпроект»", "в работе", 15], ["ПОС", "ПИ «Мостпроект»", "не начат", 0], ["СМ", "не назначен", "нет исполнителя", 0]],
  },
  {
    t: "Школа на 550 мест", city: "Калуга", stage: "Подбор исполнителя",
    due: "старт после выбора", prog: 12, todo: 2, ex: 0, secs: "4 раздела",
    money: "бюджет 3,8 млн ₽",
    act: ["Выбрать исполнителя", "4 отклика, заявка висит 8 дней"],
    bids: [
      ["Бюро «Контур»", "СРО · 9 лет · 38 объектов · 5,0", "3 450 000 ₽", "60 дней", "лучший срок"],
      ["ИП Соколов А. В.", "НРС · 12 лет · 24 объекта · 4,8", "3 180 000 ₽", "72 дня", "лучшая цена"],
      ["ПИ «Мостпроект»", "СРО · 18 лет · 140 объектов · 4,4", "3 900 000 ₽", "64 дня", ""],
      ["АБ «Форма»", "СРО · 6 лет · 19 объектов · 4,6", "3 600 000 ₽", "80 дней", ""],
    ],
    rows: [["АР", "не назначен", "нет исполнителя", 0], ["КР", "не назначен", "нет исполнителя", 0], ["ЭОМ", "не назначен", "нет исполнителя", 0], ["ТХ", "не назначен", "состав уточняется", 0]],
  },
];

/* Отработанные — то же, но без задач и с итогом. */
const DONE = [
  { t: "Квартал «Северный»", city: "Химки, МО", stage: "Рабочая документация", end: "сдан 18.12.2025", sum: "12,4 млн ₽", secs: "4 раздела · 327 листов", note: "без просрочки", rows: [["АР", "Бюро «Контур»", "принято", 100], ["КЖ", "Бюро «Контур»", "принято", 100], ["ЭОМ", "ИП Соколов А. В.", "принято", 100], ["ВК", "ИП Соколов А. В.", "принято", 100]] },
  { t: "Офис на Мытной", city: "Москва", stage: "Проектная документация", end: "сдан 04.09.2025", sum: "2,9 млн ₽", secs: "3 раздела · 96 листов", note: "1 замечание экспертизы", rows: [["АР", "Бюро «Контур»", "принято", 100], ["ЭОМ", "ИП Соколов А. В.", "принято", 100], ["ОВиК", "ПИ «Мостпроект»", "принято", 100]] },
];

/* Ближайшие даты по всем объектам — то, что легко пропустить. */
const DATES = [
  ["22.08", "Приёмка АР", "ЖК «Парк Резиденс»", "завтра"],
  ["25.08", "Ответ по КР", "ЖК «Парк Резиденс»", ""],
  ["28.08", "Выбор исполнителя", "Школа на 550 мест", ""],
  ["01.09", "Конец этапа ПД", "ЖК «Парк Резиденс»", ""],
  ["15.09", "Запуск смет", "ЖК «Парк Резиденс»", ""],
];

/* Лента событий: короткая, без фильтров — подробности по клику. */
const FEED = [
  ["Бюро «Контур»", "выгрузило АР v3 — 42 листа", "11:20"],
  ["ИП Соколов А. В.", "задал вопрос по нагрузкам в КР", "вчера"],
  ["ПИ «Мостпроект»", "принял ОВиК в работу", "вчера"],
  ["Платформа", "зарезервировала 3,6 млн ₽ по этапу 2", "19 авг"],
];

const ACTS = [["Создать заявку", "acid"], ["Найти исполнителя", ""], ["Загрузить исходные данные", ""], ["Спросить эксперта", ""]];

const ST = { "на приёмке": "warn", "замечания": "bad", "в работе": "go", "не начат": "idle", "нет исполнителя": "bad", "состав уточняется": "idle", "принято": "ok" };
const NAV = [["work", "Рабочая область"], ["reqs", "Мои заявки"], ["pros", "Исполнители"]];
/* Исполнители, которые уже работают на объектах — для вкладки «Исполнители». */
const PROS = [
  ["Бюро «Контур»", "АР, КР, КЖ", "2 объекта · оценка 5,0", "в работе"],
  ["ИП Соколов А. В.", "ЭОМ, ВК", "3 объекта · оценка 4,8", "в работе"],
  ["ПИ «Мостпроект»", "ОВиК, ПОС", "1 объект · оценка 4,4", "в работе"],
  ["не назначен", "СМ", "Школа на 550 мест · 4 отклика", "нужен выбор"],
];

function Stars({ n }) {
  return <span className="cstars">{[1, 2, 3, 4, 5].map(i => <i key={i} className={i <= n ? "on" : ""} />)}</span>;
}

function ClientWork({ go, cli, onProfile }) {
  /* Данные из короткой анкеты, если её заполнили; иначе демо-визитка. */
  const me = {
    name: (cli && cli.name) || ME.name,
    role: cli && (cli.kind === "solo" ? ["Частный заказчик", cli.city].filter(Boolean).join(" · ") : [cli.name ? "Застройщик" : null, cli.city].filter(Boolean).join(" · ")) || ME.role,
  };
  const [card, setCard] = useState(null);   /* раскрытая панель визитки: rank | rev */
  const [open, setOpen] = useState(null);   /* раскрытая заявка: 'l0', 'd1' */
  const flip = k => setOpen(v => (v === k ? null : k));
  const [tab, setTab] = useState("work");
  const totalTodo = LIVE.reduce((s, r) => s + r.todo, 0);

  return (
    <div className="nd cw">
      <header className="topbar">
        <div className="topbar__l">
          <span className="logo" onClick={() => go && go("home")} style={{ cursor: go ? "pointer" : "default" }}>Функция</span>
          <span className="cw__badge">заказчикам</span>
        </div>
        <nav className="nav">
          {NAV.map(([k, l]) => <button key={k} className={k === tab ? "on" : ""} onClick={() => setTab(k)}>{l}</button>)}
        </nav>
        <div className="topbar__r">
          <button className="cwme" onClick={() => onProfile && onProfile()}>
            <span className="cwme__a"><img src={IMG["me.jpg"]} alt="" /></span>
            <span className="cwme__t"><b>{me.name}</b><em>Профиль и настройки</em></span>
          </button>
        </div>
      </header>

      <div className="scroll">
        <div className={"wrap cw__wrap tab-" + tab}>
          {/* визитка: аватар, рейтинг, отзывы. Подробности — по клику */}
          <section className="cme">
            <div className="cme__ava"><image-slot id="cw-ava" shape="circle" placeholder="Фото"></image-slot></div>
            <div className="cme__b">
              <h1>{me.name}</h1>
              <span className="cme__r">{me.role || ME.role}</span>
            </div>
            <div className="cme__k">
              <button className={"cmk" + (card === "rank" ? " on" : "")} onClick={() => setCard(card === "rank" ? null : "rank")}>
                <span className="lbl">Рейтинг</span>
                <b className="num">{ME.score}<i>/100</i></b>
                <span className="cmk__s">уровень «{ME.level}»</span>
              </button>
              <button className={"cmk" + (card === "rev" ? " on" : "")} onClick={() => setCard(card === "rev" ? null : "rev")}>
                <span className="lbl">Отзывы</span>
                <b className="num">{ME.rate}<i>из 5</i></b>
                <span className="cmk__s">{ME.reviews} {plural(ME.reviews, "отзыв", "отзыва", "отзывов")}</span>
              </button>
              {ME.stats.map(([k, v]) => (
                <div key={k} className="cmk cmk--flat">
                  <span className="lbl">{k}</span>
                  <b className="num">{v}</b>
                </div>
              ))}
            </div>
          </section>

          {card === "rank" && (
            <div className="cpanel">
              <div className="cpanel__h"><b>Из чего собран рейтинг</b><button onClick={() => setCard(null)}>закрыть ✕</button></div>
              <div className="cpanel__f">
                {ME.factors.map(([t, w, got]) => (
                  <div key={t} className="cfac">
                    <span>{t}</span>
                    <i><b style={{ width: (got / w) * 100 + "%" }} /></i>
                    <u className="num">{got} / {w}</u>
                  </div>
                ))}
              </div>
              <span className="cpanel__n">Исполнители видят этот балл в вашей заявке. Просрочка оплаты и затянутая приёмка снимают до 15 баллов.</span>
            </div>
          )}

          {card === "rev" && (
            <div className="cpanel">
              <div className="cpanel__h"><b>Отзывы исполнителей</b><button onClick={() => setCard(null)}>закрыть ✕</button></div>
              <div className="cpanel__rv">
                {REVIEWS.map(([w, o, n, m]) => (
                  <div key={w + o} className="crev">
                    <div className="crev__h"><b>{w}</b><Stars n={n} /><span>{o}</span></div>
                    <p>{m}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* главное действие — крупным блоком, остальное рядом мелким */}
          <div className="cacts">
            <button className="cact cact--hero" onClick={() => go && go("new")}>
              <span className="cact__k">Новая заявка</span>
              <b>Создать заявку</b>
              <span className="cact__s">Опишите объект своими словами — состав разделов подставим по ПП РФ №87</span>
              <i className="cact__go"><Arr s={17} /></i>
            </button>
            <div className="cacts__rest">
              {ACTS.slice(1).map(([t]) => <button key={t} className="cact">{t}<Arr s={12} /></button>)}
            </div>
          </div>
          {/* вкладка «Исполнители» */}
          <div className="cpros">
            <div className="cw__sh"><h2>Исполнители на объектах</h2><span className="cw__sn">{PROS.length - 1} работают · 1 раздел без исполнителя</span></div>
            <div className="cpros__l">
              {PROS.map(([n, s, m, st]) => (
                <div key={n + s} className="cpro">
                  <b>{n}</b>
                  <span className="cpro__s">{s}</span>
                  <span className="cpro__m">{m}</span>
                  <span className={"cst cst--" + (st === "в работе" ? "go" : "bad")}>{st}</span>
                  <button className="btn btn-line btn-sm">{st === "в работе" ? "Открыть" : "Выбрать"}</button>
                </div>
              ))}
            </div>
          </div>

          {/* деньги одной полосой: три числа, детали по клику */}
          <section className="cmoney">
            {[["По договорам", "15,3 млн ₽", "3 объекта"], ["Оплачено", "13,6 млн ₽", "8 этапов"], ["В резерве", "3,6 млн ₽", "ждёт акцепта"]].map(([k, v, s]) => (
              <div key={k}><span className="lbl">{k}</span><b className="num">{v}</b><span>{s}</span></div>
            ))}
            <button className="btn btn-line btn-sm">Этапы и платежи <Arr s={13} /></button>
          </section>

          {/* ближайшие даты */}
          <section className="cw__sec">
            <div className="cw__sh">
              <h2>Ближайшие даты</h2>
              <span className="cw__sn">по всем объектам · 5 событий до 15 сентября</span>
            </div>
            <div className="cdates">
              {DATES.map(([d, t, o, hot]) => (
                <button key={d + t} className={"cdate" + (hot ? " hot" : "")}>
                  <b className="num">{d}</b>
                  <span className="cdate__t">{t}</span>
                  <span className="cdate__o">{o}</span>
                  {hot && <span className="cdate__h">{hot}</span>}
                </button>
              ))}
            </div>
          </section>

          {/* в работе */}
          <section className="cw__sec">
            <div className="cw__sh">
              <h2>В работе</h2>
              <span className="cw__sn">{LIVE.length} {plural(LIVE.length, "заявка", "заявки", "заявок")} · {totalTodo} {plural(totalTodo, "задача", "задачи", "задач")} ждёт решения</span>
            </div>
            <div className="cw__list">
              {LIVE.map((r, i) => {
                const k = "l" + i, isOpen = open === k;
                return (
                  <article key={r.t} className={"citem" + (isOpen ? " open" : "")}>
                    <button className="citem__h" onClick={() => flip(k)}>
                      <span className="citem__t">
                        <b>{r.t}</b>
                        <span>{r.city} · {r.stage} · {r.due}</span>
                      </span>
                      <span className="citem__p">
                        <i><b style={{ width: r.prog + "%" }} /></i>
                        <u className="num">{r.prog}%</u>
                      </span>
                      {r.todo > 0 && <span className="citem__b">{r.todo} {plural(r.todo, "задача", "задачи", "задач")}</span>}
                      <span className="citem__x"><i /></span>
                    </button>
                    <div className="citem__act">
                      <b>{r.act[0]}</b>
                      <span>{r.act[1]}</span>
                      <button className="btn btn-acid btn-sm">Открыть <Arr s={13} /></button>
                    </div>
                    {isOpen && (
                      <div className="citem__d">
                        <div className="citem__m">
                          {[["Разделы", r.secs], ["Исполнители", r.ex === 0 ? "не выбраны" : r.ex + " " + plural(r.ex, "исполнитель", "исполнителя", "исполнителей")], ["Деньги", r.money]].map(([a, b]) => (
                            <div key={a}><span className="lbl">{a}</span><b>{b}</b></div>
                          ))}
                        </div>
                        <div className="ctab">
                          {r.rows.map(([c, ex, st, p]) => (
                            <div key={c} className="ctab__r">
                              <b className="num">{c}</b>
                              <span className={ex === "не назначен" ? "none" : ""}>{ex}</span>
                              <span className={"cst cst--" + ST[st]}>{st}</span>
                              <i><b style={{ width: p + "%" }} /></i>
                              <button className="btn btn-line btn-sm">{st === "на приёмке" ? "Принять" : st === "нет исполнителя" ? "Найти" : "Открыть"}</button>
                            </div>
                          ))}
                        </div>
                        {r.bids && (
                          <div className="cbids">
                            <div className="cbids__h">
                              <b>Отклики · {r.bids.length}</b>
                              <button className="btn btn-line btn-sm">Сравнить все <Arr s={12} /></button>
                            </div>
                            {r.bids.map(([n, note, price, days, best]) => (
                              <div className="cbid" key={n}>
                                <div className="cbid__l"><b>{n}</b><span>{note}</span></div>
                                <div className="cbid__v"><b className="num">{price}</b><span>{days}</span></div>
                                {best ? <span className="cbid__b">{best}</span> : <span />}
                                <div className="cbid__a">
                                  <button className="btn btn-line btn-sm">Профиль</button>
                                  <button className="btn btn-acid btn-sm">Выбрать</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="citem__f">
                          {["Файлы и версии", "Замечания", "Этапы и оплата", "Договор"].map(x => <button key={x} className="btn btn-line btn-sm">{x}</button>)}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>

          {/* отработанные */}
          <section className="cw__sec">
            <div className="cw__sh">
              <h2>Отработанные</h2>
              <span className="cw__sn">{DONE.length} {plural(DONE.length, "заявка", "заявки", "заявок")} · 15,3 млн ₽ по договорам</span>
            </div>
            <div className="cw__list cw__list--done">
              {DONE.map((r, i) => {
                const k = "d" + i, isOpen = open === k;
                return (
                  <article key={r.t} className={"citem citem--done" + (isOpen ? " open" : "")}>
                    <button className="citem__h" onClick={() => flip(k)}>
                      <span className="citem__t">
                        <b>{r.t}</b>
                        <span>{r.city} · {r.stage} · {r.end}</span>
                      </span>
                      <span className="citem__q">{r.note}</span>
                      <b className="citem__s num">{r.sum}</b>
                      <span className="citem__x"><i /></span>
                    </button>
                    {isOpen && (
                      <div className="citem__d">
                        <div className="citem__m">
                          {[["Состав", r.secs], ["Итог", r.sum], ["Результат", r.note]].map(([a, b]) => (
                            <div key={a}><span className="lbl">{a}</span><b>{b}</b></div>
                          ))}
                        </div>
                        <div className="ctab">
                          {r.rows.map(([c, ex, st, p]) => (
                            <div key={c} className="ctab__r">
                              <b className="num">{c}</b>
                              <span>{ex}</span>
                              <span className={"cst cst--" + ST[st]}>{st}</span>
                              <i><b style={{ width: p + "%" }} /></i>
                              <button className="btn btn-line btn-sm">Открыть</button>
                            </div>
                          ))}
                        </div>
                        <div className="citem__f">
                          {["Закрывающие документы", "Архив файлов", "Повторить заявку"].map(x => <button key={x} className="btn btn-line btn-sm">{x}</button>)}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
          {/* лента событий: последнее по объектам */}
          <section className="cw__sec">
            <div className="cw__sh">
              <h2>Последние события</h2>
              <button className="cw__more">вся история <Arr s={12} /></button>
            </div>
            <div className="cfeed">
              {FEED.map(([w, m, d]) => (
                <div key={w + m} className="cfeed__r">
                  <b>{w}</b>
                  <span>{m}</span>
                  <i className="num">{d}</i>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

Object.assign(SCREENS, { ClientWork });
