"use client";

/* Экран варианта Б. Источник: design-handoff-v2/new_design_scrub.jsx
   Файл сгенерирован из выгрузки Cloud Design — правки вносить в источник. */
import * as React from "react";
import { SCREENS } from "./registry";
const { useState, useRef, useCallback } = React;

const REST = 18, PEAK = 104, ROW = 14, RADIUS = 4.2;
const bump = (d, r) => d >= r ? 0 : 0.5 * (1 + Math.cos(Math.PI * (d / r)));

function ScrubRail({ items, currentIndex = -1, side = "right", onSelect, label = "Хронология" }) {
  const [ptr, setPtr] = useState(currentIndex >= 0 ? currentIndex : 0);
  const [live, setLive] = useState(false);
  const listRef = useRef(null);
  const last = items.length - 1;

  const move = useCallback(e => {
    const r = listRef.current.getBoundingClientRect();
    const row = (e.clientY - r.top) / ROW - 0.5;
    setPtr(Math.max(-0.5, Math.min(last + 0.5, row)));
    setLive(true);
  }, [last]);

  const active = Math.max(0, Math.min(last, Math.round(ptr)));
  const cur = items[active];
  const cardH = 132;
  const total = items.length * ROW;
  const top = Math.max(0, Math.min(Math.max(0, total - cardH), (ptr + 0.5) * ROW - cardH / 2));

  return (
    <div className="scrub" style={{ "--peak": PEAK + "px" }}>
      <div className="scrub__list" ref={listRef} role="listbox" aria-label={label}
        onPointerMove={move} onPointerLeave={() => setLive(false)}>
        {items.map((it, i) => {
          const rise = (live ? 1 : 0) * bump(Math.abs(i - ptr), RADIUS);
          const isCur = i === currentIndex;
          const base = isCur ? 0.55 : 0.22;
          return (
            <button key={it.id || it.title} role="option" aria-selected={isCur} aria-label={it.title}
              tabIndex={i === (live ? active : Math.max(0, currentIndex)) ? 0 : -1}
              className="scrub__row" style={{ height: ROW, justifyContent: side === "left" ? "flex-end" : "flex-start" }}
              onFocus={() => { setPtr(i); setLive(true); }}
              onClick={() => onSelect && onSelect(it, i)}>
              <span className={"scrub__t" + (isCur ? " cur" : "")} style={{ width: REST + rise * (PEAK - REST), opacity: base + rise * (1 - base), transform: "scaleY(" + (1 + rise * 0.4) + ")" }} />
            </button>
          );
        })}
      </div>
      <div className={"scrub__card" + (live ? " on" : "")} style={{ top, minHeight: cardH, [side === "right" ? "left" : "right"]: PEAK + 20 }}>
        {cur.meta && <span className="lbl">{cur.meta}</span>}
        <b>{cur.title}</b>
        {cur.desc && <p>{cur.desc}</p>}
      </div>
    </div>
  );
}

Object.assign(SCREENS, { ScrubRail });
