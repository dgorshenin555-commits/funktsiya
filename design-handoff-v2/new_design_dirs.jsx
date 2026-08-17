/* new_design_dirs.jsx — Функция 2026: Исполнители + Производители */
(function () {
  const { useState } = React;

  const Arr = ({ s = 14 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>);
  const Search = ({ s = 15 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="7" cy="7" r="4.4" /><path d="M10.4 10.4L14 14" /></svg>);
  const Chk = ({ s = 11 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5l3.5 3.5L13 4.5" /></svg>);

  const Ring = ({ v }) => {
    const c = v >= 85 ? "var(--moss)" : v >= 75 ? "var(--acid-d)" : "var(--clay)";
    return (
      <div className="ring">
        <svg viewBox="0 0 44 44" width="54" height="54">
          <circle cx="22" cy="22" r="19.5" fill="none" stroke="var(--paper-2)" strokeWidth="3" />
          <circle cx="22" cy="22" r="19.5" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeDasharray={`${v * 1.225} 200`} transform="rotate(-90 22 22)" />
        </svg>
        <b className="num">{v}</b>
      </div>
    );
  };

  /* ---------------- исполнители ---------------- */
  const PROS = [
    { n: "ТС", name: "ООО «Техносфера»", city: "Нижний Новгород", dirs: ["Проектировщик", "Эксперт", "Чертёжник"], kind: "Проектная организация", tr: 91, yrs: 14, prj: 62, late: "0,8%", resp: "2 ч", secs: ["ОВ", "ВК", "ЭОМ", "ТХ"], v: ["СРО", "Страхование 30 млн", "Экспертиза 41", "Отзывы 28"], team: 34, top: true, note: "Инженерные разделы для промышленных объектов, котельные до 20 МВт, ИТП." },
    { n: "АФ", name: "АБ «Форма»", city: "Москва", dirs: ["Проектировщик", "Чертёжник"], kind: "Архитектурное бюро", tr: 84, yrs: 11, prj: 51, late: "2,1%", resp: "5 ч", secs: ["АР", "КЖ", "ГП"], v: ["СРО", "Страхование 15 млн", "Отзывы 19"], team: 22, note: "Жилые комплексы и общественные здания, стадии П и Р, авторский надзор." },
    { n: "ИГ", name: "ИнжГрупп", city: "Казань", dirs: ["Проектировщик", "Эксперт"], kind: "Проектная организация", tr: 88, yrs: 9, prj: 47, late: "1,2%", resp: "3 ч", secs: ["ЭОМ", "СС", "АУПТ", "АПС"], v: ["СРО", "Страхование 20 млн", "Экспертиза 26", "Отзывы 22"], team: 18, note: "Электрика и слаботочные системы, пожарная автоматика, диспетчеризация." },
    { n: "СП", name: "«СтройПроект-Э»", city: "Екатеринбург", dirs: ["Обследователь", "Эксперт"], kind: "Обследование · лаборатория", tr: 89, yrs: 22, prj: 118, late: "1,0%", resp: "4 ч", secs: ["ТО", "КЖ", "КМ"], v: ["СРО", "Аттестация лаборатории", "Страхование 25 млн", "Отзывы 44"], team: 27, note: "Техническое обследование, поверочные расчёты, заключения о состоянии несущих конструкций." },
    { n: "ПВ", name: "ПБ «Вектор»", city: "Самара", dirs: ["Проектировщик", "Чертёжник"], kind: "Проектная организация", tr: 78, yrs: 6, prj: 24, late: "4,6%", resp: "8 ч", secs: ["АР", "ОВ", "ВК"], v: ["СРО", "Отзывы 9"], team: 11, note: "Небольшое бюро, реконструкция и перепланировки, работа по фиксированной ставке." },
    { n: "АК", name: "Антон Ковалёв", city: "Москва", dirs: ["Проектировщик"], kind: "Частный специалист · ГИП", solo: true, role: "ГИП · ОВ, ВК", form: "ИП", tr: 86, yrs: 16, prj: 38, late: "1,4%", resp: "3 ч", secs: ["ОВ", "ВК", "ИТП"], v: ["НРС · ГИП", "Диплом МГСУ, 2008", "ИП, договор через платформу", "Отзывы 17"], note: "Ведёт разделы ОВ и ВК как ГИП: котельные, ИТП, тепловые сети. Работает с проектными организациями на субподряде." },
    { n: "ЕМ", name: "Елена Мартынова", city: "Санкт-Петербург", dirs: ["Проектировщик", "Чертёжник"], kind: "Частный специалист · архитектор", solo: true, role: "Архитектор · АР, ГП", form: "Самозанятая", tr: 81, yrs: 12, prj: 29, late: "2,3%", resp: "6 ч", secs: ["АР", "ГП"], v: ["НРС · архитектор", "Диплом СПбГАСУ, 2012", "Самозанятая, договор через платформу", "Отзывы 11"], note: "Планировки и фасады жилых и общественных зданий, стадия П, сопровождение до заключения." },
    { n: "ДШ", name: "Дмитрий Шевцов", city: "Екатеринбург", dirs: ["Обследователь", "Проектировщик"], kind: "Частный специалист · расчётчик", solo: true, role: "Расчётчик · КЖ, КМ", form: "ИП", tr: 84, yrs: 10, prj: 44, late: "0,9%", resp: "4 ч", secs: ["КЖ", "КМ", "ТО"], v: ["НРС · конструктор", "Аттестация по расчётам", "ИП, договор через платформу", "Отзывы 14"], note: "Поверочные расчёты несущих конструкций, усиление, разделы КЖ и КМ по обследованию." },
  ];

  const PRO_F = {
    "Тип": [["Проектная организация", 812], ["Архитектурное бюро", 291], ["Частный специалист", 438], ["Обследование", 148]],
    "Подтверждено": [["Членство в СРО", 1240], ["НРС (реестр специалистов)", 438], ["Диплом / аттестация", 512], ["Страхование ответственности", 731], ["История сделок", 402]],
  };
  /* код раздела из справочника стадий → коды, которыми исполнители описывают компетенции */
  const SEC_ALIAS = { "ОВиК": ["ОВ", "ОВиК", "ИТП"], "КР": ["КЖ", "КМ"], "ВК": ["ВК", "НВК"], "НВК": ["НВК", "ВК"], "ТС": ["ТС", "ИТП"], "СМ": ["СМ"], "ПЗ": [], "ТЭО": [], "ОДИ": [], "ЭЭ": [], "ГОЧС": [], "ПОС": [], "ООС": [], "ПБ": ["ПБ", "АУПТ", "АПС"], "АУПТ": ["АУПТ", "АПС"], "ТУС": [], "ПЗУ": ["ГП", "ПЗУ"] };
  const secMatch = (code, proSecs) => (SEC_ALIAS[code] || [code]).some(a => proSecs.includes(a));

  /* направления работы — быстрый вход в фильтр списка исполнителей */
  const DIRS = [
    ["Проектировщик", "разделы ПД и РД"],
    ["Эксперт", "заключения и замечания"],
    ["Чертёжник", "выпуск чертежей и BIM"],
    ["Обследователь", "обмеры и техсостояние"],
  ];
  const dirOf = p => p.dirs || [];

  /* ---------------- быстрый подбор исполнителей (3 этапа + результат) ---------------- */
  const QP_TYPES = [
    ["Проектная организация", "Полный комплект разделов, СРО, штат ГИПов", 812],
    ["Архитектурное бюро", "АР, ГП, концепции и авторский надзор", 291],
    ["Частный специалист", "НРС, диплом, договор через платформу", 438],
    ["Обследование", "Лаборатории, поверочные расчёты, заключения", 148],
  ];

  function QuickPick({ pros, secMatch, onApply, onClose }) {
    const TREE = (window.REQ_FORM && window.REQ_FORM.STAGE_TREE) || [];
    const [step, setStep] = useState(1);
    const [types, setTypes] = useState([]);
    const [stages, setStages] = useState([]);
    const [secs, setSecs] = useState([]);
    const tgl = (set, v) => set(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);
    /* разделы выбранных стадий — с расшифровкой из справочника */
    const stageSecs = [...new Set(TREE.filter(s => stages.includes(s.code)).flatMap(s => s.secs.map(x => x[0])))];
    const secTitle = {};
    TREE.forEach(s => s.secs.forEach(([c, n]) => { if (!secTitle[c]) secTitle[c] = n; }));
    /* при смене стадий — все разделы стадии подставляются, лишние убираются */
    React.useEffect(() => { setSecs(stageSecs); }, [stages.join(",")]);
    const pickedSecs = secs.length ? secs : stageSecs;
    const matchType = p => !types.length || types.some(t => t === "Частный специалист" ? p.solo : t === "Обследование" ? p.kind.includes("Обследование") : p.kind === t);
    const result = pros.filter(p => matchType(p) && (!pickedSecs.length || pickedSecs.some(c => secMatch(c, p.secs)))).sort((a, b) => b.tr - a.tr);
    const proCount = code => pros.filter(p => matchType(p) && secMatch(code, p.secs)).length;
    const TITLES = { 1: "Кто нужен?", 2: "На какой стадии?", 3: "Какой раздел нужен?" };
    const HINTS = { 1: "можно выбрать несколько", 2: "разделы подставятся сами", 3: "оставьте только нужные разделы", 4: "фильтры применятся к списку" };

    return (
      <div className="qpw" onClick={onClose}>
        <div className="qp" onClick={e => e.stopPropagation()}>
          <div className="qp__h">
            <div>
              <span className="lbl">Быстрый подбор · этап {step} из 4</span>
              <h3>{TITLES[step] || "Подходят " + result.length}</h3>
            </div>
            <button className="qp__x" onClick={onClose}>✕</button>
          </div>
          <div className="qp__steps">{[1, 2, 3, 4].map(i => <i key={i} className={i <= step ? "on" : ""} />)}</div>

          <div className="qp__b">
            {step === 1 && (
              <div className="qp__grid">
                {QP_TYPES.map(([t, d2, n]) => (
                  <button key={t} className={"qpcard" + (types.includes(t) ? " on" : "")} onClick={() => tgl(setTypes, t)}>
                    <b>{t}</b><em>{d2}</em><span className="lbl">{n} в базе</span>
                  </button>
                ))}
              </div>
            )}
            {step === 2 && (
              <div className="qp__grid">
                {TREE.map(st => (
                  <button key={st.code} className={"qpcard" + (stages.includes(st.code) ? " on" : "")} onClick={() => tgl(setStages, st.code)}>
                    <b><span className="stg__c">{st.code}</span> {st.name}</b>
                    <em>{st.secs.slice(0, 6).map(s => s[0]).join(", ")}{st.secs.length > 6 ? " +" + (st.secs.length - 6) : ""}</em>
                    <span className="lbl">{st.secs.length} разделов · {st.n} заявок</span>
                  </button>
                ))}
              </div>
            )}
            {step === 3 && (
              stageSecs.length === 0
                ? <p className="qp__empty">Сначала выберите стадию — разделы берутся из её состава. Можно пропустить этап — тогда искать будем по всем разделам.</p>
                : (<>
                  <div className="qp__secbar">
                    <span className="lbl">Выбрано {secs.length} из {stageSecs.length}</span>
                    <span className="spacer" />
                    <button className="btn btn-line btn-sm" onClick={() => setSecs(stageSecs)}>Все разделы</button>
                    <button className="btn btn-line btn-sm" onClick={() => setSecs([])}>Снять всё</button>
                  </div>
                  <div className="qp__secs">
                    {stageSecs.map(c => {
                      const n = proCount(c);
                      return (
                        <button key={c} className={"qpsec" + (secs.includes(c) ? " on" : "") + (n ? "" : " none")} onClick={() => tgl(setSecs, c)}>
                          <span className="stg__c">{c}</span>
                          <b>{secTitle[c] || "Раздел документации"}</b>
                          <em>{n ? n + " исп." : "нет исп."}</em>
                        </button>
                      );
                    })}
                  </div>
                </>)
            )}
            {step === 4 && (
              <div className="qp__res">
                <div className="qp__sum">
                  <div><span className="lbl">Тип</span><b>{types.length ? types.join(", ") : "любой"}</b></div>
                  <div><span className="lbl">Стадия</span><b>{stages.length ? stages.join(", ") : "любая"}</b></div>
                  <div><span className="lbl">Разделы</span><b>{pickedSecs.length ? pickedSecs.join(", ") : "все"}</b></div>
                </div>
                {result.length === 0 && <p className="qp__empty">Под эти условия исполнителей нет. Вернитесь и снимите часть условий.</p>}
                {result.slice(0, 4).map(p => (
                  <div className="qprow" key={p.n}>
                    <div className={"pini num" + (p.solo ? " pini--solo" : "")} style={{ width: 38, height: 38, fontSize: 13 }}>{p.n}</div>
                    <div style={{ minWidth: 0 }}>
                      <b>{p.name}</b>
                      <span>{p.kind} · {p.city} · {p.secs.join(", ")}</span>
                    </div>
                    <span className="trust"><span className="dot" style={{ background: p.tr >= 85 ? "var(--moss)" : "var(--acid-d)" }} />{p.tr}</span>
                  </div>
                ))}
                {result.length > 4 && <span className="lbl">и ещё {result.length - 4} — в списке</span>}
              </div>
            )}
          </div>

          <div className="qp__f">
            {step > 1 && <button className="btn btn-line" onClick={() => setStep(step - 1)}>Назад</button>}
            {step < 4
              ? <button className="btn btn-ink" onClick={() => setStep(step + 1)}>Далее <Arr /></button>
              : <button className="btn btn-acid" disabled={!result.length} style={{ opacity: result.length ? 1 : .45 }} onClick={() => onApply({ types, stages, secs: pickedSecs })}>Показать {result.length} в списке</button>}
            <span className="lbl" style={{ marginLeft: "auto" }}>{HINTS[step]}</span>
          </div>
        </div>
      </div>
    );
  }

  function Pick({ go }) {
    const [on, setOn] = useState(["История сделок"]);
    const [sort, setSort] = useState("Индекс");
    const [who, setWho] = useState("Все");
    const [sel, setSel] = useState([]);
    const toggle = (v, set, arr) => set(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);
    /* фильтр по стадии проектирования и разделам внутри стадии (справочник request_form.jsx) */
    const TREE = (window.REQ_FORM && window.REQ_FORM.STAGE_TREE) || [];
    const [stages, setStages] = useState([]);
    const [secs, setSecs] = useState([]);
    const [openSt, setOpenSt] = useState([]);
    const tglIn = (set, v) => set(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);
    const stageSecs = st => st.secs.map(s => s[0]);
    const allSecsOn = st => stageSecs(st).every(c => secs.includes(c));
    const pickStage = st => {
      const codes = stageSecs(st);
      if (stages.includes(st.code)) { setStages(p => p.filter(x => x !== st.code)); setSecs(p => p.filter(c => !codes.includes(c))); }
      else { setStages(p => [...p, st.code]); setSecs(p => [...new Set([...p, ...codes])]); setOpenSt(p => p.includes(st.code) ? p : [...p, st.code]); }
    };
    const resetAll = () => { setOn([]); setStages([]); setSecs([]); setOpenSt([]); setWho("Все"); setDir(null); };
    const [quick, setQuick] = useState(false);
    const [dir, setDir] = useState(null);
    const applyQuick = ({ types, stages: st, secs: sc }) => {
      setOn(types); setStages(st); setSecs(sc); setOpenSt(st);
      setWho(types.length === 1 && types[0] === "Частный специалист" ? "Специалисты" : types.length && !types.includes("Частный специалист") ? "Организации" : "Все");
      setQuick(false);
    };
    const fCount = on.length + stages.length + secs.length + (dir ? 1 : 0);
    const list = PROS
      .filter(p => !dir || dirOf(p).includes(dir))
      .filter(p => who === "Все" ? true : who === "Организации" ? !p.solo : p.solo)
      .filter(p => !secs.length || secs.some(c => secMatch(c, p.secs)))
      .filter(p => { const t = on.filter(v => QP_TYPES.some(q => q[0] === v)); return !t.length || t.some(v => v === "Частный специалист" ? p.solo : v === "Обследование" ? p.kind.includes("Обследование") : p.kind === v); })
      .sort((a, b) => sort === "Индекс" ? b.tr - a.tr : sort === "Опыт" ? b.yrs - a.yrs : a.resp.localeCompare(b.resp));

    return (
      <div className="scroll">
        {quick && <QuickPick pros={PROS} secMatch={secMatch} onApply={applyQuick} onClose={() => setQuick(false)} />}
        <div className="wrap">
          <div className="qbar">
            <div className="qbar__l">
              <span className="lbl">Не знаете, кого искать</span>
              <h2>Быстрый подбор исполнителя</h2>
              <p>Три вопроса — тип исполнителя, стадия проектирования и нужные разделы. Дальше платформа покажет подходящих.</p>
            </div>
            <button className="btn btn-acid btn-lg" onClick={() => setQuick(true)}>Подобрать за 3 шага <Arr /></button>
            <div className="dirs">
              <span className="lbl">Или сразу по направлению</span>
              <div className="dirs__r">
                {DIRS.map(([d, hint]) => (
                  <button key={d} className={"dirbtn" + (dir === d ? " on" : "")} onClick={() => setDir(dir === d ? null : d)}>
                    <b>{d}</b><em>{hint}</em><span className="num">{PROS.filter(p => dirOf(p).includes(d)).length}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="wrap reqs">
          <aside className="rail">
            <div className="rail__g">
              <span className="lbl">Поиск</span>
              <div className="omni" style={{ minWidth: 0 }}><Search /> Название, раздел, город</div>
            </div>
            {Object.entries(PRO_F).map(([g, items]) => (
              <div className="rail__g" key={g}>
                <span className="lbl">{g}</span>
                {items.map(([v, n]) => (
                  <div className={"fchk" + (on.includes(v) ? " on" : "")} key={v} onClick={() => toggle(v, setOn, on)}><i />{v}<em>{n}</em></div>
                ))}
              </div>
            ))}
            <div className="rail__g">
              <span className="lbl">Стадия проектирования</span>
              {TREE.map(st => {
                const isOpen = openSt.includes(st.code);
                const picked = stages.includes(st.code) || allSecsOn(st);
                const inner = st.secs.filter(s => secs.includes(s[0])).length;
                return (
                  <div className="stg" key={st.code}>
                    <div className="stg__h">
                      <div className={"fchk" + (picked ? " on" : "")} onClick={() => pickStage(st)}>
                        <i /><span className="stg__c">{st.code}</span>{st.name}<em>{st.n}</em>
                      </div>
                      <button className={"stg__t" + (isOpen ? " on" : "")} onClick={() => tglIn(setOpenSt, st.code)} title="Разделы стадии">
                        <span className="lbl">{inner ? inner + "/" + st.secs.length : st.secs.length}</span>
                        <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6.5l4 4 4-4" /></svg>
                      </button>
                    </div>
                    {isOpen && (
                      <div className="stg__b">
                        {st.secs.map(([c, nm, cnt]) => (
                          <div className={"fchk fchk--sub" + (secs.includes(c) ? " on" : "")} key={c} onClick={() => tglIn(setSecs, c)} title={nm}>
                            <i /><span className="stg__c">{c}</span><span className="stg__n">{nm}</span><em>{cnt}</em>
                          </div>
                        ))}
                        <div className="stg__a">
                          <button className="lbl" onClick={() => setSecs(p => [...new Set([...p, ...stageSecs(st)])])}>все разделы</button>
                          <button className="lbl" onClick={() => setSecs(p => p.filter(c => !stageSecs(st).includes(c)))}>снять</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="rail__g">
              <span className="lbl">Индекс доверия</span>
              <div className="row g8" style={{ height: 8, background: "var(--paper-2)", borderRadius: 99, position: "relative" }}>
                <div style={{ position: "absolute", left: "40%", right: 0, top: 0, bottom: 0, background: "var(--ink)", borderRadius: 99 }} />
              </div>
              <div className="row" style={{ justifyContent: "space-between" }}><span className="lbl">от 75</span><span className="lbl">100</span></div>
            </div>
            <button className="btn btn-line btn-sm" onClick={resetAll}>Сбросить фильтры{fCount ? " · " + fCount : ""}</button>
          </aside>

          <main>
            <div className="sec-h">
              <div><span className="lbl">Исполнители</span><h2 style={{ marginTop: 8 }}>Организации и частные специалисты</h2></div>
              <div className="row g12" style={{ flexWrap: "wrap" }}>
                <div className="seg">{["Все", "Организации", "Специалисты"].map(t => <button key={t} className={who === t ? "on" : ""} onClick={() => setWho(t)}>{t}</button>)}</div>
                <div className="seg">{["Индекс", "Опыт", "Отклик"].map(t => <button key={t} className={sort === t ? "on" : ""} onClick={() => setSort(t)}>{t}</button>)}</div>
                <button className="btn btn-line btn-sm">Пригласить в заявку</button>
              </div>
            </div>

            {(dir || stages.length > 0 || secs.length > 0) && (
              <div className="fbar">
                <span className="lbl">Фильтр</span>
                {dir && <button className="ftag" onClick={() => setDir(null)}>{dir} ✕</button>}
                {stages.map(c => <button className="ftag" key={"st" + c} onClick={() => tglIn(setStages, c)}>Стадия {c} ✕</button>)}
                {secs.map(c => <button className="ftag ftag--sec" key={"sc" + c} onClick={() => tglIn(setSecs, c)}>{c} ✕</button>)}
                <span className="lbl" style={{ marginLeft: "auto" }}>Найдено {list.length}</span>
              </div>
            )}

            <div style={{ display: "grid", gap: 14 }}>
              {list.length === 0 && (
                <div className="card" style={{ padding: 28, display: "grid", gap: 12, justifyItems: "start" }}>
                  <span className="lbl">Никого не найдено</span>
                  <p style={{ margin: 0, fontSize: 14.5, color: "var(--ink-2)", maxWidth: "52ch" }}>Под выбранные разделы исполнителей нет. Снимите часть разделов или выберите другую стадию.</p>
                  <button className="btn btn-line btn-sm" onClick={resetAll}>Сбросить фильтры</button>
                </div>
              )}
              {list.map(p => (
                <article className={"card pcard" + (sel.includes(p.n) ? " sel" : "") + (p.solo ? " pcard--solo" : "")} key={p.n}>
                  <div className="pcard__head">
                    <div className={"pini num" + (p.solo ? " pini--solo" : "")}>{p.n}</div>
                    <div style={{ minWidth: 0 }}>
                      <div className="row g8" style={{ marginBottom: 7, flexWrap: "wrap" }}>
                        <span className="lbl">{p.kind}</span>
                        {p.solo && <span className="tag solo-chip">физлицо · {p.form}</span>}
                        {p.top && <span className="best">в топе региона</span>}
                      </div>
                      <h3>{p.name}</h3>
                      {p.role && <span className="lbl" style={{ display: "block", margin: "4px 0 2px" }}>{p.role}</span>}
                      <p className="pcard__note">{p.note}</p>
                      <div className="rcard__meta" style={{ marginTop: 11 }}>
                        <span className="tag solid">{p.city}</span>
                        {p.secs.map(s => <span className="tag" key={s}>{s}</span>)}
                      </div>
                    </div>
                    <div className="pcard__tr">
                      <Ring v={p.tr} />
                      <span className="lbl" style={{ textAlign: "center" }}>индекс<br />доверия</span>
                    </div>
                  </div>

                  <div className="vlist">
                    {p.v.map(v => <span className="vchk" key={v}><i><Chk /></i>{v}</span>)}
                  </div>

                  <div className="rcard__grid">
                    <div className="f"><span>Опыт</span><b>{p.yrs} лет</b></div>
                    <div className="f"><span>Проектов</span><b>{p.prj}</b></div>
                    <div className="f"><span>Срыв сроков</span><b style={{ color: parseFloat(p.late) > 3 ? "var(--clay)" : "var(--moss)" }}>{p.late}</b></div>
                    <div className="f"><span>Отклик</span><b>{p.resp}</b></div>
                    <div className="f"><span>{p.solo ? "Формат" : "Команда"}</span><b>{p.solo ? p.form : p.team}</b></div>
                    <div className="row g8" style={{ justifySelf: "end", alignSelf: "end" }}>
                      <button className={"btn btn-sm " + (sel.includes(p.n) ? "btn-acid" : "btn-line")} onClick={() => toggle(p.n, setSel, sel)}>{sel.includes(p.n) ? "В сравнении" : "К сравнению"}</button>
                      <button className="btn btn-ink btn-sm" onClick={() => go(p.solo ? "solo" : "prof")}>Профиль <Arr s={13} /></button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </main>
        </div>

        {sel.length > 0 && (
          <div className="dock">
            <span className="lbl">Выбрано к сравнению — {sel.length}</span>
            <div className="row g8">{sel.map(s => <span className="tag solid num" key={s}>{s}</span>)}</div>
            <span className="spacer" />
            <button className="btn btn-line btn-sm" onClick={() => setSel([])}>Очистить</button>
            <button className="btn btn-acid btn-sm">Сравнить {sel.length} <Arr s={13} /></button>
          </div>
        )}
      </div>
    );
  }

  /* ---------------- производители ---------------- */
  const MAKERS = [
    { name: "Ridan", logo: "assets/ridan.webp", img: "assets/ridan-hex.jpg", cat: "Теплоснабжение · ИТП", city: "Московская обл.", note: "Пластинчатые теплообменники, балансировочные клапаны, насосные группы для ИТП.", bim: true, items: 1840, secs: ["ОВ", "ТС"], lead: "от 5 дней", tr: 93, sup: "Подбор по ТЗ" },
    { name: "Knauf", logo: null, img: "assets/knauf-aquapanel.jpg", cat: "Ограждающие конструкции", city: "Красногорск", note: "Aquapanel и системы сухого строительства: типовые узлы, расчёт огнестойкости.", bim: true, items: 620, secs: ["АР", "КЖ"], lead: "склад", tr: 90, sup: "Узлы в DWG" },
    { name: "Caparol", logo: "assets/caparol-logo.webp", img: null, cat: "Фасады и отделка", city: "Москва", note: "Фасадные системы СФТК, колеровка, ведомости отделки под раздел АР.", bim: false, items: 410, secs: ["АР"], lead: "от 3 дней", tr: 86, sup: "Колер-подбор" },
    { name: "Vandjord", logo: "assets/vandjord.jpg", img: "assets/vandjord-station.jpg", cat: "Водоотведение · ливнёвка", city: "Санкт-Петербург", note: "Очистные сооружения поверхностного стока, КНС, дренажные системы.", bim: true, items: 275, secs: ["ВК", "НВК"], lead: "от 14 дней", tr: 88, sup: "Гидравлический расчёт" },
    { name: "Немен", logo: "assets/nemen.png", img: null, cat: "Металлоконструкции", city: "Тула", note: "Балки, фермы, профнастил. Ведомости КМ и расчёт узлов под нагрузку.", bim: true, items: 130, secs: ["КМ"], lead: "от 20 дней", tr: 82, sup: "Расчёт узлов" },
  ];

  const MAK_CATS = ["Все", "Теплоснабжение", "Водоотведение", "Ограждающие", "Фасады", "Металлоконструкции"];

  function Cat() {
    const [c, setC] = useState("Все");
    const [bim, setBim] = useState(false);
    const list = MAKERS.filter(m => (c === "Все" || m.cat.startsWith(c)) && (!bim || m.bim));

    return (
      <div className="scroll">
        <div className="wrap" style={{ paddingBlock: "clamp(28px,3.5vw,48px) 60px" }}>
          <div className="sec-h">
            <div><span className="lbl">Производители · {list.length} из 386</span><h2 style={{ marginTop: 8 }}>Решения, узлы и BIM-модели</h2></div>
            <div className="omni" style={{ minWidth: 300 }}><Search />Оборудование, материал, бренд</div>
          </div>

          <div className="ai-wrap"><window.AiPick /></div>

          <div className="chips">
            {MAK_CATS.map(t => <button key={t} className={"chip" + (c === t ? " on" : "")} onClick={() => setC(t)}>{t}</button>)}
            <span className="spacer" />
            <button className={"chip" + (bim ? " on" : "")} onClick={() => setBim(!bim)}>{bim ? "✓ " : ""}Есть BIM-модель</button>
          </div>

          <div className="mgrid">
            {list.map(m => (
              <article className="card mcard" key={m.name}>
                <div className="mcard__img">
                  {m.img ? <img src={m.img} alt="" /> : <span className="lbl" style={{ color: "var(--ink-3)" }}>каталог решений</span>}
                  {m.bim && <span className="best mcard__bim">BIM</span>}
                </div>
                <div className="mcard__b">
                  <div className="row g12" style={{ marginBottom: 12 }}>
                    <div className="mlogo">{m.logo ? <img src={m.logo} alt={m.name} /> : <b>{m.name}</b>}</div>
                    <div style={{ minWidth: 0 }}>
                      <h3>{m.name}</h3>
                      <span className="lbl">{m.cat}</span>
                    </div>
                    <span className="spacer" />
                    <span className="trust"><span className="dot" style={{ background: m.tr >= 88 ? "var(--moss)" : "var(--acid-d)" }} />{m.tr}</span>
                  </div>
                  <p className="pcard__note">{m.note}</p>
                  <div className="rcard__meta" style={{ margin: "12px 0 0" }}>
                    <span className="tag solid">{m.city}</span>
                    {m.secs.map(s => <span className="tag" key={s}>{s}</span>)}
                  </div>
                  <div className="rcard__grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
                    <div className="f"><span>Позиций</span><b>{m.items}</b></div>
                    <div className="f"><span>Поставка</span><b>{m.lead}</b></div>
                    <div className="f"><span>Поддержка</span><b style={{ fontSize: 12.5, fontFamily: "var(--fb)" }}>{m.sup}</b></div>
                  </div>
                  <div className="row g8" style={{ marginTop: 14 }}>
                    <button className="btn btn-ink btn-sm">Каталог <Arr s={13} /></button>
                    <button className="btn btn-line btn-sm">Запросить подбор</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    );
  }

  Object.assign(window, { Pick, Cat });
})();
