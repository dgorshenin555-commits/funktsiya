/* specular_btn.jsx — кнопка с зеркальной подсветкой кромки.
   Идея из SpecularButton (React Bits): направление блика идёт за курсором,
   яркость гаснет с расстоянием. Здесь без ogl и WebGL — угол и яркость
   пишутся в CSS-переменные, кромку рисует conic-gradient с маской. */
(function () {
  const { useRef, useEffect } = React;

  function SpecularBtn({ className = "", proximity = 260, children, onClick, style, ...rest }) {
    const ref = useRef(null);
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      let ang = 2.4, bright = 0, tAng = 2.4, tBright = 0, raf = 0, last = performance.now();
      const move = e => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
        const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
        const dist = Math.hypot(dx, dy);
        tAng = Math.atan2(e.clientY - cy, e.clientX - cx);
        const t = Math.max(0, 1 - dist / Math.max(proximity, 1));
        tBright = t * t * (3 - 2 * t);
      };
      const loop = now => {
        raf = requestAnimationFrame(loop);
        const dt = Math.min((now - last) / 1000, 0.05); last = now;
        const diff = ((tAng - ang + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
        ang += diff * (1 - Math.exp(-dt * 7));
        bright += (tBright - bright) * (1 - Math.exp(-dt * 8));
        el.style.setProperty("--sa", (ang * 180 / Math.PI + 90).toFixed(1) + "deg");
        el.style.setProperty("--sbr", bright.toFixed(3));
      };
      window.addEventListener("pointermove", move);
      raf = requestAnimationFrame(loop);
      return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", move); };
    }, [proximity]);
    return (
      <button ref={ref} className={"spec " + className} onClick={onClick} style={style} {...rest}>
        <span className="spec__l">{children}</span>
      </button>
    );
  }

  Object.assign(window, { SpecularBtn });
})();
