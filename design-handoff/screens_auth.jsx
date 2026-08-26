/* screens_auth.jsx — split-screen login with mouse-tracking animated characters */
(function () {
  const Icon = window.Icon;
  const FuncMark = window.FuncMark;

  /* eye with white sclera + tracking pupil */
  function EyeBall({ size = 18, pupilSize = 7, max = 5, blinking, lookX, lookY, mouse }) {
    const ref = React.useRef(null);
    const [pos, setPos] = React.useState({ x: 0, y: 0 });
    React.useLayoutEffect(() => {
      if (lookX !== undefined) { setPos({ x: lookX, y: lookY }); return; }
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = mouse.x - (r.left + r.width / 2), dy = mouse.y - (r.top + r.height / 2);
      const dist = Math.min(Math.hypot(dx, dy), max), a = Math.atan2(dy, dx);
      setPos({ x: Math.cos(a) * dist, y: Math.sin(a) * dist });
    }, [mouse.x, mouse.y, lookX, lookY]);
    return (
      <div ref={ref} className="eye" style={{ width: size, height: blinking ? 2 : size }}>
        {!blinking && <div className="pupil" style={{ width: pupilSize, height: pupilSize, transform: `translate(${pos.x}px,${pos.y}px)` }} />}
      </div>
    );
  }

  /* bare pupil (no sclera) */
  function Pupil({ size = 12, max = 5, lookX, lookY, mouse }) {
    const ref = React.useRef(null);
    const [pos, setPos] = React.useState({ x: 0, y: 0 });
    React.useLayoutEffect(() => {
      if (lookX !== undefined) { setPos({ x: lookX, y: lookY }); return; }
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = mouse.x - (r.left + r.width / 2), dy = mouse.y - (r.top + r.height / 2);
      const dist = Math.min(Math.hypot(dx, dy), max), a = Math.atan2(dy, dx);
      setPos({ x: Math.cos(a) * dist, y: Math.sin(a) * dist });
    }, [mouse.x, mouse.y, lookX, lookY]);
    return <div ref={ref} className="pupil pupil--bare" style={{ width: size, height: size, transform: `translate(${pos.x}px,${pos.y}px)` }} />;
  }

  function useBlink() {
    const [b, setB] = React.useState(false);
    React.useEffect(() => {
      let t;
      const loop = () => { t = setTimeout(() => { setB(true); setTimeout(() => { setB(false); loop(); }, 150); }, Math.random() * 4000 + 3000); };
      loop();
      return () => clearTimeout(t);
    }, []);
    return b;
  }

  function skew(ref, mouse) {
    const el = ref.current; if (!el) return 0;
    const r = el.getBoundingClientRect();
    return Math.max(-6, Math.min(6, -(mouse.x - (r.left + r.width / 2)) / 120));
  }

  function Characters({ mouse, typing, hideEyes, peek }) {
    const purple = React.useRef(null), dark = React.useRef(null), amber = React.useRef(null), rose = React.useRef(null);
    const blinkP = useBlink(), blinkD = useBlink();
    // forced looks
    const away = hideEyes ? { lookX: -4, lookY: -5 } : {};
    const peekLook = peek ? { lookX: 3, lookY: 5 } : away;
    const glanceR = typing ? { lookX: 4, lookY: 2 } : {};
    const glanceL = typing ? { lookX: -4, lookY: 2 } : {};
    return (
      <div className="chars">
        {/* purple — tall, back */}
        <div ref={purple} className="char char--purple" style={{ transform: `skewX(${(hideEyes ? 0 : skew(purple, mouse)) + (typing ? -10 : 0)}deg)` }}>
          <div className="char__eyes" style={{ gap: 22 }}>
            <EyeBall mouse={mouse} blinking={blinkP} {...(hideEyes ? peekLook : glanceR)} />
            <EyeBall mouse={mouse} blinking={blinkP} {...(hideEyes ? peekLook : glanceR)} />
          </div>
        </div>
        {/* dark — middle */}
        <div ref={dark} className="char char--dark" style={{ transform: `skewX(${(hideEyes ? 0 : skew(dark, mouse)) + (typing ? 9 : 0)}deg)` }}>
          <div className="char__eyes" style={{ gap: 16, top: 30 }}>
            <EyeBall size={16} pupilSize={6} max={4} mouse={mouse} blinking={blinkD} {...(hideEyes ? away : glanceL)} />
            <EyeBall size={16} pupilSize={6} max={4} mouse={mouse} blinking={blinkD} {...(hideEyes ? away : glanceL)} />
          </div>
        </div>
        {/* amber — semicircle, front-left */}
        <div ref={amber} className="char char--amber" style={{ transform: `skewX(${hideEyes ? 0 : skew(amber, mouse)}deg)` }}>
          <div className="char__eyes" style={{ gap: 30, top: 92, left: 78 }}>
            <Pupil mouse={mouse} {...(hideEyes ? away : {})} />
            <Pupil mouse={mouse} {...(hideEyes ? away : {})} />
          </div>
        </div>
        {/* rose — front-right, with mouth */}
        <div ref={rose} className="char char--rose" style={{ transform: `skewX(${hideEyes ? 0 : skew(rose, mouse)}deg)` }}>
          <div className="char__eyes" style={{ gap: 18, top: 42, left: 48 }}>
            <Pupil mouse={mouse} {...(hideEyes ? away : {})} />
            <Pupil mouse={mouse} {...(hideEyes ? away : {})} />
          </div>
          <div className="char__mouth" />
        </div>
      </div>
    );
  }

  function Auth({ go }) {
    const [show, setShow] = React.useState(false);
    const [pw, setPw] = React.useState("demopass");
    const [typing, setTyping] = React.useState(false);
    const [glance, setGlance] = React.useState(false);
    const [peek, setPeek] = React.useState(false);
    const [mouse, setMouse] = React.useState({ x: 0, y: 0 });

    React.useEffect(() => {
      let raf;
      const onMove = e => { cancelAnimationFrame(raf); const x = e.clientX, y = e.clientY; raf = requestAnimationFrame(() => setMouse({ x, y })); };
      window.addEventListener("mousemove", onMove);
      return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
    }, []);

    // brief "look at each other" when focusing a field
    React.useEffect(() => {
      if (!typing) { setGlance(false); return; }
      setGlance(true);
      const t = setTimeout(() => setGlance(false), 850);
      return () => clearTimeout(t);
    }, [typing]);

    const hideEyes = pw.length > 0 && !show; // covering eyes while password hidden
    // purple peeks when password is revealed
    React.useEffect(() => {
      if (!(pw.length > 0 && show)) { setPeek(false); return; }
      let t1, t2;
      const loop = () => { t1 = setTimeout(() => { setPeek(true); t2 = setTimeout(() => { setPeek(false); loop(); }, 800); }, Math.random() * 3000 + 2000); };
      loop();
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [pw, show]);

    return (
      <div className="authx">
        <aside className="authx__brand">
          <div className="authx__top brand-link" onClick={() => go("landing")}>
            <FuncMark size={32} light />
            <div className="brand__name" style={{ fontSize: 18 }}>ФУНКЦИЯ</div>
          </div>

          <div className="authx__stage">
            <Characters mouse={mouse} typing={glance} hideEyes={hideEyes || (pw.length > 0 && show)} peek={peek} />
          </div>

          <div className="authx__foot">
            <span>Единая платформа ПИР</span>
            <span className="dim">Проектирование · Экспертиза · Подбор</span>
          </div>
          <div className="authx__glow authx__glow--1" />
          <div className="authx__glow authx__glow--2" />
        </aside>

        <div className="authx__form">
          <div className="authx__formwrap">
            <div className="authx__head">
              <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, color: "#fff" }}>С возвращением</h1>
              <p className="muted" style={{ margin: "8px 0 0", fontSize: 14.5 }}>Войдите для доступа к заявкам и кабинету</p>
            </div>

            <form onSubmit={e => { e.preventDefault(); go("dashboard"); }} className="col gap18" style={{ marginTop: 30 }}>
              <div className="field">
                <label>Email</label>
                <input className="input" type="email" placeholder="mail@example.com" defaultValue="demo@funktsiya.ru" autoComplete="off"
                  onFocus={() => setTyping(true)} onBlur={() => setTyping(false)} />
              </div>
              <div className="field">
                <label>Пароль</label>
                <div className="inputwrap">
                  <input className="input" type={show ? "text" : "password"} value={pw} onChange={e => setPw(e.target.value)}
                    onFocus={() => setTyping(true)} onBlur={() => setTyping(false)} />
                  <button type="button" className="inputwrap__btn" onClick={() => setShow(s => !s)} title={show ? "Скрыть" : "Показать"}>
                    <Icon name={show ? "eyeOff" : "eye"} size={18} />
                  </button>
                </div>
              </div>

              <div className="row between" style={{ fontSize: 13.5 }}>
                <label className="row gap8" style={{ cursor: "pointer", color: "var(--text-dim)" }}>
                  <input type="checkbox" /> Запомнить на 30 дней
                </label>
                <a className="link">Забыли пароль?</a>
              </div>

              <button className="btn btn-primary btn-block" style={{ height: 50, fontSize: 15 }} type="submit">Войти</button>
            </form>

            <button className="btn btn-ghost btn-block" style={{ height: 50, marginTop: 14 }} onClick={() => go("dashboard")}>
              <Icon name="mail" size={18} /> Войти через Google
            </button>

            <p className="muted" style={{ textAlign: "center", marginTop: 26, fontSize: 14 }}>
              Нет аккаунта? <a className="link" onClick={() => go("dashboard")}>Зарегистрируйтесь</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  window.Auth = Auth;
})();
