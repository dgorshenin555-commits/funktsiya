/* new_design_wizard.jsx — экран варианта Б, выгружен из основного проекта.
   Сгенерировано tools/reverse_transform.py: правки вносить в
   app/v2/_screens/ в проекте, иначе они разойдутся.
   Использует из lib_bundle.jsx: OBJECT_TYPE_LABELS, STAGE_LABELS, STAGE_P_CAPITAL, useApp.
   Подключать после lib_bundle.jsx. */
(function () {
  const { useState, useRef, useEffect } = React;

  /* Маппинг полей мастера Б → модель общего хранилища (label → код). */
  const TYPE_CODE = Object.fromEntries(Object.entries(OBJECT_TYPE_LABELS).map(([code, label]) => [label, code]));
  const STAGE_CODE = Object.fromEntries(Object.entries(STAGE_LABELS).map(([code, label]) => [label, code]));
  const SCALE_CODE = { "Один специалист": "single", "Команда": "team", "Организация": "org" };

  /* ---------- иконки ---------- */
  const S = (p, s = 16, extra = {}) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...extra}>{p}</svg>
  );
  const IC = {
    building: s => S(<><path d="M4 21V5a1 1 0 011-1h8a1 1 0 011 1v16" /><path d="M14 10h5a1 1 0 011 1v10" /><path d="M7 8h4M7 12h4M7 16h4M17 14h1M17 18h1" /><path d="M2 21h20" /></>, s),
    grid: s => S(<><rect x="3" y="3" width="8" height="8" rx="1" /><rect x="13" y="3" width="8" height="8" rx="1" /><rect x="3" y="13" width="8" height="8" rx="1" /><rect x="13" y="13" width="8" height="8" rx="1" /></>, s),
    factory: s => S(<><path d="M3 21V10l5 3V10l5 3V8l6 3v10z" /><path d="M3 21h18" /><path d="M7 17h2M13 17h2" /></>, s),
    globe: s => S(<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" /></>, s),
    layers: s => S(<><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 13l9 5 9-5" /><path d="M3 17.5l9 5 9-5" /></>, s),
    pin: s => S(<><path d="M12 22s7-6.1 7-11a7 7 0 10-14 0c0 4.9 7 11 7 11z" /><circle cx="12" cy="11" r="2.6" /></>, s),
    check: s => S(<path d="M4 12.5l5 5L20 6.5" />, s),
    shield: s => S(<><path d="M12 3l8 3v6c0 5-3.6 8.2-8 9-4.4-.8-8-4-8-9V6l8-3z" /><path d="M8.6 12.2l2.4 2.4 4.4-4.6" /></>, s),
    spark: s => S(<><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" /><path d="M18.5 16.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8z" /></>, s),
    chart: s => S(<><path d="M4 20V4M4 20h16" /><path d="M8 20v-6M13 20V8M18 20v-9" /></>, s),
    wallet: s => S(<><rect x="3" y="6" width="18" height="13" rx="2.5" /><path d="M3 10h18" /><circle cx="17" cy="14.5" r="1.2" /></>, s),
    calendar: s => S(<><rect x="3" y="5" width="18" height="16" rx="2.5" /><path d="M3 10h18M8 3v4M16 3v4" /></>, s),
    file: s => S(<><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" /><path d="M14 3v5h5" /></>, s),
    paperclip: s => S(<path d="M20.5 11.5l-8.6 8.6a5 5 0 01-7.1-7.1l8.8-8.8a3.4 3.4 0 014.8 4.8l-8.8 8.8a1.8 1.8 0 01-2.5-2.5l8-8" />, s),
    edit: s => S(<><path d="M4 20h4l10.5-10.5a2.1 2.1 0 00-3-3L5 17v3z" /><path d="M13.5 6.5l4 4" /></>, s),
    chevL: s => S(<path d="M14 6l-6 6 6 6" />, s),
    chevR: s => S(<path d="M10 6l6 6-6 6" />, s),
  };
  const Icon = ({ name, size = 16 }) => (IC[name] ? IC[name](size) : null);
  const Arr = ({ s = 14 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>);
  const Back = () => (<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M13 8H3M7 4L3 8l4 4" /></svg>);

  /* ---------- данные: общий источник (request_form.jsx) ---------- */
  const RF = window.REQ_FORM;
  const { STEPS, STAGE_OPTS, ATTRACT, TYPES, SUBTYPES, ALL_SECTIONS, SECTION_NAMES, DEFAULTS, sectPlural, exemptExpertise, filledCount, buildRequest } = RF;

  /* ---------- календарь ---------- */
  const RU_MONTHS = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  const RU_MON_SHORT = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
  const RU_WD = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const pad2 = n => String(n).padStart(2, "0");
  const fmtDate = d => pad2(d.getDate()) + "." + pad2(d.getMonth() + 1) + "." + d.getFullYear();
  const parseDate = s => {
    const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec((s || "").trim());
    if (!m) return null;
    const d = new Date(+m[3], +m[2] - 1, +m[1]);
    return isNaN(d.getTime()) ? null : d;
  };
  const startOfDay = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const sameDay = (a, b) => !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  function DateField({ value, onChange, placeholder }) {
    const today = startOfDay(new Date());
    const sel = parseDate(value);
    const base = sel || today;
    const [open, setOpen] = useState(false);
    const [view, setView] = useState("day");
    const [vm, setVm] = useState(base.getMonth());
    const [vy, setVy] = useState(base.getFullYear());
    const ref = useRef(null);

    useEffect(() => {
      if (!open) return;
      const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
      const esc = e => { if (e.key === "Escape") setOpen(false); };
      document.addEventListener("mousedown", h);
      document.addEventListener("keydown", esc);
      return () => { document.removeEventListener("mousedown", h); document.removeEventListener("keydown", esc); };
    }, [open]);

    const pick = d => { onChange(fmtDate(d)); setOpen(false); };
    const stepMonth = dir => { let m = vm + dir, y = vy; if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; } setVm(m); setVy(y); };
    const prev = () => view === "day" ? stepMonth(-1) : view === "month" ? setVy(vy - 1) : setVy(vy - 12);
    const next = () => view === "day" ? stepMonth(1) : view === "month" ? setVy(vy + 1) : setVy(vy + 12);
    const yearStart = Math.floor(vy / 12) * 12;
    const first = new Date(vy, vm, 1);
    const offset = (first.getDay() + 6) % 7;
    const cells = []; for (let i = 0; i < 42; i++) cells.push(new Date(vy, vm, 1 - offset + i));
    const title = view === "day" ? RU_MONTHS[vm] + " " + vy : view === "month" ? String(vy) : yearStart + "–" + (yearStart + 11);

    return (
      <div className="datef" ref={ref}>
        <button type="button" className={"inp datef__btn" + (open ? " on" : "")} onClick={() => setOpen(!open)}>
          <span style={{ color: value ? "var(--ink)" : "var(--ink-3)" }}>{value || placeholder || "дд.мм.гггг"}</span>
          <Icon name="calendar" size={17} />
        </button>
        {open && (
          <div className="cal">
            <div className="cal__h">
              <button type="button" onClick={prev}><Icon name="chevL" size={15} /></button>
              <button type="button" className="cal__t" onClick={() => setView(view === "day" ? "month" : "year")}>{title}</button>
              <button type="button" onClick={next}><Icon name="chevR" size={15} /></button>
            </div>
            {view === "day" && (<>
              <div className="cal__wd">{RU_WD.map(w => <span key={w}>{w}</span>)}</div>
              <div className="cal__grid">
                {cells.map((d, i) => {
                  const out = d.getMonth() !== vm;
                  const past = d < today;
                  return (
                    <button key={i} type="button" disabled={past}
                      className={"cal__d" + (out ? " out" : "") + (sameDay(d, sel) ? " sel" : "") + (sameDay(d, today) ? " now" : "") + (past ? " off" : "")}
                      onClick={() => pick(d)}>{d.getDate()}</button>
                  );
                })}
              </div>
            </>)}
            {view === "month" && (
              <div className="cal__mg">
                {RU_MON_SHORT.map((m, i) => <button key={m} type="button" className={"cal__m" + (i === vm ? " sel" : "")} onClick={() => { setVm(i); setView("day"); }}>{m}</button>)}
              </div>
            )}
            {view === "year" && (
              <div className="cal__mg">
                {Array.from({ length: 12 }, (_, i) => yearStart + i).map(y => <button key={y} type="button" className={"cal__m" + (y === vy ? " sel" : "")} onClick={() => { setVy(y); setView("month"); }}>{y}</button>)}
              </div>
            )}
            <div className="cal__f">
              <button type="button" className="btn btn-line btn-sm" onClick={() => pick(today)}>Сегодня</button>
              {value && <button type="button" className="btn btn-line btn-sm" onClick={() => { onChange(""); setOpen(false); }}>Очистить</button>}
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ---------- строка предпросмотра ---------- */
  function PrevRow({ icon, label, value, hot, children }) {
    return (
      <div className={"pv__row" + (hot ? " hot" : "")}>
        <span className="pv__ic"><Icon name={icon} size={15} /></span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="pv__k">{label}</div>
          {children || <div className="pv__v">{value}</div>}
        </div>
      </div>
    );
  }

  /* ---------- мастер ---------- */
  function OrderNew({ go, onPublish }) {
    const { user, addOrder } = useApp();
    const [step, setStep] = useState(0);
    const [type, setType] = useState("Коммерческая недвижимость");
    const [subtype, setSubtype] = useState("Офис");
    const [title, setTitle] = useState("");
    const [region, setRegion] = useState("Москва");
    const [stage, setStage] = useState("П");
    const [attract, setAttract] = useState("Команда");
    const [sel, setSel] = useState(["АР", "КР", "ЭОМ"]);
    const [budget, setBudget] = useState("");
    const [due, setDue] = useState("");
    const [byOffer, setByOffer] = useState(true);
    const [files, setFiles] = useState(0);
    const [note, setNote] = useState("");
    const toggle = s => setSel(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

    const filled = [type, region && stage && attract, sel.length, (byOffer || budget) && due ? 1 : (budget || due), files].filter(Boolean).length;
    const exempt = type === "Частное строительство";

    /* Публикация пишет заявку в общее хранилище платформы (то же, что у основного
       дизайна): заявку видят исполнители в обеих версиях. Карточка req остаётся
       для экрана «Ход заявки» (ReqTrack). */
    const stageName = (STAGE_OPTS.find(s => s[0] === stage) || [])[1] || stage;
    const publish = () => {
      if (!user) {
        // Без входа хранилище не знает автора заявки; вход общий с основным дизайном.
        window.location.href = "/auth";
        return;
      }
      const digits = String(budget).replace(/\D/g, "");
      const specialists = [...new Set(sel.flatMap(code => (STAGE_P_CAPITAL.find(s => s.code === code) || {}).specialists || []))];
      const order = addOrder({
        title: title.trim() || (type + " · " + subtype),
        description: (subtype && subtype !== "Другое" ? subtype + ". " : "") + note.trim(),
        objectType: TYPE_CODE[type] || "commercial",
        region: region || "Москва",
        scale: SCALE_CODE[attract] || "team",
        stage: STAGE_CODE[stage] || "P",
        sections: sel,
        specialists,
        budget: byOffer || !digits ? "Ждём предложений" : Number(digits).toLocaleString("ru-RU") + " ₽",
        deadline: due || "",
        status: "published",
      });
      const req = {
        id: order.id, mine: true, live: true, t: order.title,
        city: region || "Регион не указан", type: type + " · " + subtype, stage: stageName,
        secs: sel, budget: byOffer || !digits ? "ждём предложений" : Number(digits).toLocaleString("ru-RU") + " ₽",
        days: due ? "до " + due : "по согласованию", resp: 0, publ: "только что",
        kind: "Проектирование", bids: [],
        attract, files, note: note.trim(), byOffer, subtype, objType: type,
      };
      if (onPublish) onPublish(req); else go("reqs");
    };

    return (
      <div className="scroll">
        <div className="wrap wiz5">
          <button className="back" onClick={() => go("reqs")}><Back /> К заявкам</button>
          <div className="wiz5__h">
            <span className="lbl">Заявка · черновик</span>
            <h1>Создание заявки</h1>
            <p>Пять шагов. Всё, что вы заполните, сразу видно в предпросмотре справа — так же заявку увидят исполнители.</p>
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
                  <label>Название заявки</label>
                  <input className="inp" placeholder="Например: ЖК «Северный парк», корпус 2" value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div className="field">
                  <label>Тип объекта</label>
                  <div className="selcards">
                    {TYPES.map(([t, ic, d]) => (
                      <button type="button" key={t} className={"selcard" + (t === type ? " on" : "")} onClick={() => { setType(t); setSubtype(SUBTYPES[t][0]); }}>
                        <span className="selcard__ic"><Icon name={ic} size={19} /></span>
                        <b>{t}</b><em>{d}</em>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="field" key={type}>
                  <label>Назначение объекта</label>
                  <div className="picks">
                    {SUBTYPES[type].map(s => <button key={s} type="button" className={"pick" + (s === subtype ? " on" : "")} onClick={() => setSubtype(s)}>{s}</button>)}
                  </div>
                </div>
                <div className={"noteline" + (exempt ? " ok" : "")}>
                  <span className="noteline__ic"><Icon name={exempt ? "check" : "shield"} size={17} /></span>
                  <p>{exempt
                    ? <><b>Экспертиза не требуется.</b> Для индивидуального жилого дома проектная документация не подлежит обязательной экспертизе.</>
                    : <><b>Потребуется экспертиза.</b> Объект капитального строительства — документация проходит государственную или негосударственную экспертизу.</>}</p>
                </div>
              </div>)}

              {step === 1 && (<div className="fade">
                <div className="field">
                  <label>Регион</label>
                  <input className="inp" value={region} onChange={e => setRegion(e.target.value)} />
                </div>
                <div className="field">
                  <label>Стадия проектирования</label>
                  <div className="seclist">
                    {STAGE_OPTS.map(([code, name]) => (
                      <button key={code} type="button" className={"secitem" + (code === stage ? " on" : "")} onClick={() => setStage(code)}>
                        <span className="secitem__c">{code}</span>
                        <span className="secitem__n">{name}</span>
                        <span className="secitem__k"><Icon name="check" size={12} /></span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label>Тип привлечения</label>
                  <div className="picks">
                    {["Один специалист", "Команда", "Организация"].map(s => <button key={s} type="button" className={"pick" + (s === attract ? " on" : "")} onClick={() => setAttract(s)}>{s}</button>)}
                  </div>
                </div>
              </div>)}

              {step === 2 && (<div className="fade">
                <div className="sec-h" style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 14, fontWeight: 500 }}>Разделы документации</label>
                  <span className="lbl">Выбрано {sel.length} из {ALL_SECTIONS.length}</span>
                </div>
                <div className="seclist">
                  {ALL_SECTIONS.map(s => (
                    <button key={s} type="button" className={"secitem" + (sel.includes(s) ? " on" : "")} onClick={() => toggle(s)}>
                      <span className="secitem__c">{s}</span>
                      <span className="secitem__n">{SECTION_NAMES[s] || "Раздел документации"}</span>
                      <span className="secitem__k"><Icon name="check" size={12} /></span>
                    </button>
                  ))}
                </div>
              </div>)}

              {step === 3 && (<div className="fade">
                <div className="field">
                  <label>Бюджет, ₽</label>
                  <input className="inp num" placeholder="12 000 000" value={budget} disabled={byOffer} style={{ opacity: byOffer ? .5 : 1 }} onChange={e => setBudget(e.target.value)} />
                </div>
                <div className="field">
                  <label>Срок выполнения</label>
                  <DateField value={due} onChange={setDue} placeholder="Выберите дату" />
                </div>
                <label className="chk">
                  <input type="checkbox" checked={byOffer} onChange={e => setByOffer(e.target.checked)} />
                  <i><Icon name="check" size={11} /></i>
                  Ждём предложений по цене
                </label>
              </div>)}

              {step === 4 && (<div className="fade">
                <div className="field">
                  <label>Описание задачи</label>
                  <textarea className="inp" rows="5" placeholder="Опишите задачу в свободной форме: особенности объекта, пожелания к решению, требования к исполнителю, важные сроки…" value={note} onChange={e => setNote(e.target.value)} />
                </div>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label>Файлы проекта</label>
                  <button type="button" className="drop" onClick={() => setFiles(f => f + 1)}>
                    <Icon name="paperclip" size={24} />
                    <span>Перетащите файлы DWG, IFC, PDF или нажмите для выбора</span>
                  </button>
                  {files > 0 && <span className="hint">Прикреплено файлов: {files}</span>}
                </div>
              </div>)}

              <div className="wizbar">
                <button className="btn btn-line" disabled={step === 0} style={{ opacity: step === 0 ? .4 : 1 }} onClick={() => setStep(s => Math.max(0, s - 1))}>Назад</button>
                {step < STEPS.length - 1
                  ? <button className="btn btn-ink" onClick={() => setStep(s => s + 1)}>Далее <Arr /></button>
                  : <button className="btn btn-acid" onClick={publish}>Опубликовать заявку</button>}
                <span className="lbl" style={{ marginLeft: "auto" }}>Шаг {step + 1} из {STEPS.length}</span>
              </div>
            </div>

            <aside className="pv">
              <div className="pv__h">
                <span className="lbl">Предпросмотр заявки</span>
                <span className="pv__cnt num">{filled}<span>/5</span></span>
              </div>
              <div className="pv__cover">
                <span className="pv__stage">{stage}</span>
                <span className="pv__type">{type.split(" ")[0]}</span>
              </div>
              <h3>{title.trim() || "Новая заявка"}</h3>
              <div className="pv__sub">Стадия {stage} · {attract}</div>
              <div className="pv__rows">
                <PrevRow icon="building" label="Тип объекта" value={subtype ? type + " · " + subtype : type} hot={step === 0} />
                <PrevRow icon="pin" label="Регион" value={region || "—"} hot={step === 1} />
                <PrevRow icon="layers" label="Стадия / привлечение" value={stage + " · " + attract} hot={step === 1} />
                {sel.length > 0 && (
                  <PrevRow icon="file" label={"Разделы · " + sel.length} hot={step === 2}>
                    <div className="pv__codes">{sel.map(s => <span key={s} className="code">{s}</span>)}</div>
                  </PrevRow>
                )}
                {(budget || due || byOffer) && <PrevRow icon="calendar" label="Срок" value={due || "по согласованию"} hot={step === 3} />}
                {files > 0 && <PrevRow icon="paperclip" label="Файлы" value={files + " шт."} hot={step === 4} />}
                {note.trim() && <PrevRow icon="edit" label="Описание" value="в свободной форме" hot={step === 4} />}
              </div>
              <div className="pv__price">
                {byOffer || !budget
                  ? <span className="pv__wait"><Icon name="wallet" size={17} />Ждём предложений</span>
                  : <span className="pv__sum num"><Icon name="wallet" size={17} />{budget} ₽</span>}
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- жизненный цикл опубликованной заявки ---------- */
  function ReqTrack({ go, req }) {
    if (!req) return (
      <div className="scroll"><div className="wrap page"><button className="back" onClick={() => go("reqs")}><Back /> К заявкам</button><p>Заявка не выбрана.</p></div></div>
    );
    const STAGES = [
      { s: "done", t: "Заявка собрана", w: "шаги 1–5", d: "Тип объекта, регион, стадия, " + req.secs.length + " " + sectPlural(req.secs.length) + ", бюджет и срок заполнены в мастере." },
      { s: "done", t: "Проверка состава", w: "автоматически", d: "Состав разделов сверен с ПП РФ №87 для «" + (req.objType || req.type) + "»." },
      { s: "now", t: "Опубликована в общем списке", w: req.publ, d: "Заявка видна исполнителям с СРО и подходящими разделами. Первые отклики обычно в течение 4 часов." },
      { s: "next", t: "Сбор и сравнение откликов", w: "далее", d: "Цена, срок и покрытие разделов — в одной таблице." },
      { s: "next", t: "Выбор исполнителя и договор", w: "после выбора", d: "Договор, этапы и оплата ведутся внутри сделки." },
    ];
    const FACTS = [
      ["Тип объекта", req.type], ["Регион", req.city], ["Стадия", req.stage],
      ["Привлечение", req.attract || "—"], ["Бюджет", req.budget], ["Срок", req.days],
      ["Файлы", req.files ? req.files + " шт." : "не приложены"], ["Отклики", req.resp || "ждём"],
    ];
    return (
      <div className="scroll">
        <div className="wrap page">
          <button className="back" onClick={() => go("reqs")}><Back /> К заявкам</button>
          <div className="two">
            <div>
              <div className="page__h">
                <span className="lbl">Ваша заявка · опубликована {req.publ}</span>
                <h1>{req.t}</h1>
                <p>Здесь видно, где заявка сейчас и что произошло с момента заполнения мастера. Яркий кружок — текущий этап.</p>
              </div>
              <div className="box" style={{ marginBottom: 14 }}>
                <div className="track">
                  {STAGES.map((e, i) => (
                    <div className={"tstep " + (e.s === "done" ? "done" : e.s === "now" ? "now" : "")} key={e.t}>
                      <span className="bul">{e.s === "done" ? <Icon name="check" size={12} /> : i + 1}</span>
                      <div><h4>{e.t}</h4><p>{e.d}</p></div>
                      <span className="when">{e.w}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="box">
                <h3>Состав и данные заявки</h3>
                <div className="trackfacts">
                  {FACTS.map(([k, v]) => <div key={k}><span className="lbl">{k}</span><b>{v}</b></div>)}
                </div>
                <div className="field" style={{ marginTop: 18, marginBottom: 0 }}>
                  <label>Разделы · {req.secs.length}</label>
                  <div className="picks">{req.secs.map(s => <span key={s} className="pick on" style={{ display: "inline-flex", alignItems: "center", cursor: "default" }}>{s}</span>)}</div>
                </div>
                {req.note && (
                  <div className="field" style={{ marginTop: 18, marginBottom: 0 }}>
                    <label>Описание задачи</label>
                    <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: "var(--ink-2)" }}>{req.note}</p>
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: "grid", gap: 14 }}>
              <div className="box" style={{ display: "grid", gap: 14 }}>
                <span className="lbl">Ваш шаг</span>
                <h3 style={{ margin: 0 }}>Ждём отклики</h3>
                <p>Заявка уже в общем списке. Можно добавить файлы или пригласить исполнителей точечно.</p>
                <button className="btn btn-acid" onClick={() => go("pick")}>Пригласить исполнителей</button>
                <button className="btn btn-line" onClick={() => go("new")}>Редактировать заявку</button>
                <button className="btn btn-line" onClick={() => go("reqs")}>Найти в списке заявок</button>
              </div>
              <div className="box" style={{ display: "grid", gap: 10 }}>
                <span className="lbl">Видимость</span>
                <h3 style={{ margin: 0 }}>{req.secs.length ? "По вашим разделам" : "Без разделов"}</h3>
                <p>Заявка показывается исполнителям, у кого есть подтверждённый опыт по {req.secs.slice(0, 4).join(", ") || "выбранным разделам"}.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  Object.assign(window, { OrderNew, ReqTrack });
})();
