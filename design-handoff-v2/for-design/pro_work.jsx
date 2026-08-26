/* pro_work.jsx — рабочая область исполнителя. Зеркало заказчицкой, но
   смысл другой: заказчик принимает и платит, исполнитель сдаёт и получает.
   Поэтому здесь есть подбор новых заявок, загрузка исполнителя и деньги
   «к выплате», а вместо приёмки — сроки сдачи и снятие замечаний. */
(() => {
  const { useState } = React;

  const plural = (n, one, few, many) => {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
    return many;
  };
  const Arr = ({ s = 14 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>);

  const ME = {
    name: "Соколов Артём Викторович", role: "Проектировщик · ГИП · Москва и область",
    score: 71, level: "Надёжный", reviews: 12, rate: 4.7,
    stats: [["Этапов сдано", "18"], ["Заработано", "8,4 млн ₽"], ["Отклик", "4 ч"], ["Загрузка", "2 из 3"]],
    factors: [["Приёмка этапов без просрочки", 30, 24], ["Оценки заказчиков", 25, 19], ["Подтверждённые допуски", 20, 20], ["Прохождение экспертизы", 15, 8], ["Скорость и полнота откликов", 10, 0]],
  };

  const REVIEWS = [
    ["ООО «Северный дом»", "Квартал «Северный» · ЭОМ", 5, "Сдал раздел раньше срока, замечания снял за день. Возьмём на следующий объект."],
    ["ООО «Гранит-Строй»", "Склад класса А · АР, КЖ", 5, "Разделы собраны аккуратно, экспертиза прошла без замечаний по нашей части."],
    ["ИП Ларин", "Дом 240 м² · РД", 4, "Хороший результат, но выгрузку ждали на три дня дольше обещанного."],
  ];

  /* Новые заявки по разделам исполнителя — то, ради чего он заходит. */
  const FEED_NEW = [
    ["Реконструкция школы №14", "Калуга · П · АР, КР", "3,8 млн ₽", 86],
    ["Склад класса А, 24 000 м²", "Домодедово · П · АР, КЖ", "2,4 млн ₽", 74],
    ["Котельная 4,2 МВт", "Тула · РД · ЭОМ", "1,1 млн ₽", 52],
  ];

  /* Разделы, которые исполнитель ведёт сейчас. */
  const LIVE = [
    {
      t: "ЖК «Парк Резиденс»", city: "Москва", who: "ООО «Северный дом»",
      stage: "ПД · мои разделы ЭОМ, ВК", due: "сдать до 02.09.2026", prog: 38,
      todo: 2, sum: "820 000 ₽", pay: "этап 2 · в резерве",
      act: ["Снять замечания по КР", "заказчик прислал 6 замечаний, ответ ждут до 25.08"],
      rows: [["ЭОМ", "Электрооборудование", "в работе", "черновик · v1", 45], ["ВК", "Водоснабжение", "в работе", "черновик · v1", 30]],
    },
    {
      t: "Склад класса А", city: "Домодедово", who: "ООО «Гранит-Строй»",
      stage: "П · мои разделы АР, КЖ", due: "сдать до 15.09.2026", prog: 66,
      todo: 1, sum: "1 240 000 ₽", pay: "этап 1 · оплачен",
      act: ["Выгрузить АР на приёмку", "готовность 90%, срок через 5 дней"],
      rows: [["АР", "Архитектурные решения", "на приёмке", "38 листов · v2", 90], ["КЖ", "Конструкции ж/б", "в работе", "22 листа · v1", 42]],
    },
  ];

  const DONE = [
    { t: "Квартал «Северный»", city: "Химки, МО", who: "ООО «Северный дом»", stage: "РД · ЭОМ, ВК", end: "сдан 12.12.2025", sum: "2 100 000 ₽", note: "оценка 5,0", rows: [["ЭОМ", "Электрооборудование", "принято", "61 лист · v3", 100], ["ВК", "Водоснабжение", "принято", "44 листа · v3", 100]] },
    { t: "Дом 240 м²", city: "Истра, МО", who: "ИП Ларин", stage: "РД · полный комплект", end: "сдан 30.08.2025", sum: "640 000 ₽", note: "оценка 4,0", rows: [["АР", "Архитектурные решения", "принято", "34 листа · v2", 100], ["КР", "Конструктивные решения", "принято", "28 листов · v2", 100]] },
  ];

  const DATES = [
    ["25.08", "Ответ по замечаниям КР", "ЖК «Парк Резиденс»", "3 дня"],
    ["28.08", "Выгрузка АР на приёмку", "Склад класса А", ""],
    ["02.09", "Сдача ЭОМ и ВК", "ЖК «Парк Резиденс»", ""],
    ["15.09", "Сдача КЖ", "Склад класса А", ""],
    ["30.09", "Продлить полис страхования", "профиль", ""],
  ];

  const FEED = [
    ["ООО «Северный дом»", "прислал 6 замечаний по разделу КР", "вчера"],
    ["Платформа", "начислила 1 240 000 ₽ за принятый этап 1", "19 авг"],
    ["ООО «Гранит-Строй»", "пригласил вас в заявку по складу в Люберцах", "18 авг"],
    ["Платформа", "подтвердила выписку СРО", "15 авг"],
  ];

  const ACTS = [["Найти заявку", "acid"], ["Загрузить выгрузку", ""], ["Запросить продление срока", ""], ["Мои отклики · 3", ""]];

  const ST = { "на приёмке": "warn", "замечания": "bad", "в работе": "go", "не начат": "idle", "принято": "ok" };
  const NAV = [["work", "Рабочая область"], ["feed", "Заявки"], ["resp", "Мои отклики"]];
  /* Отправленные отклики — для вкладки «Мои отклики». */
  const RESP = [
    ["Реконструкция школы №14", "Калуга · АР, КР", "3,6 млн ₽ · 60 дней", "ждёт ответа"],
    ["Котельная 4,2 МВт", "Тула · ЭОМ", "1,05 млн ₽ · 40 дней", "смотрят"],
    ["Склад класса А, 24 000 м²", "Домодедово · АР, КЖ", "2,3 млн ₽ · 75 дней", "отказ"],
  ];

  function Stars({ n }) {
    return <span className="cstars">{[1, 2, 3, 4, 5].map(i => <i key={i} className={i <= n ? "on" : ""} />)}</span>;
  }

  function ProWork({ go, pro, onProfile }) {
    /* Данные из анкеты исполнителя, если она заполнена; иначе демо-визитка. */
    const me = {
      name: (pro && pro.name && pro.name.trim()) || ME.name,
      role: pro ? [pro.who, pro.region, pro.yrs ? "опыт " + pro.yrs + " лет" : null].filter(Boolean).join(" · ") : ME.role,
    };
    const [cardp, setCard] = useState(null);
    const [open, setOpen] = useState(null);
    const flip = k => setOpen(v => (v === k ? null : k));
    const [tab, setTab] = useState("work");
    const totalTodo = LIVE.reduce((s, r) => s + r.todo, 0);

    return (
      <div className="nd cw pw">
        <header className="topbar">
          <div className="topbar__l">
            <span className="logo" onClick={() => go && go("home")} style={{ cursor: go ? "pointer" : "default" }}>Функция</span>
            <span className="cw__badge pw__badge">исполнителям</span>
          </div>
          <nav className="nav">
            {NAV.map(([k, l]) => <button key={k} className={k === tab ? "on" : ""} onClick={() => setTab(k)}>{l}</button>)}
          </nav>
          <div className="topbar__r">
            <button className="cwme" onClick={() => onProfile && onProfile()}>
              <span className="cwme__a"><img src="assets/me.jpg" alt="" /></span>
              <span className="cwme__t"><b>{me.name}</b><em>Профиль и документы</em></span>
            </button>
          </div>
        </header>

        <div className="scroll">
          <div className={"wrap cw__wrap tab-" + tab}>
            <section className="cme">
              <div className="cme__ava"><image-slot id="pw-ava" shape="circle" placeholder="Фото"></image-slot></div>
              <div className="cme__b">
                <h1>{me.name}</h1>
                <span className="cme__r">{me.role || ME.role}</span>
              </div>
              <div className="cme__k">
                <button className={"cmk" + (cardp === "rank" ? " on" : "")} onClick={() => setCard(cardp === "rank" ? null : "rank")}>
                  <span className="lbl">Рейтинг</span>
                  <b className="num">{ME.score}<i>/100</i></b>
                  <span className="cmk__s">уровень «{ME.level}»</span>
                </button>
                <button className={"cmk" + (cardp === "rev" ? " on" : "")} onClick={() => setCard(cardp === "rev" ? null : "rev")}>
                  <span className="lbl">Отзывы</span>
                  <b className="num">{ME.rate}<i>из 5</i></b>
                  <span className="cmk__s">{ME.reviews} {plural(ME.reviews, "отзыв", "отзыва", "отзывов")}</span>
                </button>
                {ME.stats.map(([k, v]) => (
                  <div key={k} className="cmk cmk--flat">
                    <span className="lbl">{k}</span>
                    <b className="num">{v}</b>
                  </div>
                ))}
              </div>
            </section>

            {cardp === "rank" && (
              <div className="cpanel">
                <div className="cpanel__h"><b>Из чего собран рейтинг</b><button onClick={() => setCard(null)}>закрыть ✕</button></div>
                <div className="cpanel__f">
                  {ME.factors.map(([t, w, got]) => (
                    <div key={t} className="cfac">
                      <span>{t}</span>
                      <i><b style={{ width: (got / w) * 100 + "%" }} /></i>
                      <u className="num">{got} / {w}</u>
                    </div>
                  ))}
                </div>
                <span className="cpanel__n">Балл определяет место в подборе: сейчас вы 74-й из 214 по разделу АР. Просрочка сдачи снимает до 12 баллов.</span>
              </div>
            )}

            {cardp === "rev" && (
              <div className="cpanel">
                <div className="cpanel__h"><b>Отзывы заказчиков</b><button onClick={() => setCard(null)}>закрыть ✕</button></div>
                <div className="cpanel__rv">
                  {REVIEWS.map(([w, o, n, m]) => (
                    <div key={w + o} className="crev">
                      <div className="crev__h"><b>{w}</b><Stars n={n} /><span>{o}</span></div>
                      <p>{m}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* главное действие — крупным блоком, остальное рядом мелким */}
            <div className="cacts">
              <button className="cact cact--hero" onClick={() => go && go("reqs")}>
                <span className="cact__k">Подбор по разделам</span>
                <b>Найти заявку</b>
                <span className="cact__s">Заявки по вашим разделам и региону — задание, бюджет и срок видны до отклика</span>
                <i className="cact__go"><Arr s={17} /></i>
              </button>
              <div className="cacts__rest">
                {ACTS.slice(1).map(([t]) => <button key={t} className="cact">{t}<Arr s={12} /></button>)}
              </div>
            </div>
            {/* вкладка «Мои отклики» */}
            <div className="cpros">
              <div className="cw__sh"><h2>Мои отклики</h2><span className="cw__sn">{RESP.length} отправлено · 1 ждёт ответа</span></div>
              <div className="cpros__l">
                {RESP.map(([t, s, m, st]) => (
                  <div key={t} className="cpro">
                    <b>{t}</b>
                    <span className="cpro__s">{s}</span>
                    <span className="cpro__m">{m}</span>
                    <span className={"cst cst--" + (st === "отказ" ? "bad" : st === "смотрят" ? "warn" : "go")}>{st}</span>
                    <button className="btn btn-line btn-sm">Открыть</button>
                  </div>
                ))}
              </div>
            </div>

            {/* деньги исполнителя: не «оплачено», а «к выплате» */}
            <section className="cmoney">
              {[["Заработано за год", "8,4 млн ₽", "18 этапов"], ["К выплате", "1 240 000 ₽", "этап принят 19 авг"], ["В резерве", "820 000 ₽", "по сдаче ЭОМ и ВК"]].map(([k, v, s]) => (
                <div key={k}><span className="lbl">{k}</span><b className="num">{v}</b><span>{s}</span></div>
              ))}
              <button className="btn btn-line btn-sm">Выплаты и комиссия <Arr s={13} /></button>
            </section>

            {/* новые заявки по разделам — главный вход в работу */}
            <section className="cw__sec">
              <div className="cw__sh">
                <h2>Новые заявки по вашим разделам</h2>
                <button className="cw__more">все заявки <Arr s={12} /></button>
              </div>
              <div className="pw__feed">
                {FEED_NEW.map(([t, s, b, m]) => (
                  <button key={t} className="pwn">
                    <span className="pwn__m"><b className="num">{m}%</b><span className="lbl">совпадение</span></span>
                    <span className="pwn__b"><b>{t}</b><span>{s}</span></span>
                    <b className="pwn__s num">{b}</b>
                    <span className="pwn__go">Откликнуться <Arr s={13} /></span>
                  </button>
                ))}
              </div>
            </section>

            <section className="cw__sec">
              <div className="cw__sh">
                <h2>Ближайшие даты</h2>
                <span className="cw__sn">по всем объектам · 5 событий до 30 сентября</span>
              </div>
              <div className="cdates">
                {DATES.map(([d, t, o, hot]) => (
                  <button key={d + t} className={"cdate" + (hot ? " hot" : "")}>
                    <b className="num">{d}</b>
                    <span className="cdate__t">{t}</span>
                    <span className="cdate__o">{o}</span>
                    {hot && <span className="cdate__h">{hot}</span>}
                  </button>
                ))}
              </div>
            </section>

            {/* в работе */}
            <section className="cw__sec">
              <div className="cw__sh">
                <h2>В работе</h2>
                <span className="cw__sn">{LIVE.length} {plural(LIVE.length, "объект", "объекта", "объектов")} · {totalTodo} {plural(totalTodo, "задача", "задачи", "задач")} на вас</span>
              </div>
              <div className="cw__list">
                {LIVE.map((r, i) => {
                  const k = "l" + i, isOpen = open === k;
                  return (
                    <article key={r.t} className={"citem" + (isOpen ? " open" : "")}>
                      <button className="citem__h" onClick={() => flip(k)}>
                        <span className="citem__t">
                          <b>{r.t}</b>
                          <span>{r.who} · {r.stage} · {r.due}</span>
                        </span>
                        <span className="citem__p">
                          <i><b style={{ width: r.prog + "%" }} /></i>
                          <u className="num">{r.prog}%</u>
                        </span>
                        {r.todo > 0 && <span className="citem__b">{r.todo} {plural(r.todo, "задача", "задачи", "задач")}</span>}
                        <span className="citem__x"><i /></span>
                      </button>
                      <div className="citem__act">
                        <b>{r.act[0]}</b>
                        <span>{r.act[1]}</span>
                        <button className="btn btn-acid btn-sm">Открыть <Arr s={13} /></button>
                      </div>
                      {isOpen && (
                        <div className="citem__d">
                          <div className="citem__m">
                            {[["Заказчик", r.who], ["Моя сумма", r.sum], ["Оплата", r.pay], ["Город", r.city]].map(([a, b]) => (
                              <div key={a}><span className="lbl">{a}</span><b>{b}</b></div>
                            ))}
                          </div>
                          <div className="ctab">
                            {r.rows.map(([c, n, st, v, p]) => (
                              <div key={c} className="ctab__r">
                                <b className="num">{c}</b>
                                <span>{n}<i className="ctab__v">{v}</i></span>
                                <span className={"cst cst--" + ST[st]}>{st}</span>
                                <i><b style={{ width: p + "%" }} /></i>
                                <button className="btn btn-line btn-sm">{st === "на приёмке" ? "Открыть" : "Выгрузить"}</button>
                              </div>
                            ))}
                          </div>
                          <div className="citem__f">
                            {["Замечания", "Файлы и версии", "Задание и исходные данные", "Договор и акты"].map(x => <button key={x} className="btn btn-line btn-sm">{x}</button>)}
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="cw__sec">
              <div className="cw__sh">
                <h2>Отработанные</h2>
                <span className="cw__sn">{DONE.length} {plural(DONE.length, "объект", "объекта", "объектов")} · 2,74 млн ₽ получено</span>
              </div>
              <div className="cw__list cw__list--done">
                {DONE.map((r, i) => {
                  const k = "d" + i, isOpen = open === k;
                  return (
                    <article key={r.t} className={"citem citem--done" + (isOpen ? " open" : "")}>
                      <button className="citem__h" onClick={() => flip(k)}>
                        <span className="citem__t">
                          <b>{r.t}</b>
                          <span>{r.who} · {r.stage} · {r.end}</span>
                        </span>
                        <span className="citem__q">{r.note}</span>
                        <b className="citem__s num">{r.sum}</b>
                        <span className="citem__x"><i /></span>
                      </button>
                      {isOpen && (
                        <div className="citem__d">
                          <div className="citem__m">
                            {[["Заказчик", r.who], ["Получено", r.sum], ["Оценка", r.note], ["Город", r.city]].map(([a, b]) => (
                              <div key={a}><span className="lbl">{a}</span><b>{b}</b></div>
                            ))}
                          </div>
                          <div className="ctab">
                            {r.rows.map(([c, n, st, v, p]) => (
                              <div key={c} className="ctab__r">
                                <b className="num">{c}</b>
                                <span>{n}<i className="ctab__v">{v}</i></span>
                                <span className={"cst cst--" + ST[st]}>{st}</span>
                                <i><b style={{ width: p + "%" }} /></i>
                                <button className="btn btn-line btn-sm">Открыть</button>
                              </div>
                            ))}
                          </div>
                          <div className="citem__f">
                            {["Акты и закрывающие", "Архив файлов", "Добавить в портфолио"].map(x => <button key={x} className="btn btn-line btn-sm">{x}</button>)}
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="cw__sec">
              <div className="cw__sh">
                <h2>Последние события</h2>
                <button className="cw__more">вся история <Arr s={12} /></button>
              </div>
              <div className="cfeed">
                {FEED.map(([w, m, d]) => (
                  <div key={w + m} className="cfeed__r">
                    <b>{w}</b>
                    <span>{m}</span>
                    <i className="num">{d}</i>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  Object.assign(window, { ProWork });
})();
