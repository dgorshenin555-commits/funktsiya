"use client";

/* Экран варианта Б. Источник: design-handoff-v2/notify_block.jsx
   Первоначально импортирован скриптом tools/transform_jsx.py, но это был
   разовый перенос: дальше экран дописывается прямо здесь. Повторно
   генератор не гоняем — он вернёт файл к состоянию выгрузки. */
import * as React from "react";
import { SCREENS } from "./registry";
const { useState } = React;

const CH = [["sms", "СМС"], ["mail", "Письмо"]];
const FREQ = ["Каждый день", "Раз в неделю", "Выключить"];

function NotifyBlock({ events = [], note = "" }) {
  const [rows, setRows] = useState(events.map(e => ({ sms: e[2], mail: e[3] })));
  const [freq, setFreq] = useState("Раз в неделю");
  const [quiet, setQuiet] = useState(true);
  const [open, setOpen] = useState(false);
  const on = rows.filter(r => r.sms || r.mail).length;
  const flip = (i, ch) => setRows(v => v.map((r, j) => (j === i ? { ...r, [ch]: !r[ch] } : r)));

  return (
    <section className={"pp__card pp__fold" + (open ? " open" : "")}>
      <button className="pfold__h" onClick={() => setOpen(v => !v)}>
        <span>
          <span className="lbl">Связь</span>
          <h3>Как получать уведомления по задачам</h3>
          <span className="pfold__s">включено событий: <b className="num">{on}</b> из {events.length} · рассылка: {freq.toLowerCase()}</span>
        </span>
        <span className="pfold__x">{open ? "свернуть" : "настроить"}<i /></span>
      </button>
      {open && (<React.Fragment>
      <div className="pnot">
        <div className="pnot__hd">
          <span />
          {CH.map(([k, l]) => <span key={k} className="pnot__ch">{l}</span>)}
        </div>
        {events.map(([t, s], i) => (
          <div key={t} className="pnot__r">
            <span className="pnot__b">
              <span className="pnot__t">{t}</span>
              <span className="pnot__s">{s}</span>
            </span>
            {CH.map(([k]) => (
              <button key={k} className={"pnot__c" + (rows[i][k] ? " on" : "")} onClick={() => flip(i, k)} aria-label={t}>
                <i />
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="pnot__foot">
        <div>
          <span className="pnot__t">Рассылка платформы</span>
          <span className="pnot__s">{note}</span>
        </div>
        <div className="pnot__fs">
          {FREQ.map(f => <button key={f} className={freq === f ? "on" : ""} onClick={() => setFreq(f)}>{f}</button>)}
        </div>
      </div>
      <button className={"pnot__q" + (quiet ? " on" : "")} onClick={() => setQuiet(v => !v)}>
        <i />
        <span><b>Тихие часы 22:00 — 08:00</b>СМС и письма в это время не уходят. Срочное по этапу придёт всё равно.</span>
      </button>
      </React.Fragment>)}
    </section>
  );
}

Object.assign(SCREENS, { NotifyBlock });
