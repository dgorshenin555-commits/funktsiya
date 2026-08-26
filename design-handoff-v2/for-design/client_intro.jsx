/* client_intro.jsx — промежуточный шаг после регистрации заказчика:
   минимум данных, всё кроме типа и названия можно пропустить.
   После сохранения — рабочая область (window.ClientWork). */
(function () {
  const { useState } = React;
  const Mark = ({ s = 28 }) => (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="#14161A" /><path d="M13 28V12h14M13 20h10" stroke="#C9F24A" strokeWidth="2.6" strokeLinecap="square" /></svg>
  );
  const Arr = ({ s = 14 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>);
  const Chk = ({ s = 12 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5l3.5 3.5L13 4.5" /></svg>);

  const PLANS = ["Проектирование", "Экспертиза", "Обследование", "Изыскания"];

  function ClientIntro({ onDone, onSkip, go }) {
    const [kind, setKind] = useState("org");
    const [inn, setInn] = useState("");
    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const [mail, setMail] = useState("");
    const [plans, setPlans] = useState([]);
    const tog = v => setPlans(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);
    /* Название по ИНН — имитация ответа ЕГРЮЛ, чтобы не заполнять руками. */
    const pull = () => { if (inn.replace(/\D/g, "").length >= 10 && !name) setName("ООО «Стройинвест»"); };
    const ready = !!name.trim();
    const filled = [!!name.trim(), !!city.trim(), !!mail.trim(), plans.length > 0].filter(Boolean).length;

    return (
      <div className="nd">
        <header className="topbar">
          <div className="mark" onClick={() => go && go("home")} style={{ cursor: go ? "pointer" : "default" }}><Mark s={28} /><b>Функция</b></div>
          <span className="spacer" />
          <span className="lbl">Регистрация · шаг 2</span>
          <button className="btn btn-line btn-sm" onClick={onSkip}>Заполнить позже</button>
        </header>

        <div className="scroll">
          <div className="wrap cint">
            <div className="cint__h">
              <span className="lbl">Телефон подтверждён</span>
              <h1>Коротко о вас</h1>
              <p>Нужно только для того, чтобы исполнители видели, с кем работают. Остальное — в профиле, когда появится время.</p>
            </div>

            <div className="card cint__f">
              <div className="cint__row">
                <span className="cint__l">Кто вы</span>
                <div className="cint__seg">
                  {[["org", "Организация"], ["solo", "Частное лицо"]].map(([k, l]) => (
                    <button key={k} className={kind === k ? "on" : ""} onClick={() => setKind(k)}>{l}</button>
                  ))}
                </div>
              </div>

              {kind === "org" && (
                <div className="cint__row">
                  <span className="cint__l">ИНН<em>необязательно</em></span>
                  <div className="cint__inn">
                    <input className="cinp num" placeholder="10 или 12 цифр" value={inn} onChange={e => setInn(e.target.value.replace(/\D/g, ""))} />
                    <button className="btn btn-line btn-sm" onClick={pull}>Найти в ЕГРЮЛ</button>
                  </div>
                </div>
              )}

              <div className="cint__row">
                <span className="cint__l">{kind === "org" ? "Название" : "Имя и фамилия"}<em>обязательно</em></span>
                <input className="cinp" placeholder={kind === "org" ? "ООО «Стройинвест»" : "Иван Петров"} value={name} onChange={e => setName(e.target.value)} />
              </div>

              <div className="cint__row">
                <span className="cint__l">Город или регион<em>необязательно</em></span>
                <input className="cinp" placeholder="Москва" value={city} onChange={e => setCity(e.target.value)} />
              </div>

              <div className="cint__row">
                <span className="cint__l">E-mail для откликов<em>необязательно</em></span>
                <input className="cinp" placeholder="mail@company.ru" value={mail} onChange={e => setMail(e.target.value)} />
              </div>

              <div className="cint__row">
                <span className="cint__l">Что планируете<em>необязательно</em></span>
                <div className="cint__chips">
                  {PLANS.map(p => (
                    <button key={p} className={plans.includes(p) ? "on" : ""} onClick={() => tog(p)}>
                      {plans.includes(p) && <i><Chk s={10} /></i>}{p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="cint__bar">
              <span className="lbl">Заполнено {filled} из 4 · этого достаточно, чтобы начать</span>
              <div className="row g8" style={{ flexWrap: "wrap" }}>
                <button className="btn btn-line" onClick={onSkip}>Пропустить</button>
                <button className="btn btn-ink btn-lg" disabled={!ready} onClick={() => onDone && onDone({ kind, inn, name, city, mail, plans })}>Сохранить и перейти в рабочую область <Arr /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function ClientOnboard() {
    const [done, setDone] = useState(false);
    if (done) return <window.ClientWork />;
    return <ClientIntro onDone={() => setDone(true)} onSkip={() => setDone(true)} />;
  }

  Object.assign(window, { ClientIntro, ClientOnboard });
})();
