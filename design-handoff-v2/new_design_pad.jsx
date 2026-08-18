/* new_design_pad.jsx — мини-версия платформы внутри планшета на главной.
   6 экранов с автопереключением; клик по навигации берёт управление на себя. */
(function () {
  const { useState, useEffect, useRef } = React;
  const Arr = ({ s = 12 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>);
  const Chk = ({ s = 10 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5l3.5 3.5L13 4.5" /></svg>);

  const NAV = [["Главная", ""], ["Заявки", "12"], ["Отклики", "7"], ["Исполнители", "48"], ["Экспертиза", "3"], ["Файлы", "24"]];
  const REQS = [
    ["Склад класса А, Домодедово", "18 400 м² · стадия П", "2,4 млн", 7, ["АР", "КЖ", "ОВ"]],
    ["Реконструкция котельной 4,2 МВт", "Тула · стадия РД", "1,1 млн", 4, ["ТХ", "ЭОМ"]],
    ["ЖК «Северный парк», корпус 2", "Казань · стадия ПД", "6,8 млн", 9, ["АР", "КР", "ВК"]],
  ];
  const BIDS = [["Ситипроект", "2,4 млн · 45 дн", 92, "8/8 разделов"], ["Гипрострой", "2,8 млн · 38 дн", 88, "8/8 разделов"], ["Аркада", "2,1 млн · 60 дн", 74, "5/8 разделов"]];
  const PROS = [["Техносфера", "Проектировщик · СРО", 94], ["АБ «Форма»", "Чертёжник · BIM", 87], ["Д. Шевцов", "Обследователь · НРС", 82]];
  const SECS = [["АР", 82], ["КЖ", 64], ["ОВиК", 41], ["ЭОМ", 28]];
  const FILES = [["DWG", "Генплан участка", "4,8 МБ"], ["IFC", "Концепция_BIM", "23,1 МБ"], ["PDF", "Техзадание", "1,2 МБ"], ["ZIP", "Исходные данные", "12,4 МБ"]];
  const REMS = [["КР", "Расчёт нагрузок плиты 3 эт.", "открыто"], ["ЭОМ", "Схема электроснабжения", "принято"], ["ВК", "Ответ направлен эксперту", "проверка"]];

  function PadUI() {
    const [i, setI] = useState(0);
    const [manual, setManual] = useState(false);
    const t = useRef(0);
    useEffect(() => {
      if (manual) return;
      t.current = setInterval(() => setI(p => (p + 1) % NAV.length), 4200);
      return () => clearInterval(t.current);
    }, [manual]);
    const pick = n => { setManual(true); setI(n); };
    const scr = NAV[i][0];

    return (
      <div className="pui">
        <aside className="pui__side">
          <span className="pui__mark">Ф</span>
          {NAV.map(([l, n], k) => (
            <button className={"pui__nav" + (k === i ? " on" : "")} key={l} onClick={() => pick(k)}><b />{l}{n && <em>{n}</em>}</button>
          ))}
          <span className="pui__hint">{manual ? "ручной режим" : "автопоказ"}</span>
        </aside>

        <div className="pui__main" key={scr}>
          {scr === "Главная" && (<>
            <div className="pui__top">
              <div><span className="lbl">Рабочее место заказчика</span><h4>Сегодня, 3 события</h4></div>
              <span className="tag solid">Создать заявку</span>
            </div>
            <div className="pui__grid pui__grid--home">
              <div className="pui__card pui__card--dark">
                <span className="lbl">Активные заявки</span>
                <b className="pui__big num">12 <span>из них 3 ждут решения</span></b>
                <div className="pui__pipe"><i className="on" /><i className="on" /><i className="a" /><i /><i /></div>
              </div>
              <div className="pui__card">
                <span className="lbl">Новые отклики</span>
                {BIDS.slice(0, 2).map(([n, p, t2]) => <div className="pui__bid" key={n}><b>{n}</b><span>{p}</span><em className="num">{t2}</em></div>)}
              </div>
              <div className="pui__card">
                <span className="lbl">Готовность разделов</span>
                {SECS.slice(0, 3).map(([c, v]) => <div className="pui__bar" key={c}><b>{c}</b><i><span style={{ width: v + "%" }} /></i><em className="num">{v}%</em></div>)}
              </div>
            </div>
          </>)}

          {scr === "Заявки" && (<>
            <div className="pui__top">
              <div><span className="lbl">Мои заявки · 12</span><h4>Открытые и в работе</h4></div>
              <div className="row g8"><span className="tag solid">Все</span><span className="tag">Мои</span><span className="tag">Горячие</span></div>
            </div>
            <div className="pui__rows">
              {REQS.map(([t2, s, b, r, cs]) => (
                <div className="pui__row" key={t2}>
                  <span className="pui__row-n"><b>{t2}</b><span>{s}</span></span>
                  <span className="pui__codes">{cs.map(c => <i key={c}>{c}</i>)}</span>
                  <span className="pui__row-v"><b className="num">{b}</b><span>{r} откл.</span></span>
                </div>
              ))}
            </div>
          </>)}

          {scr === "Отклики" && (<>
            <div className="pui__top">
              <div><span className="lbl">Заявка №148 · Склад класса А</span><h4>Сравнение 3 откликов</h4></div>
              <span className="tag solid">Выбрать исполнителя</span>
            </div>
            <div className="pui__rows">
              {BIDS.map(([n, p, t2, cov], k) => (
                <div className={"pui__row" + (k === 0 ? " on" : "")} key={n}>
                  <span className="pui__row-n"><b>{n}</b><span>{p}</span></span>
                  <span className="pui__row-c">{cov}</span>
                  <span className="pui__row-v"><b className="num" style={{ color: t2 >= 88 ? "var(--moss)" : "var(--ink)" }}>{t2}</b><span>индекс</span></span>
                </div>
              ))}
            </div>
          </>)}

          {scr === "Исполнители" && (<>
            <div className="pui__top">
              <div><span className="lbl">База · 48 подходящих</span><h4>Подбор по разделам</h4></div>
              <div className="row g8"><span className="tag solid">Проектировщик</span><span className="tag">Эксперт</span><span className="tag">Чертёжник</span></div>
            </div>
            <div className="pui__rows">
              {PROS.map(([n, s, t2]) => (
                <div className="pui__row" key={n}>
                  <span className="pui__ava">{n.slice(0, 1)}</span>
                  <span className="pui__row-n"><b>{n}</b><span>{s}</span></span>
                  <span className="pui__row-v"><b className="num">{t2}</b><span>доверие</span></span>
                </div>
              ))}
            </div>
          </>)}

          {scr === "Экспертиза" && (<>
            <div className="pui__top">
              <div><span className="lbl">Этап 3 из 5</span><h4>Замечания экспертизы</h4></div>
              <span className="tag solid">3 открыто</span>
            </div>
            <div className="pui__grid pui__grid--exp">
              <div className="pui__card pui__card--dark">
                <span className="lbl">Прохождение</span>
                <b className="pui__big num">3 <span>замечания в работе</span></b>
                <div className="pui__pipe"><i className="on" /><i className="on" /><i className="a" /><i /><i /></div>
                <span className="lbl">Ответ до 24.08</span>
              </div>
              <div className="pui__card">
                <span className="lbl">По разделам</span>
                {REMS.map(([c, txt, st]) => (
                  <div className="pui__rem" key={txt}><i>{c}</i><span>{txt}</span><em className={st === "принято" ? "ok" : st === "проверка" ? "go" : ""}>{st}</em></div>
                ))}
              </div>
            </div>
          </>)}

          {scr === "Файлы" && (<>
            <div className="pui__top">
              <div><span className="lbl">Хранилище заявки · 24 файла</span><h4>Материалы и версии</h4></div>
              <span className="tag solid">Загрузить</span>
            </div>
            <div className="pui__files">
              {FILES.map(([e, n, s]) => (
                <div className="pui__file" key={n}><i>{e}</i><b>{n}</b><span>{s}</span><em><Chk s={9} /> проверен</em></div>
              ))}
            </div>
          </>)}
        </div>
      </div>
    );
  }

  Object.assign(window, { PadUI });
})();
