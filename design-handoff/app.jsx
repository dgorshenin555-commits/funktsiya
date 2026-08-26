/* app.jsx — router + tweaks */
(function () {
  const { useTweaks, TweaksPanel, TweakSection, TweakColor, TweakRadio } = window;
  const Shell = window.Shell;

  const FONTS = {
    "Inter":        '"Inter", system-ui, sans-serif',
    "Manrope":      '"Manrope", "Inter", sans-serif',
    "Space Grotesk":'"Space Grotesk", "Inter", sans-serif',
    "Sans Serif":   'system-ui, -apple-system, sans-serif',
  };
  const ACCENTS = {
    "Фиолетовый": ["#8b6cf2", "#ab87ff"],
    "Индиго":     ["#5b6ef2", "#7d8cff"],
    "Бирюзовый":  ["#22b8a8", "#37d6c0"],
    "Малиновый":  ["#e0518a", "#f56ea9"],
    "Янтарный":   ["#e0913d", "#f5b13d"],
  };

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "accent": "Фиолетовый",
    "font": "Inter",
    "density": "regular",
    "catHead": "Слева",
    "stdLayout": "Поиск"
  }/*EDITMODE-END*/;

  function App() {
    const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
    const [screen, setScreen] = React.useState("landing");
    const [orderId, setOrderId] = React.useState(1);
    const [nav, setNav] = React.useState(0);

    const go = (s, id) => {
      if (id != null) setOrderId(id);
      setScreen(s);
      setNav(n => n + 1);
    };

    // apply tweaks → CSS vars
    React.useEffect(() => {
      const [a, a2] = ACCENTS[t.accent] || ACCENTS["Фиолетовый"];
      const r = document.documentElement;
      r.style.setProperty("--accent", a);
      r.style.setProperty("--accent-2", a2);
      const hx = h => { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
      const [R, G, B] = hx(a);
      r.style.setProperty("--accent-soft", `rgba(${R},${G},${B},.14)`);
      r.style.setProperty("--accent-line", `rgba(${R},${G},${B},.34)`);
      r.style.setProperty("--grad", `linear-gradient(135deg, ${a} 0%, ${a2} 100%)`);
      r.style.setProperty("--font", FONTS[t.font] || FONTS["Inter"]);
      const pad = t.density === "compact" ? "20px" : t.density === "comfy" ? "28px" : "24px";
      r.style.setProperty("--card-pad", pad);
    }, [t.accent, t.font, t.density]);

    // Hover-предпросмотр: расшифровка кодов разделов документации
    React.useEffect(() => {
      const NAMES = (window.DATA && window.DATA.SECTION_NAMES) || {};
      const STAGES = (window.DATA && window.DATA.STAGE_NAMES) || {};
      const tip = document.createElement("div");
      tip.className = "code-tip";
      document.body.appendChild(tip);
      let current = null;

      const place = (el) => {
        const r = el.getBoundingClientRect();
        tip.style.left = Math.round(r.left + r.width / 2) + "px";
        // показываем над чипом; если сверху мало места — снизу
        const above = r.top > 64;
        tip.classList.toggle("is-below", !above);
        tip.style.top = Math.round(above ? r.top - 10 : r.bottom + 10) + "px";
      };

      const show = (el, code) => {
        const name = NAMES[code] || STAGES[code];
        if (!name) return;
        current = el;
        tip.innerHTML = '<b>' + code + '</b><span>' + name + '</span>';
        place(el);
        tip.classList.add("is-on");
      };
      const hide = () => { current = null; tip.classList.remove("is-on"); };

      // .pill учитываем только если это код стадии (иначе подсказка не нужна для табов/фильтров)
      const SEL = ".chip-code, .chip-toggle, .pill";
      const decodable = (el) => {
        const code = (el.textContent || "").trim();
        if (el.classList.contains("pill")) return STAGES[code] ? code : null;
        return (NAMES[code] || STAGES[code]) ? code : null;
      };
      const onOver = (e) => {
        const el = e.target.closest && e.target.closest(SEL);
        if (!el) { if (current) hide(); return; }
        if (el === current) return;
        const code = decodable(el);
        if (!code) { if (current) hide(); return; }
        show(el, code);
      };
      const onOut = (e) => {
        const el = e.target.closest && e.target.closest(SEL);
        if (el && el === current && !el.contains(e.relatedTarget)) hide();
      };

      document.addEventListener("mouseover", onOver);
      document.addEventListener("mouseout", onOut);
      window.addEventListener("scroll", hide, true);
      return () => {
        document.removeEventListener("mouseover", onOver);
        document.removeEventListener("mouseout", onOut);
        window.removeEventListener("scroll", hide, true);
        tip.remove();
      };
    }, []);

    const SCREENS = {
      orders:           () => <window.Orders go={go} />,
      "order-detail":   () => <window.OrderDetail id={orderId} go={go} />,
      "order-new":      () => <window.OrderNew go={go} />,
      dashboard:        () => <window.Dashboard go={go} />,
      designers:        () => <window.Designers go={go} header={t.catHead} />,
      "designer-profile":() => <window.DesignerProfile go={go} />,
      experts:          () => <window.Experts go={go} header={t.catHead} />,
      manufacturers:    () => <window.Manufacturers go={go} />,
      expertise:        () => <window.Expertise go={go} />,
      "expertise-detail":() => <window.ExpertiseDetail id={orderId} go={go} />,
      standards:        () => <window.Standards go={go} layout={t.stdLayout} />,
      pricing:          () => <window.Pricing go={go} />,
      chat:             () => <window.Chat go={go} />,
      analytics:        () => <window.Analytics go={go} />,
      settings:         () => <window.Settings go={go} />,
    };

    const fullChrome = screen === "chat";

    let body;
    if (screen === "landing") body = <window.TestLanding go={go} />;
    else if (screen === "auth") body = <window.Auth go={go} />;
    else body = (
      <Shell active={screen} go={go} scrollKey={nav}>
        {(SCREENS[screen] || SCREENS.orders)()}
      </Shell>
    );

    // chat & standards want to fill the content area without inner padding
    const shellNoPad = fullChrome ? (
      <Shell active={screen} go={go} scrollKey={nav} flush>
        {(SCREENS[screen] || SCREENS.orders)()}
      </Shell>
    ) : null;

    return (
      <>
        {fullChrome ? shellNoPad : body}
        <TweaksPanel title="Tweaks">
          <TweakSection label="Акцентный цвет" />
          <TweakColor label="Палитра" value={(window.__ACCENTS = ACCENTS)[t.accent][0]}
            options={Object.values(ACCENTS).map(p => p[0])}
            onChange={(v) => { const name = Object.keys(ACCENTS).find(k => ACCENTS[k][0] === v); setTweak("accent", name || "Фиолетовый"); }} />
          <TweakSection label="Шрифт" />
          <TweakRadio label="Семейство" value={t.font} options={["Inter","Manrope","Space Grotesk"]} onChange={(v) => setTweak("font", v)} />
          <TweakSection label="Плотность" />
          <TweakRadio label="Отступы" value={t.density} options={["compact","regular","comfy"]} onChange={(v) => setTweak("density", v)} />
          <TweakSection label="Шапка каталога" />
          <TweakRadio label="Вариант" value={t.catHead} options={["Слева","По центру"]} onChange={(v) => setTweak("catHead", v)} />
          <TweakSection label="Нормативы" />
          <TweakRadio label="Компоновка" value={t.stdLayout} options={["Поиск","Каталог"]} onChange={(v) => setTweak("stdLayout", v)} />
        </TweaksPanel>
      </>
    );
  }

  window.App = App;
})();
