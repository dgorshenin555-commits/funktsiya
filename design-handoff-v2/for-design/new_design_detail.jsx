/* new_design_detail.jsx — экран варианта Б, выгружен из основного проекта.
   Сгенерировано tools/reverse_transform.py: правки вносить в
   app/v2/_screens/ в проекте, иначе они разойдутся.
   Подключать после lib_bundle.jsx. */
(function () {
  const { useState } = React;
  const Arr = ({ s = 14 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>);
  const Back = () => (<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M13 8H3M7 4L3 8l4 4" /></svg>);
  const Chk = ({ s = 11 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5l3.5 3.5L13 4.5" /></svg>);
  const X = () => (<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M4 4l8 8M12 4l-8 8" /></svg>);
  const Ini = ({ n, size = 38 }) => (<div className="pini num" style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: size * .3, fontSize: size * .34 }}>{n}</div>);

  /* ---------- сравнение откликов ---------- */
  const ROWS = [
    ["Цена", c => c.price, (c, all) => c.pn === Math.min(...all.map(x => x.pn))],
    ["Срок", c => c.d, (c, all) => c.dn === Math.min(...all.map(x => x.dn))],
    ["Опыт", c => c.yrs + " лет", (c, all) => c.yrs === Math.max(...all.map(x => x.yrs))],
    ["Похожих проектов", c => c.same, (c, all) => c.same === Math.max(...all.map(x => x.same))],
    ["Разделы закрывает", c => c.cover, c => c.cover === "все"],
    ["Отзывы", c => c.rev, (c, all) => c.rev === Math.max(...all.map(x => x.rev))],
    ["Срыв сроков", c => c.late, (c, all) => parseFloat(c.late.replace(",", ".")) === Math.min(...all.map(x => parseFloat(x.late.replace(",", "."))))],
    ["СРО и страхование", c => c.sro ? "да" : "нет", c => c.sro],
    ["Ответил", c => c.resp, () => false],
  ];

  function Compare({ cands, onClose }) {
    return (
      <div className="ov" onClick={onClose}>
        <div className="ov__p" onClick={e => e.stopPropagation()}>
          <div className="ov__h">
            <div>
              <span className="lbl">Сравнение откликов</span>
              <h2>Кто подходит лучше</h2>
            </div>
            <span className="spacer" />
            <span className="lbl">зелёным — лучшее значение</span>
            <button className="close" onClick={onClose}><X /></button>
          </div>
          <div className="ov__b">
            <table className="cmp">
              <thead>
                <tr>
                  <th style={{ background: "var(--paper)" }}><span className="lbl">Параметр</span></th>
                  {cands.map(c => <th key={c.n}><h4>{c.name}</h4><span className="lbl">{c.city}</span></th>)}
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([label, val, best]) => (
                  <tr key={label}>
                    <th>{label}</th>
                    {cands.map(c => <td key={c.n} className={best(c, cands) ? "win" : ""}><span className="num">{val(c)}</span></td>)}
                  </tr>
                ))}
                <tr>
                  <th></th>
                  {cands.map(c => <td key={c.n}><button className="btn btn-ink btn-sm">Выбрать</button></td>)}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- деталь заявки ---------- */
  const BIDS = [
    { n: "ТС", name: "ООО «Техносфера»", city: "Нижний Новгород", note: "СРО · 14 лет · 62 проекта", price: "1 150 000 ₽", pn: 1150, d: "42 дня", dn: 42, yrs: 14, same: 9, cover: "все", rev: 28, late: "0,8%", sro: true, resp: "через 2 ч" },
    { n: "ПВ", name: "ПБ «Вектор»", city: "Самара", note: "СРО · 9 лет · 38 проектов", price: "980 000 ₽", pn: 980, d: "50 дней", dn: 50, yrs: 9, same: 4, cover: "3 из 4", rev: 9, late: "4,6%", sro: true, resp: "через 6 ч" },
    { n: "ИГ", name: "ИнжГрупп", city: "Казань", note: "СРО · 11 лет · 51 проект", price: "1 240 000 ₽", pn: 1240, d: "38 дней", dn: 38, yrs: 11, same: 7, cover: "все", rev: 22, late: "1,2%", sro: true, resp: "через 3 ч" },
  ];
  const SECS = [["ОВ", "Отопление и вентиляция"], ["ЭОМ", "Электрооборудование"], ["АР", "Архитектурные решения"], ["ТХ", "Технологические решения"]];
  const FILES = [["PDF", "Техническое задание.pdf", "2,4 МБ"], ["DWG", "Обмерные чертежи.dwg", "18,1 МБ"], ["XLSX", "Опросный лист по оборудованию.xlsx", "340 КБ"]];
  const TIMELINE = [
    { s: "done", t: "Заявка опубликована", w: "11 августа" },
    { s: "now", t: "Сбор откликов", w: "идёт · 3 отклика" },
    { s: "next", t: "Выбор исполнителя", w: "до 18 августа" },
    { s: "next", t: "Договор и аванс", w: "" },
    { s: "next", t: "Работа и сдача разделов", w: "45 дней" },
  ];

  function OrderDetail({ go }) {
    const [sel, setSel] = useState(["ТС", "ИГ"]);
    const [cmp, setCmp] = useState(false);
    const tgl = n => setSel(p => p.includes(n) ? p.filter(x => x !== n) : p.length < 4 ? [...p, n] : p);

    return (
      <div className="scroll">
        <div className="wrap page">
          <button className="back" onClick={() => go("reqs")}><Back /> Все заявки</button>
          <div className="dhead">
            <div>
              <span className="lbl">Проектирование · Нижний Новгород</span>
              <h1>Реконструкция котельной 4,2 МВт</h1>
              <div className="rcard__meta">
                <span className="tag solid">Промышленный объект</span>
                <span className="tag solid">Проектная документация</span>
                {SECS.map(([s]) => <span className="tag" key={s}>{s}</span>)}
              </div>
            </div>
            <div style={{ display: "grid", gap: 10, justifyItems: "end" }}>
              <span className="trust"><span className="dot" style={{ background: "var(--moss)" }} />Ваша заявка</span>
              <button className="btn btn-line btn-sm">Редактировать</button>
            </div>
          </div>

          <div className="facts">
            <div className="f"><span>Бюджет</span><b>1 200 000 ₽</b></div>
            <div className="f"><span>Срок</span><b>45 дней</b></div>
            <div className="f"><span>Откликов</span><b>3</b></div>
            <div className="f"><span>Опубликована</span><b>11 авг</b></div>
            <div className="f"><span>Отклики до</span><b>18 авг</b></div>
          </div>

          <div className="two">
            <div>
              <div className="sect">
                <h2>Отклики</h2>
                <p className="mut" style={{ margin: "0 0 14px", fontSize: 13.5 }}>Отметьте 2–4 исполнителя и нажмите «Сравнить» — увидите их рядом в таблице.</p>
                <div style={{ display: "grid", gap: 10 }}>
                  {BIDS.map(b => (
                    <div className={"bidrow" + (sel.includes(b.n) ? " on" : "")} key={b.n} onClick={() => tgl(b.n)}>
                      <span className="cbox">{sel.includes(b.n) && <Chk />}</span>
                      <Ini n={b.n} />
                      <div style={{ minWidth: 0 }}>
                        <h4>{b.name}</h4>
                        <p>{b.note} · ответил {b.resp}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div className="num" style={{ fontSize: 14.5 }}>{b.price}</div>
                        <div className="lbl" style={{ marginTop: 4 }}>{b.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="row g12" style={{ marginTop: 16, flexWrap: "wrap" }}>
                  <button className="btn btn-acid" disabled={sel.length < 2} style={{ opacity: sel.length < 2 ? .45 : 1 }} onClick={() => sel.length > 1 && setCmp(true)}>Сравнить — {sel.length}</button>
                  <button className="btn btn-line" onClick={() => go("msg")}>Написать исполнителю</button>
                </div>
              </div>

              <div className="sect sect--task">
                <span className="task__flag">Задание заказчика</span>
                <h2>Что нужно сделать</h2>
                <p className="task__lead">Реконструкция существующей котельной с заменой двух котлов на 2,1 МВт, переносом ХВП и заменой щитов управления. Обмеры выполнены, техническое задание согласовано с эксплуатацией.</p>
                <div className="secgrid">
                  {SECS.map(([s, t]) => <div className="secrow" key={s}><b>{s}</b>{t}</div>)}
                </div>
              </div>

              <div className="sect">
                <h2>Файлы</h2>
                <div className="files">
                  {FILES.map(([e, n, s]) => <div className="file" key={n}><span className="ext">{e}</span><span>{n}</span><span className="lbl">{s}</span></div>)}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gap: 14 }}>
              <div className="box">
                <h3>Как идёт заявка</h3>
                <div className="track">
                  {TIMELINE.map((t, i) => (
                    <div className={"tstep " + (t.s === "done" ? "done" : t.s === "now" ? "now" : "")} key={t.t} style={{ gridTemplateColumns: "34px minmax(0,1fr)" }}>
                      <span className="bul">{t.s === "done" ? <Chk /> : i + 1}</span>
                      <div><h4>{t.t}</h4>{t.w && <p>{t.w}</p>}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {cmp && <Compare cands={BIDS.filter(b => sel.includes(b.n))} onClose={() => setCmp(false)} />}
      </div>
    );
  }

  /* ---------- профиль исполнителя ---------- */
  const WORKS = [["Котельная 6 МВт, Дзержинск", "ОВ, ТХ, ЭОМ · 2025"], ["ИТП жилого квартала, 4 корпуса", "ОВ, ВК · 2024"], ["Цех металлообработки 9 800 м²", "ТХ, ЭОМ · 2024"], ["Реконструкция ЦТП", "ТС, АР · 2023"]];
  const REVS = [
    { who: "ГК «Ресурс»", st: 5, t: "Сдали разделы ОВ и ЭОМ раньше срока, замечания экспертизы закрыли за неделю. Работаем второй проект.", w: "июль 2026" },
    { who: "АО «Волга-Инвест»", st: 4, t: "Хороший инженерный уровень. Небольшая задержка по согласованию с теплосетью, но предупредили заранее.", w: "май 2026" },
  ];

  function ProProfile({ go }) {
    const [tab, setTab] = useState("Обзор");
    return (
      <div className="scroll">
        <div className="wrap page">
          <button className="back" onClick={() => go("pick")}><Back /> Все исполнители</button>
          <div className="phead">
            <Ini n="ТС" size={64} />
            <div>
              <span className="lbl">Проектная организация · Нижний Новгород</span>
              <h1 style={{ fontFamily: "var(--fd)", fontWeight: 500, fontSize: 30, letterSpacing: "-.04em", margin: "8px 0 10px" }}>ООО «Техносфера»</h1>
              <div className="rcard__meta">
                {["ОВ", "ВК", "ЭОМ", "ТХ"].map(s => <span className="tag" key={s}>{s}</span>)}
                <span className="tag solid">14 лет на рынке</span>
              </div>
            </div>
            <div style={{ display: "grid", gap: 10, justifyItems: "end" }}>
              <span className="trust" style={{ height: 30, fontSize: 13 }}><span className="dot" style={{ background: "var(--moss)" }} />Проверенная организация</span>
              <div className="row g8">
                <button className="btn btn-line btn-sm" onClick={() => go("msg")}>Написать</button>
                <button className="btn btn-ink btn-sm">Пригласить в заявку <Arr s={13} /></button>
              </div>
            </div>
          </div>

          <div className="tabs2">
            {["Обзор", "Проекты", "Отзывы", "Документы"].map(t => <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>{t}</button>)}
          </div>

          {tab === "Обзор" && (
            <div className="two">
              <div>
                <div className="sect">
                  <h2>О компании</h2>
                  <p className="mut" style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6 }}>Инженерные разделы для промышленных и коммунальных объектов: котельные до 20 МВт, ИТП, ЦТП, технологические цеха. В штате 34 специалиста, есть собственный отдел согласований. Работаем по стадиям П и Р, ведём проект до положительного заключения.</p>
                </div>
                <div className="sect">
                  <h2>Как работают</h2>
                  <div className="box">
                    {[["Отвечают на заявки", "в среднем через 2 часа"], ["Сдают в срок", "99 из 100 проектов"], ["Проходят экспертизу", "с 1,3 итерации в среднем"], ["Ведут переписку", "в платформе, без почты"]].map(([a, b]) => (
                      <div className="set-row" key={a}><div><h4>{a}</h4><p>{b}</p></div></div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: "grid", gap: 14 }}>
                <div className="box" style={{ display: "grid", gap: 12 }}>
                  <span className="lbl">Подтверждено платформой</span>
                  {["Организация и ЕГРЮЛ", "Членство в СРО (НОПРИЗ)", "Страхование на 30 млн ₽", "62 сделки в платформе", "28 отзывов заказчиков"].map(v => (
                    <span className="vchk" key={v}><i><Chk /></i>{v}</span>
                  ))}
                </div>
                <div className="box" style={{ display: "grid", gap: 8 }}>
                  <span className="lbl">Средний чек</span>
                  <b className="num" style={{ fontFamily: "var(--fd)", fontSize: 30, letterSpacing: "-.04em" }}>1,1 млн ₽</b>
                  <p>По разделам ОВ и ЭОМ для промышленных объектов.</p>
                </div>
              </div>
            </div>
          )}

          {tab === "Проекты" && (
            <div className="pgal">
              {WORKS.map(([t, s]) => (
                <figure key={t}><div className="ph"><span className="lbl">фото объекта</span></div><figcaption><b>{t}</b><span className="mut">{s}</span></figcaption></figure>
              ))}
            </div>
          )}

          {tab === "Отзывы" && (
            <div style={{ maxWidth: 720 }}>
              {REVS.map(r => (
                <div className="rev" key={r.who}>
                  <div className="row g12"><b style={{ fontSize: 14.5, fontWeight: 500 }}>{r.who}</b><span className="stars">{[1, 2, 3, 4, 5].map(i => <i key={i} className={i <= r.st ? "" : "off"} />)}</span><span className="spacer" /><span className="lbl">{r.w}</span></div>
                  <p className="mut" style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>{r.t}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "Документы" && (
            <div className="files" style={{ maxWidth: 640 }}>
              {[["PDF", "Выписка из реестра СРО", "проверено 04.08.2026"], ["PDF", "Полис страхования ответственности", "до 04.2027"], ["PDF", "Выписка ЕГРЮЛ", "проверено 04.08.2026"]].map(([e, n, s]) => (
                <div className="file" key={n}><span className="ext">{e}</span><span>{n}</span><span className="badge ok">{s}</span></div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  Object.assign(window, { OrderDetail, ProProfile, Compare });
})();
