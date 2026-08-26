/* screens_more.jsx — Chat, Analytics, Settings */
(function () {
  const Icon = window.Icon, Avatar = window.Avatar;

  /* ============ CHAT ============ */
  const CONVS = [
    { id: 0, name: "Архитектурное бюро «ПРОЕКТ.А»", order: "Проектирование жилого комплекса «Парк Резиденс»", last: "Да, конечно. Завтра вышлем ва…", time: "10:42", g: ["#a06bf5","#7d52e8"], online: true, ini: "ПА" },
    { id: 1, name: "Иванов Сергей Петрович", order: "Рабочая документация коттеджа 350 м²", last: "Я закончил первый этаж, жду к…", time: "Вчера", g: ["#4aa3ff","#3b7ff0"], ini: "ИС" },
    { id: 2, name: "Муниципальный Заказчик", order: "Водоснабжение микрорайона «Солне…", last: "Ваш проект проходит госэкспер…", time: "24 Мар", g: ["#3ad6a6","#22b886"], ini: "МЗ" },
  ];
  const MSGS = [
    { out: true, text: "Здравствуйте! Ознакомился с вашим откликом. Вы готовы взяться за стадию П?", time: "Вчера, 14:20" },
    { out: false, text: "Добрый день! Да, наш штат полностью закрывает этот объём.", time: "Вчера, 15:05" },
    { out: false, text: "Единственное, нам потребуется уточнить геологию. У вас есть актуальные изыскания?", time: "Вчера, 15:06" },
    { out: true, text: "Изыскания есть, прикрепил к заявке. Сможете подготовить детальное ТЗ?", time: "09:15" },
    { out: false, text: "Да, конечно. Завтра вышлем вам ТЗ на согласование.", time: "10:42" },
  ];
  function Chat({ go }) {
    const [sel, setSel] = React.useState(0);
    const c = CONVS[sel];
    return (
      <div className="chat">
        <aside className="chat__list">
          <h2 className="section-title" style={{ padding: "20px 20px 0", margin: 0 }}>Коммуникации</h2>
          <div style={{ padding: 16 }}><div className="topbar__search" style={{ maxWidth: "none" }}><Icon name="search" /><input placeholder="Поиск сообщений…" /></div></div>
          <div className="col" style={{ overflowY: "auto" }}>
            {CONVS.map(cv => (
              <button key={cv.id} className={"convitem" + (cv.id === sel ? " is-active" : "")} onClick={() => setSel(cv.id)}>
                <Avatar text={cv.ini} size={44} style={{ background: `linear-gradient(135deg,${cv.g[0]},${cv.g[1]})` }} />
                <div className="grow" style={{ minWidth: 0 }}>
                  <div className="row between"><span className="convitem__name">{cv.name}</span><span className="dim" style={{ fontSize: 11.5 }}>{cv.time}</span></div>
                  <div className="convitem__order">{cv.order}</div>
                  <div className="convitem__last">{cv.last}</div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <section className="chat__thread">
          <header className="chat__head">
            <Avatar text={c.ini} size={42} style={{ background: `linear-gradient(135deg,${c.g[0]},${c.g[1]})` }} />
            <div className="grow"><div style={{ fontWeight: 700 }}>{c.name}</div><div style={{ fontSize: 12.5, color: c.online ? "var(--green)" : "var(--text-mute)" }}>{c.online ? "● В сети" : "не в сети"}</div></div>
            <button className="btn btn-ghost btn-sm">Скрыть детали</button>
          </header>
          <div className="chat__body">
            {MSGS.map((m, i) => (
              <div key={i} className={"bubble-row" + (m.out ? " out" : "")}>
                {!m.out && <Avatar text={c.ini} size={30} style={{ background: `linear-gradient(135deg,${c.g[0]},${c.g[1]})`, flexShrink: 0 }} />}
                <div className={"bubble" + (m.out ? " bubble--out" : "")}>
                  <div>{m.text}</div>
                  <div className="bubble__time">{m.time}{m.out && <Icon name="check" size={12} style={{ marginLeft: 4 }} />}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="chat__compose">
            <button className="iconbtn"><Icon name="paperclip" size={17} /></button>
            <input className="input grow" placeholder="Сообщение…" />
            <button className="btn btn-primary" style={{ width: 46, padding: 0 }}><Icon name="send" size={17} /></button>
          </div>
        </section>

        <aside className="chat__info">
          <div className="overline" style={{ marginBottom: 12 }}>Связанная заявка</div>
          <h3 style={{ margin: "0 0 14px", fontSize: 16, lineHeight: 1.3 }}>Проектирование жилого комплекса «Парк Резиденс»</h3>
          <div className="card" style={{ background: "var(--surface-2)", padding: 14, marginBottom: 16 }}>
            <div className="dim" style={{ fontSize: 12 }}>Бюджет</div><div className="price mt4">12 000 000 ₽</div>
          </div>
          <button className="btn btn-ghost btn-block" onClick={() => go("order-detail", 1)} style={{ marginBottom: 24 }}>Открыть заявку</button>
          <div className="overline" style={{ marginBottom: 12 }}>Вложения</div>
          <div className="col gap10">
            {[["ТЗ_Архитектура.pdf","1.2 МБ","file"],["Сетка_Колонн.dwg","4.5 МБ","layers"]].map(([n, s, ic]) => (
              <div key={n} className="attach"><div className="attach__ic"><Icon name={ic} size={16} /></div><div><div style={{ fontSize: 13.5, fontWeight: 600 }}>{n}</div><div className="dim" style={{ fontSize: 12 }}>{s}</div></div><Icon name="download" size={15} style={{ marginLeft: "auto", opacity: .5 }} /></div>
            ))}
          </div>
        </aside>
      </div>
    );
  }

  /* ============ ANALYTICS ============ */
  function Analytics() {
    const stats = [
      { num: "1.24 млрд ₽", label: "Объём рынка (активные заявки)", icon: "wallet", delta: "+12.5%", up: true },
      { num: "452", label: "Заявок на стадии П", icon: "file", delta: "+5.2%", up: true },
      { num: "3 840", label: "Зарегистрировано специалистов", icon: "users", delta: "+142", up: true },
      { num: "2.7 млн ₽", label: "Средний бюджет заявки", icon: "target", delta: "-1.2%", up: false },
    ];
    const deficit = [
      { code: "ОВиК", name: "Отопление и вентиляция", tag: "Критический дефицит", color: "var(--red)", pct: 14, orders: 86, free: 12 },
      { code: "ВК", name: "Водоснабжение", tag: "Высокий спрос", color: "var(--amber)", pct: 30, orders: 74, free: 22 },
      { code: "СМ", name: "Сметы", tag: "Умеренный спрос", color: "var(--amber)", pct: 40, orders: 120, free: 48 },
      { code: "КР", name: "Конструкции", tag: "Баланс", color: "var(--accent-2)", pct: 76, orders: 112, free: 85 },
      { code: "АР", name: "Архитектура", tag: "Большая конкуренция", color: "var(--green)", pct: 100, orders: 105, free: 156 },
    ];
    const struct = [["Жилая недвижимость", 45, "var(--accent-2)"], ["Промышленные объекты", 25, "var(--amber)"], ["Коммерческая", 20, "var(--green)"], ["Инфраструктура", 10, "var(--accent)"]];
    const prices = [
      { code: "КР", name: "Конструктивные решения", sub: "Жилые комплексы", min: "300 тыс.", mid: "650 тыс.", max: "1200 тыс.", pos: 62 },
      { code: "АР", name: "Архитектурные решения", sub: "Коммерческая недвижимость", min: "250 тыс.", mid: "500 тыс.", max: "900 тыс.", pos: 50 },
      { code: "ЭОМ", name: "Электроснабжение", sub: "Промышленные объекты", min: "150 тыс.", mid: "300 тыс.", max: "800 тыс.", pos: 28 },
      { code: "ОВиК", name: "Отопление, вентиляция", sub: "Промышленные объекты", min: "200 тыс.", mid: "450 тыс.", max: "900 тыс.", pos: 44 },
    ];
    return (
      <>
        <div className="page-head">
          <div><h1 className="page-title">Аналитика рынка ПИР</h1><p className="page-sub">Мониторинг цен, кадрового дефицита и ключевых трендов проектирования</p></div>
          <div className="row gap10"><button className="btn btn-ghost btn-sm"><Icon name="globe" size={15} /> Все объекты</button><button className="btn btn-ghost btn-sm"><Icon name="download" size={15} /> Экспорт отчёта</button></div>
        </div>

        <div className="grid-4" style={{ marginBottom: 22 }}>
          {stats.map(s => (
            <div key={s.label} className="stat">
              <div className="row between"><div className="stat__icon"><Icon name={s.icon} /></div><span className={"delta " + (s.up ? "up" : "down")}><Icon name={s.up ? "trendUp" : "trendDown"} size={13} />{s.delta}</span></div>
              <div className="stat__num" style={{ fontSize: 26 }}>{s.num}</div><div className="stat__label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="analytics-2" style={{ marginBottom: 22 }}>
          <div className="card">
            <h3 className="row gap8 section-title" style={{ fontSize: 17, marginBottom: 6 }}><Icon name="users" size={18} style={{ color: "var(--accent-2)" }} />Востребованность кадров (Дефицит)</h3>
            <p className="muted" style={{ margin: "0 0 22px", fontSize: 13.5, lineHeight: 1.5 }}>Отношение числа свободных подрядчиков к количеству активных заявок по разделам. Чем меньше шкала, тем острее дефицит специалистов.</p>
            <div className="col gap20">
              {deficit.map(d => (
                <div key={d.code}>
                  <div className="row between" style={{ marginBottom: 8 }}><span style={{ fontWeight: 600, fontSize: 14 }}>{d.code} ({d.name})</span><span style={{ color: d.color, fontWeight: 700, fontSize: 13 }}>{d.tag}</span></div>
                  <div className="bar"><div className="bar__fill" style={{ width: d.pct + "%", background: d.color }} /></div>
                  <div className="row between dim" style={{ fontSize: 12, marginTop: 6 }}><span>Заявок: {d.orders}</span><span>Свободно подрядчиков: {d.free}</span></div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="row gap8 section-title" style={{ fontSize: 17, marginBottom: 6 }}><Icon name="chart" size={18} style={{ color: "var(--accent-2)" }} />Структура публикуемых ПИР</h3>
            <p className="muted" style={{ margin: "0 0 22px", fontSize: 13.5, lineHeight: 1.5 }}>Распределение активных заявок на платформе по типам объектов за текущий месяц.</p>
            <div className="stackbar" style={{ marginBottom: 22 }}>{struct.map(([l, v, c]) => <div key={l} style={{ width: v + "%", background: c }} />)}</div>
            <div className="col gap14">
              {struct.map(([l, v, c]) => <div key={l} className="row between" style={{ fontSize: 14 }}><span className="row gap8"><i style={{ width: 9, height: 9, borderRadius: 3, background: c }} />{l}</span><b>{v}%</b></div>)}
            </div>
            <div className="insight mt24"><Icon name="bulb" size={17} style={{ color: "var(--amber)", flexShrink: 0 }} /><div><b>Инсайт:</b> рост заявок на промышленные объекты на 15% с начала года, что связано с развитием внутреннего производства.</div></div>
          </div>
        </div>

        <div className="card">
          <h3 className="section-title" style={{ fontSize: 17, marginBottom: 6 }}>Средняя стоимость контрактов по разделам</h3>
          <p className="muted" style={{ margin: "0 0 24px", fontSize: 13.5 }}>Цены формируются на основе успешно закрытых контрактов за последние 30 дней.</p>
          <div className="col gap24">
            {prices.map(p => (
              <div key={p.code} className="pricerow">
                <div><div style={{ fontWeight: 600, fontSize: 14.5 }}>{p.code} ({p.name})</div><div className="dim" style={{ fontSize: 12.5 }}>{p.sub}</div></div>
                <div>
                  <div className="prange"><div className="prange__track" /><div className="prange__active" style={{ left: "8%", right: (100 - p.pos) + "%" }} /><div className="prange__knob" style={{ left: p.pos + "%" }} /></div>
                  <div className="row between" style={{ marginTop: 8 }}><span className="dim" style={{ fontSize: 12.5 }}>от {p.min} ₽</span><b style={{ fontSize: 13.5 }}>Средняя: {p.mid} ₽</b><span className="dim" style={{ fontSize: 12.5 }}>до {p.max} ₽</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  /* ============ SETTINGS ============ */
  function Settings({ go }) {
    const [role, setRole] = React.useState("Заказчик");
    const roles = [["Заказчик","building"],["Проектировщик","pen"],["Эксперт","shield"],["Производитель","stamp"]];
    return (
      <>
        <div className="page-head"><div><h1 className="page-title">Настройки</h1><p className="page-sub">Управление профилем и аккаунтом</p></div></div>

        <div className="settings-wrap">
          <div className="card">
            <h3 className="section-title" style={{ marginBottom: 18 }}>Профиль</h3>
            <div className="overline" style={{ marginBottom: 12 }}>Роль на платформе</div>
            <div className="grid-2" style={{ gap: 12, marginBottom: 22 }}>
              {roles.map(([r, ic]) => (
                <button key={r} className={"rolecard" + (r === role ? " is-sel" : "")} onClick={() => setRole(r)}><Icon name={ic} size={24} /><span>{r}</span></button>
              ))}
            </div>
            <div className="col gap16">
              <div className="field"><label>ФИО / Название компании</label><input className="input" defaultValue="Демо Пользователь" /></div>
              <div className="field"><label>Компания</label><input className="input" defaultValue="ООО «Демо»" /></div>
              <div className="grid-2" style={{ gap: 16 }}>
                <div className="field"><label>Телефон</label><input className="input" defaultValue="+7 999 000-00-00" /></div>
                <div className="field"><label>Регион</label><input className="input" defaultValue="Москва" /></div>
              </div>
              <div className="field"><label>О себе</label><textarea className="input" rows={3} placeholder="Краткое описание специализации и опыта" /></div>
            </div>
            <button className="btn btn-primary mt24">Сохранить изменения</button>
          </div>

          <div className="card" style={{ marginTop: 24 }}>
            <h3 className="section-title" style={{ marginBottom: 18 }}>Аккаунт</h3>
            <div className="field" style={{ marginBottom: 8 }}><label>Email (логин)</label><input className="input" defaultValue="demo@funktsiya.ru" disabled style={{ opacity: .7 }} /></div>
            <p className="dim" style={{ fontSize: 13, margin: "0 0 22px" }}>Email используется для входа и не редактируется.</p>
            <hr className="divider" style={{ marginBottom: 20 }} />
            <div className="row between"><div><div style={{ fontWeight: 600, fontSize: 14 }}>Выйти из аккаунта на этом устройстве</div></div><button className="btn btn-ghost btn-sm" onClick={() => go("landing")}><Icon name="logout" size={15} /> Выйти</button></div>
          </div>
        </div>
      </>
    );
  }

  Object.assign(window, { Chat, Analytics, Settings });
})();
