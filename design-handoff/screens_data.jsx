/* screens_data.jsx — Expertise (Standards вынесен в screens_standards.jsx) */
(function () {
  const Icon = window.Icon, Avatar = window.Avatar;

  /* ============ EXPERTISE ============ */
  const EXCH = [
    { id: 1, sro: true, title: "Комплексная экспертиза ПД для ЖК «Северный»",
      desc: "Требуется негосударственная экспертиза проектной документации для жилого комплекса.",
      detail: "Жилой комплекс бизнес-класса: 3 секции, 16–18 этажей, двухуровневая подземная автостоянка на 180 машино-мест. Требуется комплексная негосударственная экспертиза проектной документации с выдачей положительного заключения для получения разрешения на строительство. Проект разработан в BIM, исходные материалы предоставляются полным комплектом.",
      type: "Коммерческая недвижимость", region: "Москва", area: "45 000 м²", stage: "П", expType: "Негосударственная",
      due: "15.05.2026", sections: ["ПЗ","АР","КР","ЭОМ","ВК","ОВ","ПОС","СМ"], n: 8, price: "450 000 ₽", replies: 4,
      client: "ООО «СтройИнвест»", clientCity: "Москва",
      files: [["file","Проектная документация — 8 разделов.zip","210 МБ"],["layers","Архитектурные чертежи АР.pdf","48 МБ"],["bim","BIM-модель объекта.ifc","320 МБ"],["file","Техническое задание.pdf","2.4 МБ"]] },
    { id: 2, sro: false, title: "Проверка раздела КР (Складской комплекс)",
      desc: "Нужна проверка расчётов и узлов металлокаркаса складского комплекса (12 000 м²).",
      detail: "Одноэтажный складской комплекс класса А, пролёт 24 м, несущий металлический каркас. Требуется проверка статических расчётов несущих конструкций, узлов сопряжения и соответствия СП по нагрузкам и воздействиям. Заключение — в свободной форме, с перечнем замечаний по расчётной части.",
      type: "Промышленность", region: "Московская область", area: "12 000 м²", stage: "РД", expType: "Технический аудит",
      due: "10.04.2026", sections: ["КР"], n: 1, price: "50 000 ₽", replies: 12,
      client: "ООО «УралЛогистик»", clientCity: "Екатеринбург",
      files: [["file","Раздел КР — расчёты и ПЗ.pdf","36 МБ"],["layers","Узлы металлокаркаса.dwg","12 МБ"]] },
    { id: 3, sro: true, title: "Аудит инженерных систем (Индустриальный парк)",
      desc: "Технический аудит разделов ЭОМ, ВК и ОВ для нового индустриального парка.",
      detail: "Новый индустриальный парк: производственный корпус и административно-бытовой комплекс. Требуется технический аудит инженерных разделов — электроснабжение, водоснабжение и водоотведение, отопление и вентиляция — на соответствие нормативам и оптимальность решений перед прохождением государственной экспертизы.",
      type: "Промышленность", region: "Калужская область", area: "28 000 м²", stage: "П", expType: "Государственная",
      due: "20.04.2026", sections: ["ЭОМ","ВК","ОВ"], n: 3, price: "120 000 ₽", replies: 2,
      client: "АО «ИндустрияДевелопмент»", clientCity: "Калуга",
      files: [["file","Разделы ЭОМ, ВК, ОВ.zip","96 МБ"],["file","Техническое задание на аудит.pdf","3.1 МБ"]] },
  ];
  function Expertise({ go }) {
    const [tab, setTab] = React.useState("Биржа экспертизы");
    return (
      <>
        <div className="page-head">
          <h1 className="page-title">Экспертиза проектов</h1>
          <button className="btn btn-primary" onClick={() => go("experts")}><Icon name="plus" size={16} /> Заказать экспертизу</button>
        </div>
        <div className="row between gap16 wrap" style={{ marginBottom: 22 }}>
          <div className="row gap10">
            {["Биржа экспертизы","В работе (3)"].map(t => <button key={t} className={"pill" + (t === tab ? " is-active" : "")} onClick={() => setTab(t)}>{t}</button>)}
          </div>
          <div className="row gap10">
            <div className="topbar__search" style={{ maxWidth: 280, height: 42 }}><Icon name="search" /><input placeholder="Поиск…" /></div>
            <div className="viewtoggle">{["list","columns","menu"].map((v, i) => <button key={v} className={i === 1 ? "is-active" : ""}><Icon name={v === "list" ? "list" : v === "columns" ? "columns" : "menu"} /></button>)}</div>
          </div>
        </div>

        <div className="exch-grid">
          {EXCH.map((e, i) => (
            <div key={i} className="card card-hover col" style={{ padding: 0, overflow: "hidden", cursor: "pointer" }} onClick={() => go("expertise-detail", e.id)}>
              <div className="exch__thumb thumb">
                {e.sro && <span className="exch__sro"><Icon name="shield" size={13} /> СРО</span>}
                <span className="exch__n">{e.n} разд.</span>
              </div>
              <div className="col grow" style={{ padding: 20 }}>
                <h3 style={{ margin: "0 0 8px", fontSize: 17, lineHeight: 1.25, color: "#fff" }}>{e.title}</h3>
                <p className="muted" style={{ margin: "0 0 14px", fontSize: 13.5, lineHeight: 1.5 }}>{e.desc}</p>
                <div className="meta-row" style={{ fontSize: 13, marginBottom: 12 }}><span><Icon name="building" />{e.type}</span><span><Icon name="clock" />Срок: {e.due}</span></div>
                <div className="chips" style={{ marginBottom: 18 }}>{e.sections.map(s => <span key={s} className="chip chip-code">{s}</span>)}</div>
                <div className="row between" style={{ marginTop: "auto" }}>
                  <div><div className="price">{e.price}</div><div className="dim" style={{ fontSize: 12 }}>{e.replies} откликов</div></div>
                  <button className="btn btn-primary btn-sm" onClick={(ev) => { ev.stopPropagation(); go("expertise-detail", e.id); }}>Открыть <Icon name="arrowRight" size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  /* ============ EXPERTISE DETAIL (разбор заявки на экспертизу) ============ */
  const plural = (n, forms) => { const a = Math.abs(n) % 100, b = a % 10; if (a > 10 && a < 20) return forms[2]; if (b > 1 && b < 5) return forms[1]; if (b === 1) return forms[0]; return forms[2]; };
  const razdel = (n) => plural(n, ["раздел", "раздела", "разделов"]);
  const otklik = (n) => plural(n, ["отклик", "отклика", "откликов"]);
  function ExpertiseDetail({ id, go }) {
    const NAMES = (window.DATA && window.DATA.SECTION_NAMES) || {};
    const e = EXCH.find(x => x.id === id) || EXCH[0];
    const expLabel = /ая$/.test(e.expType) ? e.expType + " экспертиза" : e.expType;
    const scope = [
      "Проверка соответствия документации техническим регламентам и действующим нормативам (ГОСТ, СП, СНиП).",
      "Анализ расчётов несущих конструкций и инженерных систем.",
      "Проверка полноты и комплектности разделов.",
      "Формирование замечаний и ведение итераций с проектировщиком.",
      "Подготовка и выдача заключения экспертизы.",
    ];
    return (
      <>
        <div className="breadcrumb">
          <a className="link" onClick={() => go("expertise")}>Экспертиза</a>
          <Icon name="chevR" size={13} /> <span className="dim">{e.title}</span>
        </div>

        <div className="row between gap16 wrap" style={{ margin: "16px 0 22px" }}>
          <h1 className="page-title" style={{ maxWidth: 720 }}>{e.title}</h1>
          <div className="row gap10">
            {e.sro && <span className="badge" style={{ background: "rgba(245,177,61,.15)", color: "var(--amber)" }}><Icon name="shield" size={13} /> СРО</span>}
            <button className="btn btn-ghost btn-sm" onClick={() => go("chat")}><Icon name="comment" size={15} /> Обсудить</button>
            <button className="btn btn-primary btn-sm" onClick={() => go("chat")}><Icon name="send" size={14} /> Откликнуться</button>
          </div>
        </div>

        <div className="thumb thumb-tower detail__hero" style={{ position: "relative" }}>
          <span className="detail__hero-tag"><Icon name="scan" size={14} />{expLabel} · {e.n} {razdel(e.n)} на проверку</span>
        </div>

        <div className="detail__grid">
          <div className="col gap20" style={{ minWidth: 0 }}>
            <div className="card">
              <h3 className="section-title" style={{ marginBottom: 18 }}>Задача от заказчика</h3>
              <table className="spec"><tbody>
                <tr><td>Тип объекта</td><td>{e.type}</td></tr>
                <tr><td>Регион</td><td>{e.region}</td></tr>
                <tr><td>Площадь</td><td>{e.area}</td></tr>
                <tr><td>Стадия</td><td>{e.stage}</td></tr>
                <tr><td>Тип экспертизы</td><td>{e.expType}</td></tr>
                <tr><td>Срок</td><td>До {e.due}</td></tr>
              </tbody></table>
              <p className="muted mt16" style={{ lineHeight: 1.6, fontSize: 14.5 }}>{e.detail}</p>
            </div>

            <div className="card">
              <div className="row between" style={{ marginBottom: 16 }}>
                <h3 className="section-title" style={{ margin: 0 }}>Состав документации</h3>
                <span className="dim" style={{ fontSize: 13 }}>{e.sections.length} {razdel(e.sections.length)} на проверку</span>
              </div>
              <div className="col gap10">
                {e.sections.map(s => (
                  <div key={s} className="row gap14" style={{ padding: "12px 16px", borderRadius: 12, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                    <span className="chip chip-code" style={{ flex: "none" }}>{s}</span>
                    <span className="grow" style={{ fontSize: 13.5, minWidth: 0 }}>{NAMES[s] || "Раздел проектной документации"}</span>
                    <span className="dim" style={{ fontSize: 12.5, flex: "none" }}>к проверке</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="section-title" style={{ marginBottom: 16 }}>Объём проверки</h3>
              <div className="col gap12">
                {scope.map((t) => (
                  <div key={t} className="row gap12" style={{ alignItems: "flex-start" }}>
                    <Icon name="checkCircle" size={18} style={{ color: "var(--green)", flex: "none", marginTop: 1 }} />
                    <span style={{ fontSize: 13.5, lineHeight: 1.5 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col gap20">
            <div className="card">
              <div className="dim" style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Условия</div>
              <div className="price" style={{ fontSize: 26 }}>{e.price}</div>
              <div className="dim" style={{ fontSize: 12.5, margin: "4px 0 18px" }}>гонорар эксперта · {e.replies} {otklik(e.replies)}</div>
              <div className="col gap10" style={{ marginBottom: 18 }}>
                <div className="row between"><span className="dim" style={{ fontSize: 13 }}>Срок проверки</span><b style={{ fontSize: 13.5 }}>До {e.due}</b></div>
                <div className="row between"><span className="dim" style={{ fontSize: 13 }}>Тип экспертизы</span><b style={{ fontSize: 13.5 }}>{e.expType}</b></div>
                <div className="row between"><span className="dim" style={{ fontSize: 13 }}>Аккредитация</span><b style={{ fontSize: 13.5 }}>{e.sro ? "СРО — требуется" : "не требуется"}</b></div>
              </div>
              <button className="btn btn-primary btn-block" onClick={() => go("chat")}><Icon name="send" size={15} /> Откликнуться</button>
              <button className="btn btn-outline btn-block mt12">Запросить материалы</button>
            </div>

            <div className="card">
              <h3 className="section-title" style={{ fontSize: 16, marginBottom: 16 }}>Исходные материалы</h3>
              <div className="col gap10">
                {e.files.map((f, i) => (
                  <div key={i} className="row gap12" style={{ padding: "11px 12px", borderRadius: 12, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, display: "grid", placeItems: "center", background: "var(--accent-soft)", color: "var(--accent-2)", flex: "none" }}><Icon name={f[0]} size={18} /></div>
                    <div className="grow" style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f[1]}</div>
                      <div className="dim" style={{ fontSize: 12 }}>{f[2]}</div>
                    </div>
                    <button className="iconbtn" style={{ width: 34, height: 34, flex: "none" }} title="Скачать"><Icon name="download" size={16} /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="dim" style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Заказчик</div>
              <div className="row gap12" style={{ marginBottom: 16 }}>
                <Avatar text={e.client.replace(/[^А-ЯA-Z]/g, "").slice(0, 2) || "ЗК"} size={44} />
                <div><div style={{ fontWeight: 700 }}>{e.client}</div><div className="dim" style={{ fontSize: 13 }}>{e.clientCity}</div></div>
              </div>
              <button className="btn btn-ghost btn-block" onClick={() => go("chat")}><Icon name="comment" size={15} /> Связаться</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  Object.assign(window, { Expertise, ExpertiseDetail });
})();
