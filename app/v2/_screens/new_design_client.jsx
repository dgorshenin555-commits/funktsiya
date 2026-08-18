"use client";

/* Экран варианта Б. Источник: design-handoff-v2/new_design_client.jsx
   Первоначально импортирован скриптом tools/transform_jsx.py, но это был
   разовый перенос: дальше экран дописывается прямо здесь. Повторно
   генератор не гоняем — он вернёт файл к состоянию выгрузки. */
import * as React from "react";
import { SCREENS } from "./registry";
const { useState } = React;
const S = (p, s = 16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{p}</svg>);
const IC = {
  check: s => S(<path d="M4 12.5l5 5L20 6.5" />, s),
  building: s => S(<><path d="M4 21V5a1 1 0 011-1h8a1 1 0 011 1v16" /><path d="M14 10h5a1 1 0 011 1v10" /><path d="M7 8h4M7 12h4M7 16h4" /><path d="M2 21h20" /></>, s),
  user: s => S(<><circle cx="12" cy="8" r="3.6" /><path d="M4.5 20c1.4-3.6 4.2-5.2 7.5-5.2s6.1 1.6 7.5 5.2" /></>, s),
  layers: s => S(<><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 13l9 5 9-5" /></>, s),
  pin: s => S(<><path d="M12 22s7-6.1 7-11a7 7 0 10-14 0c0 4.9 7 11 7 11z" /><circle cx="12" cy="11" r="2.6" /></>, s),
  wallet: s => S(<><rect x="3" y="6" width="18" height="13" rx="2.5" /><path d="M3 10h18" /><circle cx="17" cy="14.5" r="1.2" /></>, s),
  shield: s => S(<><path d="M12 3l8 3v6c0 5-3.6 8.2-8 9-4.4-.8-8-4-8-9V6l8-3z" /><path d="M8.6 12.2l2.4 2.4 4.4-4.6" /></>, s),
  spark: s => S(<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />, s),
  file: s => S(<><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" /><path d="M14 3v5h5" /></>, s),
};
const Icon = ({ name, size = 16 }) => (IC[name] ? IC[name](size) : null);
const Arr = ({ s = 14 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>);
const Mark = ({ s = 28 }) => (<svg width={s} height={s} viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="#14161A" /><path d="M13 28V12h14M13 20h10" stroke="#C9F24A" strokeWidth="2.6" strokeLinecap="square" /></svg>);

const STEPS = ["Кто заказчик", "Объекты", "Задачи", "Процесс", "Контакты"];
const WHO = [
  ["Застройщик / инвестор", "building", "Ведём объекты и нанимаем проектировщиков"],
  ["Генподрядчик", "layers", "Нужны разделы и субподряд под договор"],
  ["Частный заказчик", "user", "Дом, участок, реконструкция"],
];
const OBJECTS = ["Коммерческая недвижимость", "Жилая недвижимость", "Промышленность", "Линейные объекты", "Здания и сооружения", "Частное строительство"];
const TASKS = [
  ["Проектирование", "разделы ПД и РД"],
  ["Экспертиза", "прохождение и ответы на замечания"],
  ["Обследование", "обмеры и техническое состояние"],
  ["Авторский надзор", "сопровождение стройки"],
];
const VOLUME = ["1–2 объекта в год", "3–6 объектов", "7–15 объектов", "больше 15"];
const BUDGET = ["до 1 млн ₽", "1–5 млн ₽", "5–15 млн ₽", "больше 15 млн ₽"];
const PAY = ["Эскроу по этапам", "Постоплата по акту", "Смешанно"];
const NEEDS = [["Проверенные СРО и НРС", 1], ["Договор и акты в платформе", 1], ["Резерв средств по этапам", 1], ["Тендер среди 3+ исполнителей", 1], ["Ведение замечаний экспертизы", 1], ["Хранилище файлов и версий", 1]];
const AFTER = [
  ["Опишете объект", "тип, регион, стадия — состав разделов подставим по ПП РФ №87"],
  ["Получите отклики", "цена, срок и покрытие разделов в одной таблице"],
  ["Выберете исполнителя", "по индексу доверия и подтверждённым допускам"],
  ["Оплатите по этапам", "средства резервируются и уходят после приёмки"],
];

function Client() {
  /* экран 1 — вход, экран 2 — анкета */
  const [screen, setScreen] = useState("reg");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [agree, setAgree] = useState(true);

  const [step, setStep] = useState(0);
  const [who, setWho] = useState("Застройщик / инвестор");
  const [org, setOrg] = useState("");
  const [region, setRegion] = useState("Москва");
  const [objs, setObjs] = useState(["Коммерческая недвижимость"]);
  const [tasks, setTasks] = useState(["Проектирование"]);
  const [vol, setVol] = useState("3–6 объектов");
  const [budget, setBudget] = useState("5–15 млн ₽");
  const [pay, setPay] = useState("Эскроу по этапам");
  const [needs, setNeeds] = useState(["Проверенные СРО и НРС", "Резерв средств по этапам"]);
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const tgl = (set, arr, v) => set(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);
  const done = [who, objs.length, tasks.length, pay, name.trim() && mail.trim()].filter(Boolean).length;
  const last = step === STEPS.length - 1;
  /* оценка подходящих исполнителей по профилю заказчика */
  const pros = Math.max(12, 48 + objs.length * 34 + tasks.length * 26 + needs.length * 8);

  return (
    <div className="nd">
      <header className="topbar">
        <div className="mark"><Mark s={28} /><b>Функция</b></div>
        <span className="spacer" />
        <div className="seg">
          <button className={screen === "reg" ? "on" : ""} onClick={() => setScreen("reg")}>1 · Регистрация</button>
          <button className={screen === "form" ? "on" : ""} onClick={() => setScreen("form")}>2 · Анкета</button>
        </div>
        <a className="btn btn-line btn-sm" href="Функция (новый дизайн).html">На платформу</a>
      </header>

      <div className="scroll">
        {screen === "reg" && (
          <div className="wrap wiz5 fade">
            <div className="wiz5__h">
              <span className="lbl">Регистрация заказчика</span>
              <h1>Разместите заявку — исполнители придут сами</h1>
              <p>Один шаг — номер телефона. Объекты, задачи и процесс работы заполним после входа: платформа подскажет состав разделов по ПП РФ №87.</p>
            </div>

            <div className="lreg">
              <div className="lreg__l">
                <span className="lbl">Шаг 1 из 1 · вход на платформу</span>
                <h2>Зарегистрируйтесь по номеру телефона</h2>
                <p>Отправим СМС с кодом подтверждения. Рекламу не присылаем, номер исполнителям не показываем — переписка идёт внутри платформы.</p>

                {!sent ? (<>
                  <div className="lreg__f">
                    <div className="lphone">
                      <span className="lphone__c">RU +7</span>
                      <input className="inp num" placeholder="900 000-00-00" value={phone} onChange={e => setPhone(e.target.value)} />
                    </div>
                    <button className="btn btn-ink btn-lg" onClick={() => setSent(true)}>Получить код</button>
                  </div>
                  <label className="lagree">
                    <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
                    <i />
                    <span>Согласен с условиями платформы и обработкой персональных данных</span>
                  </label>
                </>) : (<>
                  <div className="lcode">
                    <span className="lbl">Код из СМС на +7 {phone || "900 000-00-00"}</span>
                    <div className="lcode__r">
                      {[0, 1, 2, 3].map(i => (
                        <input key={i} className="lcode__i num" maxLength="1" value={code[i] || ""} onChange={ev => {
                          const v = ev.target.value.replace(/\D/g, "");
                          const next = code.split(""); next[i] = v.slice(-1) || ""; setCode(next.join(""));
                          const box = ev.target.parentNode.children[i + 1];
                          if (v && box) box.focus();
                        }} />
                      ))}
                    </div>
                    <div className="lcode__a">
                      <button className="btn btn-line btn-sm" onClick={() => setSent(false)}>Изменить номер</button>
                      <span className="lbl">отправить код повторно через 42 с</span>
                    </div>
                  </div>
                  <button className="btn btn-acid btn-lg lcode__go" onClick={() => setScreen("form")}>Войти и заполнить анкету <Arr /></button>
                </>)}

                <div className="lalt">
                  <span className="lbl">Или войдите через</span>
                  <div className="lalt__r">{["Госуслуги", "СБИС", "Почта"].map(v => <button key={v} className="lalt__b">{v}</button>)}</div>
                </div>
              </div>

              <div className="lreg__r">
                <span className="lbl">Что будет после входа</span>
                <div className="lafter">
                  {AFTER.map(([t, d], i) => (
                    <div className="lafter__i" key={t}><b className="num">{i + 1}</b><div><span className="lafter__t">{t}</span><span className="lafter__d">{d}</span></div></div>
                  ))}
                </div>
                <div className="lqr"><span className="cl__stat num">1 240</span><span>исполнителей с подтверждёнными СРО и НРС готовы взяться за ваш объект</span></div>
              </div>
            </div>
          </div>
        )}

        {screen === "form" && (
          <div className="wrap wiz5 fade">
            <div className="wiz5__h">
              <span className="lbl">Анкета заказчика</span>
              <h1>Расскажите об объектах и задачах</h1>
              <p>Пять шагов. По ним платформа подберёт исполнителей с нужными разделами и допусками — и предзаполнит вашу первую заявку.</p>
            </div>

            <div className="stepper">
              {STEPS.map((s, i) => (
                <button key={s} className={"stepper__i" + (i === step ? " on" : "") + (i < step ? " done" : "")} onClick={() => setStep(i)}>
                  <span className="stepper__n">{i < step ? <Icon name="check" size={13} /> : i + 1}</span>
                  <span className="stepper__l">{s}</span>
                </button>
              ))}
            </div>

            <div className="wiz5__grid">
              <div className="box wiz5__form">
                {step === 0 && (<div className="fade">
                  <div className="field">
                    <label>Кто вы</label>
                    <div className="selcards">
                      {WHO.map(([t, ic, d]) => (
                        <button type="button" key={t} className={"selcard" + (t === who ? " on" : "")} onClick={() => setWho(t)}>
                          <span className="selcard__ic"><Icon name={ic} size={19} /></span>
                          <b>{t}</b><em>{d}</em>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="field">
                    <label>Организация или ИНН</label>
                    <input className="inp" placeholder="ООО «СтройИнвест» или 7700000000" value={org} onChange={e => setOrg(e.target.value)} />
                  </div>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label>Регион объектов</label>
                    <input className="inp" value={region} onChange={e => setRegion(e.target.value)} />
                  </div>
                  <div className="noteline ok" style={{ marginTop: 18 }}>
                    <span className="noteline__ic"><Icon name="shield" size={17} /></span>
                    <p><b>Реквизиты не публикуем.</b> Исполнители видят тип заказчика и регион; ИНН нужен для договора и закрывающих документов.</p>
                  </div>
                </div>)}

                {step === 1 && (<div className="fade">
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label>Типы объектов <span className="lbl">выбрано {objs.length}</span></label>
                    <div className="picks">
                      {OBJECTS.map(o => <button key={o} type="button" className={"pick" + (objs.includes(o) ? " on" : "")} onClick={() => tgl(setObjs, objs, o)}>{o}</button>)}
                    </div>
                  </div>
                  <div className="field" style={{ marginTop: 20, marginBottom: 0 }}>
                    <label>Сколько объектов в год</label>
                    <div className="picks">{VOLUME.map(v => <button key={v} type="button" className={"pick" + (vol === v ? " on" : "")} onClick={() => setVol(v)}>{v}</button>)}</div>
                  </div>
                  <div className="asst" style={{ marginTop: 20, marginBottom: 0 }}>
                    <span className="asst__ic"><Icon name="spark" size={18} /></span>
                    <div>
                      <span className="lbl">Помощник</span>
                      <p>По выбранным типам объектов подберём исполнителей с опытом именно в этой категории — и подставим типовой состав разделов в заявку.</p>
                    </div>
                  </div>
                </div>)}

                {step === 2 && (<div className="fade">
                  <div className="field">
                    <label>Какие работы заказываете</label>
                    <div className="seclist">
                      {TASKS.map(([t, d]) => (
                        <button key={t} type="button" className={"secitem" + (tasks.includes(t) ? " on" : "")} onClick={() => tgl(setTasks, tasks, t)}>
                          <span className="secitem__c">{t.slice(0, 2).toUpperCase()}</span>
                          <span className="secitem__n">{t} · {d}</span>
                          <span className="secitem__k"><Icon name="check" size={12} /></span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label>Бюджет одной заявки</label>
                    <div className="picks">{BUDGET.map(b => <button key={b} type="button" className={"pick" + (budget === b ? " on" : "")} onClick={() => setBudget(b)}>{b}</button>)}</div>
                  </div>
                </div>)}

                {step === 3 && (<div className="fade">
                  <div className="field">
                    <label>Как удобно платить</label>
                    <div className="picks">{PAY.map(p => <button key={p} type="button" className={"pick" + (pay === p ? " on" : "")} onClick={() => setPay(p)}>{p}</button>)}</div>
                  </div>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label>Что важно в работе</label>
                    <div className="seclist">
                      {NEEDS.map(([t]) => (
                        <button key={t} type="button" className={"secitem" + (needs.includes(t) ? " on" : "")} onClick={() => tgl(setNeeds, needs, t)}>
                          <span className="secitem__c">·</span>
                          <span className="secitem__n">{t}</span>
                          <span className="secitem__k"><Icon name="check" size={12} /></span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="noteline" style={{ marginTop: 18 }}>
                    <span className="noteline__ic"><Icon name="wallet" size={17} /></span>
                    <p><b>Эскроу по этапам.</b> Сумма этапа резервируется до старта и уходит исполнителю после вашей приёмки раздела.</p>
                  </div>
                </div>)}

                {step === 4 && (<div className="fade">
                  <div className="field">
                    <label>Контактное лицо</label>
                    <input className="inp" placeholder="Иванов Пётр Сергеевич" value={name} onChange={e => setName(e.target.value)} />
                  </div>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label>Рабочая почта</label>
                    <input className="inp" placeholder="mail@company.ru" value={mail} onChange={e => setMail(e.target.value)} />
                  </div>
                  <div className="noteline ok" style={{ marginTop: 18 }}>
                    <span className="noteline__ic"><Icon name="file" size={17} /></span>
                    <p><b>Что дальше.</b> Откроем рабочее место заказчика и предзаполним первую заявку по вашим типам объектов — останется указать объект и срок.</p>
                  </div>
                </div>)}

                <div className="wizbar">
                  <button className="btn btn-line" disabled={step === 0} style={{ opacity: step === 0 ? .4 : 1 }} onClick={() => setStep(s => Math.max(0, s - 1))}>Назад</button>
                  {last
                    ? <a className="btn btn-acid" href="Функция (новый дизайн).html">Создать первую заявку</a>
                    : <button className="btn btn-ink" onClick={() => setStep(s => s + 1)}>Далее <Arr /></button>}
                  <span className="lbl" style={{ marginLeft: "auto" }}>Шаг {step + 1} из {STEPS.length}</span>
                </div>
              </div>

              <aside className="pv">
                <div className="pv__h">
                  <span className="lbl">Ваш профиль заказчика</span>
                  <span className="pv__cnt num">{done}<span>/5</span></span>
                </div>
                <div className="pv__cover">
                  <span className="pv__stage num">{pros}</span>
                  <span className="pv__type">подходящих исполнителей</span>
                </div>
                <h3>{org.trim() || "Ваша организация"}</h3>
                <div className="pv__sub">{who} · {region || "регион не указан"} · {vol}</div>
                <div className="pv__rows">
                  <div className="pv__row"><span className="pv__ic"><Icon name="building" size={15} /></span><div style={{ minWidth: 0, flex: 1 }}><div className="pv__k">Объекты</div><div className="pv__v">{objs.length ? objs.join(", ") : "не выбраны"}</div></div></div>
                  <div className="pv__row"><span className="pv__ic"><Icon name="layers" size={15} /></span><div style={{ minWidth: 0, flex: 1 }}><div className="pv__k">Работы</div><div className="pv__v">{tasks.length ? tasks.join(", ") : "не выбраны"}</div></div></div>
                  <div className="pv__row"><span className="pv__ic"><Icon name="shield" size={15} /></span><div style={{ minWidth: 0, flex: 1 }}><div className="pv__k">Важно</div><div className="pv__v">{needs.length ? needs.length + " условия" : "не отмечено"}</div></div></div>
                  <div className="pv__row"><span className="pv__ic"><Icon name="pin" size={15} /></span><div style={{ minWidth: 0, flex: 1 }}><div className="pv__k">Расчёты</div><div className="pv__v">{pay}</div></div></div>
                </div>
                <div className="pv__price"><span className="pv__sum num"><Icon name="wallet" size={17} />{budget}</span></div>
              </aside>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(SCREENS, { Client });
