/* new_design_land3.jsx — лендинг исполнителям, вариант 3: тёмное полотно,
   белые карточки с большими радиусами, баннер-слайдер, тарифы участия,
   табло индекса доверия и форма знакомства. */
(function () {
  const { useState } = React;
  const Mark = ({ s = 26 }) => (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="#C9F24A" /><path d="M13 28V12h14M13 20h10" stroke="#14161A" strokeWidth="2.8" strokeLinecap="square" /></svg>
  );
  const Chev = ({ d = 1 }) => (<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{d > 0 ? <path d="M6 3l5 5-5 5" /> : <path d="M10 3L5 8l5 5" />}</svg>);

  const NAV = ["Заявки", "Направления", "Тарифы", "Исполнителям", "Экспертиза", "О платформе"];
  const SLIDES = [
    ["Заявки с составом разделов", "Стадия, разделы по ПП РФ №87 и бюджет — видно до первого сообщения", "Смотреть заявки"],
    ["Оплата по этапам", "Заказчик резервирует сумму до старта, вы получаете её после приёмки раздела", "Как это работает"],
    ["Проверка по реестрам", "СРО и НРС сверяем автоматически — подтверждённый профиль выше в подборе", "Заполнить анкету"],
  ];
  const PLANS = [
    ["Старт", null, "Первые заявки", "для тех, кто только выходит на платформу", [["10 откликов", "в месяц бесплатно"], ["1 направление", "и до 4 разделов"], ["Базовый профиль", "без приоритета в выдаче"]], "0 ₽/мес", false],
    ["Практика", "хит", "Постоянный поток", "для специалистов и небольших команд", [["Без лимита откликов", "по вашим разделам"], ["3 направления", "и все разделы стадии"], ["Приоритет в подборе", "при подтверждённом НРС"]], "1 900 ₽/мес", false],
    ["Бюро", null, "Команда под ключ", "для организаций со штатом и СРО", [["Без лимита откликов", "и приглашений от заказчиков"], ["Все направления", "и все стадии"], ["Витрина бюро", "портфолио, состав команды, эскроу"]], "6 500 ₽/мес", true],
  ];
  const PERKS = [
    ["Переносите портфолио", "объекты и отзывы с прошлых площадок"],
    ["Договор в платформе", "шаблон, этапы, акты приёмки"],
    ["Двойной лимит откликов", "первый месяц после проверки документов"],
  ];
  const FEED = [
    ["Склад класса А, Домодедово", "стадия П · 18 400 м²", "2,4 млн ₽"],
    ["Котельная 4,2 МВт, Тула", "стадия РД · реконструкция", "1,1 млн ₽"],
    ["ЖК «Северный парк», Казань", "стадия ПД · корпус 2", "6,8 млн ₽"],
  ];

  function Land3() {
    const [slide, setSlide] = useState(0);
    const [org, setOrg] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [sent, setSent] = useState(false);
    const trust = "94";
    const DIG = ["0", "1", "9", "4", "7", "3", "2", "8"];

    return (
      <div className="nd l3">
        <header className="l3top">
          <div className="wrap l3top__in">
            <div className="mark"><Mark s={26} /><b>Функция</b></div>
            <nav className="l3nav">{NAV.map(n => <button key={n}>{n}</button>)}</nav>
            <span className="spacer" />
            <a className="l3btn l3btn--w" href="Функция (регистрация исполнителя).html">Войти</a>
          </div>
        </header>

        <div className="scroll">
          <section className="wrap l3sec">
            <div className="l3ban">
              <div className="l3ban__t">
                <span className="lbl">Для исполнителей</span>
                <h1>{SLIDES[slide][0]}</h1>
                <p>{SLIDES[slide][1]}</p>
                <a className="l3btn l3btn--w l3btn--lg" href="Функция (новый дизайн).html">{SLIDES[slide][2]}</a>
              </div>
              <div className="l3ban__ph">
                <image-slot id="land3-hero" shape="rect" src="assets/pro-at-work.png" placeholder="Фото проектировщика"></image-slot>
                <div className="l3ban__nav">
                  <button onClick={() => setSlide((slide + SLIDES.length - 1) % SLIDES.length)}><Chev d={-1} /></button>
                  <button onClick={() => setSlide((slide + 1) % SLIDES.length)}><Chev /></button>
                </div>
              </div>
            </div>
          </section>

          <section className="wrap l3sec">
            <div className="l3plans">
              {PLANS.map(([t, hit, cap, sub, rows, price, dark]) => (
                <div className={"l3plan" + (dark ? " dark" : "")} key={t}>
                  <div className="l3plan__h"><b>{t}</b>{hit && <span className="l3hit">{hit}</span>}</div>
                  <div className="l3plan__cap"><b>{cap}</b><span>{sub}</span></div>
                  <div className="l3plan__rows">
                    {rows.map(([a, b]) => <div key={a}><b>{a}</b><span>{b}</span></div>)}
                  </div>
                  <button className="l3price">{price}</button>
                </div>
              ))}
              <div className="l3side">
                <div className="l3sidecard"><b>Все тарифы</b><span>сравнение условий и лимитов</span></div>
                <div className="l3sidecard"><b>Для организаций</b><span>витрина бюро и командный доступ</span></div>
              </div>
            </div>
          </section>

          <section className="wrap l3sec">
            <div className="l3cta">
              <div>
                <h2>Станьте проверенным исполнителем</h2>
                <p>Заполните анкету: направление, стадии, разделы и допуски. Проверим СРО и НРС по реестрам и откроем заявки по вашему профилю — до одного рабочего дня.</p>
                <a className="l3btn l3btn--a l3btn--lg" href="Функция (регистрация исполнителя).html">Заполнить анкету</a>
              </div>
              <div className="l3cta__m">
                <div className="l3doc"><i /><i /><i /><span>ПП РФ №87</span></div>
              </div>
            </div>
          </section>

          <section className="wrap l3sec">
            <div className="l3perks">
              {PERKS.map(([t, d]) => <div className="l3perk" key={t}><b>{t}</b><span>{d}</span></div>)}
            </div>
          </section>

          <section className="wrap l3sec">
            <div className="l3trust">
              <div>
                <h2>Индекс доверия вместо резюме</h2>
                <p>Собирается из подтверждённых документов, закрытых этапов и отзывов заказчиков. Заказчик видит цифру, а не обещания — и фильтрует базу по ней.</p>
                <a className="l3link" href="Функция (новый дизайн).html">Как считается индекс</a>
              </div>
              <div className="l3trust__r">
                <div className="l3board">
                  {trust.split("").map((d, i) => <span key={i} className="l3dig">{d}</span>)}
                  <span className="l3dig l3dig--gh">{DIG[(slide + 2) % DIG.length]}</span>
                </div>
                <span className="l3trust__n">Уровень «Эталон» · 12 закрытых этапов</span>
                <div className="l3trust__b">
                  <a className="l3btn l3btn--d" href="Функция (регистрация исполнителя).html">Собрать профиль</a>
                  <a className="l3btn l3btn--l" href="Функция (новый дизайн).html">Смотреть исполнителей</a>
                </div>
              </div>
            </div>
          </section>

          <section className="wrap l3sec l3sec--last">
            <div className="l3bottom">
              <div className="l3form">
                <h2>Будем рады знакомству с вашим бюро</h2>
                <p>Оставьте данные — расскажем, как выстроить поток заявок по вашим разделам и подключить команду.</p>
                <div className="l3fields">
                  <input className="l3inp" placeholder="Название организации или ИНН" value={org} onChange={e => setOrg(e.target.value)} />
                  <input className="l3inp" placeholder="Ваше имя" value={name} onChange={e => setName(e.target.value)} />
                  <input className="l3inp num" placeholder="+7 900 000-00-00" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <button className="l3btn l3btn--a l3btn--lg" onClick={() => setSent(true)}>{sent ? "Заявка отправлена" : "Отправить заявку"}</button>
                <span className="l3note">{sent ? "Свяжемся в течение рабочего дня." : "Нажимая кнопку, вы соглашаетесь с обработкой данных."}</span>
              </div>
              <div className="l3col">
                <div className="l3card">
                  <b>Уже зарегистрированы?</b>
                  <span>Перейдите в личный кабинет исполнителя</span>
                  <a className="l3btn l3btn--l" href="Функция (новый дизайн).html">Перейти</a>
                </div>
                <div className="l3card">
                  <b>Заявки прямо сейчас</b>
                  <div className="l3feed">
                    {FEED.map(([t, s, b]) => <div key={t}><span className="l3feed__t">{t}</span><span className="l3feed__s">{s}</span><b className="num">{b}</b></div>)}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <footer className="wrap l3foot">
            <span>Функция · платформа проектно-изыскательских работ</span>
            <div className="row g16">
              <a href="Функция (лендинг для исполнителей).html">Вариант 1</a>
              <a href="Функция (новый дизайн).html">Платформа</a>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  Object.assign(window, { Land3 });
})();
