/* screens_standards.jsx — Нормативная база v2: ИИ-поиск, библиотека, разбор документа */
(function () {
  const Icon = window.Icon;

  /* ---------- статусы / справочники ---------- */
  const STATUS = {
    ok:       { label: "Действует", color: "var(--green)" },
    old:      { label: "Устарел",   color: "var(--amber)" },
    replaced: { label: "Заменён",   color: "var(--red)" },
  };
  const TYPES = ["Все", "ГОСТ", "СП", "СНиП"];
  const SECS = ["ПЗ", "АР", "КР", "ОВ", "ВК", "ЭОМ"];

  /* ---------- документы ---------- */
  const DOCS = [
    { code: "СП 20.13330.2016", type: "СП", title: "Нагрузки и воздействия", status: "ok",
      upd: "изм. №3 · 2023", intro: "04.06.2017", sections: ["КР", "АР"],
      scope: "Нормативные значения постоянных и временных нагрузок, снеговые и ветровые воздействия, коэффициенты надёжности и правила сочетаний при расчёте зданий и сооружений.",
      points: [
        ["п. 11.1", "Нормативное значение ветровой нагрузки — по ветровому району и типу местности, с учётом пульсационной составляющей"],
        ["п. 10.1", "Снеговая нагрузка на покрытие — по снеговому району (карта 1, прил. Е)"],
        ["табл. 7.1", "Коэффициенты надёжности по нагрузке γf для постоянных и временных нагрузок"],
      ],
      rel: ["СП 22.13330.2016", "СП 17.13330.2017"],
      tags: "ветер ветровая снеговая гололёдная нагрузка сочетания пульсационная фасад высота район прогибы" },
    { code: "СП 17.13330.2017", type: "СП", title: "Кровли", status: "ok",
      upd: "изм. №2 · 2022", intro: "01.12.2017", sections: ["АР", "КР"],
      scope: "Проектирование кровель всех типов: уклоны, составы покрытий, водоотвод, узлы примыканий, эксплуатируемые и инверсионные кровли.",
      points: [
        ["п. 4.3", "Минимальные уклоны кровли в зависимости от материала водоизоляционного слоя"],
        ["п. 5.2", "Эксплуатируемые кровли — требования к защитному слою и покрытию"],
        ["п. 9.7", "Внутренний водоотвод: число воронок и площадь водосбора"],
      ],
      rel: ["СП 20.13330.2016", "СП 50.13330.2012"],
      tags: "кровля уклон мембрана пвх эксплуатируемая инверсионная водоотвод воронка парапет примыкание" },
    { code: "СП 50.13330.2012", type: "СП", title: "Тепловая защита зданий", status: "ok",
      upd: "ред. 2012", intro: "01.07.2013", sections: ["АР", "ОВ"],
      scope: "Требования к тепловой защите ограждающих конструкций: нормируемые сопротивления теплопередаче, защита от переувлажнения, воздухопроницаемость.",
      points: [
        ["табл. 3", "Нормируемые значения сопротивления теплопередаче R₀ по типу здания и ГСОП"],
        ["п. 5.7", "Приведённое сопротивление теплопередаче с учётом теплотехнических неоднородностей"],
        ["прил. Е", "Проверка на невыпадение конденсата и влагонакопление в конструкции"],
      ],
      rel: ["СП 17.13330.2017", "СП 60.13330.2020"],
      tags: "теплотехника утеплитель сопротивление теплопередаче конденсат влагонакопление гсоп фасад" },
    { code: "СП 2.13130.2020", type: "СП", title: "Системы противопожарной защиты. Обеспечение огнестойкости объектов защиты", status: "ok",
      upd: "изм. №1 · 2021", intro: "30.09.2020", sections: ["АР", "КР"],
      scope: "Требуемые пределы огнестойкости строительных конструкций и способы их обеспечения, включая огнезащиту стальных и деревянных конструкций.",
      points: [
        ["табл. 21", "Соответствие степени огнестойкости здания и пределов огнестойкости конструкций"],
        ["п. 6.5.3", "Конструктивная огнезащита стальных конструкций — условия применения"],
        ["п. 5.4.3", "Подтверждение предела огнестойкости расчётом или испытанием"],
      ],
      rel: ["ГОСТ Р 53295-2009", "ГОСТ 31251-2008"],
      tags: "огнестойкость огнезащита предел r120 r90 пожарная защита металлоконструкции сталь степень" },
    { code: "ГОСТ Р 53295-2009", type: "ГОСТ", title: "Средства огнезащиты для стальных конструкций. Общие требования. Метод определения огнезащитной эффективности", status: "ok",
      upd: "ред. 2009", intro: "01.01.2010", sections: ["КР"],
      scope: "Требования к огнезащитным составам и покрытиям для стали, группы огнезащитной эффективности и методы их испытаний.",
      points: [
        ["п. 4", "Семь групп огнезащитной эффективности — от 150 до 15 минут"],
        ["п. 8", "Метод испытания на двутавре №20: критическая температура 500 °C"],
      ],
      rel: ["СП 2.13130.2020"],
      tags: "огнезащита сталь краска вспучивающаяся покрытие эффективность испытания сертификат" },
    { code: "СП 60.13330.2020", type: "СП", title: "Отопление, вентиляция и кондиционирование воздуха", status: "ok",
      upd: "ред. 2020", intro: "01.07.2021", sections: ["ОВ"],
      scope: "Проектирование систем отопления, вентиляции и кондиционирования: параметры микроклимата, воздухообмен, противодымная защита.",
      points: [
        ["п. 5.1", "Расчётные параметры микроклимата помещений в холодный период года"],
        ["п. 7.1", "Минимальный расход наружного воздуха на одного человека"],
        ["прил. К", "Нормы воздухообмена по типам помещений"],
      ],
      rel: ["СП 50.13330.2012"],
      tags: "отопление вентиляция кондиционирование воздухообмен микроклимат дымоудаление" },
    { code: "СП 31.13330.2021", type: "СП", title: "Водоснабжение. Наружные сети и сооружения", status: "ok",
      upd: "ред. 2021", intro: "01.07.2021", sections: ["ВК"],
      scope: "Проектирование наружных сетей и сооружений водоснабжения: расчётные расходы, напоры, материалы труб, зоны санитарной охраны.",
      points: [
        ["п. 5.2", "Удельное среднесуточное водопотребление на одного жителя"],
        ["п. 8.2", "Минимальный свободный напор в сети при максимальном водоразборе"],
        ["разд. 14", "Зоны санитарной охраны источников и водопроводных сооружений"],
      ],
      rel: ["СНиП 2.04.02-84*"],
      tags: "водоснабжение водопровод наружные сети напор расход труба пожаротушение" },
    { code: "СНиП 2.04.02-84*", type: "СНиП", title: "Водоснабжение. Наружные сети и сооружения", status: "replaced", repl: "СП 31.13330.2021",
      upd: "ред. 1985", intro: "01.01.1985", sections: ["ВК"],
      scope: "Прежняя редакция норм по наружным сетям водоснабжения. Применяется только при проверке проектов, выполненных до ввода СП 31.13330.",
      points: [["—", "Документ сохранён в базе для работы с архивными проектами"]],
      rel: ["СП 31.13330.2021"],
      tags: "водоснабжение наружные сети архив" },
    { code: "ГОСТ Р 21.101-2020", type: "ГОСТ", title: "СПДС. Основные требования к проектной и рабочей документации", status: "ok",
      upd: "ред. 2020", intro: "01.01.2021", sections: ["ПЗ"],
      scope: "Состав, оформление и правила внесения изменений в проектную и рабочую документацию: обозначения, основные надписи, общие данные.",
      points: [
        ["п. 4.2", "Обозначения разделов проектной и марок рабочей документации"],
        ["п. 5.2", "Состав общих данных по рабочим чертежам"],
        ["разд. 7", "Правила внесения изменений в выданную документацию"],
      ],
      rel: ["ГОСТ 21.1101-2013"],
      tags: "оформление документация спдс штамп основная надпись обозначения изменения" },
    { code: "ГОСТ 21.1101-2013", type: "ГОСТ", title: "СПДС. Основные требования к проектной и рабочей документации", status: "replaced", repl: "ГОСТ Р 21.101-2020",
      upd: "ред. 2013", intro: "01.01.2014", sections: ["ПЗ"],
      scope: "Прежняя редакция требований к составу и оформлению документации. Заменена ГОСТ Р 21.101-2020.",
      points: [["—", "Используйте при сопровождении проектов, выпущенных до 2021 года"]],
      rel: ["ГОСТ Р 21.101-2020"],
      tags: "оформление документация спдс архив" },
    { code: "СП 22.13330.2016", type: "СП", title: "Основания зданий и сооружений", status: "ok",
      upd: "изм. №4 · 2026", intro: "01.07.2017", sections: ["КР"],
      scope: "Проектирование оснований: расчёт по несущей способности и деформациям, нормативные характеристики грунтов, особые условия.",
      points: [
        ["п. 5.6", "Расчёт оснований по деформациям — предельные осадки зданий"],
        ["табл. 5.1", "Коэффициенты условий работы грунтового основания"],
        ["прил. Б", "Нормативные значения прочностных характеристик грунтов"],
      ],
      rel: ["СП 20.13330.2016"],
      tags: "основания фундаменты грунты осадка деформации несущая способность свая" },
    { code: "СП 52.13330.2016", type: "СП", title: "Естественное и искусственное освещение", status: "ok",
      upd: "изм. №1 · 2019", intro: "08.05.2017", sections: ["ЭОМ", "АР"],
      scope: "Нормы естественного, совмещённого и искусственного освещения зданий и наружного освещения территорий.",
      points: [
        ["табл. 4.1", "Нормируемые показатели освещения основных помещений"],
        ["п. 7.2", "Нормированные значения КЕО для естественного освещения"],
      ],
      rel: ["СНиП 23-05-95*"],
      tags: "освещение освещённость кео светильники инсоляция" },
    { code: "СНиП 23-05-95*", type: "СНиП", title: "Естественное и искусственное освещение", status: "old", repl: "СП 52.13330.2016",
      upd: "ред. 2003", intro: "01.01.1996", sections: ["ЭОМ"],
      scope: "Устаревшая редакция норм освещения. Для новых проектов применяйте СП 52.13330.2016.",
      points: [["—", "Сохраняется в перечнях для отдельных видов экспертизы"]],
      rel: ["СП 52.13330.2016"],
      tags: "освещение архив" },
    { code: "ГОСТ 31251-2008", type: "ГОСТ", title: "Стены наружные с внешней стороны. Метод испытаний на пожарную опасность", status: "ok",
      upd: "ред. 2008", intro: "01.03.2009", sections: ["АР"],
      scope: "Метод испытаний наружных стен (включая навесные фасадные системы) на пожарную опасность и присвоение класса К0–К3.",
      points: [
        ["разд. 6", "Порядок проведения огневых испытаний фрагмента стены"],
        ["разд. 9", "Критерии присвоения класса пожарной опасности К0"],
      ],
      rel: ["СП 2.13130.2020"],
      tags: "фасад нвф пожарная опасность к0 стены наружные испытания" },
    { code: "СП 256.1325800.2016", type: "СП", title: "Электроустановки жилых и общественных зданий. Правила проектирования и монтажа", status: "ok",
      upd: "изм. №6 · 2026", intro: "02.03.2017", sections: ["ЭОМ"],
      scope: "Проектирование электроустановок: вводные устройства, групповые сети, защитные меры электробезопасности, учёт электроэнергии.",
      points: [
        ["разд. 7", "Требования к групповым сетям и сечениям проводников"],
        ["разд. 10", "Защитные меры электробезопасности: УЗО, заземление"],
      ],
      rel: ["СП 52.13330.2016"],
      tags: "электроснабжение электроустановки кабель сечение узо щит заземление" },
  ];

  const CHANGES = [
    { code: "СП 22.13330.2016", what: "Изм. №4 — уточнён расчёт оснований по деформациям", when: "Май 2026" },
    { code: "СП 256.1325800.2016", what: "Изм. №6 — требования к групповым сетям", when: "Апрель 2026" },
    { code: "ГОСТ Р 21.101-2020", what: "Поправка — оформление общих данных (п. 5.2)", when: "Март 2026" },
  ];

  /* ---------- ИИ-разбор: заготовленные темы ---------- */
  const THEMES = [
    { re: /огнезащит|огнесто|r\s?120/i,
      parsed: ["Огнезащита", "Стальные конструкции", "Предел R120"],
      verdict: "Требуемые пределы огнестойкости и допустимые способы огнезащиты задаёт СП 2.13130.2020; требования к самим средствам огнезащиты — ГОСТ Р 53295-2009. Степень огнестойкости здания проверьте по табл. 21.",
      docs: [
        ["СП 2.13130.2020", "п. 6.5.3 — конструктивная огнезащита стальных конструкций; табл. 21 — требуемые пределы"],
        ["ГОСТ Р 53295-2009", "п. 4 — группы огнезащитной эффективности средств огнезащиты"],
        ["СП 20.13330.2016", "табл. 7.1 — коэффициенты надёжности по нагрузке для расчётной схемы"],
      ] },
    { re: /кровл|мембран|инверсион/i,
      parsed: ["Кровля", "Эксплуатируемая", "Состав покрытия"],
      verdict: "Базовый документ по составам и уклонам кровли — СП 17.13330.2017: для эксплуатируемых кровель смотрите требования к защитному слою. Теплотехнический расчёт пирога — по СП 50.13330.2012.",
      docs: [
        ["СП 17.13330.2017", "п. 4.3 — минимальные уклоны; п. 5.2 — защитный слой эксплуатируемой кровли"],
        ["СП 50.13330.2012", "табл. 3 — нормируемое сопротивление теплопередаче покрытия"],
        ["СП 20.13330.2016", "п. 10.1 — снеговая нагрузка на покрытие по району строительства"],
      ] },
    { re: /фасад|ветров|нвф/i,
      parsed: ["Фасад", "Высота 75 м", "Ветровая нагрузка"],
      verdict: "Ветровая нагрузка на навесной фасад считается по СП 20.13330.2016 с учётом пульсационной составляющей для высоты 75 м. Класс пожарной опасности наружной стены подтверждается испытаниями по ГОСТ 31251-2008.",
      docs: [
        ["СП 20.13330.2016", "п. 11.1 — нормативное значение ветровой нагрузки; пульсация для H = 75 м"],
        ["ГОСТ 31251-2008", "метод испытаний наружных стен на пожарную опасность (класс К0)"],
        ["СП 50.13330.2012", "табл. 3 — приведённое сопротивление теплопередаче стены"],
      ] },
    { re: /водоснабж|водопровод|наружн\S* сет/i,
      parsed: ["Водоснабжение", "Наружные сети"],
      verdict: "Действующая редакция по наружным сетям — СП 31.13330.2021. СНиП 2.04.02-84* заменён и применяется только при работе с архивными проектами.",
      docs: [
        ["СП 31.13330.2021", "п. 5 — расчётные расходы воды; п. 8 — свободные напоры в сети"],
        ["СНиП 2.04.02-84*", "заменён — вместо него действует СП 31.13330.2021"],
      ] },
  ];

  const SUGGEST = [
    "Огнезащита металлоконструкций R120",
    "Состав эксплуатируемой кровли",
    "Ветровая нагрузка на фасад 75 м",
    "Наружные сети водоснабжения",
  ];

  const byCode = (code) => DOCS.find(d => d.code === code);

  /* ---------- поиск с подсветкой ---------- */
  const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const stem = (t) => (/^[а-яё]+$/.test(t) && t.length > 5) ? t.slice(0, t.length - 2) : t;
  const getTerms = (q) => q.toLowerCase().split(/[\s,;«»()]+/).filter(t => t.length > 1).map(stem);

  function searchDocs(q) {
    const terms = getTerms(q);
    if (!terms.length) return [];
    const out = [];
    for (const d of DOCS) {
      const code = d.code.toLowerCase();
      const title = d.title.toLowerCase();
      const body = (d.scope + " " + d.tags + " " + d.sections.join(" ")).toLowerCase();
      let s = 0;
      for (const t of terms) {
        if (code.includes(t)) s += 6;
        else if (title.includes(t)) s += 3;
        else if (body.includes(t)) s += 1;
      }
      if (s > 0) out.push([s, d]);
    }
    return out.sort((a, b) => b[0] - a[0]).map(x => x[1]);
  }

  function Hl({ text, q }) {
    const terms = q ? getTerms(q).map(escRe) : [];
    if (!terms.length) return text;
    const re = new RegExp("(" + terms.join("|") + ")", "ig");
    const parts = String(text).split(re);
    return parts.map((p, i) => i % 2 ? <mark key={i} className="nb-hl">{p}</mark> : p);
  }

  /* ---------- поисковый бокс (паттерн ai-pbox из каталога) ---------- */
  function NbSearch({ q, setQ, onSubmit, onReset, thinking, compact }) {
    const taRef = React.useRef(null);
    React.useLayoutEffect(() => { const ta = taRef.current; if (ta) { ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight, 120) + "px"; } }, [q]);
    return (
      <div className={"ai-pbox nb-pbox" + (compact ? " nb-pbox--compact" : "") + (thinking ? " is-loading" : "")}>
        <textarea ref={taRef} className="ai-pbox__ta" rows={1} value={q}
          placeholder="Номер документа или задача — например, «огнезащита колонн R120»…"
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSubmit(); } }} />
        <div className="ai-pbox__bar">
          <span className="nb-pbox__hint"><Icon name="spark" size={14} /> ИИ-поиск по базе ГОСТ, СП и СНиП</span>
          <div className="row gap8">
            {q.trim().length > 0 && <button type="button" className="nb-pbox__clear" onClick={onReset}>Сбросить</button>}
            <button type="button" className={"ai-pbox__send" + (q.trim() ? " is-on" : "")} onClick={() => onSubmit()} disabled={thinking} aria-label="Найти">
              <Icon name={thinking ? "scan" : "search"} size={17} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- блок ИИ-разбора ---------- */
  function ThemeBlock({ theme, onOpen }) {
    return (
      <div className="nb-ai">
        <div className="nb-ai__head">
          <span className="ai-badge"><Icon name="spark" size={13} /> ИИ-разбор задачи</span>
          <div className="chips">{theme.parsed.map(p => <span key={p} className="chip chip-code">{p}</span>)}</div>
        </div>
        <p className="nb-ai__verdict">{theme.verdict}</p>
        <div className="col gap8">
          {theme.docs.map(([code, why]) => {
            const d = byCode(code); const st = d && STATUS[d.status];
            return (
              <button key={code} type="button" className="nb-ai__doc" onClick={() => d && onOpen(d)}>
                <span className="chip chip-code">{code}</span>
                <span className="nb-ai__why">{why}</span>
                {st && <span className="nb-status" style={{ color: st.color }}><i />{st.label}</span>}
                <Icon name="chevR" size={14} className="nb-ai__go" />
              </button>
            );
          })}
        </div>
        <p className="nb-ai__note">Подбор носит справочный характер — сверяйте пункты с актуальной редакцией документа.</p>
      </div>
    );
  }

  /* ---------- карточка (сетка) ---------- */
  function DocCard({ d, fav, onFav, onOpen }) {
    const st = STATUS[d.status];
    return (
      <div className="card card-hover nb-card" onClick={onOpen} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") onOpen(); }}>
        <span className="nb-card__edge" style={{ background: st.color }}></span>
        <div className="row between" style={{ marginBottom: 12 }}>
          <span className="chip chip-code">{d.code}</span>
          <button className={"nb-fav" + (fav ? " is-on" : "")} onClick={(e) => { e.stopPropagation(); onFav(); }} title="В избранное"><Icon name="star" size={16} /></button>
        </div>
        <b className="nb-card__title">{d.title}</b>
        <p className="nb-card__scope">{d.scope}</p>
        <div className="row between" style={{ marginTop: "auto" }}>
          <span className="nb-status" style={{ color: st.color }}><i />{st.label}</span>
          <span className="dim" style={{ fontSize: 12 }}>{d.upd}</span>
        </div>
      </div>
    );
  }

  /* ---------- строка (результаты / список) ---------- */
  function DocRow({ d, q, fav, onFav, onOpen }) {
    const st = STATUS[d.status];
    return (
      <div className="nb-res" onClick={onOpen} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") onOpen(); }}>
        <span className="nb-res__edge" style={{ background: st.color }}></span>
        <div className="nb-res__main">
          <div className="row gap10 wrap" style={{ marginBottom: 6 }}>
            <span className="chip chip-code"><Hl text={d.code} q={q} /></span>
            <span className="nb-status" style={{ color: st.color }}><i />{st.label}</span>
            <span className="dim" style={{ fontSize: 12 }}>{d.upd}</span>
          </div>
          <b className="nb-res__title"><Hl text={d.title} q={q} /></b>
          <p className="nb-res__scope"><Hl text={d.scope} q={q} /></p>
        </div>
        <div className="nb-res__side">
          <button className={"nb-fav" + (fav ? " is-on" : "")} onClick={(e) => { e.stopPropagation(); onFav(); }} title="В избранное"><Icon name="star" size={15} /></button>
          <div className="chips nb-res__secs">{d.sections.map(s => <span key={s} className="chip chip-code">{s}</span>)}</div>
        </div>
      </div>
    );
  }

  /* ---------- свежие изменения ---------- */
  function Strip({ onOpen }) {
    return (
      <div style={{ marginBottom: 30 }}>
        <div className="row gap8" style={{ alignItems: "baseline", marginBottom: 12 }}>
          <h3 className="section-title" style={{ fontSize: 16, margin: 0 }}>Свежие изменения</h3>
          <span className="dim" style={{ fontSize: 12.5 }}>весна 2026</span>
        </div>
        <div className="nb-strip">
          {CHANGES.map(c => {
            const d = byCode(c.code);
            return (
              <button key={c.code} type="button" className="nb-strip__item" onClick={() => d && onOpen(d)}>
                <span className="nb-strip__ic"><Icon name="file" size={16} /></span>
                <span className="nb-strip__b">
                  <b>{c.code}</b>
                  <span className="nb-strip__what">{c.what}</span>
                </span>
                <span className="nb-strip__when">{c.when}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* ---------- панель разбора документа ---------- */
  function Drawer({ d, q, fav, onFav, onClose, onJump }) {
    const st = STATUS[d.status];
    React.useEffect(() => {
      const onKey = (e) => { if (e.key === "Escape") onClose(); };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);
    const repl = d.repl ? byCode(d.repl) : null;
    return (
      <div className="nb-drawer" onClick={onClose}>
        <div className="nb-drawer__panel" onClick={(e) => e.stopPropagation()}>
          <div className="nb-drawer__head">
            <div className="row between" style={{ marginBottom: 14 }}>
              <span className="nb-status nb-status--badge" style={{ color: st.color, background: `color-mix(in srgb, ${st.color} 13%, transparent)` }}><i />{st.label}</span>
              <div className="row gap8">
                <button className={"nb-fav" + (fav ? " is-on" : "")} onClick={onFav} title="В избранное"><Icon name="star" size={17} /></button>
                <button className="iconbtn" style={{ width: 34, height: 34 }} onClick={onClose} aria-label="Закрыть"><Icon name="x" size={16} /></button>
              </div>
            </div>
            <h2 className="nb-drawer__code">{d.code}</h2>
            <p className="nb-drawer__title">{d.title}</p>
            <div className="nb-drawer__meta">
              <span><Icon name="file" size={13} /> {d.type}</span>
              <span><Icon name="calendar" size={13} /> введён {d.intro}</span>
              <span><Icon name="clock" size={13} /> {d.upd}</span>
            </div>
          </div>
          <div className="nb-drawer__body">
            {(d.status === "replaced" || d.status === "old") && (
              <div className="nb-alert" style={{ borderColor: `color-mix(in srgb, ${st.color} 35%, transparent)`, background: `color-mix(in srgb, ${st.color} 9%, transparent)` }}>
                <Icon name="alert" size={17} style={{ color: st.color, flex: "none", marginTop: 1 }} />
                <span className="grow">
                  {d.status === "replaced" ? "Документ заменён — для новых проектов не применяется." : "Редакция устарела — проверьте требования в актуальном документе."}
                  {repl && <> Действующая редакция — <b>{repl.code}</b>.</>}
                </span>
                {repl && <button className="btn btn-ghost btn-sm" style={{ flex: "none" }} onClick={() => onJump(repl)}>Открыть</button>}
              </div>
            )}
            <h4 className="nb-drawer__h">Область применения</h4>
            <p className="nb-drawer__scope">{d.scope}</p>
            <h4 className="nb-drawer__h">Ключевые пункты</h4>
            <div className="col gap8">
              {d.points.map(([ref, text]) => (
                <div key={ref + text} className="nb-point">
                  <span className="chip chip-code">{ref}</span>
                  <span className="nb-point__t"><Hl text={text} q={q} /></span>
                </div>
              ))}
            </div>
            <h4 className="nb-drawer__h">Разделы проекта</h4>
            <div className="chips">{d.sections.map(s => <span key={s} className="chip chip-code">{s}</span>)}</div>
            {d.rel && d.rel.length > 0 && (
              <>
                <h4 className="nb-drawer__h">Связанные документы</h4>
                <div className="col gap8">
                  {d.rel.map(code => {
                    const r = byCode(code); if (!r) return null;
                    const rst = STATUS[r.status];
                    return (
                      <button key={code} type="button" className="nb-ai__doc" onClick={() => onJump(r)}>
                        <span className="chip chip-code">{r.code}</span>
                        <span className="nb-ai__why">{r.title}</span>
                        <span className="nb-status" style={{ color: rst.color }}><i />{rst.label}</span>
                        <Icon name="chevR" size={14} className="nb-ai__go" />
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          <div className="nb-drawer__foot">
            <button className="btn btn-primary grow"><Icon name="download" size={15} /> Скачать PDF</button>
            <button className="btn btn-ghost grow"><Icon name="eye" size={15} /> Читать онлайн</button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- фильтры (вариант «Поиск») ---------- */
  function FiltersRow({ type, setType, status, setStatus, sec, setSec, onlyFav, setOnlyFav }) {
    return (
      <div className="nb-filters">
        <div className="row gap8">{TYPES.map(tp => <button key={tp} className={"pill" + (tp === type ? " is-active" : "")} onClick={() => setType(tp)}>{tp}</button>)}</div>
        <span className="nb-sep"></span>
        <div className="row gap8">{Object.entries(STATUS).map(([k, s]) => (
          <button key={k} className={"pill nb-pill-st" + (status === k ? " is-active" : "")} onClick={() => setStatus(status === k ? "Все" : k)}><i style={{ background: s.color }} />{s.label}</button>
        ))}</div>
        <span className="nb-sep"></span>
        <div className="row gap8">{SECS.map(s => <button key={s} className={"pill" + (sec === s ? " is-active" : "")} onClick={() => setSec(sec === s ? null : s)}>{s}</button>)}</div>
        <div className="grow"></div>
        <button className={"pill nb-pill-st" + (onlyFav ? " is-active" : "")} onClick={() => setOnlyFav(!onlyFav)}><Icon name="star" size={13} /> Избранное</button>
      </div>
    );
  }

  /* ---------- рейл фильтров (вариант «Каталог») ---------- */
  function Rail({ type, setType, status, setStatus, sec, setSec, onlyFav, setOnlyFav, favCount }) {
    const typeCount = (tp) => tp === "Все" ? DOCS.length : DOCS.filter(d => d.type === tp).length;
    const stCount = (k) => DOCS.filter(d => d.status === k).length;
    return (
      <aside className="nb-rail">
        <div>
          <div className="nb-rail__h">Тип документа</div>
          {TYPES.map(tp => (
            <button key={tp} className={"nb-rail__item" + (type === tp ? " is-active" : "")} onClick={() => setType(tp)}>
              <span>{tp}</span><span className="nb-rail__n">{typeCount(tp)}</span>
            </button>
          ))}
        </div>
        <div>
          <div className="nb-rail__h">Статус</div>
          <button className={"nb-rail__item" + (status === "Все" && !onlyFav ? " is-active" : "")} onClick={() => { setStatus("Все"); setOnlyFav(false); }}><span>Все</span><span className="nb-rail__n">{DOCS.length}</span></button>
          {Object.entries(STATUS).map(([k, s]) => (
            <button key={k} className={"nb-rail__item" + (status === k ? " is-active" : "")} onClick={() => setStatus(status === k ? "Все" : k)}>
              <span className="row gap8"><i className="nb-dot" style={{ background: s.color }} />{s.label}</span><span className="nb-rail__n">{stCount(k)}</span>
            </button>
          ))}
          <button className={"nb-rail__item" + (onlyFav ? " is-active" : "")} onClick={() => setOnlyFav(!onlyFav)}>
            <span className="row gap8"><Icon name="star" size={14} style={{ color: "var(--amber)" }} />Избранное</span><span className="nb-rail__n">{favCount}</span>
          </button>
        </div>
        <div>
          <div className="nb-rail__h">Раздел проекта</div>
          <div className="chips" style={{ paddingLeft: 4 }}>{SECS.map(s => (
            <button key={s} className={"chip chip-code nb-chipbtn" + (sec === s ? " is-on" : "")} onClick={() => setSec(sec === s ? null : s)}>{s}</button>
          ))}</div>
        </div>
      </aside>
    );
  }

  /* ---------- экран ---------- */
  function Standards({ go, layout }) {
    const isB = layout === "Каталог";
    const [q, setQ] = React.useState("");
    const [asked, setAsked] = React.useState(null);
    const [thinking, setThinking] = React.useState(false);
    const [open, setOpen] = React.useState(null);
    const [favs, setFavs] = React.useState(() => new Set(["СП 20.13330.2016", "СП 17.13330.2017", "ГОСТ Р 21.101-2020"]));
    const [type, setType] = React.useState("Все");
    const [status, setStatus] = React.useState("Все");
    const [sec, setSec] = React.useState(null);
    const [onlyFav, setOnlyFav] = React.useState(false);

    const searching = q.trim().length > 1;
    const results = React.useMemo(() => searching ? searchDocs(q) : [], [q, searching]);
    const theme = (asked && asked === q.trim() && !thinking) ? THEMES.find(t => t.re.test(asked)) : null;

    const submit = (text) => {
      const v = (text != null ? text : q).trim(); if (!v) return;
      setQ(v); setAsked(v); setThinking(true);
      setTimeout(() => setThinking(false), 700);
    };
    const reset = () => { setQ(""); setAsked(null); };
    const toggleFav = (code) => setFavs(p => { const n = new Set(p); if (n.has(code)) n.delete(code); else n.add(code); return n; });

    const filtered = DOCS.filter(d =>
      (type === "Все" || d.type === type) &&
      (status === "Все" || d.status === status) &&
      (!sec || d.sections.includes(sec)) &&
      (!onlyFav || favs.has(d.code)));

    const rowProps = (d) => ({ d, fav: favs.has(d.code), onFav: () => toggleFav(d.code), onOpen: () => setOpen(d) });

    const pills = (
      <div className={"ai-pills nb-sugg" + (isB ? "" : " nb-pills")} style={isB ? { margin: "12px 0 24px" } : null}>
        {SUGGEST.map(s => <button key={s} type="button" className={"ai-pill" + (asked === s && q === s ? " is-on" : "")} onClick={() => submit(s)}>{s}</button>)}
      </div>
    );

    const resultsView = (
      <div className={thinking ? "nb-dim" : ""}>
        {theme && <ThemeBlock theme={theme} onOpen={setOpen} />}
        <div className="row between" style={{ marginBottom: 12 }}>
          <h3 className="section-title" style={{ fontSize: 16, margin: 0 }}>{results.length ? "Документы — " + results.length : "Ничего не найдено"}</h3>
          <a className="link" style={{ fontSize: 13 }} onClick={reset}>Сбросить поиск</a>
        </div>
        {results.length
          ? <div className="col gap10">{results.map(d => <DocRow key={d.code} q={q} {...rowProps(d)} />)}</div>
          : <div className="nb-empty">По запросу ничего не нашлось. Попробуйте номер документа («СП 20.13330») или другую формулировку.</div>}
      </div>
    );

    const libraryHead = (
      <div className="row between" style={{ margin: "0 0 14px", alignItems: "baseline" }}>
        <h3 className="section-title" style={{ fontSize: 16, margin: 0 }}>Библиотека</h3>
        <span className="dim" style={{ fontSize: 12.5 }}>{filtered.length} из {DOCS.length}</span>
      </div>
    );
    const emptyLib = <div className="nb-empty">Под выбранные фильтры ничего не попало — сбросьте часть условий.</div>;

    const drawer = open && (
      <Drawer d={open} q={searching ? q : ""} fav={favs.has(open.code)} onFav={() => toggleFav(open.code)}
        onClose={() => setOpen(null)} onJump={(r) => setOpen(r)} />
    );

    /* --- вариант «Поиск»: поисковый хаб --- */
    if (!isB) return (
      <>
        <div className="nb-hero">
          <div className="ai-glow" aria-hidden="true"></div>
          <span className="ai-badge"><Icon name="spark" size={13} /> Нормативная база</span>
          <h1 className="cat-title" style={{ fontSize: 36 }}>Найдите норматив — по номеру или задаче</h1>
          <p className="cat-lead" style={{ maxWidth: 560 }}>ГОСТ, СП и СНиП с привязкой к разделам проекта. Опишите задачу — подберём применимые документы и нужные пункты.</p>
          <NbSearch q={q} setQ={setQ} onSubmit={submit} onReset={reset} thinking={thinking} />
          {pills}
        </div>
        {searching ? resultsView : (
          <>
            <Strip onOpen={setOpen} />
            {libraryHead}
            <FiltersRow type={type} setType={setType} status={status} setStatus={setStatus} sec={sec} setSec={setSec} onlyFav={onlyFav} setOnlyFav={setOnlyFav} />
            {filtered.length ? <div className="nb-grid">{filtered.map(d => <DocCard key={d.code} {...rowProps(d)} />)}</div> : emptyLib}
          </>
        )}
        {drawer}
      </>
    );

    /* --- вариант «Каталог»: рейл фильтров + список --- */
    return (
      <>
        <div className="page-head" style={{ marginBottom: 22 }}>
          <h1 className="page-title">Нормативная база</h1>
          <span className="dim" style={{ fontSize: 13 }}>ГОСТ, СП и СНиП · обновлено в мае 2026</span>
        </div>
        <div className="nb-b">
          <Rail type={type} setType={setType} status={status} setStatus={setStatus} sec={sec} setSec={setSec}
            onlyFav={onlyFav} setOnlyFav={setOnlyFav} favCount={favs.size} />
          <div style={{ minWidth: 0 }}>
            <NbSearch compact q={q} setQ={setQ} onSubmit={submit} onReset={reset} thinking={thinking} />
            {pills}
            {searching ? resultsView : (
              <>
                <Strip onOpen={setOpen} />
                {libraryHead}
                {filtered.length ? <div className="col gap10">{filtered.map(d => <DocRow key={d.code} {...rowProps(d)} />)}</div> : emptyLib}
              </>
            )}
          </div>
        </div>
        {drawer}
      </>
    );
  }

  Object.assign(window, { Standards });
})();
