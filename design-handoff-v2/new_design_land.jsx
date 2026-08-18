/* new_design_land.jsx — лендинг для исполнителей: регистрация по телефону,
   как это работает, тарифы, приложение. Структура как в присланном примере,
   визуальный язык — наш: paper / ink / acid. */
(function () {
  const { useState } = React;
  const Mark = ({ s = 28 }) => (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="#14161A" /><path d="M13 28V12h14M13 20h10" stroke="#C9F24A" strokeWidth="2.6" strokeLinecap="square" /></svg>
  );

  /* детерминированная матрица QR-вида (только для макета) */
  const QR = (() => {
    const n = 33, m = [];
    let s = 20260817;
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

  const DIRS = [
    ["Проектировщик", "Разделы ПД и РД под подпись ГИПа", "#C9F24A", "#14161A", 612],
    ["Эксперт", "Замечания и заключения по документации", "#2440E8", "#F1EFE9", 148],
    ["Чертёжник", "Выпуск чертежей и BIM-моделей", "#6E3AD6", "#F1EFE9", 274],
    ["Обследователь", "Обмеры и оценка техсостояния", "#DC5A2A", "#F1EFE9", 96],
  ];
  const FEED = [
    ["Склад класса А, Домодедово", "18 400 м² · стадия П", "2,4 млн ₽", ["АР", "КЖ", "ОВ"], "7 откликов"],
    ["Реконструкция котельной 4,2 МВт", "Тула · стадия РД", "1,1 млн ₽", ["ТХ", "ЭОМ"], "4 отклика"],
    ["ЖК «Северный парк», корпус 2", "Казань · стадия ПД", "6,8 млн ₽", ["АР", "КР", "ВК"], "9 откликов"],
  ];
  const STEPS = [
    ["Заказчики публикуют заявки", "описывают объект, стадию и разделы документации"],
    ["Вы выбираете подходящие", "фильтр по направлению, стадии и разделам — только ваши задачи"],
    ["Откликаетесь и обсуждаете", "цена, сроки и состав работ в чате с заказчиком"],
    ["Выполняете и получаете оплату", "средства резервируются по этапам и приходят после приёмки"],
  ];
  const TARIFFS = [
    ["Отклик бесплатно", "Первые 10 откликов в месяц ничего не стоят. Платите только процент с закрытого этапа — если заявка не стала договором, платить нечего.", "0 ₽", "за отклик"],
    ["Комиссия с этапа", "5% с суммы принятого этапа. Расчёты идут через платформу: заказчик резервирует сумму заранее, вы получаете её после приёмки раздела.", "5%", "с принятого этапа"],
  ];
  const FACTS = [["1 240", "заявок в месяц"], ["4,2 млн ₽", "средний бюджет"], ["48 ч", "до первого отклика"]];

  function Land() {
    const [phone, setPhone] = useState("");
    const [sent, setSent] = useState(false);
    const [code, setCode] = useState("");
    const [agree, setAgree] = useState(true);

    return (
      <div className="nd land">
        <header className="topbar">
          <div className="mark"><Mark s={28} /><b>Функция</b></div>
          <span className="spacer" />
          <span className="lbl">Для исполнителей</span>
          <a className="btn btn-line btn-sm" href="Функция (новый дизайн).html">Платформа</a>
        </header>

        <div className="scroll">
          <section className="wrap lhero">
            <div>
              <span className="lbl">Регистрация исполнителя</span>
              <h1>Регистрация для проектировщиков и подрядчиков</h1>
              <p>Один шаг — номер телефона. Направления, разделы и документы заполним после входа: платформа сама подскажет состав по ПП РФ №87.</p>
              <div className="lfacts">
                {FACTS.map(([v, k]) => <div key={k}><b className="num">{v}</b><span className="lbl">{k}</span></div>)}
              </div>
            </div>
            <div className="lhero__ph">
              <image-slot id="land-hero" shape="rounded" radius="24" src="assets/pro-at-work.png" placeholder="Фото исполнителя за работой"></image-slot>
            </div>
          </section>

          <section className="wrap">
            <div className="lreg">
              <div className="lreg__l">
                <span className="lbl">Шаг 1 из 1 · вход на платформу</span>
                <h2>Зарегистрируйтесь по номеру телефона</h2>
                <p>Отправим СМС с кодом подтверждения. Рекламу не присылаем, номер заказчикам не показываем — связь идёт через платформу.</p>

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
                  <a className="btn btn-acid btn-lg lcode__go" href="Функция (регистрация исполнителя).html">Войти и заполнить профиль</a>
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
                  {[["Направление", "проектировщик, эксперт, чертёжник или обследователь"],
                    ["Стадии и разделы", "состав подставим по ПП РФ №87 — останется отметить своё"],
                    ["Документы и допуски", "СРО и НРС сверим по реестрам, диплом и полис — сканом"],
                    ["Ставка и загрузка", "и первые заявки по вашим разделам"]].map(([t, d], i) => (
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
              <div><span className="lbl">Живая выдача</span><h2 className="lsec__h" style={{ margin: "8px 0 0" }}>Заявки, которые ждут исполнителя</h2></div>
              <a className="btn btn-line btn-sm" href="Функция (новый дизайн).html">Смотреть все заявки</a>
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

          <section className="wrap lsec">
            <h2 className="lsec__h">Тарифы</h2>
            <div className="ltars">
              {TARIFFS.map(([t, d, v, k]) => (
                <div className="ltar" key={t}>
                  <div>
                    <h4>{t}</h4>
                    <p>{d}</p>
                  </div>
                  <div className="ltar__v"><b className="num">{v}</b><span className="lbl">{k}</span></div>
                </div>
              ))}
            </div>
          </section>

          <section className="wrap lsec">
            <div className="lapp">
              <div className="lapp__dev">
                <div className="lapp__cam" />
                <div className="lapp__scr">
                  <Qr size={158} />
                  <span>Наведите камеру телефона, чтобы отсканировать QR-код и скачать приложение</span>
                </div>
              </div>
              <div className="lapp__t">
                <h2>С приложением «Функция» ещё удобнее</h2>
                <p>Заявки по вашим разделам, чат с заказчиком и статусы этапов всегда под рукой.</p>
                <div className="lapp__st">
                  {[["App Store", "Загрузите в"], ["Google Play", "Доступно в"], ["RuStore", "Скачайте из"]].map(([n, s]) => (
                    <span className="lstore" key={n}><em>{s}</em><b>{n}</b></span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <footer className="wrap foot">
            <span className="lbl">Функция · платформа проектно-изыскательских работ</span>
            <div className="row g16">
              <a href="Функция (регистрация исполнителя).html">Анкета исполнителя</a>
              <a href="Функция (новый дизайн).html">Заявки</a>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  Object.assign(window, { Land });
})();
