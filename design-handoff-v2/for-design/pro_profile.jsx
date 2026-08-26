/* pro_profile.jsx — раздел «Профиль исполнителя».
   Наверху повторяет первый экран после регистрации (готовность + шаги),
   ниже — сам профиль: то, что заказчик увидит в подборе, и то, что влияет
   на попадание в подбор. Стили частично берутся из pro_home.css. */
(() => {
  const { useState } = React;

  const plural = (n, one, few, many) => {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
    return many;
  };
  const Arr = ({ s = 14 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>);
  const Chk = ({ s = 13 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5l3.5 3.5L13 4.5" /></svg>);

  const TASKS = [
    ["Допуски и СРО", "Выписка из реестра и номер СРО", "Открывает заявки стадий П и РД — это 8 из 10 бюджетов", 30, false],
    ["Портфолио объектов", "3–5 объектов с составом разделов", "Заказчик видит опыт и приглашает адресно", 24, false],
    ["Ставки и формат", "Цена за раздел или за этап", "Платформа сама подставляет вас в подбор", 16, false],
    ["Телефон подтверждён", "+7 903 ··· 41 07", "", 12, true],
    ["Разделы и стадии отмечены", "8 разделов · П, РД", "", 18, true],
  ];

  /* Разделы по стадиям — то, по чему платформа подбирает заявки. */
  const SECS = [
    ["Проектная документация", ["АР", "КР", "ЭОМ", "ВК", "ОВиК", "ПОС", "ПБ", "СМ", "ООС"], ["АР", "КР", "ЭОМ", "ВК", "ОВиК"]],
    ["Рабочая документация", ["АР", "КЖ", "КМ", "ЭОМ", "ВК", "ОВ", "СС", "АПС"], ["АР", "КЖ", "ЭОМ"]],
    ["Обследование", ["ТО", "Обмеры", "Поверочные расчёты"], []],
  ];

  /* Документы: статус решает, попадёт исполнитель в фильтр «проверенные». */
  const DOCS = [
    ["Выписка из реестра СРО", "СРО-П-172-1234", "нет", "Обязательно для стадий П и РД"],
    ["Свидетельство НРС (ГИП)", "—", "нет", "Нужно, чтобы подписывать разделы"],
    ["Диплом о высшем образовании", "загружен 20.08.2026", "проверка", "Проверяем 1–2 рабочих дня"],
    ["Паспорт (страницы 2–3)", "загружен 20.08.2026", "ок", "Для договора и выплат"],
    ["Полис страхования ответственности", "—", "нет", "Не обязателен, но повышает место в подборе"],
  ];

  /* Из чего складывается рейтинг: вес — вклад в итоговый балл.
     На старте закрыты только «допуски» частично, поэтому балл низкий. */
  const RANK = [
    ["Приёмка этапов без просрочки", 30, 0, "нет закрытых этапов"],
    ["Оценки заказчиков", 25, 0, "нет отзывов"],
    ["Подтверждённые допуски", 20, 6, "паспорт и диплом"],
    ["Прохождение экспертизы", 15, 0, "нет объектов на площадке"],
    ["Скорость и полнота откликов", 10, 4, "отклик за 4 часа"],
  ];

  /* Критерии, по которым заказчик оценивает после этапа. */
  const CRIT = [["Сроки", "вовремя сдан этап"], ["Качество", "замечания по разделам"], ["Экспертиза", "снятие замечаний"], ["Связь", "ответы и отчётность"]];

  /* События исполнителя: заявки, отклики, этапы и деньги. */
  const NOTIFY = [
    ["Новая заявка по вашим разделам", "совпадение состава от 60%", true, true],
    ["Приглашение в заявку", "заказчик позвал вас адресно", true, true],
    ["Ответ на ваш отклик", "выбрали вас или отказали", true, true],
    ["Этап принят или отправлен на правку", "с перечнем замечаний", true, false],
    ["Оплата по этапу", "деньги ушли на ваш счёт", false, true],
    ["Проверка документов", "результат по СРО, НРС и диплому", false, true],
  ];

  const NAV = [["feed", "Заявки"], ["resp", "Мои отклики"], ["prof", "Профиль"]];

  function ProProfile({ go, onBack }) {
    const [done, setDone] = useState(TASKS.map(t => t[4]));
    const [secs, setSecs] = useState(SECS.map(s => s[2]));
    const [kind, setKind] = useState("Частный специалист");
    const ready = TASKS.reduce((s, t, i) => s + (done[i] ? t[3] : 0), 0);
    const left = TASKS.filter((t, i) => !done[i]);
    const toggle = i => setDone(d => d.map((v, j) => (j === i ? !v : v)));
    const tsec = (gi, s) => setSecs(v => v.map((g, j) => (j === gi ? (g.includes(s) ? g.filter(x => x !== s) : g.concat(s)) : g)));
    const total = secs.reduce((n, g) => n + g.length, 0);
    const verified = DOCS.filter(d => d[2] === "ок").length;
    const score = RANK.reduce((s, r) => s + r[2], 0);
    const [rkOpen, setRkOpen] = useState(false);

    return (
      <div className="nd ph pp">
        <header className="topbar">
          <div className="topbar__l">
            <span className="logo" onClick={() => go && go("home")} style={{ cursor: go ? "pointer" : "default" }}>Функция</span>
            <span className="ph__badge">исполнителям</span>
          </div>
          <nav className="nav">
            {NAV.map(([k, l]) => <button key={k} className={k === "prof" ? "on" : ""}>{l}</button>)}
          </nav>
          <div className="topbar__r">
            <span className="lbl">+7 903 ··· 41 07</span>
            {onBack
              ? <button className="btn btn-line btn-sm btn--back" onClick={onBack}>В рабочую область</button>
              : <button className="btn btn-line btn-sm">Сайт для заказчиков</button>}
          </div>
        </header>

        <div className="scroll">
          <div className="wrap">
            {/* блок с первого экрана: статус в базе и готовность */}
            <section className="ph__hero">
              <div className="ph__hl">
                <span className="lbl">Профиль создан · 20 августа</span>
                <h1>Вы в базе исполнителей. Осталось подтвердить допуски</h1>
                <p>Заявки по вашим разделам уже подобраны — можно откликаться прямо сейчас. Но пока в профиле нет СРО и портфолио, заказчики видят вас ниже проверенных, а часть заявок стадии П закрыта.</p>
                <div className="ph__hb">
                  <button className="btn btn-acid btn-lg">Подтвердить допуски <Arr /></button>
                  <button className="btn btn-ghost">Как меня видит заказчик</button>
                </div>
              </div>
              <aside className="ph__ring">
                <div className="ph__rv"><b className="num">{ready}</b><span>%</span></div>
                <span className="ph__rl">готовность профиля</span>
                <div className="ph__bar"><i style={{ width: ready + "%" }} /></div>
                <span className="ph__rn">{left.length === 0 ? "все шаги закрыты" : "осталось шагов: " + left.length + " · +" + left.reduce((s, t) => s + t[3], 0) + "%"}</span>
              </aside>
            </section>

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

            {/* сам профиль в две колонки: слева содержимое, справа то,
                что видит заказчик, и служебные действия */}
            <div className="pp__grid">
              <div className="pp__main">
                {/* визитка */}
                <section className="pp__card pp__id">
                  <div className="pp__ava"><image-slot id="pp-ava" shape="circle" placeholder="Фото"></image-slot></div>
                  <div className="pp__idb">
                    <div className="pp__idt">
                      <h2>Соколов Артём Викторович</h2>
                      <span className="tag tag--warn"><span className="dot" style={{ background: "#DC5A2A" }} />не проверен</span>
                    </div>
                    <span className="pp__idr">Проектировщик · ГИП · Москва и область</span>
                    <div className="pp__seg">
                      {["Частный специалист", "Организация"].map(k => (
                        <button key={k} className={kind === k ? "on" : ""} onClick={() => setKind(k)}>{k}</button>
                      ))}
                    </div>
                    <p className="pp__about">Разделы АР, КР и ЭОМ для жилых и общественных объектов. 11 лет практики, 34 объекта прошли экспертизу. Работаю в Revit и nanoCAD, беру ведение этапа с сопровождением замечаний.</p>
                    <div className="pp__chips">
                      {["11 лет опыта", "34 объекта", "Revit · nanoCAD", "Отклик за 4 часа"].map(x => <span key={x} className="tag">{x}</span>)}
                    </div>
                  </div>
                </section>

                {/* разделы и стадии */}
                <section className="pp__card">
                  <div className="pp__h">
                    <div><span className="lbl">Основа подбора</span><h3>Разделы и стадии</h3></div>
                    <span className="pp__n"><b className="num">{total}</b> {plural(total, "раздел", "раздела", "разделов")} отмечено</span>
                  </div>
                  <p className="pp__note">Платформа показывает заявки, где совпадает состав. Чем точнее список, тем меньше нерелевантных заявок в ленте.</p>
                  {SECS.map(([g, all], gi) => (
                    <div key={g} className="pp__sg">
                      <span className="pp__sgt">{g}</span>
                      <div className="pp__sl">
                        {all.map(s => (
                          <button key={s} className={"psec" + (secs[gi].includes(s) ? " on" : "")} onClick={() => tsec(gi, s)}>{s}</button>
                        ))}
                      </div>
                    </div>
                  ))}
                </section>

                <window.NotifyBlock events={NOTIFY} note="Новые заявки по вашим разделам, изменения в нормативах и обновления платформы." />

                {/* документы и допуски */}
                <section className="pp__card">
                  <div className="pp__h">
                    <div><span className="lbl">Проверка</span><h3>Документы и допуски</h3></div>
                    <span className="pp__n"><b className="num">{verified}</b> из {DOCS.length} подтверждено</span>
                  </div>
                  <div className="pp__docs">
                    {DOCS.map(([t, v, st, why]) => (
                      <div key={t} className={"pdoc pdoc--" + st}>
                        <span className="pdoc__s">{st === "ок" ? <Chk s={12} /> : st === "проверка" ? "···" : "—"}</span>
                        <span className="pdoc__b">
                          <span className="pdoc__t">{t}</span>
                          <span className="pdoc__w">{why}</span>
                        </span>
                        <span className="pdoc__v num">{v}</span>
                        <button className="btn btn-line btn-sm">{st === "нет" ? "Загрузить" : "Заменить"}</button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* портфолио */}
                <section className="pp__card">
                  <div className="pp__h">
                    <div><span className="lbl">Опыт</span><h3>Портфолио объектов</h3></div>
                    <button className="btn btn-ink btn-sm">Добавить объект <Arr s={13} /></button>
                  </div>
                  <div className="pp__port">
                    {[["ЖК «Северный парк», Казань", "ПД · АР, КР, ВК · 2025", "pp-p1"],
                      ["Склад класса А, Домодедово", "РД · АР, КЖ · 2024", "pp-p2"],
                      ["Школа на 550 мест, Калуга", "П · АР, КР · 2024", "pp-p3"]].map(([t, s, id]) => (
                      <div key={id} className="pport">
                        <div className="pport__i"><image-slot id={id} shape="rounded" radius="14" placeholder="Фото или визуализация"></image-slot></div>
                        <b>{t}</b>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                  <p className="pp__note">Три объекта — минимум, при котором заказчики начинают приглашать адресно. Можно приложить ссылку на альбом вместо файлов.</p>
                </section>

                {/* отзывы: пусто, но со структурой — понятно, что будет оцениваться */}
                <section className="pp__card">
                  <div className="pp__h">
                    <div><span className="lbl">Отзывы заказчиков</span><h3>Пока ни одного отзыва</h3></div>
                    <span className="pp__n"><b className="num">0</b> отзывов · <b className="num">0</b> этапов</span>
                  </div>
                  <p className="pp__note" style={{ marginTop: 0 }}>Отзыв появляется автоматически после приёмки этапа — заказчик ставит оценку по четырём критериям. Удалить или купить отзыв нельзя, ответить на него можно один раз.</p>
                  <div className="pp__crit">
                    {CRIT.map(([t, s]) => (
                      <div key={t} className="pcrit">
                        <span className="pcrit__t">{t}</span>
                        <span className="pcrit__d">{s}</span>
                        <span className="pcrit__s">{[1, 2, 3, 4, 5].map(n => <i key={n} />)}</span>
                        <span className="pcrit__v">—</span>
                      </div>
                    ))}
                  </div>
                  <div className="pp__row">
                    <span>Работали на других площадках? Приложите ссылки — модератор перенесёт отзывы с пометкой «внешний источник».</span>
                    <button className="btn btn-line btn-sm">Перенести отзывы</button>
                  </div>
                </section>
              </div>

              {/* правая колонка */}
              <aside className="pp__side">
                <section className="pp__card pp__prev">
                  <span className="lbl">Как вас видит заказчик</span>
                  <div className="pprev">
                    <div className="pprev__t">
                      <span className="pprev__a">СА</span>
                      <div>
                        <b>Соколов А. В.</b>
                        <span>Проектировщик · Москва</span>
                      </div>
                    </div>
                    <div className="pprev__s">
                      {secs[0].slice(0, 4).map(s => <span key={s} className="psec on">{s}</span>)}
                      {secs[0].length > 4 && <span className="psec">+{secs[0].length - 4}</span>}
                    </div>
                    <div className="pprev__f">
                      <div><span className="lbl">Опыт</span><b className="num">11 лет</b></div>
                      <div><span className="lbl">Отклик</span><b className="num">4 ч</b></div>
                    </div>
                    <span className="pprev__w">без подтверждённого СРО — в конце списка</span>
                  </div>
                </section>

                <section className="pp__card pp__stat">
                  <span className="lbl">За 30 дней</span>
                  <div className="pp__sts">
                    {[["Показов в подборе", "—"], ["Приглашений", "—"], ["Откликов", "0"], ["Этапов в работе", "0"]].map(([k, v]) => (
                      <div key={k}><span>{k}</span><b className="num">{v}</b></div>
                    ))}
                  </div>
                  <span className="pp__note">Данные появятся после публикации профиля.</span>
                </section>

                {/* рейтинг: свёрнутое превью, по клику разворачивается разбор */}
                <section className={"pp__card pp__rk" + (rkOpen ? " open" : "")}>
                  <button className="prk__head" onClick={() => setRkOpen(v => !v)}>
                    <span className="prk__hl">
                      <span className="lbl">Рейтинг на площадке</span>
                      <span className="prk__v"><b className="num">{score}</b><i>из 100</i></span>
                      <span className="prk__lv">уровень «Новый»</span>
                    </span>
                    <span className="prk__x">{rkOpen ? "свернуть" : "подробнее"}<Arr s={12} /></span>
                  </button>
                  <div className="prk__bar"><i style={{ width: score + "%" }} /></div>
                  <div className="prk__pos">
                    <span>Место в подборе</span>
                    <b className="num">186 <i>из 214</i></b>
                  </div>
                  {rkOpen && (
                    <div className="prk__body">
                      <div className="prk__lad">
                        {[["Новый", 0], ["Проверенный", 40], ["Надёжный", 70], ["Эталон", 90]].map(([l, v]) => (
                          <span key={l} className={"prk__st" + (score >= v ? " on" : "")}><i />{l}<b className="num">{v}+</b></span>
                        ))}
                      </div>
                      <div className="prk__f">
                        {RANK.map(([t, w, got, note]) => (
                          <div key={t} className={"prf" + (got > 0 ? " on" : "")}>
                            <span className="prf__t">{t}</span>
                            <span className="prf__v num">{got} / {w}</span>
                            <span className="prf__b"><i style={{ width: (got / w) * 100 + "%" }} /></span>
                            <span className="prf__n">{note}</span>
                          </div>
                        ))}
                      </div>
                      <div className="prk__fc">
                        <span className="lbl">После подтверждения СРО</span>
                        <b className="num">≈ 74 <i>из 214</i></b>
                        <span>расчёт по текущим анкетам в вашем разделе</span>
                      </div>
                      <p className="prk__n">Пересчитывается после каждой приёмки этапа. Не покупается и не обнуляется при отказе от заявки — но просрочка снимает до 12 баллов.</p>
                    </div>
                  )}
                </section>

                <section className="pp__card pp__set">
                  <span className="lbl">Настройки подбора</span>
                  {[["География", "Москва, МО, ЦФО"], ["Бюджет заявки", "от 500 000 ₽"], ["Уведомления", "новые заявки — сразу"], ["Приглашения", "разрешены"]].map(([k, v]) => (
                    <div key={k} className="pset"><span>{k}</span><b>{v}</b></div>
                  ))}
                  <button className="btn btn-line btn-sm">Настроить</button>
                </section>
              </aside>
            </div>
          </div>
        </div>
      </div>
    );
  }

  Object.assign(window, { ProProfile, ProProfileFull: ProProfile });
})();
