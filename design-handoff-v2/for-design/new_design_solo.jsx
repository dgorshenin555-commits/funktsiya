/* new_design_solo.jsx — экран варианта Б, выгружен из основного проекта.
   Сгенерировано tools/reverse_transform.py: правки вносить в
   app/v2/_screens/ в проекте, иначе они разойдутся.
   Подключать после lib_bundle.jsx. */
(function () {
  const { useState } = React;
  const Arr = ({ s = 14 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>);
  const Back = ({ s = 14 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M13 8H3M7 4L3 8l4 4" /></svg>);
  const Chk = ({ s = 11 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5l3.5 3.5L13 4.5" /></svg>);

  const TIMELINE = [
    { id: "t1", meta: "2008", title: "Диплом МГСУ, ТГВ", desc: "Специальность «Теплогазоснабжение и вентиляция», диплом по реконструкции котельных." },
    { id: "t2", meta: "2008–2012", title: "Инженер ОВ, проектный институт", desc: "Разделы ОВ для жилых серий и школ, первые ИТП, работа под ГИПом." },
    { id: "t3", meta: "2012–2016", title: "Ведущий инженер, «Теплопроект»", desc: "Котельные до 6 МВт, тепловые сети, прохождение экспертизы по 12 объектам." },
    { id: "t4", meta: "2016", title: "Внесён в НРС (НОПРИЗ)", desc: "Реестр специалистов в области проектирования, направление ОВ." },
    { id: "t5", meta: "2016–2020", title: "ГИП, «Ситипроект»", desc: "Ведение комплексных проектов, согласование с теплосетями и заказчиком." },
    { id: "t6", meta: "2019", title: "Аттестация по расчётам ОВ", desc: "Поверочные расчёты систем отопления и вентиляции промышленных зданий." },
    { id: "t7", meta: "2020", title: "Открыл ИП", desc: "Прямые договоры с заказчиками и субподряд у проектных организаций." },
    { id: "t8", meta: "2021", title: "Склад класса А, 12 400 м²", desc: "ОВ, ВК: воздушное отопление, дымоудаление, узлы ввода." },
    { id: "t9", meta: "2022", title: "ЦТП, Подольск", desc: "Реконструкция без остановки теплоснабжения, этапная сдача разделов." },
    { id: "t10", meta: "2023", title: "ИТП жилого квартала", desc: "Три корпуса, единый узел учёта, заключение с первой итерации." },
    { id: "t11", meta: "2024", title: "Повышение квалификации", desc: "Энергоэффективность и автоматизация тепловых пунктов, 72 часа." },
    { id: "t12", meta: "2025", title: "Котельная 4,2 МВт, Ногинск", desc: "ГИП: ОВ, ТХ, сопровождение до положительного заключения." },
    { id: "t13", meta: "2026", title: "38 сделок в платформе", desc: "Срыв сроков 1,4%, средний отклик 3 часа, 17 отзывов заказчиков." },
  ];

  const SKILLS = [["ОВ", "Отопление и вентиляция", 96], ["ВК", "Водоснабжение и канализация", 88], ["ИТП", "Индивидуальные тепловые пункты", 92], ["ТС", "Тепловые сети", 71]];
  const WORKS = [["Котельная 4,2 МВт, Ногинск", "ОВ, ТХ · 2025 · ГИП"], ["ИТП жилого квартала, 3 корпуса", "ОВ, ВК · 2024"], ["Реконструкция ЦТП, Подольск", "ТС, ОВ · 2024"], ["Склад класса А, 12 400 м²", "ОВ, ВК · 2023"]];
  const REVS = [
    { who: "ООО «Ситипроект»", st: 5, t: "Взял разделы ОВ и ВК на субподряд, сдал раньше срока. Замечания экспертизы закрыл за три дня, на связи постоянно.", w: "июль 2026" },
    { who: "ГК «Ресурс»", st: 5, t: "Считает честно, объясняет решения заказчику сам. Работаем третий объект подряд.", w: "апрель 2026" },
  ];
  const DOCS = [["PDF", "Выписка из НРС (НОПРИЗ)", "проверено 04.08.2026"], ["PDF", "Диплом МГСУ, ТГВ, 2008", "проверено"], ["PDF", "Свидетельство ИП, ОГРНИП", "проверено 04.08.2026"], ["PDF", "Повышение квалификации, 2025", "до 03.2028"]];

  function SoloProfile({ go }) {
    const [tab, setTab] = useState("Обзор");
    return (
      <div className="scroll">
        <div className="wrap page">
          <button className="back" onClick={() => go("pick")}><Back /> Все исполнители</button>

          <div className="shead">
            <div className="shead__ava">
              <img src="assets/me.jpg" alt="Антон Ковалёв" />
              <span className="shead__ver"><Chk s={12} /> НРС</span>
            </div>
            <div className="shead__main">
              <div className="row g8" style={{ flexWrap: "wrap", marginBottom: 10 }}>
                <span className="tag solo-chip">физлицо · ИП</span>
                <span className="lbl">Частный специалист · Москва</span>
              </div>
              <h1>Антон Ковалёв</h1>
              <span className="shead__role">ГИП · инженер ОВ, ВК · 16 лет практики</span>
              <p className="shead__bio">Веду разделы отопления, вентиляции и водоснабжения как главный инженер проекта: котельные, ИТП, тепловые сети. Работаю напрямую с заказчиками и на субподряде у проектных организаций, сопровождаю проект до положительного заключения.</p>
              <div className="shead__acts">
                <button className="btn btn-acid" onClick={() => go("msg")}>Написать</button>
                <button className="btn btn-ink" onClick={() => go("reqs")}>Пригласить в заявку <Arr s={13} /></button>
                <button className="btn btn-line" onClick={() => go("call")}>Видеозвонок</button>
              </div>
            </div>
            <div className="shead__side">
              <div className="shead__tr"><span className="lbl">Проверен платформой</span><span className="shead__trn">СРО не требуется: подтверждены НРС, диплом и статус ИП</span></div>
              <div className="shead__kv"><span>Отклик</span><b>3 ч</b></div>
              <div className="shead__kv"><span>Проектов</span><b>38</b></div>
              <div className="shead__kv"><span>Срыв сроков</span><b style={{ color: "var(--moss)" }}>1,4%</b></div>
              <div className="shead__kv"><span>Ставка</span><b>от 2 400 ₽/ч</b></div>
            </div>
          </div>

          <div className="tabs2">
            {["Обзор", "Проекты", "Отзывы", "Документы"].map(t => <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>{t}</button>)}
          </div>

          {tab === "Обзор" && (
            <div className="two">
              <div>
                <div className="sect">
                  <h2>Что берёт в работу</h2>
                  <div className="skills">
                    {SKILLS.map(([s, t, v]) => (
                      <div className="skill" key={s}>
                        <div className="skill__h"><b>{s}</b><span>{t}</span><em className="num">{v}</em></div>
                        <div className="skill__bar"><i style={{ width: v + "%" }} /></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="sect">
                  <h2>Путь специалиста</h2>
                  <div className="scrubrow">
                    <window.ScrubRail items={TIMELINE} currentIndex={TIMELINE.length - 1} />
                    <p className="mut" style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6 }}>Наведите на рельс — от диплома до последних сделок: образование, НРС, аттестации и ключевые объекты. Последний штрих — текущее состояние профиля.</p>
                  </div>
                </div>
                <div className="sect">
                  <h2>Как работает</h2>
                  <div className="box">
                    {[["Договор", "через платформу, как ИП — с закрывающими документами"], ["Оплата", "по этапам, аванс 30%, остаток после сдачи раздела"], ["Загрузка", "берёт до двух объектов одновременно"], ["Смежники", "приводит конструктора и электрика при необходимости"]].map(([a, b]) => (
                      <div className="set-row" key={a}><div><h4>{a}</h4><p>{b}</p></div></div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: "grid", gap: 14 }}>
                <div className="box" style={{ display: "grid", gap: 12 }}>
                  <span className="lbl">Подтверждено платформой</span>
                  {["Личность и ИНН", "НРС · ГИП (НОПРИЗ)", "Диплом МГСУ, ТГВ, 2008", "Повышение квалификации, 2025", "ИП, ОГРНИП проверен", "38 сделок в платформе"].map(v => (
                    <span className="vchk" key={v}><i><Chk /></i>{v}</span>
                  ))}
                </div>
                <div className="box" style={{ display: "grid", gap: 10 }}>
                  <span className="lbl">Отличие от организации</span>
                  <p>У физлица нет СРО и страхования организации — ответственность обеспечивается договором через платформу и escrow по этапам. Для объектов, требующих СРО, специалист выступает субподрядчиком проектной организации.</p>
                </div>
              </div>
            </div>
          )}

          {tab === "Проекты" && (
            <div className="pgal">
              {WORKS.map(([t, s]) => (
                <figure key={t}><div className="ph"><span className="lbl">фото объекта</span></div><figcaption><b>{t}</b><span className="mut">{s}</span></figcaption></figure>
              ))}
            </div>
          )}

          {tab === "Отзывы" && (
            <div style={{ maxWidth: 720 }}>
              {REVS.map(r => (
                <div className="rev" key={r.who}>
                  <div className="row g12"><b style={{ fontSize: 14.5, fontWeight: 500 }}>{r.who}</b><span className="stars">{[1, 2, 3, 4, 5].map(i => <i key={i} className={i <= r.st ? "" : "off"} />)}</span><span className="spacer" /><span className="lbl">{r.w}</span></div>
                  <p className="mut" style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>{r.t}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "Документы" && (
            <div className="files" style={{ maxWidth: 640 }}>
              {DOCS.map(([e, n, s]) => (
                <div className="file" key={n}><span className="ext">{e}</span><span>{n}</span><span className="badge ok">{s}</span></div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  Object.assign(window, { SoloProfile });
})();
