/* screens_catalog.jsx — Designers, DesignerProfile, Experts, Manufacturers */
(function () {
  const Icon = window.Icon, Avatar = window.Avatar;

  const grad = (a, b) => ({ background: `linear-gradient(135deg, ${a}, ${b})` });

  /* Analytics-style bar chart of solution match % (адаптация присланного компонента) */
  function SolChart({ sols, themeKey, onPick }) {
    const max = Math.max(...sols.map(s => s.match), 0);
    const ranked = [...sols].sort((a, b) => b.match - a.match);
    return (
      <div className="mcard">
        <div className="mcard__top">
          <span className="mcard__h"><Icon name="scan" size={15} /> Совпадение с задачей</span>
          <span className="mcard__sub">{sols.length} решения · по релевантности</span>
        </div>
        <div className="mcard__rows">
          {ranked.map((s, i) => (
            <button key={s.t} type="button" className={"mrow" + (s.match === max ? " is-top" : "")} onClick={() => onPick(s)} title={s.t}>
              <span className="mrow__rank">{i + 1}</span>
              <span className="mrow__name">{s.short || s.t}<i className="mrow__tag" style={{ color: s.tagC, background: `color-mix(in srgb, ${s.tagC} 15%, transparent)` }}>{s.tag}</i></span>
              <span className="mrow__track"><span key={themeKey + "-" + i} className="mrow__fill" style={{ width: s.match + "%", background: s.tagC }} /></span>
              <span className="mrow__val">{s.match}<small>%</small></span>
              <Icon name="arrowRight" size={14} className="mrow__go" />
            </button>
          ))}
        </div>
      </div>
    );
  }
  function Ava({ text, g, size = 44 }) {
    return <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.34, ...grad(g[0], g[1]) }}>{text}</div>;
  }
  /* фото-аватар в стиле главной: фото + ободок + индикатор, с fallback на градиент с инициалами */
  function PhotoAva({ d, size = 44, ring = true, dot }) {
    const [err, setErr] = React.useState(false);
    const initials = d.name.replace(/[^А-ЯA-Z]/g, "").slice(0, 2);
    const showImg = d.photo && !err;
    const px = Math.round(size * 2);
    const src = d.photo ? `${d.photo}?w=${px}&h=${px}&fit=crop&crop=faces` : null;
    return (
      <span className={"tl-avatar" + (ring ? " tl-avatar--ring" : "")}
        style={{ width: size, height: size, fontSize: size * 0.36, ...(showImg ? {} : grad(d.g[0], d.g[1])) }}>
        {showImg
          ? <img src={src} alt="" onError={() => setErr(true)} />
          : <span className="tl-avatar__fb">{initials}</span>}
        {dot && <span className="tl-avatar__dot" />}
      </span>
    );
  }
  function Stars({ v }) {
    return <span className="row gap6" style={{ fontSize: 13.5, color: "var(--text-dim)" }}><Icon name="star" size={14} style={{ color: "var(--amber)" }} />{v}</span>;
  }

  /* ============ DESIGNERS ============ */
  const DESIGNERS = [
    { name: "Вадим Петров", org: false, photo: "https://images.unsplash.com/photo-1633332755192-727a05c4013d", codes: ["КР","АР"], city: "Санкт-Петербург", sro: "СРО НБПИ-04-032", rating: "4.8", projects: 21, g: ["#f76f9e","#f0507f"], featured: true },
    { name: "ООО «ПроектСити»", org: true, codes: ["КР"], city: "Москва", sro: "СРО ДОМФ-01-134", rating: "4.7", projects: 86, g: ["#4aa3ff","#3b7ff0"] },
    { name: "Андрей Смирнов", org: false, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e", codes: ["КР"], city: "Воронеж", sro: "СРО ПТЗ-05-456", rating: "4.5", projects: 48, g: ["#3ad6a6","#22b886"] },
    { name: "АрхПроект Строй", org: true, codes: ["КР","АР"], city: "Санкт-Петербург", sro: "СРО ППЦ-02-467", rating: "4.7", projects: 66, g: ["#f5933d","#ec6f2a"] },
    { name: "Елена Волкова", org: false, photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e", codes: ["ЭОМ","ВК"], city: "Москва", sro: "СРО ИНЖ-07-891", rating: "4.9", projects: 74, g: ["#a06bf5","#7d52e8"] },
    { name: "ООО «СПД»", org: true, codes: ["ТУС"], city: "Москва", sro: "СРО СПП-77-187", rating: "4.5", projects: 188, g: ["#5ad0e0","#3aa9d8"] },
  ];

  function PersonCard({ d, go, accent = "designers" }) {
    return (
      <div className={"card card-hover personcard" + (d.featured ? " is-featured" : "")}>
        <div className="row gap12" style={{ marginBottom: 14 }}>
          <PhotoAva d={d} dot={!d.org} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{d.name}</div>
            <div className="chips" style={{ marginTop: 6 }}>{d.codes.map(c => <span key={c} className="chip chip-code">{c}</span>)}</div>
          </div>
        </div>
        <div className="col gap8 muted" style={{ fontSize: 13.5, marginBottom: 14 }}>
          <span className="row gap6"><Icon name="pin" size={14} />{d.city}</span>
          <span className="row gap6"><Icon name="building" size={14} />{d.sro}</span>
          <span className="row gap16"><Stars v={d.rating} /><span className="row gap6"><Icon name="portfolio" size={14} />{d.projects} проектов</span></span>
        </div>
        <div className="row gap8">
          <button className="btn btn-ghost btn-sm grow" onClick={() => go("designer-profile")}>Открыть профиль</button>
          <button className="btn btn-primary btn-sm" onClick={() => go("order-detail", 1)}>Выбрать <Icon name="arrowRight" size={14} /></button>
        </div>
      </div>
    );
  }

  function CatalogTopFilters({ chips, active, onPick }) {
    return (
      <div className="chips" style={{ marginBottom: 22 }}>
        {chips.map(c => <button key={c} className={"pill" + (c === active ? " is-active" : "")} onClick={() => onPick(c)}>{c}</button>)}
        <button className="pill">…</button>
      </div>
    );
  }

  const RATE_STEPS = [["Любой", 0, "#9ca3af"], ["4.0+", 4.0, "#f5b13d"], ["4.5+", 4.5, "#facc15"], ["4.8+", 4.8, "#34d399"]];
  const HINTS = [
    ["pin", "КР в Москве", d => d.codes.includes("КР") && d.city === "Москва"],
    ["compass", "АР в Петербурге", d => d.codes.includes("АР") && d.city === "Санкт-Петербург"],
    ["building", "Только организации", d => d.org],
    ["portfolio", "50+ проектов", d => d.projects >= 50],
  ];

  function RateScale({ value, onPick }) {
    return (
      <div className="ratescale" title="Минимальный рейтинг">
        {RATE_STEPS.map(([label, v, c]) => (
          <button key={label} className={value === v ? "is-on" : ""} style={{ "--dot": c }} onClick={() => onPick(v)}><i />{label}</button>
        ))}
      </div>
    );
  }

  function CatHints({ active, onPick }) {
    return (
      <div className="cat-hints">
        {HINTS.map(([ic, label], i) => (
          <button key={label} className={"cat-hint" + (active === i ? " is-on" : "")} onClick={() => onPick(active === i ? null : i)}>
            <Icon name={ic} size={14} />{label}
          </button>
        ))}
      </div>
    );
  }

  function FilterPills() {
    return (
      <>
        <span className="pill"><Icon name="pin" />Регион</span>
        <span className="pill"><Icon name="layers" />Раздел</span>
        <span className="pill"><Icon name="building" />СРО</span>
        <span className="pill"><Icon name="filter" />Фильтры</span>
      </>
    );
  }

  function PromptSearch({ value, onChange, placeholder }) {
    const [files, setFiles] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const taRef = React.useRef(null);
    const fileRef = React.useRef(null);

    React.useLayoutEffect(() => {
      const ta = taRef.current; if (!ta) return;
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
    }, [value]);

    const has = (value || "").trim().length > 0 || files.length > 0;
    const submit = () => {
      if (!has || loading) return;
      setLoading(true);
      setTimeout(() => setLoading(false), 1400);
    };
    const addFiles = (e) => {
      const list = Array.from(e.target.files || []);
      if (list.length) setFiles(p => [...p, ...list]);
      e.target.value = "";
    };
    const removeFile = (i) => setFiles(p => p.filter((_, idx) => idx !== i));

    return (
      <div className="psearch">
        {files.length > 0 && (
          <div className="psearch__files">
            {files.map((f, i) => (
              <span key={i} className="psearch__file">
                <Icon name="paperclip" /><b>{f.name}</b>
                <button onClick={() => removeFile(i)} aria-label="Убрать"><Icon name="x" size={13} /></button>
              </span>
            ))}
          </div>
        )}
        <textarea ref={taRef} rows={1} className="psearch__ta" value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder || "Опишите, какой специалист нужен — раздел, регион, опыт…"}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }} />
        <div className="psearch__bar">
          <label className="psearch__act psearch__attach" data-tip="Прикрепить файлы">
            <input ref={fileRef} type="file" multiple hidden onChange={addFiles} />
            <Icon name="paperclip" />
          </label>
          <span className="psearch__spacer" />
          <button className={"psearch__act psearch__send" + (has ? " is-on" : "")} disabled={!has}
            data-tip={loading ? "Остановить" : "Найти"} onClick={submit} aria-label="Найти">
            {loading ? <span className="psearch__sq" /> : <Icon name="send" />}
          </button>
        </div>
      </div>
    );
  }

  function Designers({ go, header = "Слева" }) {
    const [q, setQ] = React.useState("");
    const [rate, setRate] = React.useState(0);
    const [hint, setHint] = React.useState(null);
    const spot = DESIGNERS[0];
    const centered = header === "По центру";

    const query = q.trim().toLowerCase();
    const list = DESIGNERS.filter(d =>
      parseFloat(d.rating) >= rate &&
      (hint == null || HINTS[hint][2](d)) &&
      (!query || d.name.toLowerCase().includes(query) || d.city.toLowerCase().includes(query))
    );
    const reset = () => { setQ(""); setRate(0); setHint(null); };

    const searchBox = <PromptSearch value={q} onChange={setQ} />;

    const grid = list.length
      ? <div className="orders-grid">{list.map(d => <PersonCard key={d.name} d={d} go={go} />)}</div>
      : (
        <div className="card" style={{ textAlign: "center", padding: 40 }}>
          <p className="muted" style={{ margin: "0 0 16px", fontSize: 14.5 }}>По заданным условиям никого не нашлось.</p>
          <button className="btn btn-outline btn-sm" onClick={reset}>Сбросить фильтры</button>
        </div>
      );

    return (
      <>
        {centered ? (
          <div className="cat-hero">
            <p className="cat-eyebrow">Каталог</p>
            <h1 className="cat-title">Проектировщики и организации</h1>
            <p className="cat-lead">Верифицированные специалисты и бюро с СРО, рейтингом и портфолио. Подберите исполнителя под раздел, регион и бюджет.</p>
            {searchBox}
            <CatHints active={hint} onPick={setHint} />
          </div>
        ) : (
          <div className="cat-head">
            <div>
              <p className="cat-eyebrow">Каталог</p>
              <h1 className="cat-title">Проектировщики<br />и организации</h1>
              <p className="cat-lead">Верифицированные специалисты и бюро с СРО, рейтингом и портфолио. Подберите исполнителя под раздел, регион и бюджет.</p>
            </div>
            <div className="cat-head__filters">
              <div className="viewtoggle">{["list","columns","menu"].map((v, i) => <button key={v} className={i === 0 ? "is-active" : ""}><Icon name={v === "list" ? "list" : v === "columns" ? "columns" : "user"} /></button>)}</div>
              <FilterPills />
            </div>
          </div>
        )}

        {centered && (
          <div className="row gap10 wrap" style={{ marginBottom: 22 }}>
            <div className="viewtoggle">{["list","columns","menu"].map((v, i) => <button key={v} className={i === 0 ? "is-active" : ""}><Icon name={v === "list" ? "list" : v === "columns" ? "columns" : "user"} /></button>)}</div>
            <FilterPills />
            <span className="grow" />
            <RateScale value={rate} onPick={setRate} />
          </div>
        )}

        <div className="catalog">
          <div className="col gap16" style={{ minWidth: 0 }}>
            {!centered && searchBox}
            {!centered && <CatHints active={hint} onPick={setHint} />}
            {!centered && (
              <div className="row gap12 wrap between">
                <RateScale value={rate} onPick={setRate} />
                <span className="dim" style={{ fontSize: 13 }}>Найдено: {list.length} из {DESIGNERS.length}</span>
              </div>
            )}
            {grid}
          </div>

          <div className="col gap20">
            <div className="card spotlight">
              <div style={{ display: "flex", justifyContent: "center" }}><PhotoAva d={spot} size={84} dot={!spot.org} /></div>
              <h3 style={{ textAlign: "center", margin: "16px 0 8px", fontSize: 19 }}>{spot.name}</h3>
              <div className="chips" style={{ justifyContent: "center", marginBottom: 12 }}>{spot.codes.map(c => <span key={c} className="chip chip-code">{c}</span>)}</div>
              <div className="col gap8 muted" style={{ fontSize: 13.5, textAlign: "center", marginBottom: 16 }}>
                <span>{spot.sro}</span>
                <span className="row gap6" style={{ justifyContent: "center" }}><Icon name="phone" size={14} />+7 987 125-45-67</span>
                <span className="row gap6" style={{ justifyContent: "center" }}><Icon name="pin" size={14} />Санкт-Петербург, ПО, МСК</span>
              </div>
              <button className="btn btn-primary btn-block" onClick={() => go("designer-profile")}>Связаться</button>
            </div>

            <div className="card">
              <h3 className="row gap8 section-title" style={{ fontSize: 16, marginBottom: 14 }}><Icon name="globe" size={17} style={{ color: "var(--accent-2)" }} />Регион</h3>
              <div className="col gap10 muted" style={{ fontSize: 13.5 }}>
                <span className="row gap6"><Icon name="pin" size={14} />Санкт-Петербург, ПО, МСК</span>
                <span className="row gap16"><Stars v="4.8" /><span>21 проект</span></span>
                {["С 2020 года в проектировании","3 года стажа","Первые места в конкурсах"].map(t => <span key={t} className="row gap8"><Icon name="check" size={14} style={{ color: "var(--green)" }} />{t}</span>)}
              </div>
              <button className="btn btn-outline btn-sm btn-block mt16" onClick={() => go("designer-profile")}>Смотреть все</button>
            </div>

            <div className="card">
              <h3 className="section-title" style={{ fontSize: 16, marginBottom: 14 }}>Последние проекты</h3>
              <div className="grid-2" style={{ gap: 12 }}>
                {[["ЖК Ренессанс","Санкт-Петербург"],["МФК Старый город","Москва"],["Торговый центр","Москва"],["Приморский центр","Новосибирск"]].map(([t, c]) => (
                  <div key={t}><div className="thumb thumb-tower" style={{ height: 76 }} /><div style={{ fontSize: 13, fontWeight: 600, marginTop: 8 }}>{t}</div><div className="dim" style={{ fontSize: 12 }}>{c}</div></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ============ DESIGNER PROFILE ============ */
  function DesignerProfile({ go }) {
    const [tab, setTab] = React.useState("Обзор");

    const PORTFOLIO = [
      { t: "ЖК «Северный парк»", c: "Санкт-Петербург", role: "АР · КР", year: "2024", area: "78 400 м²", status: ["done", "Сдан"] },
      { t: "МФК «Старый город»", c: "Москва", role: "АР", year: "2023", area: "42 100 м²", status: ["done", "Сдан"] },
      { t: "БЦ «Приморский»", c: "Владивосток", role: "КР", year: "2023", area: "31 800 м²", status: ["done", "Сдан"] },
      { t: "ЖК «Ренессанс»", c: "Санкт-Петербург", role: "АР · КР", year: "2025", area: "96 200 м²", status: ["work", "В работе"] },
    ];
    const REVIEWS = [
      { ini: "ДК", g: ["#4aa3ff", "#3b7ff0"], name: "Дмитрий Карпов", org: "ООО «СтройИнвест»", r: "5.0", date: "12 марта 2025", proj: "ЖК «Северный парк»",
        text: "Раздел КР выполнен раньше срока, все замечания экспертизы сняты с первой итерации. Олег на связи постоянно — отвечает в течение получаса. Однозначно рекомендую." },
      { ini: "АН", g: ["#3ad6a6", "#22b886"], name: "Анна Новикова", org: "ИП Новикова", r: "4.5", date: "28 января 2025", proj: "МФК «Старый город»",
        text: "Грамотный архитектор, аккуратная документация по ГОСТ. Пара правок по планировкам заняла время, но итог отличный." },
      { ini: "СМ", g: ["#f5933d", "#ec6f2a"], name: "Сергей Морозов", org: "ООО «Девелопмент-Групп»", r: "5.0", date: "9 декабря 2024", proj: "БЦ «Приморский»",
        text: "Сложный объект с ограничениями по участку — решение нашли быстро. BIM-модель чистая, коллизий минимум. Будем работать снова." },
    ];
    const DOCS = [
      { ic: "building", name: "Выписка из реестра СРО", sub: "СРО НБПИ-04-032 · Действует до 14.08.2026", tag: ["done", "Активно"] },
      { ic: "cert", name: "Специалист НРС (ГИП)", sub: "№ П-145122 · Минстрой России", tag: ["done", "Активно"] },
      { ic: "award", name: "Диплом СПбГАСУ", sub: "Архитектор · 2012 год", tag: null },
      { ic: "shield", name: "Страхование ответственности", sub: "Полис № 24/0915 · до 31.12.2025", tag: ["wait", "Истекает"] },
    ];

    const reviewAgg = [["5★", 78], ["4★", 18], ["3★", 4], ["2★", 0], ["1★", 0]];

    const Main = () => {
      if (tab === "Портфолио") return (
        <div className="card" style={{ minWidth: 0 }}>
          <div className="row between" style={{ marginBottom: 16 }}>
            <h3 className="section-title" style={{ margin: 0 }}>Портфолио · 198 проектов</h3>
            <span className="dim" style={{ fontSize: 13 }}>Показаны 4 последних</span>
          </div>
          <div className="grid-2" style={{ gap: 16 }}>
            {PORTFOLIO.map(p => (
              <div key={p.t} className="card card-hover" style={{ padding: 0, overflow: "hidden" }}>
                <div className="thumb thumb-tower" style={{ height: 132, borderRadius: 0 }} />
                <div style={{ padding: 16 }}>
                  <div className="row between" style={{ marginBottom: 8 }}>
                    <span className={"badge " + p.status[0]}><i />{p.status[1]}</span>
                    <span className="dim" style={{ fontSize: 12.5 }}>{p.year}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{p.t}</div>
                  <div className="col gap6 muted mt12" style={{ fontSize: 13 }}>
                    <span className="row gap6"><Icon name="pin" size={13} />{p.c}</span>
                    <span className="row gap16"><span className="row gap6"><Icon name="layers" size={13} />{p.role}</span><span className="row gap6"><Icon name="portfolio" size={13} />{p.area}</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      if (tab === "Отзывы") return (
        <div className="card" style={{ minWidth: 0 }}>
          <div className="row gap24 wrap" style={{ marginBottom: 22, alignItems: "center" }}>
            <div style={{ textAlign: "center", paddingRight: 24, borderRight: "1px solid var(--border)" }}>
              <div style={{ fontSize: 42, fontWeight: 800, color: "#fff", lineHeight: 1 }}>4.6</div>
              <div className="row gap4" style={{ justifyContent: "center", marginTop: 8 }}>{[0,1,2,3,4].map(i => <Icon key={i} name="star" size={14} style={{ color: i < 4 ? "var(--amber)" : "var(--text-mute)" }} />)}</div>
              <div className="dim" style={{ fontSize: 12.5, marginTop: 6 }}>76 отзывов</div>
            </div>
            <div className="col gap8 grow" style={{ minWidth: 220 }}>
              {reviewAgg.map(([lbl, pct]) => (
                <div key={lbl} className="row gap10" style={{ fontSize: 12.5 }}>
                  <span className="muted" style={{ width: 26 }}>{lbl}</span>
                  <span className="grow" style={{ height: 6, borderRadius: 99, background: "var(--surface-3)", overflow: "hidden" }}><span style={{ display: "block", height: "100%", width: pct + "%", background: "var(--amber)" }} /></span>
                  <span className="dim" style={{ width: 34, textAlign: "right" }}>{pct}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="col gap16">
            {REVIEWS.map(rv => (
              <div key={rv.name} className="card" style={{ background: "var(--surface-2)" }}>
                <div className="row gap12" style={{ marginBottom: 10 }}>
                  <Ava text={rv.ini} g={rv.g} size={40} />
                  <div className="grow">
                    <div className="row between"><div style={{ fontWeight: 700, fontSize: 14 }}>{rv.name}</div><Stars v={rv.r} /></div>
                    <div className="dim" style={{ fontSize: 12.5 }}>{rv.org} · {rv.date}</div>
                  </div>
                </div>
                <p className="muted" style={{ margin: "0 0 10px", fontSize: 13.5, lineHeight: 1.55 }}>{rv.text}</p>
                <span className="chip"><Icon name="portfolio" size={13} />{rv.proj}</span>
              </div>
            ))}
          </div>
        </div>
      );
      if (tab === "Документы и СРО") return (
        <div className="card" style={{ minWidth: 0 }}>
          <h3 className="section-title" style={{ marginBottom: 6 }}>Документы и допуски</h3>
          <p className="muted" style={{ margin: "0 0 18px", fontSize: 13.5 }}>Документы проверены платформой «Функция». Членство в СРО подтверждено в реестре НОПРИЗ.</p>
          <div className="col gap10">
            {DOCS.map(d => (
              <div key={d.name} className="row gap14" style={{ padding: "14px 16px", borderRadius: 12, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, display: "grid", placeItems: "center", background: "var(--accent-soft)", color: "var(--accent-2)", flex: "none" }}><Icon name={d.ic} size={20} /></div>
                <div className="grow" style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{d.name}</div>
                  <div className="dim" style={{ fontSize: 12.5, marginTop: 2 }}>{d.sub}</div>
                </div>
                {d.tag && <span className={"badge " + d.tag[0]}><i />{d.tag[1]}</span>}
                <button className="iconbtn" title="Скачать"><Icon name="download" size={17} /></button>
              </div>
            ))}
          </div>
        </div>
      );
      return (
        <div className="card" style={{ minWidth: 0 }}>
          <h3 className="section-title" style={{ marginBottom: 14 }}>О специалисте</h3>
          <p className="muted" style={{ lineHeight: 1.6, fontSize: 14.5, marginTop: 0 }}>Архитектор с опытом проектирования жилых комплексов. Работает в AutoCAD, Revit и ArchiCAD. Специализация — многоквартирные дома бизнес-класса и комплексное освоение территорий.</p>
          <div className="grid-2 mt24" style={{ gap: 28 }}>
            <div>
              <div className="overline">Программное обеспечение</div>
              <div className="chips mt12">{["AutoCAD","Revit","Navisworks","Lira-SAPR"].map(s => <span key={s} className="chip">{s}</span>)}</div>
            </div>
            <div>
              <div className="overline">Достижения на Функции</div>
              <div className="col gap10 mt12">{["Топ-10 архитекторов СПб","98% успешных сделок","12 лет на рынке ПИР"].map(s => <span key={s} className="row gap8" style={{ fontSize: 14 }}><Icon name="checkCircle" size={16} style={{ color: "var(--green)" }} />{s}</span>)}</div>
            </div>
          </div>
          <div className="divider mt24" />
          <div className="overline mt24">Разделы документации</div>
          <div className="chips mt12">{["АР","КР","ГП","ПОС"].map(c => <span key={c} className="chip chip-code">{c}</span>)}</div>
        </div>
      );
    };

    return (
      <>
        <div className="breadcrumb"><a className="link" onClick={() => go("designers")}>Каталог специалистов</a><Icon name="chevR" size={13} /> <span className="dim">Олег Соколов</span></div>

        <div className="profile-hero">
          <div className="profile-hero__bg" />
          <div className="profile-hero__row">
            <PhotoAva d={{ name: "Олег Соколов", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d", g: ["#a06bf5","#7d52e8"] }} size={108} dot />
            <div className="grow">
              <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 8px", color: "#fff" }}>Олег Соколов</h1>
              <div className="meta-row" style={{ fontSize: 14 }}><span><Icon name="pin" />Санкт-Петербург</span><Stars v="4.6 (Рейтинг)" /></div>
              <div className="chips mt12">{["АР","КР"].map(c => <span key={c} className="chip chip-code">{c}</span>)}</div>
            </div>
            <div className="row gap10">
              <button className="btn btn-ghost" onClick={() => go("chat")}><Icon name="comment" size={15} /> Написать</button>
              <button className="btn btn-primary" onClick={() => go("order-detail", 1)}><Icon name="rocket" size={15} /> Пригласить в проект</button>
            </div>
          </div>
        </div>

        <div className="tabs">{["Обзор","Портфолио","Отзывы","Документы и СРО"].map(t => <button key={t} className={"tab" + (t === tab ? " is-active" : "")} onClick={() => setTab(t)}>{t}</button>)}</div>

        <div className="detail__grid">
          <Main />

          <div className="col gap20">
            <div className="card">
              <div className="row between" style={{ marginBottom: 12 }}><span className="dim" style={{ fontSize: 13, fontWeight: 600 }}>График загрузки</span><span className="badge done"><i />Свободен</span></div>
              <p className="muted" style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55 }}>Готов взять проект в работу прямо сейчас. Среднее время ответа на заявку — менее 30 минут.</p>
            </div>
            <div className="card">
              <h3 className="section-title" style={{ fontSize: 16, marginBottom: 16 }}>Статистика профиля</h3>
              <div className="col gap14">
                {[["Выполнено на платформе","198 проектов"],["Стаж работы","12 лет"],["Процент успешных сделок","98%"],["Рейтинг заказчиков","4.6 / 5.0"]].map(([k, v]) => (
                  <div key={k} className="row between" style={{ fontSize: 14 }}><span className="muted">{k}</span><b style={{ color: v.includes("%") || v.includes("/") ? "var(--accent-2)" : "#fff" }}>{v}</b></div>
                ))}
              </div>
            </div>
            <div className="card">
              <h3 className="section-title" style={{ fontSize: 16, marginBottom: 14 }}>Контактные данные</h3>
              <div className="col gap12 muted" style={{ fontSize: 14 }}>
                <span className="row gap10"><Icon name="phone" size={16} style={{ color: "var(--accent-2)" }} />+7 912 345-67-89</span>
                <span className="row gap10"><Icon name="mail" size={16} style={{ color: "var(--accent-2)" }} />sokolov@proekt.ru</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ============ EXPERTS ============ */
  const EXPERTS = [
    { name: "ООО «Эксперт-Регион»", org: true, tags: ["Негос. экспертиза ПД","Аудит смет"], city: "Москва", lic: "Аккредитация МИНСТРОЙ №0015", rating: "4.9", checks: 412, g: ["#3ad6a6","#22b886"], featured: true },
    { name: "Ковалёв Иван Иванович", org: false, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d", tags: ["Проверка узлов (КР)","Аудит смет"], city: "Санкт-Петербург", lic: "Специалист НРС №145122", rating: "4.8", checks: 94, g: ["#4aa3ff","#3b7ff0"] },
    { name: "АО «BIM Технологии»", org: true, tags: ["BIM/ТИМ контроль","Инженерные сети"], city: "Казань", lic: "ISO-19650 Сертификат", rating: "4.7", checks: 156, g: ["#a06bf5","#7d52e8"] },
    { name: "Ефремова Анна", org: false, photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80", tags: ["Инженерные сети","BIM/ТИМ контроль"], city: "Новосибирск", lic: "Инженер-эксперт ПБ", rating: "5.0", checks: 58, g: ["#f5933d","#ec6f2a"] },
    { name: "Центр Сметного Аудита", org: true, tags: ["Аудит смет","Негос. экспертиза ПД"], city: "Краснодар", lic: "Лицензия №24/11", rating: "4.6", checks: 812, g: ["#f76f9e","#f0507f"] },
  ];
  const EXPERT_HINTS = [
    ["shield", "Негос. экспертиза", e => e.tags.some(t => t.includes("экспертиза"))],
    ["bim", "BIM / ТИМ", e => e.tags.some(t => t.includes("BIM"))],
    ["building", "Только организации", e => e.org],
    ["checkCircle", "100+ проверок", e => e.checks >= 100],
  ];

  /* карточка эксперта — по принципу PersonCard проектировщиков */
  function ExpertCard({ e, go }) {
    return (
      <div className={"card card-hover personcard" + (e.featured ? " is-featured" : "")}>
        <div className="row gap12" style={{ marginBottom: 14 }}>
          <PhotoAva d={e} dot={!e.org} />
          <div style={{ minWidth: 0 }}>
            <div className="row gap8 wrap" style={{ fontWeight: 700, fontSize: 15 }}>
              {e.name}
              {e.featured && <span className="row gap4" style={{ color: "var(--green)", fontSize: 12.5, fontWeight: 600 }}><Icon name="check" size={14} />Лидер отрасли</span>}
            </div>
            <div className="chips" style={{ marginTop: 6 }}>{e.tags.map(t => <span key={t} className="chip">{t}</span>)}</div>
          </div>
        </div>
        <div className="col gap8 muted" style={{ fontSize: 13.5, marginBottom: 14 }}>
          <span className="row gap6"><Icon name="pin" size={14} />{e.city}</span>
          <span className="row gap6"><Icon name="cert" size={14} />{e.lic}</span>
          <span className="row gap16"><Stars v={e.rating} /><span className="row gap6"><Icon name="checkCircle" size={14} style={{ color: "var(--green)" }} />{e.checks} проверок</span></span>
        </div>
        <div className="row gap8">
          <button className="btn btn-ghost btn-sm grow" onClick={() => go("chat")}>Обсудить</button>
          <button className="btn btn-primary btn-sm" onClick={() => go("expertise")}>Выбрать <Icon name="arrowRight" size={14} /></button>
        </div>
      </div>
    );
  }

  function ExpertHints({ active, onPick }) {
    return (
      <div className="cat-hints">
        {EXPERT_HINTS.map(([ic, label], i) => (
          <button key={label} className={"cat-hint" + (active === i ? " is-on" : "")} onClick={() => onPick(active === i ? null : i)}>
            <Icon name={ic} size={14} />{label}
          </button>
        ))}
      </div>
    );
  }

  function Experts({ go, header = "Слева" }) {
    const [q, setQ] = React.useState("");
    const [rate, setRate] = React.useState(0);
    const [hint, setHint] = React.useState(null);
    const centered = header === "По центру";
    const spot = EXPERTS[0];

    const query = q.trim().toLowerCase();
    const list = EXPERTS.filter(e =>
      parseFloat(e.rating) >= rate &&
      (hint == null || EXPERT_HINTS[hint][2](e)) &&
      (!query || e.name.toLowerCase().includes(query) || e.city.toLowerCase().includes(query) || e.tags.join(" ").toLowerCase().includes(query))
    );
    const reset = () => { setQ(""); setRate(0); setHint(null); };

    const searchBox = <PromptSearch value={q} onChange={setQ} placeholder="Опишите, какая экспертиза нужна — разделы, аудит, BIM…" />;
    const filterPills = (
      <>
        <span className="pill"><Icon name="pin" />Регион</span>
        <span className="pill"><Icon name="shield" />Тип проверки</span>
        <span className="pill"><Icon name="cert" />Сертификаты</span>
      </>
    );
    const viewToggle = (
      <div className="viewtoggle">{["list","columns","menu"].map((v, i) => <button key={v} className={i === 0 ? "is-active" : ""}><Icon name={v === "list" ? "list" : v === "columns" ? "columns" : "shield"} /></button>)}</div>
    );
    const grid = list.length
      ? <div className="orders-grid">{list.map(e => <ExpertCard key={e.name} e={e} go={go} />)}</div>
      : (
        <div className="card" style={{ textAlign: "center", padding: 40 }}>
          <p className="muted" style={{ margin: "0 0 16px", fontSize: 14.5 }}>По заданным условиям никого не нашлось.</p>
          <button className="btn btn-outline btn-sm" onClick={reset}>Сбросить фильтры</button>
        </div>
      );

    return (
      <>
        {centered ? (
          <div className="cat-hero">
            <p className="cat-eyebrow">Экспертиза</p>
            <h1 className="cat-title">Эксперты и BIM-контроль</h1>
            <p className="cat-lead">Аккредитованные эксперты и организации для проверки разделов, аудита смет и BIM/ТИМ-контроля. Выберите исполнителя под тип экспертизы.</p>
            {searchBox}
            <ExpertHints active={hint} onPick={setHint} />
          </div>
        ) : (
          <div className="cat-head">
            <div>
              <p className="cat-eyebrow">Экспертиза</p>
              <h1 className="cat-title">Эксперты<br />и BIM-контроль</h1>
              <p className="cat-lead">Аккредитованные эксперты и организации для проверки разделов, аудита смет и BIM/ТИМ-контроля. Выберите исполнителя под тип экспертизы.</p>
            </div>
            <div className="cat-head__filters">
              {viewToggle}
              {filterPills}
            </div>
          </div>
        )}

        {centered && (
          <div className="row gap10 wrap" style={{ marginBottom: 22 }}>
            {viewToggle}
            {filterPills}
            <span className="grow" />
            <RateScale value={rate} onPick={setRate} />
          </div>
        )}

        <div className="catalog">
          <div className="col gap16" style={{ minWidth: 0 }}>
            {!centered && searchBox}
            {!centered && <ExpertHints active={hint} onPick={setHint} />}
            {!centered && (
              <div className="row gap12 wrap between">
                <RateScale value={rate} onPick={setRate} />
                <span className="dim" style={{ fontSize: 13 }}>Найдено: {list.length} из {EXPERTS.length}</span>
              </div>
            )}
            {grid}
          </div>

          <div className="col gap20">
            <div className="card spotlight">
              <div style={{ display: "flex", justifyContent: "center" }}><PhotoAva d={spot} size={84} /></div>
              <h3 style={{ textAlign: "center", margin: "16px 0 8px", fontSize: 18 }}>{spot.name}</h3>
              <div className="chips" style={{ justifyContent: "center", marginBottom: 12 }}>{spot.tags.map(t => <span key={t} className="chip">{t}</span>)}</div>
              <div className="col gap8 muted" style={{ fontSize: 13.5, textAlign: "center", marginBottom: 16 }}>
                <span className="row gap6" style={{ justifyContent: "center" }}><Icon name="cert" size={14} />{spot.lic}</span>
                <span className="row gap6" style={{ justifyContent: "center" }}><Icon name="phone" size={14} />+7 495 222-33-44</span>
                <span className="row gap6" style={{ justifyContent: "center" }}><Icon name="pin" size={14} />{spot.city}</span>
              </div>
              <button className="btn btn-primary btn-block" onClick={() => go("chat")}>Связаться</button>
              <button className="btn btn-outline btn-block mt12" onClick={() => go("expertise")}>Заказать экспертизу</button>
            </div>

            <div className="card">
              <h3 className="row gap8 section-title" style={{ fontSize: 16, marginBottom: 14 }}><Icon name="chart" size={17} style={{ color: "var(--accent-2)" }} />Статистика</h3>
              <div className="col gap10 muted" style={{ fontSize: 13.5 }}>
                <span className="row gap6"><Icon name="pin" size={14} />{spot.city}, работа по всей РФ</span>
                <span className="row gap16"><Stars v={spot.rating} /><span>{spot.checks} заключений · 8 лет</span></span>
                {["Допуск к объектам гос. значения","Проверка сметной документации","Полная материальная ответственность"].map(t => <span key={t} className="row gap8"><Icon name="check" size={14} style={{ color: "var(--green)" }} />{t}</span>)}
              </div>
              <button className="btn btn-outline btn-sm btn-block mt16" onClick={() => go("expertise")}>Смотреть все</button>
            </div>

            <div className="card">
              <h3 className="section-title" style={{ fontSize: 16, marginBottom: 14 }}>Последние заключения</h3>
              <div className="grid-2" style={{ gap: 12 }}>
                {[["ЖК «Симфония»","14 разделов"],["Складской комплекс","КР, ОВиК"],["Школа на 1200 мест","Полная экспертиза"],["БЦ «Меридиан»","АР, КР"]].map(([t, c]) => (
                  <div key={t}><div className="thumb thumb-tower" style={{ height: 76 }} /><div style={{ fontSize: 13, fontWeight: 600, marginTop: 8 }}>{t}</div><div className="dim" style={{ fontSize: 12 }}>{c}</div></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ============ MANUFACTURERS ============ */
  const MANUF = [
    { name: "ООО «ТехФасад»", type: "org", desc: "Производитель фасадных систем и узлов для жилых и коммерческих зданий", chips: ["BIM","Узлы","СП / ГОСТ","АР / КР"], rating: "4.8", projects: 120, geo: "РФ / СНГ", g: ["#a06bf5","#7d52e8"], featured: true, contacts: true },
    { name: "Завод ЖБИ «ЗапСибСтрой»", type: "org", desc: "Производство ЖБИ изделий для промышленного и гражданского строительства", chips: ["КР","Нормативы","Промышленность"], rating: "4.9", projects: 87, geo: "РФ / СНГ", g: ["#4aa3ff","#3b7ff0"] },
    { name: "АО «ПрофМет»", type: "org", desc: "Производитель металлических конструкций, поставщик для кровельных систем", chips: ["КР","Металл","ГОСТ"], rating: "4.6", projects: 65, geo: "РФ", g: ["#f5933d","#ec6f2a"] },
    { name: "СтальПром Урал", type: "org", desc: "Изготовление и монтаж металлоконструкций, узлы крепления, опорные системы", chips: ["КР","Узлы","ГОСТ"], rating: "4.7", projects: 53, geo: "РФ", g: ["#3ad6a6","#22b886"] },
  ];
  const PRODUCTS = [
    { name: "Фасадная система F-300", sub: "Навес на фасад", chips: ["BIM","Узлы","FC","Сертификаты"], spec: "СП 60, ГОСТ-31231", certs: 18 },
    { name: "Узел крепления UF-12", sub: "Узел фасада", chips: ["BIM","Узлы","ГОСТ","КР"], spec: "ФС ГОСТ-31231", certs: 68 },
  ];
  function Manufacturers({ go }) {
    const EXAMPLES = [
      "Мне нужен узел крепления фасада для здания 75 м в климатической зоне II с минераловатным утеплителем.",
      "Подбери систему плоской эксплуатируемой кровли для промышленного здания с уклоном 1,5%.",
      "Какое решение по огнезащите металлоконструкций обеспечит предел R120 для складского комплекса?",
    ];
    const [query, setQuery] = React.useState(EXAMPLES[0]);
    const [active, setActive] = React.useState(0);
    const [thinking, setThinking] = React.useState(false);
    const [mode, setMode] = React.useState(null);
    const taRef = React.useRef(null);
    const fileRef = React.useRef(null);
    const [files, setFiles] = React.useState([]);
    const onFiles = (e) => { const ns = Array.from(e.target.files || []).map(f => f.name); if (ns.length) setFiles(p => [...p, ...ns]); e.target.value = ""; };
    const SUGGEST = [
      ["Узел крепления фасада", "здание 75 м, зона II, минвата", 0],
      ["Плоская эксплуатируемая кровля", "промздание, уклон 1,5%", 1],
      ["Огнезащита металлоконструкций", "предел R120, склад", 2],
    ];
    React.useLayoutEffect(() => { const ta = taRef.current; if (ta) { ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight, 160) + "px"; } }, [query]);
    const ask = (q, idx) => {
      const text = (q != null ? q : query).trim(); if (!text) return;
      setQuery(text); if (idx != null) setActive(idx); setThinking(true);
      setTimeout(() => setThinking(false), 750);
    };

    const ANSWERS = [
      {
        parsed: ["Фасад", "Высота 75 м", "Ветровой район II", "Минвата 150 мм", "λ ≤ 0,038"],
        sol: [
          { t: "Навесной вентилируемый фасад (НВФ)", tag: "Рекомендовано", tagC: "var(--green)", match: 96, short: "НВФ",
            d: "Алюминиевая подсистема, минераловатный утеплитель 150 мм, облицовка из керамогранита. Рассчитан на ветровую нагрузку района II и высоту до 100 м.",
            chips: ["Узел КР-12", "R₀ ≥ 3,2", "НГ", "Ветер II"],
            det: {
              params: [["Высота применения", "до 100 м"], ["Ветровой район", "II (до 0,30 кПа)"], ["Сопротивление R₀", "≥ 3,2 м²·°C/Вт"], ["Пож. опасность", "К0 / НГ"]],
              layers: [["Облицовка", "керамогранит 8 мм, скрытый крепёж"], ["Воздушный зазор", "40 мм, вентилируемый"], ["Утеплитель", "минвата 150 мм, λ=0,037"], ["Подсистема", "алюминий, кронштейн КР-12, шаг 600 мм"], ["Несущая стена", "газобетон / монолит"]],
              pros: ["Вентзазор исключает накопление влаги", "Ремонтопригодность облицовки", "Проходит экспертизу по СП 2.13130 без доп. обоснования"],
            } },
          { t: "Фасад с фиброцементными плитами", tag: "Альтернатива", tagC: "var(--blue)", match: 88, short: "Фиброцемент",
            d: "Лёгкая облицовка на оцинкованной подсистеме. Меньшая нагрузка на узел, но требует уменьшенного шага кронштейнов на высоте 75 м.",
            chips: ["Узел КР-08", "Г1", "Лёгкий"] },
          { t: "Штукатурный фасад (СФТК)", tag: "С ограничением", tagC: "var(--amber)", match: 61, short: "СФТК",
            d: "Для здания 75 м применяется только с противопожарными рассечками и дополнительным механическим креплением. Требует обоснования по ветровой нагрузке.",
            chips: ["Огранич. по высоте", "Доп. крепёж"] },
        ],
        makers: [
          { n: "ООО «ТехФасад»", d: "НВФ-подсистемы и узлы крепления, готовая BIM-библиотека", tag: "BIM", rating: "4.8", g: ["#a06bf5", "#7d52e8"] },
          { n: "Rockwool", d: "Минераловатный утеплитель λ=0,037, сертификаты НГ", tag: "Каталог", rating: "4.9", g: ["#e0518a", "#c43f72"] },
          { n: "АО «ПрофМет»", d: "Алюминиевые направляющие и кронштейны по ГОСТ", tag: "ГОСТ", rating: "4.6", g: ["#f5933d", "#ec6f2a"] },
        ],
        norms: [
          ["СП 20.13330.2016", "Нагрузки и воздействия — ветровой район II"],
          ["СП 50.13330.2012", "Тепловая защита зданий"],
          ["ГОСТ 31251-2008", "Стены наружные. Метод испытания на пожарную опасность"],
          ["СП 2.13130.2020", "Обеспечение огнестойкости объектов защиты"],
        ],
        bim: [
          ["bim", "Узел крепления НВФ КР-12.rfa", "Revit · 2,4 МБ"],
          ["bim", "Кронштейн фасадный.ifc", "IFC · 1,1 МБ"],
          ["layers", "Спецификация подсистемы.xlsx", "XLSX · 320 КБ"],
        ],
        objects: [
          ["assets/hero-commercial.png", "БЦ «Меридиан»", "Москва · 78 м · 2024"],
          ["assets/hero-industrial.png", "ЖК «Высота»", "Казань · 75 м · 2023"],
          ["assets/hero-private.png", "Отель «Панорама»", "Сочи · 72 м · 2024"],
        ],
      },
      {
        parsed: ["Кровля", "Плоская эксплуатируемая", "Уклон 1,5%", "Промышленное здание", "ПВХ-мембрана"],
        sol: [
          { t: "Инверсионная кровля с ПВХ-мембраной", tag: "Рекомендовано", tagC: "var(--green)", match: 94, short: "Инверсия",
            d: "Балластная инверсионная система: ПВХ-мембрана, экструзионный пенополистирол, балласт. Подходит для эксплуатируемой кровли с уклоном 1,5% и пешеходной нагрузкой.",
            chips: ["ПВХ 1,5 мм", "ЭППС", "Уклон 1,5%", "Балласт"],
            det: {
              params: [["Уклон", "1,5% (норма ≥ 1,5%)"], ["Нагрузка", "эксплуатируемая, пешеходная"], ["Утеплитель", "ЭППС, λ=0,032"], ["Гидроизоляция", "ПВХ-мембрана 1,5 мм"]],
              layers: [["Балласт / плитка", "на опорах, ≥ 50 мм"], ["Геотекстиль", "разделительный слой"], ["Утеплитель ЭППС", "в 2 слоя вразбежку"], ["ПВХ-мембрана", "1,5 мм, свободная укладка"], ["Разуклонка", "уклон 1,5%"], ["Несущая плита", "монолит / профлист"]],
              pros: ["Гидроизоляция защищена утеплителем от УФ и перепадов", "Долговечность 25+ лет", "Ремонт без вскрытия пирога — поднять балласт"],
            } },
          { t: "Мастичная кровля (полиуретан)", tag: "Альтернатива", tagC: "var(--blue)", match: 81, short: "Мастика",
            d: "Бесшовное полиуретановое покрытие, ремонтопригодно и стойко к застою воды, но дороже в нанесении на больших площадях.",
            chips: ["Бесшовная", "ПУ", "Ремонтопригодна"] },
          { t: "Битумно-полимерная наплавляемая", tag: "С ограничением", tagC: "var(--amber)", match: 69, short: "Наплавляемая",
            d: "Двухслойная наплавляемая система. Для эксплуатируемой кровли требует защитной стяжки и финишного покрытия плиткой.",
            chips: ["2 слоя", "Защитная стяжка"] },
        ],
        makers: [
          { n: "ТЕХНОНИКОЛЬ", d: "ПВХ-мембраны, узлы примыканий, BIM-библиотека", tag: "BIM", rating: "4.9", g: ["#4aa3ff", "#3b7ff0"] },
          { n: "ПЕНОПЛЭКС", d: "Экструзионный пенополистирол для инверсии", tag: "Каталог", rating: "4.8", g: ["#3ad6a6", "#22b886"] },
          { n: "Sika", d: "Полиуретановые мастики и герметики", tag: "ГОСТ", rating: "4.7", g: ["#f5933d", "#ec6f2a"] },
        ],
        norms: [
          ["СП 17.13330.2017", "Кровли"],
          ["СП 28.13330.2017", "Защита строительных конструкций от коррозии"],
          ["СП 50.13330.2012", "Тепловая защита зданий"],
          ["ГОСТ 30547-97", "Материалы рулонные кровельные. Общие технические условия"],
        ],
        bim: [
          ["bim", "Узел примыкания к парапету.rfa", "Revit · 1,8 МБ"],
          ["bim", "Воронка водосточная.ifc", "IFC · 0,9 МБ"],
          ["layers", "Спецификация кровельного пирога.xlsx", "XLSX · 280 КБ"],
        ],
        objects: [
          ["assets/hero-industrial.png", "Логистический центр А-12", "Москва · 24 000 м² · 2024"],
          ["assets/hero-commercial.png", "ТЦ «Галерея»", "Самара · эксплуатируемая · 2023"],
          ["assets/hero-private.png", "Паркинг «Центральный»", "Уфа · кровля-стилобат · 2024"],
        ],
      },
      {
        parsed: ["Огнезащита", "Металлоконструкции", "Предел R120", "Складской комплекс", "Конструктивная"],
        sol: [
          { t: "Конструктивная огнезащита плитами", tag: "Рекомендовано", tagC: "var(--green)", match: 95, short: "Плиты",
            d: "Облицовка несущих колонн и балок негорючими плитами. Гарантированный предел R120 без зависимости от приведённой толщины металла, сухой монтаж.",
            chips: ["R120", "НГ", "Плиты", "Сухой монтаж"],
            det: {
              params: [["Предел огнестойкости", "R120"], ["Тип", "конструктивная, сухой монтаж"], ["Приведённая толщина", "не нормируется"], ["Материал", "негорючие плиты НГ"]],
              layers: [["Несущая колонна", "двутавр / коробка"], ["Каркас крепления", "оцинкованный профиль"], ["Плиты огнезащиты", "2 слоя, вразбежку"], ["Крепёж", "анкеры / саморезы"], ["Финиш", "шпатлёвка / окраска (опц.)"]],
              pros: ["R120 без зависимости от сечения металла", "Сухой монтаж — всесезонно", "Не требует контроля толщины, как вспучивающаяся краска"],
            } },
          { t: "Вспучивающаяся краска", tag: "Альтернатива", tagC: "var(--blue)", match: 83, short: "Краска",
            d: "Тонкослойное покрытие, сохраняет геометрию конструкций. Для R120 требует значительной толщины и контроля приведённой толщины металла.",
            chips: ["Тонкослойная", "Окраска", "Контроль ТМ"] },
          { t: "Напыляемый минеральный состав", tag: "С ограничением", tagC: "var(--amber)", match: 71, short: "Напыление",
            d: "Экономичное решение для скрытых конструкций, но неприменимо для открытых эстетичных элементов без облицовки.",
            chips: ["Напыление", "Скрытые конструкции"] },
        ],
        makers: [
          { n: "PROMAT", d: "Негорячие плиты, расчёт огнезащиты, BIM", tag: "BIM", rating: "4.8", g: ["#a06bf5", "#7d52e8"] },
          { n: "Неохим", d: "Вспучивающиеся составы, сертификаты ПБ", tag: "Сертификаты", rating: "4.6", g: ["#e0518a", "#c43f72"] },
          { n: "ТИЗОЛ", d: "Базальтовые плиты и напыляемые составы", tag: "ГОСТ", rating: "4.7", g: ["#3ad6a6", "#22b886"] },
        ],
        norms: [
          ["СП 2.13130.2020", "Обеспечение огнестойкости объектов защиты"],
          ["ГОСТ Р 53295-2009", "Средства огнезащиты для стальных конструкций"],
          ["ГОСТ 30247.1-94", "Конструкции. Методы испытаний на огнестойкость"],
          ["СП 56.13330.2021", "Производственные здания"],
        ],
        bim: [
          ["bim", "Огнезащита колонны R120.rfa", "Revit · 1,5 МБ"],
          ["layers", "Ведомость огнезащиты МК.xlsx", "XLSX · 210 КБ"],
          ["file", "Сертификат ПБ на состав (R120).pdf", "PDF · 3,2 МБ"],
        ],
        objects: [
          ["assets/hero-industrial.png", "Склад класса А «ЛогоПарк»", "Подольск · R120 · 2024"],
          ["assets/hero-commercial.png", "Производство «ТехноЛайн»", "Тула · МК · 2023"],
          ["assets/hero-private.png", "Распредцентр «Север»", "Тверь · R120 · 2024"],
        ],
      },
    ];
    const A = ANSWERS[active] || ANSWERS[0];
    const parsed = A.parsed, SOLUTIONS = A.sol, MAKERS = A.makers, NORMS = A.norms, BIM = A.bim, OBJECTS = A.objects;

    const [tab, setTab] = React.useState("ai");
    const [openSol, setOpenSol] = React.useState(null);
    const P_CATS = ["Все", "Фасады", "Кровля", "Утеплители", "Металл", "ЖБИ", "Огнезащита", "Инж. системы"];
    const PRODUCERS = [
      { n: "ООО «ТехФасад»", cat: "Фасады", d: "НВФ-подсистемы и узлы крепления, BIM-библиотека", tag: "BIM", rating: "4.8", geo: "РФ / СНГ", g: ["#a06bf5", "#7d52e8"], det: { founded: "2007", about: "Производитель навесных вентилируемых фасадов: алюминиевые и нержавеющие подсистемы, кронштейны, готовая BIM-библиотека узлов под Revit и IFC.", products: ["Подсистема НВФ (алюминий)", "Кронштейны КР-08 / КР-12", "Узлы примыканий и откосов", "Облицовка: керамогранит, ХПЛ"], certs: ["ТР ТС", "Расчёт ветровой нагрузки", "Пожарный сертификат НГ"], bim: 42, projects: [["assets/hero-commercial.png", "БЦ «Меридиан»", "Москва · 78 м"], ["assets/hero-industrial.png", "ЖК «Высота»", "Казань · 75 м"]] } },
      { n: "ТЕХНОНИКОЛЬ", cat: "Кровля", d: "Кровля, гидро- и пароизоляция, узлы примыканий", tag: "BIM", rating: "4.9", geo: "РФ / СНГ", g: ["#4aa3ff", "#3b7ff0"], det: { founded: "1992", about: "Один из крупнейших производителей кровельных и гидроизоляционных материалов: ПВХ-мембраны, битумные материалы, узлы примыканий, развитая BIM-библиотека.", products: ["ПВХ-мембраны LOGICROOF", "Битумно-полимерные материалы", "Воронки и узлы примыканий", "Пароизоляция"], certs: ["ТР ТС", "ISO 9001", "Пожарные сертификаты"], bim: 120, projects: [["assets/hero-industrial.png", "Логистический центр А-12", "Москва · 24 000 м²"], ["assets/hero-commercial.png", "ТЦ «Галерея»", "Самара"]] } },
      { n: "Rockwool", cat: "Утеплители", d: "Минераловатный утеплитель, сертификаты НГ", tag: "Каталог", rating: "4.9", geo: "РФ", g: ["#e0518a", "#c43f72"], det: { founded: "1937", about: "Каменная вата для тепло-, звукоизоляции и огнезащиты. Полная линейка под фасады, кровли и перегородки с сертификатами негорючести.", products: ["Фасадные плиты λ=0,037", "Кровельные плиты", "Звукоизоляция", "Огнезащитные маты"], certs: ["НГ (негорючий)", "ТР ТС", "Сертификат теплопроводности"], bim: 64, projects: [["assets/hero-commercial.png", "БЦ «Меридиан»", "Москва"], ["assets/hero-private.png", "Отель «Панорама»", "Сочи"]] } },
      { n: "ПЕНОПЛЭКС", cat: "Утеплители", d: "Экструзионный пенополистирол XPS", tag: "Каталог", rating: "4.8", geo: "РФ", g: ["#3ad6a6", "#22b886"], det: { founded: "1998", about: "Экструзионный пенополистирол XPS для инверсионных кровель, фундаментов и цоколей. Низкое водопоглощение и стабильная теплопроводность.", products: ["XPS λ=0,032", "Плиты для инверсии", "Фундаментные плиты", "Дренажные решения"], certs: ["ТР ТС", "Сертификат прочности", "Гигиеническое заключение"], bim: 28, projects: [["assets/hero-industrial.png", "Паркинг «Центральный»", "Уфа"], ["assets/hero-commercial.png", "ТЦ «Галерея»", "Самара"]] } },
      { n: "АО «ПрофМет»", cat: "Металл", d: "Металлоконструкции, направляющие, кронштейны", tag: "ГОСТ", rating: "4.6", geo: "РФ", g: ["#f5933d", "#ec6f2a"], det: { founded: "2004", about: "Производство металлоконструкций и комплектующих по ГОСТ: направляющие, кронштейны, закладные детали, оцинкованный и нержавеющий профиль.", products: ["Направляющие фасадные", "Кронштейны несущие", "Закладные детали", "Оцинкованный профиль"], certs: ["ГОСТ 23118-2019", "Сертификат сварки", "ТР ТС"], bim: 18, projects: [["assets/hero-industrial.png", "ЖК «Высота»", "Казань"]] } },
      { n: "Завод ЖБИ «ЗапСибСтрой»", cat: "ЖБИ", d: "ЖБИ для промышленного и гражданского строительства", tag: "ГОСТ", rating: "4.7", geo: "РФ", g: ["#5b9dff", "#3b7ff0"], det: { founded: "1981", about: "Железобетонные изделия для промышленного и гражданского строительства: плиты, балки, колонны, сваи. Собственная лаборатория контроля качества.", products: ["Плиты перекрытия", "Балки и ригели", "Колонны", "Сваи забивные"], certs: ["ГОСТ 13015-2012", "Паспорт качества", "Сертификат бетона"], bim: 36, projects: [["assets/hero-industrial.png", "Логистический центр А-12", "Москва"]] } },
      { n: "PROMAT", cat: "Огнезащита", d: "Негорючие плиты, расчёт огнезащиты, BIM", tag: "BIM", rating: "4.8", geo: "РФ / ЕС", g: ["#a06bf5", "#7d52e8"], det: { founded: "1958", about: "Системы пассивной огнезащиты: негорючие плиты, расчёт пределов огнестойкости R до 240, BIM-модели узлов облицовки конструкций.", products: ["Плиты огнезащитные", "Системы R60–R240", "Огнезащита воздуховодов", "Расчёт огнестойкости"], certs: ["ГОСТ Р 53295-2009", "Сертификат ПБ", "Протоколы испытаний"], bim: 54, projects: [["assets/hero-industrial.png", "Склад класса А «ЛогоПарк»", "Подольск · R120"]] } },
      { n: "Knauf", cat: "Инж. системы", d: "Сухие смеси, ГКЛ, системы перегородок", tag: "Каталог", rating: "4.8", geo: "РФ / СНГ", g: ["#f0a94b", "#e0913d"], det: { founded: "1932", about: "Строительные материалы и системы: гипсокартон, сухие смеси, перегородки, потолки. Полная техническая документация и BIM-объекты.", products: ["ГКЛ / ГВЛ", "Сухие смеси", "Системы перегородок", "Подвесные потолки"], certs: ["ТР ТС", "ISO 9001", "Пожарные сертификаты"], bim: 88, projects: [["assets/hero-commercial.png", "БЦ «Меридиан»", "Москва"]] } },
    ];
    const [pCat, setPCat] = React.useState("Все");
    const [pq, setPq] = React.useState("");
    const [openProd, setOpenProd] = React.useState(null);
    const producers = PRODUCERS.filter(m => (pCat === "Все" || m.cat === pCat) && (!pq.trim() || (m.n + " " + m.d).toLowerCase().includes(pq.trim().toLowerCase())));

    const B_CATS = ["Все", "Узлы", "Конструкции", "Фасады", "Инж. системы", "Спецификации"];
    const BIMLIB = [
      { ic: "bim", n: "Узел крепления НВФ КР-12.rfa", cat: "Узлы", fmt: "Revit", size: "2,4 МБ" },
      { ic: "bim", n: "Кронштейн фасадный.ifc", cat: "Фасады", fmt: "IFC", size: "1,1 МБ" },
      { ic: "bim", n: "Узел примыкания кровли к парапету.rfa", cat: "Узлы", fmt: "Revit", size: "1,8 МБ" },
      { ic: "bim", n: "Балка перекрытия Б-300.ifc", cat: "Конструкции", fmt: "IFC", size: "2,0 МБ" },
      { ic: "bim", n: "Огнезащита колонны R120.rfa", cat: "Конструкции", fmt: "Revit", size: "1,5 МБ" },
      { ic: "cpu", n: "Узел ввода инженерных сетей.rfa", cat: "Инж. системы", fmt: "Revit", size: "1,3 МБ" },
      { ic: "layers", n: "Спецификация фасадной подсистемы.xlsx", cat: "Спецификации", fmt: "XLSX", size: "320 КБ" },
      { ic: "layers", n: "Ведомость огнезащиты МК.xlsx", cat: "Спецификации", fmt: "XLSX", size: "210 КБ" },
    ];
    const [bCat, setBCat] = React.useState("Все");
    const [bq, setBq] = React.useState("");
    const bims = BIMLIB.filter(b => (bCat === "Все" || b.cat === bCat) && (!bq.trim() || b.n.toLowerCase().includes(bq.trim().toLowerCase())));

    const Section = ({ icon, title, count, children }) => (
      <div className="ai-sec">
        <div className="ai-sec__h">
          <span className="ai-sec__ic"><Icon name={icon} size={16} /></span>
          <h3 className="section-title" style={{ fontSize: 17 }}>{title}</h3>
          {count != null && <span className="dim" style={{ fontSize: 13 }}>{count}</span>}
        </div>
        {children}
      </div>
    );

    return (
      <>
        <p className="cat-eyebrow">Производители и решения</p>
        <h1 className="cat-title" style={{ maxWidth: 640 }}>Каталог решений и ИИ-подбор</h1>
        <div className="tabs" style={{ marginTop: 18 }}>
          {[["ai", "ИИ-подбор"], ["prod", "Производители"], ["bim", "BIM-модели"]].map(([k, l]) => (
            <button key={k} className={"tab" + (tab === k ? " is-active" : "")} onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>

        {tab === "ai" && <div className="ai-tabwrap">
        <div className="ai-hero ai-hero--split">
          <div className="ai-glow" aria-hidden="true" />
          <div className="ai-hero__main">
            <span className="ai-badge"><Icon name="spark" size={13} /> ИИ-помощник проектировщика</span>
            <h2 className="ai-hero__title">Опишите задачу — соберём решение</h2>
            <p className="ai-hero__sub">Помощник подберёт решения, сверит их с нормативами и покажет производителей, BIM-модели и реализованные объекты.</p>

            <div className={"ai-pbox" + (thinking ? " is-loading" : "")}>
              {files.length > 0 && <div className="ai-pbox__files">
                {files.map((f, i) => (
                  <span key={i} className="ai-att"><Icon name="file" size={13} />{f}<button type="button" onClick={() => setFiles(p => p.filter((_, j) => j !== i))} aria-label="Убрать"><Icon name="x" size={12} /></button></span>
                ))}
              </div>}
              <textarea ref={taRef} className="ai-pbox__ta" rows={1} value={query}
                placeholder={mode === "norm" ? "Поиск по нормативной базе…" : mode === "analyze" ? "Глубокий разбор задачи…" : mode === "bim" ? "Подбор BIM-моделей…" : "Какую инженерную задачу решаем?"}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(); } }} />
              <input type="file" ref={fileRef} multiple onChange={onFiles} style={{ display: "none" }} />
              <div className="ai-pbox__bar">
                <div className="ai-pbox__tools">
                  <button type="button" className="ai-pbox__attach" title="Прикрепить файлы" onClick={() => fileRef.current && fileRef.current.click()}><Icon name="paperclip" size={18} /></button>
                  <div className="ai-pbox__toggles">
                    {[["norm", "Нормативы", "globe", "#3f9fe0"], ["analyze", "Анализ", "brain", "#8b6cf2"], ["bim", "BIM", "layers", "#f0913d"]].map(([k, label, ic, col], i) => (
                      <React.Fragment key={k}>
                        {i > 0 && <span className="ai-pbox__div" />}
                        <button type="button" className={"ai-pbox__tg" + (mode === k ? " is-on" : "")} style={mode === k ? { color: col, borderColor: col, background: `color-mix(in srgb, ${col} 15%, transparent)` } : null} onClick={() => setMode(m => m === k ? null : k)}>
                          <Icon name={ic} size={16} />{mode === k && <span>{label}</span>}
                        </button>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <button type="button" className={"ai-pbox__send" + ((query.trim() || files.length) ? " is-on" : "")} onClick={() => ask()} disabled={thinking} aria-label="Подобрать">
                  <Icon name={thinking ? "scan" : (query.trim() || files.length) ? "arrowUp" : "mic"} size={18} />
                </button>
              </div>
            </div>

            <div className="ai-pills">
              {SUGGEST.map(([title, label, idx]) => (
                <button key={title} type="button" className={"ai-pill" + (idx === active ? " is-on" : "")} onClick={() => ask(EXAMPLES[idx], idx)}>{title}</button>
              ))}
            </div>
          </div>

          <div className="ai-hero__aside">
            <div className="ai-hero__mascot"><window.Mascots scale={0.46} /></div>
          </div>
        </div>

        <div className={"ai-answer" + (thinking ? " is-dim" : "")}>
          <div className="ai-understood">
            <span className="ai-understood__l"><Icon name="checkCircle" size={15} style={{ color: "var(--green)" }} /> Задача распознана</span>
            <div className="chips">{parsed.map(p => <span key={p} className="chip chip-code">{p}</span>)}</div>
          </div>

          <Section icon="bulb" title="Решения" count={SOLUTIONS.length + " варианта"}>
            <div className="col gap16">
              <SolChart sols={SOLUTIONS} themeKey={active} onPick={setOpenSol} />
              <div className="solgrid">
                {SOLUTIONS.map(s => (
                  <div key={s.t} className="solv ai-sol--click" onClick={() => setOpenSol(s)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") setOpenSol(s); }}>
                    <span className="solv__edge" style={{ background: s.tagC }} />
                    <div className="solv__top">
                      <span className="ai-tag" style={{ color: s.tagC, background: `color-mix(in srgb, ${s.tagC} 14%, transparent)` }}>{s.tag}</span>
                      <span className="solv__match" style={{ color: s.tagC }}><b>{s.match}</b><small>%</small></span>
                    </div>
                    <b className="solv__title">{s.t}</b>
                    <p className="solv__desc">{s.d}</p>
                    <div className="chips solv__chips">{s.chips.map(c => <span key={c} className="chip chip-code">{c}</span>)}</div>
                    <span className="ai-sol__more solv__more">Подробнее <Icon name="arrowRight" size={14} /></span>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <Section icon="database" title="Нормативная база" count={NORMS.length}>
            <div className="secgrid">
              {NORMS.map(([code, name]) => (
                <div key={code} className="secitem"><span className="chip chip-code">{code}</span><span className="secitem__name">{name}</span></div>
              ))}
            </div>
          </Section>

          <Section icon="building" title="Реализованные объекты" count={OBJECTS.length}>
            <div className="ai-grid">
              {OBJECTS.map(([img, name, meta]) => (
                <div key={name} className="ai-obj">
                  <div className="ai-obj__img" style={{ backgroundImage: "url('" + img + "')" }} />
                  <div className="ai-obj__b"><div style={{ fontWeight: 700, fontSize: 14 }}>{name}</div><div className="dim" style={{ fontSize: 12.5 }}>{meta}</div></div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {openSol && (() => {
          const s = openSol, det = s.det || {};
          return (
            <div className="solm" onClick={() => setOpenSol(null)}>
              <div className="solm__panel" onClick={e => e.stopPropagation()}>
                <button className="solm__close" onClick={() => setOpenSol(null)} aria-label="Закрыть"><Icon name="x" size={18} /></button>
                <div className="solm__head" style={{ borderColor: `color-mix(in srgb, ${s.tagC} 30%, transparent)` }}>
                  <span className="ai-tag" style={{ color: s.tagC, background: `color-mix(in srgb, ${s.tagC} 14%, transparent)` }}>{s.tag}</span>
                  <h2 className="solm__title">{s.t}</h2>
                  <p className="muted" style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.55, maxWidth: 560 }}>{s.d}</p>
                  <div className="solm__match"><div className="solm__ring" style={{ background: `conic-gradient(${s.tagC} ${s.match * 3.6}deg, var(--surface-3) 0)` }}><span>{s.match}<small>%</small></span></div><span className="dim" style={{ fontSize: 12 }}>совпадение<br />с задачей</span></div>
                </div>

                <div className="solm__body">
                  {det.params && <div className="solm__sec">
                    <h4 className="solm__h">Параметры</h4>
                    <div className="solm__params">{det.params.map(([k, v]) => <div key={k} className="solm__param"><span className="dim">{k}</span><b>{v}</b></div>)}</div>
                  </div>}

                  {det.layers && <div className="solm__sec">
                    <h4 className="solm__h">Состав узла</h4>
                    <div className="solm__layers">{det.layers.map(([n, d], i) => <div key={n} className="solm__layer"><span className="solm__layer-n">{i + 1}</span><div><b>{n}</b><span className="dim">{d}</span></div></div>)}</div>
                  </div>}

                  {det.pros && <div className="solm__sec">
                    <h4 className="solm__h">Преимущества</h4>
                    <ul className="solm__pros">{det.pros.map(p => <li key={p}><Icon name="check" size={15} />{p}</li>)}</ul>
                  </div>}

                  <div className="solm__sec">
                    <h4 className="solm__h">Применимые нормативы</h4>
                    <div className="secgrid">{NORMS.slice(0, 3).map(([code, name]) => <div key={code} className="secitem"><span className="chip chip-code">{code}</span><span className="secitem__name">{name}</span></div>)}</div>
                  </div>

                  <div className="solm__sec">
                    <h4 className="solm__h">Производители</h4>
                    <div className="solm__makers">{MAKERS.slice(0, 3).map(m => {
                      const match = PRODUCERS.find(p => p.n === m.n || p.n.includes(m.n) || m.n.includes(p.n));
                      const target = match || Object.assign({ cat: "—", tag: m.tag, geo: "РФ", det: { about: m.d } }, m);
                      return <button key={m.n} type="button" className="solm__maker solm__maker--btn" onClick={() => { setOpenSol(null); setTab("prod"); setOpenProd(target); }} title={"Открыть «" + m.n + "»"}><div className="manuf__logo" style={Object.assign({ width: 34, height: 34 }, grad(m.g[0], m.g[1]))}><Icon name="factory" size={16} /></div><div style={{ minWidth: 0 }}><b>{m.n}</b><span className="dim">★ {m.rating}</span></div><Icon name="arrowRight" size={14} className="solm__maker-go" /></button>;
                    })}</div>
                  </div>

                  <div className="solm__sec">
                    <h4 className="solm__h">BIM-модели и спецификации</h4>
                    <div className="col gap8">{BIM.map(([ic, name, meta]) => <div key={name} className="ai-file"><div className="ai-file__ic"><Icon name={ic} size={16} /></div><div style={{ minWidth: 0, flex: 1 }}><div style={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div><div className="dim" style={{ fontSize: 11.5 }}>{meta}</div></div><button className="iconbtn" style={{ width: 32, height: 32, flex: "none" }}><Icon name="download" size={15} /></button></div>)}</div>
                  </div>
                </div>

                <div className="solm__foot">
                  <button className="btn btn-ghost" onClick={() => setOpenSol(null)}>Закрыть</button>
                  <div className="row gap8">
                    <button className="btn btn-ghost"><Icon name="download" size={15} /> Скачать BIM</button>
                    <button className="btn btn-primary" onClick={() => go("order-detail", 1)}><Icon name="plus" size={15} /> В проект</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
        </div>}

        {tab === "prod" && <div className="ai-tabwrap">
          <div className="row between gap16 wrap" style={{ margin: "18px 0 16px", alignItems: "center" }}>
            <div className="topbar__search" style={{ maxWidth: 360, height: 44 }}><Icon name="search" /><input placeholder="Поиск производителя или решения…" value={pq} onChange={e => setPq(e.target.value)} /></div>
            <span className="dim" style={{ fontSize: 13 }}>Найдено: {producers.length}</span>
          </div>
          <div className="chips" style={{ marginBottom: 20 }}>
            {P_CATS.map(c => <button key={c} className={"pill" + (c === pCat ? " is-active" : "")} onClick={() => setPCat(c)}>{c}</button>)}
          </div>
          {producers.length ? <div className="ai-grid">
            {producers.map(m => (
              <div key={m.n} className="card card-hover prod-card" onClick={() => setOpenProd(m)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") setOpenProd(m); }}>
                <div className="row gap12" style={{ marginBottom: 12 }}>
                  <div className="manuf__logo" style={grad(m.g[0], m.g[1])}><Icon name="factory" size={20} /></div>
                  <div style={{ minWidth: 0 }}><div style={{ fontWeight: 700, fontSize: 14.5 }}>{m.n}</div><div className="row gap6 dim" style={{ fontSize: 12.5 }}><Icon name="star" size={12} style={{ color: "var(--amber)" }} />{m.rating} · {m.geo}</div></div>
                </div>
                <p className="muted" style={{ margin: "0 0 14px", fontSize: 13, lineHeight: 1.45 }}>{m.d}</p>
                <div className="row between" style={{ alignItems: "center" }}><span className="chip chip-code">{m.cat}</span><div className="row gap8"><span className="chip">{m.tag}</span><span className="ai-sol__more">Открыть <Icon name="arrowRight" size={14} /></span></div></div>
              </div>
            ))}
          </div> : <div className="card" style={{ textAlign: "center", padding: 40 }}><p className="muted" style={{ margin: 0 }}>Ничего не найдено. Измените запрос или категорию.</p></div>}

          {openProd && (() => {
            const m = openProd, det = m.det || {};
            return (
              <div className="solm" onClick={() => setOpenProd(null)}>
                <div className="solm__panel" onClick={e => e.stopPropagation()}>
                  <button className="solm__close" onClick={() => setOpenProd(null)} aria-label="Закрыть"><Icon name="x" size={18} /></button>
                  <div className="solm__head">
                    <div className="row gap14" style={{ alignItems: "center" }}>
                      <div className="manuf__logo" style={Object.assign({ width: 52, height: 52, flex: "none" }, grad(m.g[0], m.g[1]))}><Icon name="factory" size={24} /></div>
                      <div style={{ minWidth: 0 }}>
                        <h2 className="solm__title" style={{ margin: 0 }}>{m.n}</h2>
                        <div className="row gap10 dim" style={{ fontSize: 13, marginTop: 5, flexWrap: "wrap" }}><span className="row gap5"><Icon name="star" size={13} style={{ color: "var(--amber)" }} />{m.rating}</span><span className="row gap5"><Icon name="pin" size={13} />{m.geo}</span>{det.founded && <span className="row gap5"><Icon name="calendar" size={13} />с {det.founded}</span>}</div>
                      </div>
                    </div>
                    <div className="chips" style={{ marginTop: 14 }}><span className="chip chip-code">{m.cat}</span><span className="chip">{m.tag}</span>{det.bim != null && <span className="chip"><Icon name="layers" size={12} /> {det.bim} BIM-моделей</span>}</div>
                  </div>

                  <div className="solm__body">
                    {det.about && <div className="solm__sec"><h4 className="solm__h">О производителе</h4><p className="muted" style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55 }}>{det.about}</p></div>}

                    {det.products && <div className="solm__sec">
                      <h4 className="solm__h">Продукция</h4>
                      <div className="solm__params">{det.products.map(p => <div key={p} className="solm__param" style={{ flexDirection: "row", alignItems: "center", gap: 9 }}><Icon name="box" size={15} style={{ color: "var(--accent-2)", flex: "none" }} /><b style={{ fontSize: 13 }}>{p}</b></div>)}</div>
                    </div>}

                    {det.certs && <div className="solm__sec">
                      <h4 className="solm__h">Сертификаты и документы</h4>
                      <ul className="solm__pros">{det.certs.map(c => <li key={c}><Icon name="check" size={15} />{c}</li>)}</ul>
                    </div>}

                    {det.projects && det.projects.length > 0 && <div className="solm__sec">
                      <h4 className="solm__h">Объекты с продукцией</h4>
                      <div className="ai-grid">{det.projects.map(([img, name, meta]) => <div key={name} className="ai-obj"><div className="ai-obj__img" style={{ backgroundImage: "url('" + img + "')" }} /><div className="ai-obj__b"><div style={{ fontWeight: 700, fontSize: 13.5 }}>{name}</div><div className="dim" style={{ fontSize: 12 }}>{meta}</div></div></div>)}</div>
                    </div>}
                  </div>

                  <div className="solm__foot">
                    <button className="btn btn-ghost" onClick={() => setOpenProd(null)}>Закрыть</button>
                    <div className="row gap8">
                      <button className="btn btn-ghost"><Icon name="download" size={15} /> Скачать BIM</button>
                      <button className="btn btn-primary" onClick={() => go("chat")}><Icon name="chat" size={15} /> Связаться</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>}

        {tab === "bim" && <div className="ai-tabwrap">
          <div className="row between gap16 wrap" style={{ margin: "18px 0 16px", alignItems: "center" }}>
            <div className="topbar__search" style={{ maxWidth: 360, height: 44 }}><Icon name="search" /><input placeholder="Поиск модели или спецификации…" value={bq} onChange={e => setBq(e.target.value)} /></div>
            <span className="dim" style={{ fontSize: 13 }}>Найдено: {bims.length}</span>
          </div>
          <div className="chips" style={{ marginBottom: 20 }}>
            {B_CATS.map(c => <button key={c} className={"pill" + (c === bCat ? " is-active" : "")} onClick={() => setBCat(c)}>{c}</button>)}
          </div>
          {bims.length ? <div className="ai-grid">
            {bims.map(b => (
              <div key={b.n} className="ai-file">
                <div className="ai-file__ic"><Icon name={b.ic} size={18} /></div>
                <div style={{ minWidth: 0, flex: 1 }}><div style={{ fontWeight: 600, fontSize: 13.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.n}</div><div className="dim" style={{ fontSize: 12 }}>{b.fmt} · {b.size} · {b.cat}</div></div>
                <button className="iconbtn" style={{ width: 34, height: 34, flex: "none" }} title="Скачать"><Icon name="download" size={16} /></button>
              </div>
            ))}
          </div> : <div className="card" style={{ textAlign: "center", padding: 40 }}><p className="muted" style={{ margin: 0 }}>Ничего не найдено.</p></div>}
        </div>}
      </>
    );
  }

  Object.assign(window, { Designers, DesignerProfile, Experts, Manufacturers, PromptSearch });
})();
