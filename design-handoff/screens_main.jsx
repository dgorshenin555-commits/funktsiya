/* screens_main.jsx — Landing, Auth, Dashboard */
(function () {
  const Icon = window.Icon, Avatar = window.Avatar;
  const FuncMark = window.FuncMark;

  /* ============ LANDING ============ */
  const FEATURES = [
    { icon: "compass", title: "Проектировщики", color: "var(--accent-2)",
      desc: "Подбор исполнителей по заявке, СРО, рейтингу, география и опыт.",
      chips: [], cta: "Выбрать специалиста", go: "designers" },
    { icon: "shield", title: "Экспертиза", color: "var(--blue)",
      desc: "Замечания, ответы, итерации и статусы прохождений в одном месте.",
      chips: ["Подана","Замечания","Доработка","Заключение"], cta: "Открыть трекер", go: "expertise" },
    { icon: "box", title: "Производители", color: "var(--pink)",
      desc: "Каталог решений с BIM-моделями, узлами, нормативной привязкой.",
      chips: ["BIM","Узлы","ТП","СР","Нормативы","Советы"], cta: "Перейти в каталог", go: "manufacturers" },
    { icon: "chat", title: "Коммуникации", color: "var(--green)",
      desc: "Чаты, обсуждение файлов DWG и прозрачная история тарифов.",
      chips: ["DWG","IFC","PDF","Комментарии"], cta: "Открыть ЕТП", go: "chat" },
    { icon: "trophy", title: "Рейтинги", color: "var(--amber)",
      desc: "Сроки, качество. Успешные проекты. Проверка. Репутация.",
      chips: ["Сроки","Качество","Успешные проекты"], cta: "Смотреть рейтинг", go: "experts" },
  ];
  const PLATFORM = [["CRM","var(--red)"],["EDI","var(--blue)"],["Финансы","var(--green)"],["BIM","var(--accent-2)"],["Маркет","var(--amber)"],["Коммуникации","var(--green)"],["Производители","var(--pink)"]];

  function Landing({ go }) {
    return (
      <div className="landing">
        <header className="landing__top">
          <button className="iconbtn"><Icon name="menu" /></button>
          <div className="row gap12 brand-link" onClick={() => go("landing")} title="На главную" style={{ cursor: "pointer" }}>
            <FuncMark size={34} />
            <div className="brand__name">ФУНКЦИЯ</div>
          </div>
        </header>

        <div className="landing__scroll">
          <div className="landing__wrap">
            <section className="hero">
              <div>
                <h1 className="hero__title">Единая платформа<br/>для проектирования,<br/>экспертизы и подбора<br/>решений</h1>
                <p className="hero__sub">Публикуйте заявки, находите проектировщиков, проходите экспертизу, работайте с нормативами и техническими решениями в одной системе.</p>
                <div className="row gap12 mt32 wrap">
                  <button className="btn btn-primary" style={{ height: 50, padding: "0 26px", fontSize: 15 }} onClick={() => go("auth")}>Создать заявку</button>
                  <button className="btn btn-ghost" style={{ height: 50, padding: "0 26px", fontSize: 15 }} onClick={() => go("orders")}>Смотреть возможности</button>
                </div>
              </div>

              <div className="hero__right">
                <window.Mascots scale={0.4} style={{ marginLeft: "auto", marginRight: 20, marginBottom: -14, position: "relative", zIndex: 1 }} />
                <div className="card hero__form" style={{ position: "relative", zIndex: 2 }}>
                  <h3 className="section-title">Создание заявки</h3>
                  <p className="muted" style={{ fontSize: 14, margin: "8px 0 18px", lineHeight: 1.55 }}>Пошаговая публикация проекта, от типа объекта и региона до бюджета, сроков и загрузки файлов.</p>
                  <div className="chips" style={{ marginBottom: 14 }}>
                    {["Тип объекта","Регион","Стадия","Разделы","Файлы"].map(c => <span key={c} className="pill" style={{ height: 34 }}>{c}</span>)}
                  </div>
                  <div className="input row between" style={{ marginBottom: 16, cursor: "pointer" }}>
                    <span className="dim">Вложить файлы проекта</span><Icon name="paperclip" size={16} />
                  </div>
                  <button className="btn btn-primary btn-block" style={{ height: 50, fontSize: 15 }} onClick={() => go("auth")}>Опубликовать</button>
                </div>
              </div>
            </section>

            <section className="features">
              {FEATURES.map(f => (
                <div key={f.title} className="card card-hover feature" style={{ "--fc": f.color }} onClick={() => go(f.go)}>
                  <div className="feature__icon" style={{ color: f.color }}><Icon name={f.icon} size={27} strokeWidth={1.6} /></div>
                  <h3 className="section-title" style={{ fontSize: 18 }}>{f.title}</h3>
                  <p className="muted feature__desc">{f.desc}</p>
                  {f.chips.length > 0 && <div className="chips" style={{ marginBottom: 18 }}>{f.chips.map(c => <span key={c} className="chip">{c}</span>)}</div>}
                  <div className="feature__cta">{f.cta} <Icon name="arrowRight" size={15} /></div>
                </div>
              ))}
              <div className="card feature feature--all" onClick={() => go("orders")}>
                <div>
                  <h3 className="section-title" style={{ fontSize: 20 }}>Все решения</h3>
                  <p className="muted feature__desc">Заявки, специалисты, эксперты, производители и нормативы — в едином рабочем пространстве.</p>
                </div>
                <div className="feature__icon" style={{ color: "var(--accent-2)", marginBottom: 0 }}><Icon name="arrowRight" size={22} /></div>
              </div>
            </section>
          </div>

          <footer className="landing__legend">
            {PLATFORM.map(([l, c]) => <span key={l}><i style={{ background: c }} />{l}</span>)}
            <span className="dim">• Ещё</span>
          </footer>
        </div>
      </div>
    );
  }

  /* ============ DASHBOARD ============ */
  function Dashboard({ go }) {
    const stats = [
      { num: "4", label: "Активных заявок", icon: "grid" },
      { num: "0", label: "Моих заявок", icon: "file" },
      { num: "0", label: "Моих откликов", icon: "comment" },
    ];
    return (
      <>
        <div className="page-head">
          <div>
            <h1 className="page-title">Личный кабинет</h1>
            <p className="page-sub">Демо Пользователь · demo@funktsiya.ru · ООО «Демо»</p>
          </div>
          <a className="link" onClick={() => go("landing")} style={{ fontSize: 14, paddingTop: 6 }}>Выйти</a>
        </div>

        <div className="grid-3" style={{ marginBottom: 36 }}>
          {stats.map(s => (
            <div key={s.label} className="stat">
              <div className="stat__icon"><Icon name={s.icon} /></div>
              <div className="stat__num">{s.num}</div>
              <div className="stat__label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="row between" style={{ marginBottom: 22 }}>
          <h2 className="section-title">Мои заявки</h2>
          <button className="btn btn-primary btn-sm" onClick={() => go("order-new")}><Icon name="plus" size={15} /> Создать заявку</button>
        </div>

        <div className="empty">
          <window.Mascots scale={0.5} style={{ marginBottom: 10 }} />
          <h3 style={{ margin: "0 0 6px", fontSize: 18, color: "#fff" }}>У вас пока нет заявок</h3>
          <p className="muted" style={{ margin: "0 0 22px", fontSize: 14 }}>Опубликуйте первый проект — отклики проектировщиков появятся здесь.</p>
          <button className="btn btn-primary" onClick={() => go("order-new")}>Создать первую заявку</button>
        </div>
      </>
    );
  }

  Object.assign(window, { Landing, Dashboard });
})();
