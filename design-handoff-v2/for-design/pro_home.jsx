/* pro_home.jsx — первая страница исполнителя сразу после регистрации.
   День нулевой: профиля ещё нет, откликов нет, но заявки по отмеченным
   разделам уже есть — на них и строится экран. */
(() => {
  const { useState } = React;

  const Arr = ({ s = 14 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>);
  const plural = (n, one, few, many) => {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
    return many;
  };

  const Chk = ({ s = 13 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5l3.5 3.5L13 4.5" /></svg>);

  /* Шаги готовности профиля. weight — вклад в готовность, why — что он даёт
     исполнителю (без этого чек-лист читается как бюрократия). */
  const TASKS = [
    ["Допуски и СРО", "Выписка из реестра и номер СРО", "Открывает заявки стадий П и РД — это 8 из 10 бюджетов", 30, false],
    ["Портфолио объектов", "3–5 объектов с составом разделов", "Заказчик видит опыт и приглашает адресно", 24, false],
    ["Ставки и формат", "Цена за раздел или за этап", "Платформа сама подставляет вас в подбор", 16, false],
    ["Телефон подтверждён", "+7 903 ··· 41 07", "", 12, true],
    ["Разделы и стадии отмечены", "8 разделов · П, РД", "", 18, true],
  ];

  /* Заявки, подобранные по отмеченным разделам. match — совпадение состава. */
  const FEED = [
    { t: "Проектирование жилого комплекса «Парк Резиденс»", city: "Москва", stage: "Проектная документация", secs: ["АР", "КР", "ЭОМ", "ВК"], mine: ["АР", "КР", "ЭОМ"], budget: "12 000 000 ₽", days: "до 01.09.2026", resp: 4, match: 86, hot: true },
    { t: "Склад класса А, 24 000 м²", city: "Домодедово", stage: "Стадия П", secs: ["АР", "КЖ", "ОВ"], mine: ["АР", "КЖ"], budget: "2 400 000 ₽", days: "до 15.10.2026", resp: 2, match: 74 },
    { t: "Котельная 4,2 МВт", city: "Тула", stage: "Рабочая документация", secs: ["ТХ", "ЭОМ", "АК"], mine: ["ЭОМ"], budget: "1 100 000 ₽", days: "до 20.09.2026", resp: 6, match: 52 },
    { t: "Реконструкция школы №14", city: "Калуга", stage: "Обследование + П", secs: ["АР", "КР", "ТО"], mine: ["АР", "КР"], budget: "3 800 000 ₽", days: "до 05.11.2026", resp: 1, match: 68, hot: true },
  ];

  const NAV = [["feed", "Заявки"], ["resp", "Мои отклики"], ["prof", "Профиль"], ["calc", "Расчёты"]];

  function ProHome() {
    const [done, setDone] = useState(TASKS.map(t => t[4]));
    const [sent, setSent] = useState([]);
    const ready = TASKS.reduce((s, t, i) => s + (done[i] ? t[3] : 0), 0);
    const left = TASKS.filter((t, i) => !done[i]);
    const toggle = i => setDone(d => d.map((v, j) => (j === i ? !v : v)));
    const respond = i => setSent(s => (s.includes(i) ? s : s.concat(i)));

    return (
      <div className="nd ph">
        <header className="topbar">
          <div className="topbar__l">
            <span className="logo">Функция</span>
            <span className="ph__badge">исполнителям</span>
          </div>
          <nav className="nav">
            {NAV.map(([k, l]) => <button key={k} className={k === "feed" ? "on" : ""}>{l}{k === "resp" && sent.length > 0 && <span className="nav__n num">{sent.length}</span>}</button>)}
          </nav>
          <div className="topbar__r">
            <span className="lbl">+7 903 ··· 41 07</span>
            <button className="btn btn-line btn-sm">Сайт для заказчиков</button>
          </div>
        </header>

        <div className="scroll">
          <div className="wrap">
            {/* 1. Приветствие + готовность: единственная цель первого визита —
                   объяснить, что уже работает и что осталось сделать. */}
            <section className="ph__hero">
              <div className="ph__hl">
                <span className="lbl">Профиль создан · 20 августа</span>
                <h1>Вы в базе исполнителей. Осталось подтвердить допуски</h1>
                <p>Заявки по вашим разделам уже подобраны — можно откликаться прямо сейчас. Но пока в профиле нет СРО и портфолио, заказчики видят вас ниже проверенных, а часть заявок стадии П закрыта.</p>
                <div className="ph__hb">
                  <button className="btn btn-acid btn-lg">Подтвердить допуски <Arr /></button>
                  <button className="btn btn-ghost">Сначала посмотреть заявки</button>
                </div>
              </div>
              <aside className="ph__ring">
                <div className="ph__rv"><b className="num">{ready}</b><span>%</span></div>
                <span className="ph__rl">готовность профиля</span>
                <div className="ph__bar"><i style={{ width: ready + "%" }} /></div>
                <span className="ph__rn">{left.length === 0 ? "все шаги закрыты" : "осталось шагов: " + left.length + " · +" + left.reduce((s, t) => s + t[3], 0) + "%"}</span>
              </aside>
            </section>

            {/* 2. Чек-лист: каждый шаг с объяснением выгоды, отмечается кликом */}
            <section className="ph__block">
              <div className="sec-h">
                <div><span className="lbl">Что сделать сегодня</span><h2 style={{ marginTop: 8 }}>Шаги до полного доступа</h2></div>
                <span className="ph__hint">Заполнение занимает 10–15 минут</span>
              </div>
              <div className="ph__tasks">
                {TASKS.map((t, i) => (
                  <button key={t[0]} className={"ptask" + (done[i] ? " on" : "")} onClick={() => toggle(i)}>
                    <span className="ptask__c">{done[i] ? <Chk /> : <b className="num">+{t[3]}%</b>}</span>
                    <span className="ptask__b">
                      <span className="ptask__t">{t[0]}</span>
                      <span className="ptask__s">{t[1]}</span>
                      {t[2] && <span className="ptask__w">{t[2]}</span>}
                    </span>
                    <span className="ptask__go">{done[i] ? "готово" : <Arr s={13} />}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* 3. Главное содержимое страницы — подобранные заявки */}
            <section className="ph__block">
              <div className="sec-h">
                <div><span className="lbl">Подобрано по вашим разделам</span><h2 style={{ marginTop: 8 }}>Заявки, где вы подходите</h2></div>
                <div className="row g12">
                  <span className="ph__hint">Первый отклик — бесплатно</span>
                  <button className="btn btn-line btn-sm">Настроить подбор</button>
                </div>
              </div>
              <div className="ph__feed">
                {FEED.map((r, i) => (
                  <article key={r.t} className="pfeed">
                    <div className="pfeed__m">
                      <b className="num">{r.match}%</b>
                      <span className="lbl">совпадение</span>
                    </div>
                    <div className="pfeed__b">
                      <div className="pfeed__top">
                        <h3>{r.t}</h3>
                        {r.hot && <span className="tag tag--hot"><span className="dot" style={{ background: "#DC5A2A" }} />срочно</span>}
                      </div>
                      <div className="pfeed__meta">
                        <span>{r.city}</span><i />
                        <span>{r.stage}</span><i />
                        <span>{r.resp} {plural(r.resp, "отклик", "отклика", "откликов")}</span>
                      </div>
                      <div className="pfeed__secs">
                        {r.secs.map(s => <span key={s} className={"psec" + (r.mine.includes(s) ? " on" : "")}>{s}</span>)}
                        <span className="pfeed__sn">{r.mine.length} из {r.secs.length} разделов — ваши</span>
                      </div>
                    </div>
                    <div className="pfeed__r">
                      <div className="pfeed__f"><span className="lbl">Бюджет</span><b className="num">{r.budget}</b></div>
                      <div className="pfeed__f"><span className="lbl">Срок</span><b className="num">{r.days}</b></div>
                      <button className={"btn btn-sm " + (sent.includes(i) ? "btn-line" : "btn-ink")} onClick={() => respond(i)} disabled={sent.includes(i)}>
                        {sent.includes(i) ? "отклик отправлен" : <>Откликнуться <Arr s={13} /></>}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* 4. Как устроены деньги и работа — снимает главный вопрос новичка */}
            <section className="ph__block ph__how">
              <div className="ph__hh">
                <span className="lbl">Как устроена работа</span>
                <h2>Платите только с принятого этапа</h2>
              </div>
              <div className="ph__steps">
                {[["01", "Отклик", "Пишете цену и срок по своим разделам. Первый отклик бесплатно, дальше — пакет или подписка."],
                  ["02", "Этап", "Заказчик принимает состав и открывает этап. Деньги резервируются на платформе до сдачи."],
                  ["03", "Расчёт", "Этап принят — сумма приходит вам, платформа удерживает 5%. Спорные случаи разбирает эксперт."]].map(([n, t, d]) => (
                  <div key={n} className="pstep">
                    <span className="pstep__n num">{n}</span>
                    <b>{t}</b>
                    <span>{d}</span>
                  </div>
                ))}
              </div>
              <div className="ph__foot">
                <span>Вопросы по договору и расчётам — в разделе «Расчёты» или напрямую менеджеру платформы.</span>
                <button className="btn btn-line btn-sm">Открыть расчёты</button>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  Object.assign(window, { ProHome });
})();
