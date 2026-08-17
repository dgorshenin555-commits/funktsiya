"use client";

/* Экран варианта Б. Источник: design-handoff-v2/new_design_flow.jsx
   Файл сгенерирован из выгрузки Cloud Design — правки вносить в источник. */
import * as React from "react";
import { SCREENS } from "./registry";
const { useState } = React;
const Arr = ({ s = 14 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>);
const Back = () => (<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M13 8H3M7 4L3 8l4 4" /></svg>);
const Chk = ({ s = 11 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5l3.5 3.5L13 4.5" /></svg>);

/* ============ новая заявка ============ */
const TYPES = [
  { k: "Проектирование", d: "Нужен проект: разделы, стадия, сроки" },
  { k: "Экспертиза", d: "Проект готов, нужно заключение" },
  { k: "Обследование", d: "Нужно оценить состояние здания" },
];
const OBJS = [
  { k: "Жилой дом", secs: ["АР", "КЖ", "ОВ", "ВК", "ЭОМ"] },
  { k: "Промышленный объект", secs: ["ТХ", "ОВ", "ЭОМ", "КЖ", "КМ"] },
  { k: "Общественное здание", secs: ["АР", "КЖ", "ОВ", "ВК", "СС"] },
  { k: "Инженерные сети", secs: ["НВК", "ТС", "ЭОМ"] },
];
const ALL_SECS = ["АР", "КЖ", "КМ", "ОВ", "ВК", "НВК", "ЭОМ", "СС", "ТХ", "ТС", "ГП", "АУПТ"];

function OrderNew({ go }) {
  const [st, setSt] = useState(1);
  const [type, setType] = useState("Проектирование");
  const [obj, setObj] = useState(null);
  const [secs, setSecs] = useState([]);
  const rec = OBJS.find(o => o.k === obj);
  const pickObj = o => { setObj(o.k); setSecs(o.secs); };
  const tgl = s => setSecs(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  return (
    <div className="scroll">
      <div className="wrap wiz">
        <button className="back" onClick={() => go("reqs")}><Back /> К заявкам</button>
        <div className="steps">{[1, 2, 3].map(i => <i key={i} className={i <= st ? "on" : ""} />)}</div>

        {st === 1 && (<>
          <h1>Что нужно сделать?</h1>
          <p className="sub">Выберите одну задачу — дальше мы спросим только то, что важно для неё.</p>
          <div className="opts" style={{ marginBottom: 26 }}>
            {TYPES.map(t => (
              <button key={t.k} className={"opt" + (type === t.k ? " on" : "")} onClick={() => setType(t.k)}>
                <b>{t.k}</b><em>{t.d}</em>
              </button>
            ))}
          </div>
          <div className="field">
            <label>Что за объект?</label>
            <div className="opts">
              {OBJS.map(o => <button key={o.k} className={"opt" + (obj === o.k ? " on" : "")} onClick={() => pickObj(o)}><b>{o.k}</b><em>{o.secs.length} типовых раздела</em></button>)}
            </div>
          </div>
        </>)}

        {st === 2 && (<>
          <h1>Уточним состав работ</h1>
          <p className="sub">Мы уже отметили разделы, которые обычно нужны для «{obj || "объекта"}». Уберите лишнее или добавьте своё.</p>
          {rec && (
            <div className="tipbox">
              <span className="lbl">Подсказка</span>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5 }}>Для такого объекта по ПП РФ №87 чаще всего заказывают: {rec.secs.join(", ")}. Если сомневаетесь — оставьте как есть, исполнители уточнят в откликах.</p>
            </div>
          )}
          <div className="field">
            <label>Разделы проекта</label>
            <div className="picks">{ALL_SECS.map(s => <button key={s} className={"pick" + (secs.includes(s) ? " on" : "")} onClick={() => tgl(s)}>{s}</button>)}</div>
            <span className="hint">Выбрано: {secs.length || "ничего"}</span>
          </div>
          <div className="field">
            <label>Где находится объект?</label>
            <input className="inp" defaultValue="Нижний Новгород" />
          </div>
          <div className="field">
            <label>Опишите задачу своими словами</label>
            <textarea className="inp" rows="4" placeholder="Например: реконструкция котельной 4,2 МВт, есть обмеры и техзадание" />
            <span className="hint">Не обязательно. Но с описанием откликов приходит в 2 раза больше.</span>
          </div>
        </>)}

        {st === 3 && (<>
          <h1>Сроки и бюджет</h1>
          <p className="sub">Ориентир можно указать примерно — исполнители предложат свои условия.</p>
          <div className="field">
            <label>Когда нужен результат?</label>
            <div className="picks">{["до 30 дней", "45 дней", "60 дней", "90 дней", "обсудим"].map(s => <button key={s} className={"pick" + (s === "45 дней" ? " on" : "")}>{s}</button>)}</div>
          </div>
          <div className="field">
            <label>Ваш бюджет</label>
            <input className="inp" defaultValue="1 200 000 ₽" />
            <span className="hint">По похожим заявкам ({obj || "объект"}, {secs.length || 4} раздела) обычно платят 950 000 – 1 450 000 ₽.</span>
          </div>
          <div className="box" style={{ marginBottom: 22 }}>
            <h3>Что будет дальше</h3>
            <div style={{ display: "grid", gap: 12 }}>
              <div className="help"><i>1</i><span>Заявка появится в списке — исполнители с СРО увидят её сразу.</span></div>
              <div className="help"><i>2</i><span>Первые отклики обычно приходят в течение 4 часов.</span></div>
              <div className="help"><i>3</i><span>Вы сравните предложения в таблице и выберете исполнителя.</span></div>
            </div>
          </div>
        </>)}

        <div className="wizbar">
          {st > 1 && <button className="btn btn-line" onClick={() => setSt(st - 1)}>Назад</button>}
          {st < 3
            ? <button className="btn btn-ink" onClick={() => setSt(st + 1)} disabled={st === 1 && !obj} style={{ opacity: st === 1 && !obj ? .4 : 1 }}>Дальше <Arr /></button>
            : <button className="btn btn-acid" onClick={() => go("reqs")}>Опубликовать заявку</button>}
          <span className="lbl" style={{ marginLeft: "auto" }}>Шаг {st} из 3</span>
        </div>
      </div>
    </div>
  );
}

/* ============ экспертиза ============ */
const EXP = [
  { s: "done", t: "Проект отправлен", w: "24 июля", d: "Комплект: АР, КЖ, ВК, СС — 148 файлов." },
  { s: "done", t: "Проверка комплектности", w: "26 июля", d: "Замечаний по составу нет, работа принята к рассмотрению." },
  { s: "now", t: "Замечания эксперта — 2", w: "06 августа", d: "КЖ: уточнить расчёт нагрузок на перекрытие. ВК: схема водомерного узла не соответствует СП 30.13330." },
  { s: "next", t: "Повторная подача", w: "до 20 августа", d: "После правок проект уходит на вторую итерацию." },
  { s: "next", t: "Заключение", w: "ориентир 02 сентября", d: "Положительное заключение и печати в личном кабинете." },
];

function Expertise({ go }) {
  return (
    <div className="scroll">
      <div className="wrap page">
        <div className="two">
          <div>
            <div className="page__h">
              <span className="lbl">Экспертиза · 2-я итерация</span>
              <h1>ЖК «Северный», корпус 3</h1>
              <p>Здесь видно, на каком шаге проект и что нужно сделать вам. Шаг, отмеченный ярким кружком, — за вами.</p>
            </div>
            <div className="box">
              <div className="track">
                {EXP.map((e, i) => (
                  <div className={"tstep " + (e.s === "done" ? "done" : e.s === "now" ? "now" : "")} key={e.t}>
                    <span className="bul">{e.s === "done" ? <Chk /> : i + 1}</span>
                    <div><h4>{e.t}</h4><p>{e.d}</p></div>
                    <span className="when">{e.w}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gap: 14 }}>
            <div className="box" style={{ display: "grid", gap: 14 }}>
              <span className="lbl">Ваш шаг</span>
              <h3 style={{ margin: 0 }}>Ответить на 2 замечания</h3>
              <p>Срок — до 20 августа. Загрузите исправленные разделы, ответ эксперту сформируется автоматически.</p>
              <button className="btn btn-acid">Загрузить правки</button>
              <button className="btn btn-line">Обсудить с исполнителем</button>
            </div>
            <div className="box" style={{ display: "grid", gap: 10 }}>
              <span className="lbl">Экспертная организация</span>
              <h3 style={{ margin: 0 }}>ЭЦ «Проектстандарт»</h3>
              <p>Аккредитация · 2 216 заключений.</p>
              <button className="btn btn-line btn-sm" onClick={() => go("pick")}>Профиль организации</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* OrderNew здесь — короткая версия из 3 шагов, заменена полным мастером в new_design_wizard.jsx */
Object.assign(SCREENS, { OrderNewLite: OrderNew, Expertise });
