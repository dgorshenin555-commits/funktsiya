"use client";

/* Экран варианта Б. Источник: design-handoff-v2/new_design_signup.jsx
   Первоначально импортирован скриптом tools/transform_jsx.py, но это был
   разовый перенос: дальше экран дописывается прямо здесь. Повторно
   генератор не гоняем — он вернёт файл к состоянию выгрузки. */
import * as React from "react";
import { SCREENS } from "./registry";
const { useState } = React;
const S = (p, s = 16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{p}</svg>);
const IC = {
  check: s => S(<path d="M4 12.5l5 5L20 6.5" />, s),
  user: s => S(<><circle cx="12" cy="8" r="3.6" /><path d="M4.5 20c1.4-3.6 4.2-5.2 7.5-5.2s6.1 1.6 7.5 5.2" /></>, s),
  shield: s => S(<><path d="M12 3l8 3v6c0 5-3.6 8.2-8 9-4.4-.8-8-4-8-9V6l8-3z" /><path d="M8.6 12.2l2.4 2.4 4.4-4.6" /></>, s),
  pin: s => S(<><path d="M12 22s7-6.1 7-11a7 7 0 10-14 0c0 4.9 7 11 7 11z" /><circle cx="12" cy="11" r="2.6" /></>, s),
  layers: s => S(<><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 13l9 5 9-5" /></>, s),
  wallet: s => S(<><rect x="3" y="6" width="18" height="13" rx="2.5" /><path d="M3 10h18" /><circle cx="17" cy="14.5" r="1.2" /></>, s),
  file: s => S(<><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" /><path d="M14 3v5h5" /></>, s),
  spark: s => S(<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />, s),
  mail: s => S(<><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M3.5 7l8.5 6 8.5-6" /></>, s),
};
const Icon = ({ name, size = 16 }) => (IC[name] ? IC[name](size) : null);
const Arr = ({ s = 14 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>);

const STEPS = ["Кто вы", "Направление", "Разделы", "Опыт и допуски", "Работа и цена", "Контакты"];
const WHO = [
  ["Частный специалист", "user", "Работаю сам, договор через платформу"],
  ["Команда", "layers", "Небольшая группа под задачи заказчика"],
  ["Организация", "shield", "Юрлицо со штатом и членством в СРО"],
];
const DIRS = [
  ["Проектировщик", "Разделы ПД и РД под подпись ГИПа", "#C9F24A", "#14161A"],
  ["Эксперт", "Замечания и заключения по документации", "#2440E8", "#F1EFE9"],
  ["Чертёжник", "Выпуск чертежей и BIM-моделей", "#6E3AD6", "#F1EFE9"],
  ["Обследователь", "Обмеры и оценка техсостояния объекта", "#DC5A2A", "#F1EFE9"],
];
const PROOFS = [
  ["Членство в СРО", "выписка из реестра", 18],
  ["НРС — реестр специалистов", "номер и подтверждение", 16],
  ["Диплом профильного вуза", "скан документа", 10],
  ["Аттестация эксперта", "область аттестации", 14],
  ["Страхование ответственности", "полис", 8],
  ["Портфолио объектов", "3+ реализованных проекта", 12],
];
const LOADS = ["Полная загрузка", "Частичная", "Разовые задачи"];
const FORMATS = ["Удалённо", "Выезд на объект", "Гибрид"];
const RATES = ["до 1 500 ₽/ч", "1 500–2 500 ₽/ч", "2 500–4 000 ₽/ч", "от 4 000 ₽/ч", "по проекту"];

function Signup() {
  const R = SCREENS.REQ_FORM || {};
  const TREE = R.STAGE_TREE || [];
  const [step, setStep] = useState(0);
  const [who, setWho] = useState("Частный специалист");
  const [dirs, setDirs] = useState(["Проектировщик"]);
  const [stages, setStages] = useState(["П"]);
  const [secs, setSecs] = useState(["АР", "КР"]);
  const [yrs, setYrs] = useState(8);
  const [proofs, setProofs] = useState(["НРС — реестр специалистов", "Диплом профильного вуза"]);
  const [load, setLoad] = useState("Частичная");
  const [fmt, setFmt] = useState("Гибрид");
  const [rate, setRate] = useState("1 500–2 500 ₽/ч");
  const [region, setRegion] = useState("Москва");
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [phone, setPhone] = useState("");
  const tgl = (set, arr, v) => set(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);

  const stageSecs = [...new Set(TREE.filter(s => stages.includes(s.code)).flatMap(s => s.secs.map(x => x[0])))];
  const secTitle = {};
  TREE.forEach(s => s.secs.forEach(([c, n]) => { if (!secTitle[c]) secTitle[c] = n; }));
  /* индекс доверия собирается из заполненности профиля — так его видит заказчик */
  const trust = Math.min(98, 34 + proofs.reduce((a, p) => a + (PROOFS.find(x => x[0] === p) || [0, 0, 0])[2], 0) + Math.min(14, Math.round(yrs * 1.1)) + (secs.length ? 6 : 0) + (name.trim() ? 4 : 0));
  const level = trust >= 90 ? "Эталон" : trust >= 78 ? "Надёжный" : trust >= 60 ? "Проверен" : "Заполняется";
  const done = [who, dirs.length, secs.length, proofs.length, rate, name.trim() && mail.trim()].filter(Boolean).length;
  const last = step === STEPS.length - 1;

  return (
    <div className="nd">
      <header className="topbar">
        <div className="mark">
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="#14161A" /><path d="M13 28V12h14M13 20h10" stroke="#C9F24A" strokeWidth="2.6" strokeLinecap="square" /></svg>
          <b>Функция</b>
        </div>
        <span className="spacer" />
        <span className="lbl">Анкета исполнителя · бесплатно</span>
        <a className="btn btn-line btn-sm" href="Функция (новый дизайн).html">На платформу</a>
      </header>

      <div className="scroll">
        <div className="wrap wiz5">
          <div className="wiz5__h">
            <span className="lbl">Регистрация исполнителя</span>
            <h1>Заполните анкету — заказчики найдут вас сами</h1>
            <p>Шесть коротких шагов. Чем больше подтверждений, тем выше индекс доверия и место в подборе по разделам. Проверка занимает до одного рабочего дня.</p>
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
                  <label>Как вы работаете</label>
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
                  <label>Регион работы</label>
                  <input className="inp" value={region} onChange={e => setRegion(e.target.value)} />
                </div>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label>Опыт в проектировании — {yrs} лет</label>
                  <input className="rng" type="range" min="0" max="30" value={yrs} onChange={e => setYrs(+e.target.value)} />
                </div>
                <div className="noteline ok" style={{ marginTop: 18 }}>
                  <span className="noteline__ic"><Icon name="shield" size={17} /></span>
                  <p><b>Данные проверяются.</b> Мы сверяем СРО и НРС по открытым реестрам — заказчик видит подтверждённый профиль, а не обещания.</p>
                </div>
              </div>)}

              {step === 1 && (<div className="fade">
                <div className="sec-h" style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 14, fontWeight: 500 }}>Направления работы</label>
                  <span className="lbl">выбрано {dirs.length} из 4</span>
                </div>
                <div className="dircards dircards--light">
                  {DIRS.map(([d, hint, c, ct]) => (
                    <button key={d} style={{ "--c": c, "--ct": ct }} className={"dircard" + (dirs.includes(d) ? " on" : "")} onClick={() => tgl(setDirs, dirs, d)}>
                      <span className="dircard__top">
                        <span className="dircard__t">{d}</span>
                        <span className="dircard__n">{dirs.includes(d) ? <b><Icon name="check" size={11} /></b> : "+"}</span>
                      </span>
                      <span className="dircard__d">{hint}</span>
                    </button>
                  ))}
                </div>
                <div className="asst" style={{ marginTop: 18, marginBottom: 0 }}>
                  <span className="asst__ic"><Icon name="spark" size={18} /></span>
                  <div>
                    <span className="lbl">Подсказка</span>
                    <p>Отмечайте только то, за что готовы отвечать подписью. Заказчики фильтруют список по направлению — точная анкета даёт больше целевых заявок.</p>
                  </div>
                </div>
              </div>)}

              {step === 2 && (<div className="fade">
                <div className="field">
                  <label>Стадии, на которых работаете</label>
                  <div className="picks">
                    {TREE.map(s => <button key={s.code} type="button" className={"pick" + (stages.includes(s.code) ? " on" : "")} onClick={() => tgl(setStages, stages, s.code)}>{s.code} · {s.name}</button>)}
                  </div>
                </div>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label>Разделы документации <span className="lbl">выбрано {secs.length}</span></label>
                  {stageSecs.length === 0
                    ? <p className="qp__empty">Сначала выберите стадию — разделы берутся из её состава.</p>
                    : (<>
                      <div className="qp__secbar">
                        <span className="lbl">доступно {stageSecs.length}</span>
                        <span className="spacer" />
                        <button className="btn btn-line btn-sm" onClick={() => setSecs(stageSecs)}>Все</button>
                        <button className="btn btn-line btn-sm" onClick={() => setSecs([])}>Снять</button>
                      </div>
                      <div className="seclist">
                        {stageSecs.map(c => (
                          <button key={c} type="button" className={"secitem" + (secs.includes(c) ? " on" : "")} onClick={() => tgl(setSecs, secs, c)}>
                            <span className="secitem__c">{c}</span>
                            <span className="secitem__n">{secTitle[c] || "Раздел документации"}</span>
                            <span className="secitem__k"><Icon name="check" size={12} /></span>
                          </button>
                        ))}
                      </div>
                    </>)}
                </div>
              </div>)}

              {step === 3 && (<div className="fade">
                <div className="asst">
                  <span className="asst__ic"><Icon name="shield" size={18} /></span>
                  <div>
                    <span className="lbl">Индекс доверия</span>
                    <p>Каждое подтверждение поднимает индекс. Сейчас — <b>{trust}</b> из 100, уровень «<b>{level}</b>». Без подтверждений профиль показывается ниже в подборе.</p>
                  </div>
                </div>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label>Что можете подтвердить</label>
                  <div className="seclist">
                    {PROOFS.map(([t, d, w]) => (
                      <button key={t} type="button" className={"secitem" + (proofs.includes(t) ? " on" : "")} onClick={() => tgl(setProofs, proofs, t)}>
                        <span className="secitem__c">+{w}</span>
                        <span className="secitem__n">{t} · {d}</span>
                        <span className="secitem__k"><Icon name="check" size={12} /></span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="field" style={{ marginTop: 18, marginBottom: 0 }}>
                  <label>Документы</label>
                  <button type="button" className="drop"><Icon name="file" size={24} /><span>Загрузите сканы: выписка СРО, НРС, диплом, полис</span></button>
                </div>
              </div>)}

              {step === 4 && (<div className="fade">
                <div className="field">
                  <label>Загрузка</label>
                  <div className="picks">{LOADS.map(v => <button key={v} type="button" className={"pick" + (load === v ? " on" : "")} onClick={() => setLoad(v)}>{v}</button>)}</div>
                </div>
                <div className="field">
                  <label>Формат работы</label>
                  <div className="picks">{FORMATS.map(v => <button key={v} type="button" className={"pick" + (fmt === v ? " on" : "")} onClick={() => setFmt(v)}>{v}</button>)}</div>
                </div>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label>Ставка</label>
                  <div className="picks">{RATES.map(v => <button key={v} type="button" className={"pick" + (rate === v ? " on" : "")} onClick={() => setRate(v)}>{v}</button>)}</div>
                </div>
                <div className="noteline" style={{ marginTop: 18 }}>
                  <span className="noteline__ic"><Icon name="wallet" size={17} /></span>
                  <p><b>Оплата через платформу.</b> Средства резервируются на этапе и переводятся после приёмки раздела — без предоплат «на слово».</p>
                </div>
              </div>)}

              {step === 5 && (<div className="fade">
                <div className="field">
                  <label>Имя или название</label>
                  <input className="inp" placeholder="Иванов Пётр Сергеевич" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="field">
                  <label>Почта</label>
                  <input className="inp" placeholder="mail@example.ru" value={mail} onChange={e => setMail(e.target.value)} />
                </div>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label>Телефон</label>
                  <input className="inp num" placeholder="+7 900 000-00-00" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <div className="noteline ok" style={{ marginTop: 18 }}>
                  <span className="noteline__ic"><Icon name="mail" size={17} /></span>
                  <p><b>Что дальше.</b> Проверим документы в течение рабочего дня и пришлём ссылку на профиль. Заявки по вашим разделам начнут приходить сразу после проверки.</p>
                </div>
              </div>)}

              <div className="wizbar">
                <button className="btn btn-line" disabled={step === 0} style={{ opacity: step === 0 ? .4 : 1 }} onClick={() => setStep(s => Math.max(0, s - 1))}>Назад</button>
                {last
                  ? <button className="btn btn-acid">Отправить анкету</button>
                  : <button className="btn btn-ink" onClick={() => setStep(s => s + 1)}>Далее <Arr /></button>}
                <span className="lbl" style={{ marginLeft: "auto" }}>Шаг {step + 1} из {STEPS.length}</span>
              </div>
            </div>

            <aside className="pv">
              <div className="pv__h">
                <span className="lbl">Как увидит заказчик</span>
                <span className="pv__cnt num">{done}<span>/6</span></span>
              </div>
              <div className="pv__cover">
                <span className="pv__stage num">{trust}</span>
                <span className="pv__type">{level}</span>
              </div>
              <h3>{name.trim() || "Ваш профиль"}</h3>
              <div className="pv__sub">{who} · {region || "регион не указан"} · опыт {yrs} лет</div>
              <div className="pv__rows">
                <div className="pv__row"><span className="pv__ic"><Icon name="layers" size={15} /></span><div style={{ minWidth: 0, flex: 1 }}><div className="pv__k">Направления</div><div className="pv__v">{dirs.length ? dirs.join(", ") : "не выбраны"}</div></div></div>
                <div className="pv__row"><span className="pv__ic"><Icon name="file" size={15} /></span><div style={{ minWidth: 0, flex: 1 }}><div className="pv__k">Разделы · {secs.length}</div><div className="pv__codes">{secs.length ? secs.map(s => <span key={s} className="code">{s}</span>) : <span className="pv__v">не выбраны</span>}</div></div></div>
                <div className="pv__row"><span className="pv__ic"><Icon name="shield" size={15} /></span><div style={{ minWidth: 0, flex: 1 }}><div className="pv__k">Подтверждено</div><div className="pv__v">{proofs.length ? proofs.length + " документа" : "пока ничего"}</div></div></div>
                <div className="pv__row"><span className="pv__ic"><Icon name="pin" size={15} /></span><div style={{ minWidth: 0, flex: 1 }}><div className="pv__k">Формат</div><div className="pv__v">{fmt} · {load}</div></div></div>
              </div>
              <div className="pv__price"><span className="pv__sum num"><Icon name="wallet" size={17} />{rate}</span></div>
            </aside>
          </div>

          <div className="sg3">
            <div className="sg3__cta">
              <div>
                <h2>Не хотите заполнять сами?</h2>
                <p>Оставьте контакт — специалист платформы соберёт профиль вместе с вами: подберём направления, разделы по ПП РФ №87 и проверим документы.</p>
                <button className="sg3btn sg3btn--a">Оставить заявку</button>
              </div>
              <div className="sg3__doc"><i /><i /><i /><span>ПП РФ №87</span></div>
            </div>

            <div className="sg3__perks">
              {[["Профиль за 10 минут", "направления, стадии и разделы — из готового справочника"],
                ["Проверка по реестрам", "СРО и НРС сверяем автоматически, без справок на бумаге"],
                ["Двойной лимит откликов", "первый месяц после проверки документов"]].map(([t, d]) => (
                <div className="sg3__perk" key={t}><b>{t}</b><span>{d}</span></div>
              ))}
            </div>

            <div className="sg3__band">
              <div>
                <h2>Ваш индекс доверия</h2>
                <p>Собирается из подтверждённых документов, закрытых этапов и отзывов. Заказчики фильтруют базу по нему — цифра важнее резюме.</p>
                <span className="sg3__lvl">Сейчас уровень «{level}»</span>
              </div>
              <div className="sg3__right">
                <div className="sg3__board">
                  {String(trust).padStart(2, "0").split("").map((d, i) => <span className="sg3__dig" key={i}>{d}</span>)}
                  <span className="sg3__dig sg3__dig--gh">{Math.min(9, proofs.length)}</span>
                </div>
                <span className="sg3__n">{proofs.length} из {PROOFS.length} подтверждений отмечено</span>
                <div className="sg3__b">
                  <button className="sg3btn sg3btn--d" onClick={() => setStep(3)}>Добавить документы</button>
                  <button className="sg3btn sg3btn--l" onClick={() => setStep(2)}>Уточнить разделы</button>
                </div>
              </div>
            </div>

            <div className="sg3__bottom">
              <div className="sg3__card">
                <b>Уже работали на площадках?</b>
                <span>Перенесём портфолио объектов и отзывы — приложите ссылки в шаге «Опыт и допуски».</span>
                <button className="sg3btn sg3btn--l" onClick={() => setStep(3)}>Перейти к опыту</button>
              </div>
              <div className="sg3__card">
                <b>Заявки прямо сейчас</b>
                <div className="sg3__feed">
                  {[["Склад класса А, Домодедово", "стадия П · АР, КЖ, ОВ", "2,4 млн ₽"],
                    ["Котельная 4,2 МВт, Тула", "стадия РД · ТХ, ЭОМ", "1,1 млн ₽"],
                    ["ЖК «Северный парк», Казань", "стадия ПД · АР, КР, ВК", "6,8 млн ₽"]].map(([t, s, b]) => (
                    <div key={t}><span className="sg3__ft">{t}</span><span className="sg3__fs">{s}</span><b className="num">{b}</b></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(SCREENS, { Signup });
