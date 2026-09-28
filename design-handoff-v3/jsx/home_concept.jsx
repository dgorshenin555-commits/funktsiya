/* home_concept.jsx — главная по структуре концепта, в нашем стиле.
   Подключать после lib_bundle.jsx, до live/new_design.jsx. Ставит window.HomeConcept. */
(function () {
  const { useState, useRef } = React;
  const Arr = ({ s = 14 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>);
  const Chk = ({ s = 11 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5l3.5 3.5L13 4.5" /></svg>);
  const Mark = ({ s = 22 }) => (<svg width={s} height={s} viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="11" fill="#14161A" /><rect x="13" y="10" width="4.4" height="21" rx="2.2" fill="#C9F24A" /><rect x="13" y="10" width="17" height="4.4" rx="2.2" fill="#C9F24A" /><rect x="13" y="18.5" width="12" height="4.4" rx="2.2" fill="#C9F24A" /></svg>);

  const COPY = {
    cli: { eyebrow: "Платформа проектирования зданий и сооружений", h: <>Проектируем здания.<br />Понятно <em>и по этапам</em></>, lead: "Заказывайте проектирование дома, склада или производства. Находите проектировщиков с СРО, согласовывайте состав разделов (АР, КР, ОВ, ЭОМ) и ведите проект до экспертизы.", cta: "Описать задачу", alt: "Сначала посмотреть возможности", note: "Начните без регистрации. Профессиональные термины не нужны.", brief: "С чего начнём?" },
    pro: { eyebrow: "Проектировщикам, инженерам, экспертам", h: <>Заявки на проектирование.<br />Работа <em>по этапам</em></>, lead: "Выбирайте заявки по своим разделам, согласовывайте стоимость и сдавайте этапы. Оплата зарезервирована до начала работы.", cta: "Рассказать о специализации", alt: "Смотреть открытые заявки", note: "Специализация, опыт и доступность — основа подходящего подбора.", brief: "Какие проекты вы берёте?" },
  };
  const TASKS = [
    { k: "01", t: "Заказать проект здания", d: "Дом, склад, производство — полный комплект или отдельный раздел." },
    { k: "02", t: "Проверить документацию", d: "Разобраться с комплектом и подготовить ответы на замечания." },
    { k: "03", t: "Обследовать здание", d: "Оценить состояние объекта перед покупкой или реконструкцией." },
  ];
  const HOW = [
    ["01", "Расскажите об объекте", "Короткое описание и исходные данные вместо сложного технического задания."],
    ["02", "Сравните предложения", "Что входит в стоимость, какие сроки и какой результат вы получите."],
    ["03", "Следите за этапами", "Файлы, изменения и согласования — в рабочем пространстве проекта."],
    ["04", "Примите работу", "Проверьте результат или верните его с конкретными замечаниями."],
  ];

  const LINKS = [
    ["reqs", "Заявки", "Открытые задачи заказчиков — без регистрации"],
    ["pick", "Исполнители", "Проверенные команды: СРО, опыт, проекты"],
    ["cat", "Производители", "Каталог материалов и оборудования для проекта"],
    ["norm", "Нормативы", "СП, ГОСТ и правила — в контексте задачи"],
    ["exp", "Экспертиза", "Замечания и ответы по комплекту документации"],
    ["price", "Тарифы", "Комиссия платформы и условия резерва по этапам"],
  ];

  const OBJ = [
    { t: "Промышленный объект", m: "4 200 м² · КЖ, ОВ, ЭОМ · Тверская область", img: "assets/hero-industrial-2.png", q: "Строим цех 4 200 м². Есть архитектурный раздел, нужны конструкции, отопление и электрика для прохождения экспертизы.", pts: [["Разделы", "КЖ, ОВ, ЭОМ"], ["Исходные данные", "АР, ТУ на сети, геология"], ["Результат", "Стадия П для экспертизы"], ["Срок", "3–4 месяца"]] },
    { t: "Складской комплекс", m: "12 000 м² · Полный комплект ПИР · Московская область", img: "assets/hero-commercial-2.png", q: "Участок 3 га, нужен склад класса A на 12 000 м². Требуется полный комплект: от изысканий до рабочей документации.", pts: [["Разделы", "Все разделы ПД и РД"], ["Исходные данные", "ГПЗУ, изыскания, ТЗ"], ["Результат", "Экспертиза + РД для стройки"], ["Срок", "8–10 месяцев"]] },
    { t: "Загородный дом", m: "180 м² · АР, ГП, ВК · Московская область", img: "assets/hero-private-2.png", q: "Хочу построить дом 180 м² на своём участке. Нужен проект для строительства: планировки, посадка на участок, водоснабжение.", pts: [["Разделы", "АР, ГП, ВК"], ["Исходные данные", "Участок, пожелания по планировке"], ["Результат", "Проект для строительства"], ["Срок", "6–8 недель"]] },
  ];

  function HomeConcept({ go, regCli, regPro }) {
    const [role, setRole] = useState("cli");
    const [brief, setBrief] = useState(null);  /* заголовок открытого брифа или null */
    const [txt, setTxt] = useState("");
    const [res, setRes] = useState(null);
    const briefRef = useRef(null);
    const vidRef = useRef(null);
    const [snd, setSnd] = useState(false);
    const toggleSnd = () => { const v = vidRef.current; if (!v) return; v.muted = snd; if (!snd) { v.currentTime = 0; v.play().catch(() => {}); } setSnd(!snd); };
    const c = COPY[role];
    const [obj, setObj] = useState(0);
    const [hold, setHold] = useState(false);
    React.useEffect(() => { if (hold) return; const t = setInterval(() => setObj(v => (v + 1) % OBJ.length), 3200); return () => clearInterval(t); }, [hold]);
    const o = OBJ[obj];
    const openBrief = t => { setBrief(t); setRes(null); setTimeout(() => briefRef.current && window.scrollTo({ top: briefRef.current.getBoundingClientRect().top + window.scrollY - 90, behavior: "smooth" }), 30); };
    const submit = () => {
      if (!txt.trim()) { setRes({ err: true }); return; }
      setRes({ ok: true });
    };
    return (
      <div className="scroll">
        <div className="wrap hc">
          <p className="hc__what"><b>Функция</b> — маркетплейс проектных работ (ПИР): заказчики находят проектировщиков, инженеров и экспертов; работа идёт по разделам и этапам.</p>
          <div className="hc__role" role="tablist">
            <button className={role === "cli" ? "on" : ""} onClick={() => setRole("cli")}>Я заказчик</button>
            <button className={role === "pro" ? "on" : ""} onClick={() => setRole("pro")}>Я исполнитель</button>
          </div>
          <section className="hc__hero">
            <div>
              <div className="hero__eyebrow"><span className="dot" style={{ background: "var(--acid)" }} /><span className="lbl">{c.eyebrow}</span></div>
              <h1>{c.h}</h1>
              <p className="lead">{c.lead}</p>
              <div className="hc__act">
                <button className={"btn btn-lg " + (role === "cli" ? "btn-ink" : "btn-acid")} onClick={() => openBrief(c.brief)}>{c.cta} <Arr /></button>
                <button className="hc__sec" onClick={() => go("reqs")}>{c.alt} <Arr s={13} /></button>
              </div>
              <div className="hero__note"><span className="dot" style={{ background: "var(--moss)" }} />{c.note}</div>
            </div>
            <div className="hc__pv hc__pv--video">
              <video ref={vidRef} className="hc__video" src="assets/promo.mp4" autoPlay muted loop playsInline preload="metadata" />
              <button className="hc__snd" onClick={toggleSnd} aria-label={snd ? "Выключить звук" : "Включить звук"}>{snd ? "Звук вкл" : "Включить звук"}</button>
            </div>
          </section>

          {brief && (
            <section className="hc__brief" ref={briefRef}>
              <div className="sec-h" style={{ marginTop: 0 }}>
                <div><h2 style={{ margin: 0 }}>{brief}</h2><p style={{ margin: "6px 0 0", color: "var(--ink-2)", fontSize: 14 }}>Расскажите об объекте и желаемом результате.</p></div>
                <button className="btn btn-line btn-sm" onClick={() => setBrief(null)}>Закрыть</button>
              </div>
              <label htmlFor="hc-desc">Ваша задача</label>
              <textarea id="hc-desc" value={txt} onChange={e => setTxt(e.target.value)} placeholder="Например: хочу построить дом 180 м². Участок уже есть, нужен проект для строительства." />
              <div className="row g12" style={{ flexWrap: "wrap" }}>
                <button className="btn btn-ink" onClick={submit}>Собрать черновик задания <Arr /></button>
                <button className="hc__sec" onClick={role === "cli" ? regCli : regPro}>Сразу к регистрации <Arr s={13} /></button>
              </div>
              {res && res.err && <div className="hc__res" style={{ color: "var(--clay)" }}>Добавьте несколько слов об объекте и желаемом результате.</div>}
              {res && res.ok && (
                <div className="hc__res">
                  <b>Следующий шаг — уточнить исходные данные</b>
                  <ul><li>Где находится объект?</li><li>Какие планы и документы уже есть?</li><li>Когда нужен результат?</li></ul>
                  <button className="btn btn-acid btn-sm" style={{ justifySelf: "start" }} onClick={() => go("new")}>Продолжить в мастере заявки <Arr s={13} /></button>
                </div>
              )}
            </section>
          )}

          <div className="hc__trust">
            <span>Все разделы ПД и РД</span>
            <span>Исполнители с СРО</span>
            <span>Проверка перед экспертизой</span>
            <span>Резерв оплаты по этапам</span>
          </div>

          <section id="hc-tasks">
            <div className="sec-h">
              <div><span className="lbl">Найти решение</span><h2 style={{ marginTop: 8 }}>Что нужно вашему проекту?</h2></div>
              <p style={{ margin: 0, color: "var(--ink-2)", fontSize: 14, maxWidth: "36ch" }}>Начните с задачи — поможем разобраться с остальным.</p>
            </div>
            <div className="hc__tasks">
              {TASKS.map(t => (
                <button className="hc__task" key={t.k} onClick={() => openBrief(t.t)}>
                  <span className="k">{t.k}</span>
                  <h3>{t.t}</h3>
                  <p>{t.d}</p>
                  <em>Найти решение <Arr s={13} /></em>
                </button>
              ))}
            </div>
            <div className="hc__help">
              <span>Не знаете, какие работы нужны? Это нормально.</span>
              <button className="hc__sec" onClick={() => openBrief(c.brief)}>Помогите разобраться <Arr s={13} /></button>
            </div>
          </section>

          <section id="hc-how">
            <div className="sec-h">
              <div><span className="lbl">Как это работает</span><h2 style={{ marginTop: 8 }}>Каждый шаг — понятен</h2></div>
              <span className="lbl">Решения остаются за вами</span>
            </div>
            <div className="hc__how">
              {HOW.map(([k, t, d]) => (
                <article key={k}><span className="k">{k}</span><h3>{t}</h3><p>{d}</p></article>
              ))}
            </div>
          </section>

          <section id="hc-links">
            <div className="sec-h">
              <div><span className="lbl">Разделы платформы</span><h2 style={{ marginTop: 8 }}>Куда дальше</h2></div>
            </div>
            <div className="hc__links">
              {LINKS.map(([k, t, d]) => (
                <button className="hc__link" key={k} onClick={() => go(k)}>
                  <b>{t}</b><span>{d}</span><i><Arr s={14} /></i>
                </button>
              ))}
            </div>
          </section>

          <section className="hc__pro" id="hc-pro">
            <div>
              <span className="lbl">Проектировщикам и командам</span>
              <h2>Ваш опыт нужен<br />следующему проекту.</h2>
              <p>Покажите специализацию, подходящие работы и готовность начать.</p>
            </div>
            <button className="btn btn-acid btn-lg" onClick={regPro}>Я исполнитель <Arr /></button>
          </section>

          <footer className="foot">
            <div className="row g12"><Mark /><span className="lbl">Функция — проектирование начинается с понимания</span></div>
            <div className="row g16"><a href="#" className="lbl" style={{ color: "var(--ink-2)" }}>Документы</a><a href="#" className="lbl" style={{ color: "var(--ink-2)" }}>Поддержка</a><a href="#" className="lbl" style={{ color: "var(--ink-2)" }}>API</a></div>
          </footer>
        </div>
      </div>
    );
  }
  Object.assign(window, { HomeConcept });
})();
