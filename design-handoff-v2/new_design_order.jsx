/* new_design_order.jsx — полная карточка заявки на работу.
   Данные перенесены один-в-один из прототипа «Функция (тест заголовок)»:
   заявка №1 «Парк Резиденс», 5 вкладок, отклики, сравнение, переписка,
   замечания экспертизы, файлы, заказчик, требуемые специалисты. */
(function () {
  const { useState, useEffect } = React;
  const Arr = ({ s = 14 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>);
  const Back = () => (<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M13 8H3M7 4L3 8l4 4" /></svg>);
  const Chk = ({ s = 11 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5l3.5 3.5L13 4.5" /></svg>);
  const X = () => (<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M4 4l8 8M12 4l-8 8" /></svg>);
  const Ini = ({ n, size = 40 }) => (<div className="pini num" style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: size * .3, fontSize: size * .34 }}>{n}</div>);

  /* ---------- заявка (ORDERS[0] из прототипа) ---------- */
  const O = {
    id: 1,
    title: "Проектирование жилого комплекса «Парк Резиденс»",
    status: "Опубликована",
    desc: "Требуется разработка проектной документации стадии П для жилого комплекса бизнес-класса. 3 секции, 18 этажей, подземная автостоянка. Общая площадь 45 000 м².",
    region: "Москва",
    type: "Коммерческая недвижимость",
    due: "01.09.2026",
    sections: ["АР", "КР", "ЭОМ", "ВК", "ОВиК", "ПОС", "ПБ", "СМ"],
    budget: "12 000 000 ₽",
    replies: 5,
    stage: "П",
    scope: "Формирование команды",
    client: "ООО «СтройИнвест»",
    clientCity: "Москва",
    hero: "assets/hero-commercial-2.png",
  };
  const SECTION_NAMES = {
    "АР": "Архитектурные решения",
    "КР": "Конструктивные и объёмно-планировочные решения",
    "ЭОМ": "Система электроснабжения",
    "ВК": "Системы водоснабжения и водоотведения",
    "ОВиК": "Отопление, вентиляция и кондиционирование",
    "ПОС": "Проект организации строительства",
    "ПБ": "Мероприятия по обеспечению пожарной безопасности",
    "СМ": "Смета на строительство",
  };
  const TEAM = ["Архитектор", "ГАП", "Конструктор", "Инженер-электрик", "Инженер-сантехник"];
  const TIMELINE = [
    { t: "Принята в работу", done: true },
    { t: "Назначены проектировщики", done: false },
    { t: "Передана на экспертизу", done: false },
    { t: "Закрыта", done: false },
  ];
  const RESPONSES = [
    { ini: "КБ", name: "Бюро «Контур»", spec: "Полный комплект · BIM", rating: "4.9", reviews: 128, price: "11 800 000 ₽", priceNum: 11800000, term: "95 дней", termNum: 95, note: "Опыт по жилым комплексам бизнес-класса, своя BIM-команда.", trust: 90, level: "Надёжный", vf: true, codes: ["АР", "КР", "ЭОМ", "ВК", "ОВиК", "ПОС", "ПБ", "СМ"], projects: 86, availFree: true, avail: "Свободен", resp: "~40 мин", respNum: 40, escrow: true, bim: true },
    { ini: "СА", name: "ИП Соколов А.В.", spec: "Конструктив · Архитектура", rating: "4.8", reviews: 64, price: "10 200 000 ₽", priceNum: 10200000, term: "110 дней", termNum: 110, note: "Готов начать сразу, среднее время ответа — 30 минут.", trust: 88, level: "Надёжный", vf: true, codes: ["КР", "АР"], projects: 198, availFree: true, avail: "Свободен", resp: "~30 мин", respNum: 30, escrow: true, bim: false },
    { ini: "МП", name: "ПИ «Мостпроект»", spec: "Полный комплект · под ключ", rating: "5.0", reviews: 210, price: "12 600 000 ₽", priceNum: 12600000, term: "90 дней", termNum: 90, note: "Берёт проект под ключ с прохождением экспертизы.", trust: 93, level: "Эталон", vf: true, codes: ["АР", "КР", "ЭОМ", "ВК", "ОВиК", "ПОС", "ПБ", "СМ"], projects: 172, availFree: false, avail: "Занят до 15.07", resp: "~2 ч", respNum: 120, escrow: true, bim: true },
    { ini: "СЛ", name: "Студия «Линия»", spec: "Архитектура · инж. сети", rating: "4.5", reviews: 22, price: "9 400 000 ₽", priceNum: 9400000, term: "130 дней", termNum: 130, note: "Бюджетный вариант, профиль на верификации.", trust: 79, level: "Проверяется", vf: false, codes: ["АР", "ЭОМ", "ВК", "ОВиК"], projects: 31, availFree: true, avail: "Свободен", resp: "~1 ч", respNum: 60, escrow: false, bim: true },
  ];
  const MESSAGES = [
    { me: false, who: "Бюро «Контур»", ini: "КБ", t: "Добрый день! Изучили ТЗ, готовы взяться. Уточните: подземная автостоянка на 2 уровня?", time: "10:24" },
    { me: true, who: "Вы", ini: "Вы", t: "Здравствуйте! Да, два уровня, около 180 машино-мест.", time: "10:31" },
    { me: false, who: "Бюро «Контур»", ini: "КБ", t: "Принято. Направим коммерческое предложение с разбивкой по разделам до конца дня.", time: "10:36" },
    { me: true, who: "Вы", ini: "Вы", t: "Отлично, ждём. Интересует срок по стадии П.", time: "10:38" },
  ];
  const REMARKS = [
    { sec: "КР", txt: "Уточнить расчёт нагрузок на плиту перекрытия 3 этажа", st: "wait", lbl: "Открыто" },
    { sec: "ЭОМ", txt: "Схема электроснабжения принята без замечаний", st: "done", lbl: "Принято" },
    { sec: "ВК", txt: "Ответ направлен эксперту, ожидается проверка", st: "work", lbl: "На проверке" },
    { sec: "ПБ", txt: "Добавить расчёт эвакуационных путей секции 2", st: "wait", lbl: "Открыто" },
  ];
  const FILES = [
    { ext: "PDF", name: "Техническое задание.pdf", size: "1,2 МБ", date: "08.06.2026" },
    { ext: "DWG", name: "Генплан участка.dwg", size: "4,8 МБ", date: "08.06.2026" },
    { ext: "IFC", name: "Концепция_BIM.ifc", size: "23,1 МБ", date: "07.06.2026" },
    { ext: "ZIP", name: "Исходные данные.zip", size: "12,4 МБ", date: "05.06.2026" },
  ];
  const TABS = ["Описание", "Проектировщики", "Коммуникации", "Замечания", "Файлы"];
  const mln = n => (n / 1e6).toLocaleString("ru-RU", { maximumFractionDigits: 1 }) + " млн ₽";

  /* ---------- сравнение откликов (10 параметров, как в прототипе) ---------- */
  function CompareOrder({ cands, order, onClose, go }) {
    useEffect(() => {
      const k = e => { if (e.key === "Escape") onClose(); };
      window.addEventListener("keydown", k);
      return () => window.removeEventListener("keydown", k);
    }, [onClose]);
    const cov = c => order.filter(s => c.codes.includes(s)).length;
    const maxTrust = Math.max(...cands.map(c => c.trust));
    const minPrice = Math.min(...cands.map(c => c.priceNum));
    const minTerm = Math.min(...cands.map(c => c.termNum));
    const maxCov = Math.max(...cands.map(cov));
    const maxProj = Math.max(...cands.map(c => c.projects));
    const maxRating = Math.max(...cands.map(c => parseFloat(c.rating)));
    const minResp = Math.min(...cands.map(c => c.respNum));
    const Yes = () => <span className="yn ok"><Chk s={12} /> Да</span>;
    const No = () => <span className="yn no"><X /> Нет</span>;
    const rows = [
      { l: "Индекс доверия", h: "верификация + история", best: c => c.trust === maxTrust, r: c => <span className="num">{c.trust}<small>/100</small></span> },
      { l: "Стоимость", best: c => c.priceNum === minPrice, r: c => <span className="num">{mln(c.priceNum)}</span> },
      { l: "Срок", best: c => c.termNum === minTerm, r: c => <span className="num">{c.termNum}<small> дн.</small></span> },
      {
        l: "Покрытие разделов", h: "подтверждённые компетенции", best: c => cov(c) === maxCov, r: c => (<>
          <span className="num">{cov(c)}<small>/{order.length}</small></span>
          <span className="covchips">{order.map(s => <span key={s} className={"tag" + (c.codes.includes(s) ? "" : " miss")}>{s}</span>)}</span>
        </>)
      },
      { l: "Отзывы", best: c => parseFloat(c.rating) === maxRating, r: c => (<><span className="num">{c.rating}</span><span className="lbl">{c.reviews} отзывов</span></>) },
      { l: "Опыт на платформе", best: c => c.projects === maxProj, r: c => <span className="num">{c.projects}<small> пр.</small></span> },
      { l: "Доступность", best: c => c.availFree, r: c => c.availFree ? <span className="yn ok"><Chk s={12} /> {c.avail}</span> : <span className="yn no">{c.avail}</span> },
      { l: "Время ответа", best: c => c.respNum === minResp, r: c => <span className="num">{c.resp}</span> },
      { l: "Безопасная сделка", h: "эскроу по этапам", best: () => false, r: c => c.escrow ? <Yes /> : <No /> },
      { l: "BIM / ТИМ", best: () => false, r: c => c.bim ? <Yes /> : <No /> },
    ];
    return (
      <div className="ov" onClick={onClose}>
        <div className="ov__p" onClick={e => e.stopPropagation()}>
          <div className="ov__h">
            <div>
              <span className="lbl">Сравнение откликов</span>
              <h2>{cands.length} кандидата рядом</h2>
            </div>
            <span className="spacer" />
            <span className="lbl">«лучшее» отмечено по каждому параметру</span>
            <button className="close" onClick={onClose}><X /></button>
          </div>
          <div className="ov__b">
            <table className="cmp">
              <thead>
                <tr>
                  <th style={{ background: "var(--paper)" }}><span className="lbl">Параметр</span></th>
                  {cands.map(c => (
                    <th key={c.name}>
                      <div className="row g10" style={{ alignItems: "center" }}>
                        <Ini n={c.ini} size={34} />
                        <div style={{ minWidth: 0, textAlign: "left" }}>
                          <h4>{c.name}</h4>
                          <span className="lbl">{c.spec}</span>
                        </div>
                      </div>
                      <span className={"trust" + (c.vf ? "" : " pend")} style={{ marginTop: 8 }}><span className="dot" style={{ background: c.vf ? "var(--moss)" : "var(--clay)" }} />{c.level}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.l}>
                    <th>{row.l}{row.h && <em>{row.h}</em>}</th>
                    {cands.map(c => <td key={c.name} className={row.best(c) ? "win" : ""}>{row.r(c)}{row.best(c) && <span className="bestmark">лучшее</span>}</td>)}
                  </tr>
                ))}
                <tr>
                  <th></th>
                  {cands.map(c => (
                    <td key={c.name}>
                      <div className="row g8" style={{ flexWrap: "wrap" }}>
                        <button className="btn btn-ink btn-sm" onClick={() => { onClose(); go("msg"); }}>Выбрать</button>
                        <button className="btn btn-line btn-sm" onClick={() => { onClose(); go("prof"); }}>Профиль</button>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- карточка заявки ---------- */
  function OrderCard({ go }) {
    const [tab, setTab] = useState("Описание");
    const [sel, setSel] = useState([]);
    const [cmp, setCmp] = useState(false);
    const tgl = n => setSel(s => s.includes(n) ? s.filter(x => x !== n) : (s.length >= 4 ? s : [...s, n]));
    const open = REMARKS.filter(r => r.st === "wait").length;

    return (
      <div className="scroll">
        <div className="wrap page">
          <button className="back" onClick={() => go("reqs")}><Back /> Заявки</button>

          <div className="dhead">
            <div>
              <span className="lbl">Заявка № {O.id} · {O.region}</span>
              <h1>{O.title}</h1>
              <div className="rcard__meta">
                <span className="tag solid">{O.type}</span>
                <span className="tag solid">Стадия {O.stage}</span>
                {O.sections.map(s => <span className="tag" key={s}>{s}</span>)}
              </div>
            </div>
            <div style={{ display: "grid", gap: 10, justifyItems: "end" }}>
              <span className="trust"><span className="dot" style={{ background: "var(--moss)" }} />{O.status}</span>
              <div className="row g8">
                <button className="btn btn-line btn-sm" onClick={() => go("msg")}>Обсудить</button>
                <button className="btn btn-ink btn-sm" onClick={() => setTab("Проектировщики")}>Отклики · {O.replies}</button>
              </div>
            </div>
          </div>

          <div className="ohero">
            <img src={O.hero} alt="" />
            <span className="ohero__tag">BIM-модель · {O.type}</span>
            <div className="ohero__facts">
              <div><span className="lbl">Бюджет</span><b className="num">{O.budget}</b></div>
              <div><span className="lbl">Срок</span><b className="num">до {O.due}</b></div>
              <div><span className="lbl">Разделы</span><b className="num">{O.sections.length}</b></div>
              <div><span className="lbl">Откликов</span><b className="num">{O.replies}</b></div>
              <div><span className="lbl">Формат</span><b>{O.scope}</b></div>
            </div>
          </div>

          <div className="tabs2">
            {TABS.map(t => <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>{t}</button>)}
          </div>

          <div className="two">
            <div>
              {tab === "Описание" && (<>
                <div className="sect sect--task">
                  <span className="task__flag">Задание заказчика</span>
                  <h2>Что нужно сделать</h2>
                  <p className="task__lead">{O.desc}</p>
                  <div className="spec">
                    {[["Тип объекта", O.type], ["Регион", O.region], ["Масштаб", O.scope], ["Стадия", O.stage], ["Бюджет", O.budget], ["Срок", "до " + O.due]].map(([k, v]) => (
                      <div key={k}><span className="lbl">{k}</span><b>{v}</b></div>
                    ))}
                  </div>
                </div>
                <div className="sect">
                  <div className="sec-h"><h2 style={{ margin: 0 }}>Разделы документации</h2><span className="lbl">{O.sections.length} разделов</span></div>
                  <div className="secgrid">
                    {O.sections.map(s => <div className="secrow" key={s}><b>{s}</b>{SECTION_NAMES[s]}</div>)}
                  </div>
                </div>
                <div className="sect">
                  <h2>Таймлайн работы</h2>
                  <div className="track">
                    {TIMELINE.map((t, i) => (
                      <div className={"tstep " + (t.done ? "done" : i === 1 ? "now" : "")} key={t.t} style={{ gridTemplateColumns: "34px minmax(0,1fr)" }}>
                        <span className="bul">{t.done ? <Chk /> : i + 1}</span>
                        <div><h4>{t.t}</h4></div>
                      </div>
                    ))}
                  </div>
                </div>
              </>)}

              {tab === "Проектировщики" && (<div className="sect">
                <div className="sec-h"><h2 style={{ margin: 0 }}>Отклики на заявку</h2><span className="lbl">отметьте 2–4 отклика, чтобы сравнить бок о бок</span></div>
                <div style={{ display: "grid", gap: 10 }}>
                  {RESPONSES.map(r => {
                    const cov = O.sections.filter(s => r.codes.includes(s));
                    const on = sel.includes(r.name);
                    return (
                      <div className={"resp" + (on ? " on" : "")} key={r.name}>
                        <span className="cbox" onClick={() => tgl(r.name)}>{on && <Chk />}</span>
                        <Ini n={r.ini} size={44} />
                        <div className="resp__b">
                          <div className="row g10" style={{ alignItems: "center", flexWrap: "wrap" }}>
                            <b>{r.name}</b>
                            {r.vf
                              ? <span className="trust" title={"Индекс доверия · " + r.level}><span className="dot" style={{ background: r.trust >= 90 ? "var(--moss)" : "var(--acid-d)" }} />{r.trust}</span>
                              : <span className="trust pend"><span className="dot" style={{ background: "var(--clay)" }} />не подтв.</span>}
                            <span className="lbl">{r.spec}</span>
                          </div>
                          <p>{r.note}</p>
                          <div className="resp__f">
                            <span className="num big">{r.price}</span>
                            <span className="lbl">{r.term}</span>
                            <span className="cov"><b>{cov.length}/{O.sections.length}</b> разделов</span>
                            <span className="lbl">★ {r.rating} · {r.reviews} отзывов</span>
                            <span className={"lbl" + (r.availFree ? "" : " busy")}>{r.avail} · ответ {r.resp}</span>
                          </div>
                        </div>
                        <div className="resp__a">
                          <button className="btn btn-line btn-sm" onClick={() => go("prof")}>Профиль</button>
                          <button className="btn btn-ink btn-sm" onClick={() => go("msg")}>Выбрать <Arr s={13} /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="row g12" style={{ marginTop: 16, flexWrap: "wrap" }}>
                  <button className="btn btn-acid" disabled={sel.length < 2} style={{ opacity: sel.length < 2 ? .45 : 1 }} onClick={() => sel.length > 1 && setCmp(true)}>
                    Сравнить{sel.length >= 2 ? " · " + sel.length : ""}
                  </button>
                  {sel.length > 0 && <button className="btn btn-line" onClick={() => setSel([])}>Сбросить</button>}
                  <span className="lbl">{sel.length < 2 ? "выбрано " + sel.length + " — добавьте ещё" : "готово к сравнению"}</span>
                </div>
              </div>)}

              {tab === "Коммуникации" && (<div className="sect">
                <div className="sec-h"><h2 style={{ margin: 0 }}>Переписка по заявке</h2><span className="trust"><span className="dot" style={{ background: "var(--moss)" }} />Бюро «Контур»</span></div>
                <div className="ochat">
                  {MESSAGES.map((m, i) => (
                    <div className={"omsg" + (m.me ? " me" : "")} key={i}>
                      <Ini n={m.ini} size={32} />
                      <div>
                        <div className="omsg__b">{m.t}</div>
                        <span className="lbl">{m.who} · {m.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="omsgbar">
                  <input className="inp" placeholder="Написать сообщение…" />
                  <button className="btn btn-ink" onClick={() => go("msg")}>Отправить</button>
                </div>
              </div>)}

              {tab === "Замечания" && (<div className="sect">
                <div className="sec-h"><h2 style={{ margin: 0 }}>Замечания экспертизы</h2><span className="lbl">{open} открытых · {REMARKS.length} всего</span></div>
                <div style={{ display: "grid", gap: 8 }}>
                  {REMARKS.map((r, i) => (
                    <div className="rem" key={i}>
                      <span className="tag solid">{r.sec}</span>
                      <span className="rem__t">{r.txt}</span>
                      <span className={"badge " + (r.st === "done" ? "ok" : r.st === "work" ? "work" : "wait")}>{r.lbl}</span>
                    </div>
                  ))}
                </div>
              </div>)}

              {tab === "Файлы" && (<div className="sect">
                <div className="sec-h"><h2 style={{ margin: 0 }}>Файлы проекта</h2><button className="btn btn-line btn-sm">Загрузить</button></div>
                <div className="files">
                  {FILES.map(f => (
                    <div className="file" key={f.name}>
                      <span className="ext">{f.ext}</span>
                      <span>{f.name}</span>
                      <span className="lbl">{f.size} · {f.date}</span>
                    </div>
                  ))}
                </div>
              </div>)}
            </div>

            <div style={{ display: "grid", gap: 14 }}>
              <div className="box">
                <span className="lbl">Заказчик</span>
                <div className="row g12" style={{ margin: "12px 0 16px", alignItems: "center" }}>
                  <Ini n="СИ" size={44} />
                  <div>
                    <b style={{ fontSize: 14.5, fontWeight: 500 }}>{O.client}</b>
                    <div className="lbl" style={{ marginTop: 3 }}>{O.clientCity}</div>
                  </div>
                </div>
                <button className="btn btn-acid" style={{ width: "100%" }} onClick={() => go("msg")}>Связаться</button>
              </div>

              <div className="box">
                <h3>Требуются специалисты</h3>
                <div className="team">
                  {TEAM.map(t => (
                    <button className="team__row" key={t} onClick={() => go("solo")}>
                      <span>{t}</span><Arr s={13} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="box" style={{ display: "grid", gap: 10 }}>
                <span className="lbl">Рыночный ориентир</span>
                <h3 style={{ margin: 0 }}>{O.budget} — в рынке</h3>
                <p>По похожим заявкам («{O.type}», стадия «{O.stage}») закрывались за 7–16 млн ₽. Медиана — 11,5 млн ₽ по 42 заявкам за 12 месяцев.</p>
                <button className="btn btn-line btn-sm" onClick={() => go("trust")}>Как считается индекс доверия</button>
              </div>
            </div>
          </div>
        </div>
        {cmp && <CompareOrder cands={RESPONSES.filter(r => sel.includes(r.name))} order={O.sections} onClose={() => setCmp(false)} go={go} />}
      </div>
    );
  }

  Object.assign(window, { OrderCard, CompareOrder });
})();
