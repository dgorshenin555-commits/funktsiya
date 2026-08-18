"use client";

/* Экран варианта Б. Источник: design-handoff-v2/new_design_more.jsx
   Первоначально импортирован скриптом tools/transform_jsx.py, но это был
   разовый перенос: дальше экран дописывается прямо здесь. Повторно
   генератор не гоняем — он вернёт файл к состоянию выгрузки. */
import * as React from "react";
import { SCREENS } from "./registry";
const { useState } = React;
const Arr = ({ s = 14 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>);
const Search = ({ s = 15 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="7" cy="7" r="4.4" /><path d="M10.4 10.4L14 14" /></svg>);

/* ============ нормативы ============ */
const DOCS = [
  { c: "СП", n: "СП 30.13330.2020", t: "Внутренний водопровод и канализация зданий", st: "действует", ed: "ред. 2023", secs: "ВК" },
  { c: "СП", n: "СП 60.13330.2020", t: "Отопление, вентиляция и кондиционирование", st: "действует", ed: "ред. 2024", secs: "ОВ" },
  { c: "СП", n: "СП 63.13330.2018", t: "Бетонные и железобетонные конструкции", st: "действует", ed: "ред. 2022", secs: "КЖ" },
  { c: "ГОСТ", n: "ГОСТ 21.501-2018", t: "Правила выполнения рабочей документации АР и КЖ", st: "действует", ed: "ред. 2018", secs: "АР · КЖ" },
  { c: "ПП", n: "ПП РФ №87", t: "Состав разделов проектной документации", st: "действует", ed: "ред. 2025", secs: "все" },
  { c: "СП", n: "СП 52.13330.2016", t: "Естественное и искусственное освещение", st: "заменён", ed: "см. СП 52.13330.2025", secs: "ЭОМ" },
];
const D_CATS = ["Все", "ВК", "ОВ", "КЖ", "АР", "ЭОМ"];

function Standards() {
  const [c, setC] = useState("Все");
  const [doc, setDoc] = useState(null);
  const list = DOCS.filter(d => c === "Все" || d.secs.includes(c));
  return (
    <div className="scroll">
      <div className="wrap page">
        <div className="page__h">
          <span className="lbl">База знаний</span>
          <h1>Нормативы</h1>
          <p>Только актуальные редакции. Если документ заменён — мы сразу показываем, чем именно.</p>
        </div>
        <div className="chips">
          {D_CATS.map(t => <button key={t} className={"chip" + (c === t ? " on" : "")} onClick={() => setC(t)}>{t}</button>)}
          <span className="spacer" />
          <div className="omni" style={{ maxWidth: 320 }}><Search />Номер или тема документа</div>
        </div>
        <div className="docs">
          {list.map(d => (
            <div className="doc" key={d.n} onClick={() => setDoc(d)}>
              <span className="doc__c">{d.c}</span>
              <div>
                <h4>{d.n}</h4>
                <p>{d.t}</p>
              </div>
              <div className="row g12">
                <span className="tag solid">{d.secs}</span>
                <span className={"badge " + (d.st === "действует" ? "ok" : "old")}>{d.st === "действует" ? d.ed : "заменён"}</span>
                <button className="btn btn-line btn-sm">Открыть</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {doc && (
        <div className="drawer" onClick={() => setDoc(null)}>
          <div className="drawer__p" onClick={e => e.stopPropagation()}>
            <div className="drawer__h">
              <div>
                <span className="lbl">{doc.c} · {doc.ed}</span>
                <h2 style={{ marginTop: 8 }}>{doc.n}</h2>
                <p className="mut" style={{ margin: 0, fontSize: 14 }}>{doc.t}</p>
              </div>
              <button className="close" onClick={() => setDoc(null)}>✕</button>
            </div>
            <div className="drawer__b">
              <div className="box" style={{ display: "grid", gap: 10 }}>
                <span className="lbl">Коротко о главном</span>
                <p>Документ {doc.st === "действует" ? "действует" : "заменён — см. новую редакцию"}, относится к разделам {doc.secs}. В заявках встречается чаще всего в требованиях к составу проекта.</p>
              </div>
              <div>
                <h3 style={{ fontFamily: "var(--fd)", fontWeight: 500, fontSize: 18, letterSpacing: "-.03em", margin: "0 0 12px" }}>На что смотреть в первую очередь</h3>
                <div className="box">
                  {[["Раздел 5", "Требования к расчёту и исходным данным"], ["Раздел 7", "Оборудование и материалы: допустимые решения"], ["Приложение А", "Формы и примеры оформления"]].map(([a, b]) => (
                    <div className="set-row" key={a}><div><h4>{a}</h4><p>{b}</p></div><button className="btn btn-line btn-sm">К тексту</button></div>
                  ))}
                </div>
              </div>
              <div className="row g12" style={{ flexWrap: "wrap" }}>
                <button className="btn btn-ink">Открыть документ</button>
                <button className="btn btn-line">В избранное</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============ сообщения ============ */
const THREADS = [
  { n: "ТС", who: "ООО «Техносфера»", last: "Готовы начать с 15 августа, обмеры есть", on: true, w: "12:40" },
  { n: "ЭЦ", who: "ЭЦ «Проектстандарт»", last: "Замечания по КЖ во вложении", w: "вчера" },
  { n: "ИГ", who: "ИнжГрупп", last: "Уточните мощность ввода", w: "08 авг" },
];
const MSGS = [
  { t: "Здравствуйте! Посмотрели заявку по котельной — готовы взяться. Уточните, есть ли обмерные чертежи?", w: "11:58" },
  { me: true, t: "Добрый день. Обмеры есть, приложил в заявку. Интересует срок и стоимость по разделам ОВ и ЭОМ.", w: "12:12" },
  { t: "По ОВ и ЭОМ — 42 дня, 1 150 000 ₽ вместе с согласованием. Готовы начать с 15 августа.", w: "12:40" },
];

function Messages() {
  const [i, setI] = useState(0);
  const [call, setCall] = useState(false);
  return (
    <div className="scroll">
      <div className="wrap page">
        <div className="page__h">
          <span className="lbl">Общение</span>
          <h1>Сообщения</h1>
          <p>Вся переписка по заявке — в одном месте, вместе с файлами и договорённостями.</p>
        </div>
        <div className="chat">
          <div className="clist">
            {THREADS.map((t, k) => (
              <div className={"crow" + (k === i ? " on" : "")} key={t.n} onClick={() => setI(k)}>
                <div className="pini num" style={{ width: 36, height: 36, flex: "0 0 36px", borderRadius: 11, fontSize: 13 }}>{t.n}</div>
                <div style={{ minWidth: 0 }}>
                  <h4>{t.who}</h4>
                  <p>{t.last}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="cbody">
            <div className="cbody__h">
              <div className="pini num" style={{ width: 34, height: 34, flex: "0 0 34px", borderRadius: 10, fontSize: 12 }}>{THREADS[i].n}</div>
              <div><h4 style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>{THREADS[i].who}</h4><span className="lbl">по заявке · котельная 4,2 МВт</span></div>
              <span className="spacer" />
              <button className="btn btn-line btn-sm" onClick={() => setCall(true)}>Видеозвонок</button>
            </div>
            <div className="msgs">
              {MSGS.map(m => <div className={"msg" + (m.me ? " me" : "")} key={m.t}>{m.t}<span>{m.w}</span></div>)}
            </div>
            <div className="cin">
              <input className="inp" style={{ height: 44 }} placeholder="Написать сообщение…" />
              <button className="btn btn-ink">Отправить</button>
            </div>
          </div>
        </div>
      </div>
      {call && <SCREENS.Call who={THREADS[i].who} onEnd={() => setCall(false)} />}
    </div>
  );
}

/* ============ тарифы ============ */
const PLANS = [
  { t: "Заказчик", p: "0 ₽", s: "навсегда", f: ["Публикация заявок без лимита", "Отклики и сравнение исполнителей", "Переписка и файлы", "Нормативы"], b: "Уже включено", line: true },
  { t: "Исполнитель", p: "4 900 ₽", s: "в месяц", f: ["Доступ ко всем заявкам", "Отклики без ограничений", "Бейдж проверенного исполнителя", "Профиль в каталоге"], b: "Подключить", hot: true },
  { t: "Компания", p: "по договору", s: "от 10 сотрудников", f: ["Команда и роли", "Свои шаблоны заявок", "Интеграции и API", "Персональный менеджер"], b: "Обсудить" },
];

function Pricing() {
  return (
    <div className="scroll">
      <div className="wrap page">
        <div className="page__h">
          <span className="lbl">Аккаунт</span>
          <h1>Тарифы</h1>
          <p>Заказчикам платформа бесплатна. Платят только исполнители — за доступ к заявкам.</p>
        </div>
        <div className="plans">
          {PLANS.map(p => (
            <div className={"plan" + (p.hot ? " hot" : "")} key={p.t}>
              <span className="lbl">{p.t}</span>
              <div><b className="p">{p.p}</b><div className="lbl" style={{ marginTop: 6 }}>{p.s}</div></div>
              <ul>{p.f.map(f => <li key={f}>{f}</li>)}</ul>
              <button className={"btn " + (p.hot ? "btn-acid" : "btn-line")} disabled={p.line} style={{ opacity: p.line ? .5 : 1 }}>{p.b}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============ настройки ============ */
function Settings() {
  const [sw, setSw] = useState({ mail: true, push: true, digest: false, public: true });
  const t = k => setSw(p => ({ ...p, [k]: !p[k] }));
  const ROWS = [
    ["mail", "Письма о новых откликах", "Сразу, как исполнитель отвечает на заявку"],
    ["push", "Напоминания о сроках", "За 3 дня до срока по заявке или экспертизе"],
    ["digest", "Сводка за неделю", "Одно письмо по понедельникам"],
    ["public", "Показывать профиль в каталоге", "Заказчики смогут найти вас и пригласить в заявку"],
  ];
  return (
    <div className="scroll">
      <div className="wrap page">
        <div className="two">
          <div>
            <div className="page__h">
              <span className="lbl">Аккаунт</span>
              <h1>Настройки</h1>
              <p>Всё в одном списке — без вложенных меню.</p>
            </div>
            <div className="box" style={{ marginBottom: 14 }}>
              <h3>Профиль</h3>
              <div className="field"><label>Организация</label><input className="inp" defaultValue="ООО «Техносфера»" /></div>
              <div className="field"><label>Контактное лицо</label><input className="inp" defaultValue="Андрей Кузнецов" /></div>
              <div className="field" style={{ marginBottom: 0 }}><label>Телефон</label><input className="inp" defaultValue="+7 831 200-14-08" /></div>
            </div>
            <div className="box">
              <h3>Уведомления и видимость</h3>
              {ROWS.map(([k, t1, d]) => (
                <div className="set-row" key={k}>
                  <div><h4>{t1}</h4><p>{d}</p></div>
                  <button className={"sw" + (sw[k] ? " on" : "")} onClick={() => t(k)} aria-label={t1} />
                </div>
              ))}
            </div>
          </div>
          <div className="box" style={{ display: "grid", gap: 12 }}>
            <span className="lbl">Нужна помощь?</span>
            <h3 style={{ margin: 0 }}>Поможем оформить первую заявку</h3>
            <p>Позвоним, разберём задачу и подскажем состав разделов — бесплатно.</p>
            <button className="btn btn-ink">Запросить звонок <Arr /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(SCREENS, { Standards, Messages, Pricing, Settings });
