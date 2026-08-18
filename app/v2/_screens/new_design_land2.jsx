"use client";

/* Экран варианта Б. Источник: design-handoff-v2/new_design_land2.jsx
   Первоначально импортирован скриптом tools/transform_jsx.py, но это был
   разовый перенос: дальше экран дописывается прямо здесь. Повторно
   генератор не гоняем — он вернёт файл к состоянию выгрузки. */
import * as React from "react";
import { SCREENS } from "./registry";
import { IMG } from "../_assets";
const { useState } = React;
const Mark = ({ s = 28 }) => (
  <svg width={s} height={s} viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="#14161A" /><path d="M13 28V12h14M13 20h10" stroke="#C9F24A" strokeWidth="2.6" strokeLinecap="square" /></svg>
);
const Cur = ({ c }) => (<svg width="16" height="16" viewBox="0 0 16 16" fill={c}><path d="M2 2l11 5-4.6 1.4L7 13z" /></svg>);
const Chev = () => (<svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6.5l4 4 4-4" /></svg>);
const Arr = ({ s = 14 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>);

const NAV = ["Направления", "Заявки", "Тарифы", "Исполнителям"];
const ROLES = [
  ["ГИП", "#C9F24A", "#14161A", { top: "14%", right: "-6%" }],
  ["Конструктор", "#6E3AD6", "#F1EFE9", { top: "42%", left: "-9%" }],
  ["Эксперт", "#DC5A2A", "#F1EFE9", { bottom: "26%", right: "-4%" }],
];
const PILLARS = [
  ["Состав вместо описаний", "Заявка приходит с разделами по ПП РФ №87, стадией и сроком — понятно, ваша это работа или нет, до первого сообщения."],
  ["Подбор по компетенциям", "Заказчик фильтрует базу по направлению, стадии и разделу. Подтверждённые СРО и НРС поднимают вас в выдаче."],
  ["Деньги по этапам", "Сумма резервируется до старта и переводится после приёмки раздела — без предоплат «на слово» и долгов по акту."],
];
const FEED = [
  ["Склад класса А, Домодедово", "18 400 м² · стадия П", "2,4 млн ₽", ["АР", "КЖ", "ОВ"], "7 откликов"],
  ["Реконструкция котельной 4,2 МВт", "Тула · стадия РД", "1,1 млн ₽", ["ТХ", "ЭОМ"], "4 отклика"],
  ["ЖК «Северный парк», корпус 2", "Казань · стадия ПД", "6,8 млн ₽", ["АР", "КР", "ВК"], "9 откликов"],
];
const TARIFFS = [
  ["Отклик бесплатно", "Первые 10 откликов в месяц ничего не стоят. Платите процент только с закрытого этапа.", "0 ₽", "за отклик"],
  ["Комиссия с этапа", "5% с суммы принятого этапа. Расчёты через платформу, резерв до старта работ.", "5%", "с принятого этапа"],
];

function Land2() {
  const R = SCREENS.REQ_FORM || {};
  const TREE = R.STAGE_TREE || [];
  const [dir, setDir] = useState("Проектировщик");
  const [stage, setStage] = useState("П");
  const [secs, setSecs] = useState(["АР", "КР"]);
  const DIRS = [["Проектировщик", 612], ["Эксперт", 148], ["Чертёжник", 274], ["Обследователь", 96]];
  const stageSecs = (TREE.find(s => s.code === stage) || { secs: [] }).secs.map(x => x[0]);
  const secTitle = {};
  TREE.forEach(s => s.secs.forEach(([c, n]) => { if (!secTitle[c]) secTitle[c] = n; }));
  const vol = (DIRS.find(d => d[0] === dir) || [0, 300])[1];
  const match = Math.max(5, Math.round(vol * (0.1 + 0.055 * Math.min(secs.length, 6))));
  const tgl = v => setSecs(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);

  return (
    <div className="nd l2">
      <header className="l2top">
        <div className="wrap l2top__in">
          <div className="mark"><Mark s={28} /><b>Функция</b></div>
          <nav className="l2nav">{NAV.map(n => <button key={n}>{n} <Chev /></button>)}</nav>
          <span className="spacer" />
          <a className="l2login" href="Функция (новый дизайн).html">Войти</a>
          <a className="btn btn-pill btn-line" href="Функция (регистрация исполнителя).html">Зарегистрироваться</a>
        </div>
      </header>

      <div className="scroll">
        <section className="wrap l2hero">
          <div>
            <h1>Превращайте компетенции в поток заявок</h1>
            <p>Платформа проектно-изыскательских работ, где заявка приходит с составом разделов, стадией и бюджетом. Подбор по вашим компетенциям, оплата по этапам, проверка СРО и НРС по реестрам.</p>
            <div className="l2cta">
              <a className="btn btn-pill btn-acid btn-lg" href="Функция (регистрация исполнителя).html">Заполнить анкету</a>
              <a className="btn btn-pill btn-ink btn-lg" href="Функция (новый дизайн).html">Смотреть заявки <Arr /></a>
            </div>
            <div className="l2facts">
              {[["1 240", "заявок в месяц"], ["4,2 млн ₽", "средний бюджет"], ["48 ч", "до первого отклика"]].map(([v, k]) => (
                <div key={k}><b className="num">{v}</b><span className="lbl">{k}</span></div>
              ))}
            </div>
          </div>

          <div className="l2ph">
            <span className="l2ph__ic"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#14161A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h4l10.5-10.5a2.1 2.1 0 00-3-3L5 17v3z" /><path d="M13.5 6.5l4 4" /></svg></span>
            <div className="l2ph__img">
              <image-slot id="land2-hero" shape="rounded" radius="26" src={IMG["pro-at-work.png"]} placeholder="Фото проектировщика за работой"></image-slot>
            </div>
            {ROLES.map(([n, c, ct, pos]) => (
              <span className="l2role" key={n} style={{ ...pos, "--c": c, "--ct": ct }}><Cur c={c} /><b>{n}</b></span>
            ))}
            <div className="l2card">
              <span className="lbl">Индекс доверия</span>
              <b className="num">94 <em>Эталон</em></b>
              <span>СРО, НРС и 12 закрытых этапов подтверждены платформой</span>
            </div>
          </div>
        </section>

        <section className="wrap l2claim">
          <h2>Функция помогает заменить тендеры и переписку по почте одной рабочей заявкой</h2>
          <div className="l2pillars">
            {PILLARS.map(([t, d], i) => (
              <div className="l2pillar" key={t}>
                <span className="num">0{i + 1}</span>
                <h4>{t}</h4>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="wrap l2sec">
          <div className="l2pick">
            <div className="l2pick__l">
              <span className="lbl">Подбор за минуту</span>
              <h3>Отметьте профиль — покажем поток</h3>
              <div className="field">
                <label>Направление</label>
                <div className="picks">{DIRS.map(([d]) => <button key={d} className={"pick" + (dir === d ? " on" : "")} onClick={() => setDir(d)}>{d}</button>)}</div>
              </div>
              <div className="field">
                <label>Стадия</label>
                <div className="picks">{TREE.map(s => <button key={s.code} className={"pick" + (stage === s.code ? " on" : "")} onClick={() => { setStage(s.code); setSecs([]); }}>{s.code}</button>)}</div>
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Разделы <span className="lbl">выбрано {secs.length} из {stageSecs.length}</span></label>
                <div className="l2secs">
                  {stageSecs.map(c => (
                    <button key={c} className={"l2sec-i" + (secs.includes(c) ? " on" : "")} onClick={() => tgl(c)} title={secTitle[c]}><i>{c}</i><span>{secTitle[c]}</span></button>
                  ))}
                </div>
              </div>
            </div>
            <div className="l2pick__r">
              <span className="lbl">Заявок под профиль</span>
              <b className="num">{match}</b>
              <span className="l2pick__d">{dir} · стадия {stage} · {secs.length ? secs.slice(0, 6).join(", ") : "разделы не выбраны"}</span>
              <a className="btn btn-pill btn-acid btn-w" href="Функция (регистрация исполнителя).html">Зарегистрироваться</a>
              <span className="lbl">проверка документов — до 1 рабочего дня</span>
            </div>
          </div>
        </section>

        <section className="wrap l2sec">
          <div className="sec-h">
            <div><span className="lbl">Живая выдача</span><h3 className="l2h">Заявки по вашим разделам</h3></div>
            <a className="btn btn-pill btn-line btn-sm" href="Функция (новый дизайн).html">Все заявки</a>
          </div>
          <div className="lfeed">
            {FEED.map(([t, s, b, cs, r]) => (
              <div className="lfeed__i" key={t}>
                <div><b>{t}</b><span>{s}</span></div>
                <div className="lfeed__c">{cs.map(c => <i key={c} className={secs.includes(c) ? "on" : ""}>{c}</i>)}</div>
                <div className="lfeed__v"><b className="num">{b}</b><span>{r}</span></div>
              </div>
            ))}
          </div>
        </section>

        <section className="wrap l2sec">
          <h3 className="l2h">Тарифы</h3>
          <div className="ltars">
            {TARIFFS.map(([t, d, v, k]) => (
              <div className="ltar" key={t}>
                <div><h4>{t}</h4><p>{d}</p></div>
                <div className="ltar__v"><b className="num">{v}</b><span className="lbl">{k}</span></div>
              </div>
            ))}
          </div>
        </section>

        <section className="wrap l2sec">
          <div className="l2end">
            <div>
              <h3>Анкета занимает 6 шагов</h3>
              <p>Направление, стадии, разделы, допуски, загрузка и ставка. После проверки заявки по вашим разделам приходят сразу.</p>
            </div>
            <a className="btn btn-pill btn-acid btn-lg" href="Функция (регистрация исполнителя).html">Начать анкету <Arr /></a>
          </div>
        </section>

        <footer className="wrap foot">
          <span className="lbl">Функция · платформа проектно-изыскательских работ</span>
          <div className="row g16">
            <a href="Функция (лендинг для исполнителей).html">Вариант 1</a>
            <a href="Функция (новый дизайн).html">Платформа</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

Object.assign(SCREENS, { Land2 });
