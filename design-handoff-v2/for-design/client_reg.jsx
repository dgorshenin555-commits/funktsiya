/* client_reg.jsx — регистрация заказчика по телефону.
   Собрана по образцу регистрации исполнителя (new_design_land.jsx):
   те же классы land/lhero/lreg/lcode, отличаются только содержание и правая
   колонка «что будет после входа». Подключать после lib_bundle.jsx. */
(function () {
  const { useState } = React;
  const Mark = ({ s = 28 }) => (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="#14161A" /><path d="M13 28V12h14M13 20h10" stroke="#C9F24A" strokeWidth="2.6" strokeLinecap="square" /></svg>
  );
  const Arr = ({ s = 14 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>);

  /* детерминированная матрица QR-вида (только для макета) */
  const QR = (() => {
    const n = 33, m = [];
    let s = 20260826;
    const rnd = () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
    for (let y = 0; y < n; y++) { const row = []; for (let x = 0; x < n; x++) row.push(rnd() > .52 ? 1 : 0); m.push(row); }
    const eye = (oy, ox) => {
      for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) {
        const b = y === 0 || y === 6 || x === 0 || x === 6, c = y >= 2 && y <= 4 && x >= 2 && x <= 4;
        m[oy + y][ox + x] = b || c ? 1 : 0;
      }
      for (let y = -1; y < 8; y++) for (let x = -1; x < 8; x++) {
        const py = oy + y, px = ox + x;
        if (py < 0 || px < 0 || py >= n || px >= n) continue;
        if (y === -1 || y === 7 || x === -1 || x === 7) m[py][px] = 0;
      }
    };
    eye(0, 0); eye(0, n - 7); eye(n - 7, 0);
    return m;
  })();
  const Qr = ({ size = 190 }) => (
    <div className="qr" style={{ width: size, height: size }}>
      {QR.map((row, y) => row.map((v, x) => v ? <i key={x + "-" + y} style={{ left: (x / 33 * 100) + "%", top: (y / 33 * 100) + "%" }} /> : null))}
    </div>
  );

  const FACTS = [["0 ₽", "публикация заявки"], ["4 ч", "до первого отклика"], ["1 240", "проверенных исполнителей"]];
  const AFTER = [
    ["Тип объекта и стадия", "промышленный, коммерческий или жилой — состав разделов подставим сами"],
    ["Разделы по ПП РФ №87", "лишнее уберёте, спорное уточнят исполнители в откликах"],
    ["Бюджет и срок", "можно указать ориентир или оставить «ждём предложений»"],
    ["Отклики и выбор", "цена, срок и состав работ в одной таблице"],
  ];
  const FEED = [
    ["Реконструкция котельной 4,2 МВт", "Нижний Новгород · стадия ПД", "1,2 млн ₽", ["ОВ", "ЭОМ", "АР"], "3 отклика"],
    ["ЖК «Северный», корпус 3", "Казань · экспертиза", "по итерациям", ["АР", "КЖ", "ВК"], "2 отклика"],
    ["Склад-холодильник 12 000 м²", "Краснодар · стадия РД", "2,9 млн ₽", ["КЖ", "КМ", "ТХ"], "7 откликов"],
  ];
  const STEPS = [
    ["Публикуете заявку", "описываете объект своими словами, разделы подставит платформа"],
    ["Получаете отклики", "только от исполнителей с действующим СРО или НРС"],
    ["Сравниваете и выбираете", "цена, срок, состав работ и субподряд — в одной таблице"],
    ["Принимаете по этапам", "средства резервируются заранее и уходят после приёмки раздела"],
  ];

  function ClientReg({ go, onDone, onPro }) {
    const [phone, setPhone] = useState("");
    const [sent, setSent] = useState(false);
    const [code, setCode] = useState("");
    const [agree, setAgree] = useState(true);

    return (
      <div className="nd land">
        <header className="topbar">
          <div className="mark" onClick={() => go && go("home")} style={{ cursor: "pointer" }}><Mark s={28} /><b>Функция</b></div>
          <span className="spacer" />
          <span className="lbl">Для заказчиков</span>
          <button className="btn btn-line btn-sm" onClick={() => onPro && onPro()}>Я исполнитель</button>
        </header>

        <div className="scroll">
          <section className="wrap lhero">
            <div>
              <span className="lbl">Регистрация заказчика</span>
              <h1>Регистрация для застройщиков и собственников объектов</h1>
              <p>Один шаг — номер телефона. Объект, стадию и разделы заполним после входа: платформа сама подскажет состав по ПП РФ №87.</p>
              <div className="lfacts">
                {FACTS.map(([v, k]) => <div key={k}><b className="num">{v}</b><span className="lbl">{k}</span></div>)}
              </div>
            </div>
            <div className="lhero__ph">
              <image-slot id="creg-hero" shape="rounded" radius="24" src="assets/hero-commercial-2.png" placeholder="Фото объекта заказчика"></image-slot>
            </div>
          </section>

          <section className="wrap">
            <div className="lreg">
              <div className="lreg__l">
                <span className="lbl">Шаг 1 из 1 · вход на платформу</span>
                <h2>Зарегистрируйтесь по номеру телефона</h2>
                <p>Отправим СМС с кодом подтверждения. Рекламу не присылаем, номер исполнителям не показываем — связь идёт через платформу.</p>

                {!sent ? (<>
                  <div className="lreg__f">
                    <div className="lphone">
                      <span className="lphone__c">RU +7</span>
                      <input className="inp num" placeholder="900 000-00-00" value={phone} onChange={e => setPhone(e.target.value)} />
                    </div>
                    <button className="btn btn-ink btn-lg" onClick={() => setSent(true)}>Получить код</button>
                  </div>
                  <label className="lagree">
                    <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
                    <i />
                    <span>Согласен с условиями платформы и обработкой персональных данных</span>
                  </label>
                </>) : (<>
                  <div className="lcode">
                    <span className="lbl">Код из СМС на +7 {phone || "900 000-00-00"}</span>
                    <div className="lcode__r">
                      {[0, 1, 2, 3].map(i => (
                        <input key={i} className="lcode__i num" maxLength="1" value={code[i] || ""} onChange={ev => {
                          const v = ev.target.value.replace(/\D/g, "");
                          const next = code.split("");
                          next[i] = v.slice(-1) || "";
                          setCode(next.join(""));
                          const box = ev.target.parentNode.children[i + 1];
                          if (v && box) box.focus();
                        }} />
                      ))}
                    </div>
                    <div className="lcode__a">
                      <button className="btn btn-line btn-sm" onClick={() => setSent(false)}>Изменить номер</button>
                      <span className="lbl">отправить код повторно через 42 с</span>
                    </div>
                  </div>
                  <button className="btn btn-acid btn-lg lcode__go" onClick={() => onDone && onDone(phone)}>Войти и продолжить <Arr /></button>
                </>)}

                <div className="lalt">
                  <span className="lbl">Или войдите через</span>
                  <div className="lalt__r">
                    {["Госуслуги", "СБИС", "Почта"].map(v => <button key={v} className="lalt__b">{v}</button>)}
                  </div>
                </div>
              </div>

              <div className="lreg__r">
                <span className="lbl">Что будет после входа</span>
                <div className="lafter">
                  {AFTER.map(([t, d], i) => (
                    <div className="lafter__i" key={t}><b className="num">{i + 1}</b><div><span className="lafter__t">{t}</span><span className="lafter__d">{d}</span></div></div>
                  ))}
                </div>
                <div className="lqr">
                  <Qr size={104} />
                  <span>QR — зарегистрироваться с телефона в приложении</span>
                </div>
              </div>
            </div>
          </section>

          <section className="wrap lsec">
            <div className="sec-h">
              <div><span className="lbl">Живая выдача</span><h2 className="lsec__h" style={{ margin: "8px 0 0" }}>Заявки, которые уже идут на платформе</h2></div>
              <button className="btn btn-line btn-sm" onClick={() => go && go("reqs")}>Смотреть все заявки</button>
            </div>
            <div className="lfeed">
              {FEED.map(([t, s, b, cs, r]) => (
                <div className="lfeed__i" key={t}>
                  <div><b>{t}</b><span>{s}</span></div>
                  <div className="lfeed__c">{cs.map(c => <i key={c}>{c}</i>)}</div>
                  <div className="lfeed__v"><b className="num">{b}</b><span>{r}</span></div>
                </div>
              ))}
            </div>
          </section>

          <section className="wrap lsec">
            <h2 className="lsec__h">Как это работает</h2>
            <div className="lsteps">
              {STEPS.map(([t, d], i) => (
                <div className="lstep" key={t}>
                  <div className="lstep__n"><b className="num">{i + 1}</b><i /></div>
                  <h4>{t}</h4>
                  <p>{d}</p>
                </div>
              ))}
            </div>
          </section>

          <footer className="wrap foot">
            <span className="lbl">Функция · платформа проектно-изыскательских работ</span>
            <div className="row g16">
              <a href="#" onClick={e => { e.preventDefault(); go && go("reqs"); }}>Заявки</a>
              <a href="#" onClick={e => { e.preventDefault(); go && go("pick"); }}>Исполнители</a>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  Object.assign(window, { ClientReg });
})();
