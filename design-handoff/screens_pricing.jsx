/* screens_pricing.jsx — Pricing / Тарифы (per participant) */
(function () {
  const Icon = window.Icon;

  const PLANS = [
    {
      role: "Заказчик", icon: "building", color: "var(--green)",
      tagline: "Публикуйте проекты и находите команду",
      monthly: 0, yearly: 0, free: true,
      features: [
        "Публикация заявок без ограничений",
        "Поиск проектировщиков и экспертов",
        "Базовый чат и обмен файлами",
        "Сравнение откликов по заявке",
      ],
      cta: "Начать бесплатно", go: "order-new",
    },
    {
      role: "Проектировщик", icon: "compass", color: "var(--accent-2)",
      tagline: "Получайте заказы и растите репутацию",
      monthly: 1990, yearly: 1590, popular: true,
      features: [
        "Отклики на заявки без лимита",
        "Верифицированный профиль и СРО",
        "Рейтинг и портфолио проектов",
        "Доступ к биржам экспертизы",
        "Приоритет в выдаче подбора",
      ],
      cta: "Подключить тариф", go: "designers",
    },
    {
      role: "Эксперт", icon: "shield", color: "var(--blue)",
      tagline: "Проверяйте проекты и выдавайте заключения",
      monthly: 3490, yearly: 2790,
      features: [
        "Биржа экспертизы проектов",
        "Трекер замечаний и итераций",
        "Электронная выдача заключений",
        "Аккредитация и верификация",
        "Командная работа над проверкой",
      ],
      cta: "Подключить тариф", go: "expertise",
    },
    {
      role: "Производитель", icon: "box", color: "var(--pink)",
      tagline: "Продвигайте решения в подборе",
      monthly: 4990, yearly: 3990,
      features: [
        "Каталог решений с BIM-моделями",
        "Нормативная привязка узлов",
        "Продвижение в подборе решений",
        "Аналитика спроса и заявок",
        "Интеграции и доступ к API",
      ],
      cta: "Связаться с нами", go: "manufacturers",
    },
  ];

  function PlanCard({ p, annual, go }) {
    const price = annual ? p.yearly : p.monthly;
    return (
      <div className={"plan" + (p.popular ? " plan--pop" : "")} style={{ "--fc": p.color }}>
        {p.popular && <div className="plan__badge"><Icon name="star" size={13} /> Популярный</div>}
        <div className="plan__icon" style={{ color: p.color }}><Icon name={p.icon} size={24} strokeWidth={1.6} /></div>
        <div className="plan__role">{p.role}</div>
        <p className="plan__tag">{p.tagline}</p>

        <div className="plan__price">
          {p.free
            ? <span className="plan__amount num-pop" key="free">Бесплатно</span>
            : <><span className="plan__amount num-pop" key={price}>{price.toLocaleString("ru-RU")}</span><span className="plan__cur"> ₽</span><span className="plan__per">/ мес</span></>}
        </div>
        <div className="plan__billed">{p.free ? "навсегда" : annual ? "при оплате за год" : "при помесячной оплате"}</div>

        <ul className="plan__feats">
          {p.features.map((f, i) => (
            <li key={i}><span className="plan__check"><Icon name="check" size={13} /></span>{f}</li>
          ))}
        </ul>

        <button className={"btn btn-block plan__cta " + (p.popular ? "btn-primary" : "btn-ghost")} onClick={() => go(p.go)}>{p.cta}</button>
      </div>
    );
  }

  function Pricing({ go }) {
    const [annual, setAnnual] = React.useState(false);
    return (
      <>
        <div className="pricing-head">
          <span className="overline" style={{ color: "var(--accent-2)" }}>Тарифы</span>
          <h1 className="page-title" style={{ fontSize: 34, marginTop: 10 }}>Свой тариф для каждого участника</h1>
          <p className="muted" style={{ fontSize: 15.5, lineHeight: 1.6, maxWidth: 640, margin: "12px auto 0" }}>
            Заказчики публикуют заявки бесплатно. Проектировщики, эксперты и производители подключают подписку под свою роль на платформе.
          </p>

          <div className="billtoggle">
            <button className={"billtoggle__opt" + (!annual ? " is-active" : "")} onClick={() => setAnnual(false)}>Помесячно</button>
            <button className={"billtoggle__opt" + (annual ? " is-active" : "")} onClick={() => setAnnual(true)}>
              За год <span className="billtoggle__save">−20%</span>
            </button>
          </div>
        </div>

        <div className="pricing-grid">
          {PLANS.map(p => <PlanCard key={p.role} p={p} annual={annual} go={go} />)}
        </div>

        <div className="pricing-foot">
          <Icon name="shield" size={16} style={{ color: "var(--green)" }} />
          Оплата по счёту или картой · НДС включён · Отмена в любой момент
        </div>
      </>
    );
  }

  Object.assign(window, { Pricing });
})();
