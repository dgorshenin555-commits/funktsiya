/* new_design_extra.jsx — экран варианта Б, выгружен из основного проекта.
   Сгенерировано tools/reverse_transform.py: правки вносить в
   app/v2/_screens/ в проекте, иначе они разойдутся.
   Подключать после lib_bundle.jsx. */
(function () {
  const { useState } = React;
  const Search = ({ s = 15 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="7" cy="7" r="4.4" /><path d="M10.4 10.4L14 14" /></svg>);

  /* ---------- аналитика ---------- */
  const KPI = [
    { b: "1,24 млрд ₽", l: "Заявок опубликовано за квартал", d: "+12,5%", up: true },
    { b: "148", l: "Заявок в работе сейчас", d: "+8", up: true },
    { b: "4 ч", l: "Медианный срок первого отклика", d: "−1,5 ч", up: true },
    { b: "1,6", l: "Итераций до заключения экспертизы", d: "−0,2", up: true },
  ];
  const DEM = [["АР", 74], ["КЖ", 66], ["ОВ", 58], ["ЭОМ", 51], ["ВК", 44], ["КМ", 38], ["СС", 27]];
  const REG = [["Москва и МО", "312 заявок", "1 850 ₽/м²"], ["Санкт-Петербург", "148", "1 620 ₽/м²"], ["Приволжье", "121", "1 180 ₽/м²"], ["Урал", "96", "1 240 ₽/м²"], ["Юг", "74", "1 090 ₽/м²"]];

  function Analytics() {
    const max = Math.max(...DEM.map(d => d[1]));
    return (
      <div className="scroll">
        <div className="wrap page">
          <div className="page__h">
            <span className="lbl">База знаний</span>
            <h1>Аналитика рынка</h1>
            <p>Сколько стоит проект, где больше заказов и какие разделы просят чаще. Данные — по заявкам платформы за последний квартал.</p>
          </div>
          <div className="acards">
            {KPI.map(k => (
              <div className="acard" key={k.l}>
                <span className="lbl">{k.l}</span>
                <b>{k.b}</b>
                <span className="delta" style={{ color: k.up ? "var(--moss)" : "var(--clay)" }}>{k.d} к прошлому кварталу</span>
              </div>
            ))}
          </div>
          <div className="two">
            <div className="box">
              <h3>Какие разделы заказывают чаще</h3>
              <div className="cols">
                {DEM.map(([s, v]) => (
                  <div key={s}>
                    <em>{v}</em>
                    <i style={{ height: (v / max) * 140 + "px", background: v === max ? "var(--acid)" : undefined }} />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="box">
              <h3>Регионы</h3>
              <div>
                {REG.map(([r, n, p]) => (
                  <div className="set-row" key={r}>
                    <div><h4>{r}</h4><p>{n}</p></div>
                    <span className="num" style={{ fontSize: 13.5 }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- ИИ-подбор решений (производители) ---------- */
  const EX = [
    "Узел крепления фасада для здания 75 м, минеральная вата, зона II",
    "Теплообменник для ИТП на 1,2 МВт с защитой от накипи",
    "Очистка поверхностного стока с парковки на 120 машин",
  ];
  const SOLS = [
    { name: "Ridan НН №14 + балансировка", who: "Ridan", m: 94, why: "Подходит по мощности и температурному графику, есть подбор по ТЗ." },
    { name: "Aquapanel Outdoor, узел У-12", who: "Knauf", m: 81, why: "Соответствует ветровой нагрузке, узел есть в DWG." },
    { name: "Vandjord Combi 20 л/с", who: "Vandjord", m: 68, why: "Производительность выше нужной, потребует приямка." },
  ];

  function AiPick() {
    const [q, setQ] = useState("");
    const [state, setState] = useState("empty");
    const ask = t => { setQ(t); setState("think"); setTimeout(() => setState("res"), 900); };
    return (
      <div className="ai">
        <div className="row g12" style={{ alignItems: "flex-start" }}>
          <span style={{ marginTop: 4, color: "var(--ink-3)" }}><Search /></span>
          <textarea value={q} onChange={e => setQ(e.target.value)} placeholder="Опишите задачу обычными словами — подберём решение и производителя" />
        </div>
        <div className="row g12" style={{ flexWrap: "wrap" }}>
          <button className="btn btn-ink btn-sm" onClick={() => q.trim() ? ask(q) : ask(EX[0])}>Подобрать решение</button>
          {state !== "empty" && <button className="btn btn-line btn-sm" onClick={() => { setState("empty"); setQ(""); }}>Сбросить</button>}
          <span className="lbl" style={{ marginLeft: "auto" }}>можно приложить файл ТЗ</span>
        </div>
        {state === "empty" && (
          <div className="exs">{EX.map(e => <button className="ex" key={e} onClick={() => ask(e)}>{e}</button>)}</div>
        )}
        {state === "think" && <p className="mut" style={{ margin: 0, fontSize: 13.5 }}>Сверяем с каталогами и нормативами…</p>}
        {state === "res" && (
          <div className="match">
            <span className="lbl">Подходят под задачу</span>
            {SOLS.map((s, i) => (
              <div className={"mrow" + (i === 0 ? " top" : "")} key={s.name}>
                <div><b style={{ fontSize: 13.5, fontWeight: 500, display: "block" }}>{s.who}</b><span className="mut" style={{ fontSize: 12.5, lineHeight: 1.35, display: "block", marginTop: 2 }}>{s.name}</span></div>
                <div>
                  <div className="mbar"><i style={{ width: s.m + "%" }} /></div>
                  <p className="mut" style={{ margin: "6px 0 0", fontSize: 12.5 }}>{s.why}</p>
                </div>
                <em>{s.m}%</em>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ---------- звонок ---------- */
  function Call({ who, onEnd }) {
    return (
      <div className="call">
        <div className="call__v">
          <div className="call__t">{who}</div>
          <div className="call__t">вы</div>
        </div>
        <div className="call__b">
          <button className="cbtn">Мик</button>
          <button className="cbtn">Видео</button>
          <button className="cbtn">Экран</button>
          <button className="cbtn end" onClick={onEnd}>Стоп</button>
        </div>
      </div>
    );
  }

  Object.assign(window, { Analytics, AiPick, Call });
})();
