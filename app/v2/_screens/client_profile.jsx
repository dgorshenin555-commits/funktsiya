"use client";

/* Экран варианта Б. Источник: design-handoff-v2/client_profile.jsx
   Первоначально импортирован скриптом tools/transform_jsx.py, но это был
   разовый перенос: дальше экран дописывается прямо здесь. Повторно
   генератор не гоняем — он вернёт файл к состоянию выгрузки. */
import * as React from "react";
import { SCREENS } from "./registry";
const { useState } = React;

const plural = (n, one, few, many) => {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
  return many;
};
const Arr = ({ s = 14 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>);

const KINDS = ["Организация", "Частное лицо"];

const CFG = {
  "Организация": {
    name: "ООО «Северный дом»",
    role: "Застройщик · Москва · ИНН 7712345678",
    warn: "организация не подтверждена",
    ini: "СД",
    logo: "Логотип",
    about: "Строим жилые кварталы и социальные объекты в Москве и области. Работаем по ПП №87, заказываем полный комплект ПД и РД, сопровождение экспертизы берём отдельно. В работе одновременно 2–3 объекта.",
    chips: ["На платформе с августа 2026", "2 объекта в работе", "Оплата по этапам", "Договор подряда"],
    idFields: [["Полное наименование", "ООО «Северный дом»"], ["ИНН / КПП", "7712345678 / 771201001"], ["Юридический адрес", "Москва, Ленинградский пр-т, 39"], ["Подписант", "Мельников И. А., директор"]],
    pay: [["Способ оплаты", "по этапам, резерв"], ["Плательщик", "с расчётного счёта"], ["Документы", "договор, акты, счёт"], ["НДС", "не облагается, УСН"]],
    objs: 3,
  },
  "Частное лицо": {
    name: "Мельников Игорь Петрович",
    role: "Частный заказчик · Москва и Московская область",
    warn: "личность не подтверждена",
    ini: "МИ",
    logo: "Фото",
    about: "Строю дом для себя, 320 м², участок в Истринском районе. Нужен полный комплект рабочей документации и авторский надзор. В стройке не специалист, поэтому важны понятные объяснения и фиксированная смета.",
    chips: ["Частный дом 320 м²", "Оплата картой или переводом", "Первый проект", "Нужен авторский надзор"],
    idFields: [["ФИО", "Мельников Игорь Петрович"], ["Телефон", "+7 916 ··· 08 24"], ["Объект", "жилой дом, Истринский р-н, МО"], ["Права на участок", "выписка ЕГРН не приложена"]],
    pay: [["Способ оплаты", "картой, по этапам"], ["Плательщик", "физическое лицо"], ["Документы", "договор, акт, чек"], ["Возврат", "резерв возвращается при отказе"]],
    objs: 1,
  },
};

const NEEDS = [
  ["Типы объектов", ["Жилые", "Общественные", "Промышленные", "Линейные", "Реконструкция", "ИЖС"], ["Жилые", "Общественные", "Реконструкция"]],
  ["Стадии", ["Обследование", "Проектная документация", "Рабочая документация", "Экспертиза", "Авторский надзор"], ["Проектная документация", "Рабочая документация", "Экспертиза"]],
  ["Регионы", ["Москва", "Московская обл.", "ЦФО", "Приволжский ФО", "Северо-Запад"], ["Москва", "Московская обл."]],
];

const RANK = [
  ["Оплата этапов в срок", 30, 0, "нет закрытых этапов"],
  ["Приёмка без затягивания", 25, 0, "нет принятых разделов"],
  ["Оценки исполнителей", 20, 0, "нет отзывов"],
  ["Полнота задания на заявку", 15, 7, "состав и исходные данные заполнены"],
  ["Ответы на отклики", 10, 3, "отвечает за 6 часов"],
];

const CRIT = [["Оплата", "деньги пришли в срок"], ["Задание", "полнота и внятность ТЗ"], ["Приёмка", "сроки согласования"], ["Связь", "ответы и решения"]];

const OBJS = [
  ["ЖК «Парк Резиденс»", "Москва · ПД · заявка опубликована", "в работе", "cp-o1"],
  ["Школа на 550 мест", "Калуга · П · подбор исполнителя", "в работе", "cp-o2"],
  ["Квартал «Северный»", "МО · РД · сдан 2025", "завершён", "cp-o3"],
  ["Логистический центр", "МО · П · согласование", "в работе", "cp-o4"],
];
const OBJS_P = [["Жилой дом 320 м²", "Истринский р-н, МО · РД · подбор исполнителя", "в работе", "cp-p1"]];

/* События заказчика: что происходит с его заявкой и деньгами. */
const NOTIFY = [
  ["Новый отклик на заявку", "как только исполнитель предложил цену и срок", true, true],
  ["Исполнитель готов начать", "подтверждение состава и старта этапа", true, true],
  ["Этап сдан на приёмку", "у вас 5 рабочих дней на согласование", true, true],
  ["Срок приёмки истекает", "напоминание за сутки, чтобы этап не закрылся сам", true, false],
  ["Оплата и документы", "счёт, акт, чек по этапу", false, true],
  ["Замечания экспертизы", "если по вашему объекту пришли замечания", false, true],
];

const NAV = [["reqs", "Мои заявки"], ["resp", "Отклики"], ["pros", "Исполнители"], ["prof", "Профиль"]];

function ClientProfile({ go, onBack }) {
  const [kind, setKind] = useState("Организация");
  const cfg = CFG[kind];
  const fiz = kind === "Частное лицо";
  const [needs, setNeeds] = useState(NEEDS.map(n => n[2]));
  const [rkOpen, setRkOpen] = useState(false);

  const score = RANK.reduce((s, r) => s + r[2], 0);
  const tn = (gi, s) => setNeeds(v => v.map((g, j) => (j === gi ? (g.includes(s) ? g.filter(x => x !== s) : g.concat(s)) : g)));
  const objs = fiz ? OBJS_P : OBJS.slice(0, cfg.objs);

  return (
    <div className="nd ph pp cp">
      <header className="topbar">
        <div className="topbar__l">
          <span className="logo" onClick={() => go && go("home")} style={{ cursor: go ? "pointer" : "default" }}>Функция</span>
          <span className="ph__badge cp__badge">заказчикам</span>
        </div>
        <nav className="nav">
          {NAV.map(([k, l]) => <button key={k} className={k === "prof" ? "on" : ""}>{l}</button>)}
        </nav>
        <div className="topbar__r">
          <span className="lbl">+7 916 ··· 08 24</span>
          {onBack
            ? <button className="btn btn-line btn-sm btn--back" onClick={onBack}>В рабочую область</button>
            : <button className="btn btn-line btn-sm">Сайт для исполнителей</button>}
        </div>
      </header>

      <div className="scroll">
        <div className="wrap">
          {/* переключатель вида заказчика — он же задаёт весь состав профиля */}
          <div className="cp__kind">
            <span className="lbl">Вы заказываете как</span>
            <div className="cp__ks">
              {KINDS.map(k => <button key={k} className={kind === k ? "on" : ""} onClick={() => setKind(k)}>{k}</button>)}
            </div>
            <span className="cp__kn">Форма одна, проверяют разное: у организации — ЕГРЮЛ и подписанта, у частного лица — личность и права на объект.</span>
          </div>

          <div className="pp__grid">
            <div className="pp__main">
              {/* визитка: у физлица круглое фото, у организаций — плашка логотипа */}
              <section className="pp__card pp__id">
                <div className={"pp__ava" + (fiz ? "" : " cp__ava")}><image-slot id={fiz ? "cp-face" : "cp-logo"} shape={fiz ? "circle" : "rounded"} radius="18" placeholder={cfg.logo}></image-slot></div>
                <div className="pp__idb">
                  <div className="pp__idt">
                    <h2>{cfg.name}</h2>
                    <span className="tag tag--warn"><span className="dot" style={{ background: "#DC5A2A" }} />{cfg.warn}</span>
                  </div>
                  <span className="pp__idr">{cfg.role}</span>
                  <p className="pp__about">{cfg.about}</p>
                  <div className="cp__id2">
                    {cfg.idFields.map(([k, v]) => <div key={k}><span className="lbl">{k}</span><b>{v}</b></div>)}
                  </div>
                  <div className="pp__chips">
                    {cfg.chips.map(x => <span key={x} className="tag">{x}</span>)}
                  </div>
                </div>
              </section>

              <section className="pp__card">
                <div className="pp__h">
                  <div><span className="lbl">Основа подбора</span><h3>Что и где проектируем</h3></div>
                  <span className="pp__n">подходящих исполнителей: <b className="num">{fiz ? 96 : 214}</b></span>
                </div>
                <p className="pp__note" style={{ marginTop: 0 }}>По этим отметкам платформа предлагает исполнителей и рассылает заявку тем, у кого совпадает профиль. Чем точнее — тем меньше нерелевантных откликов.</p>
                {NEEDS.map(([g, all], gi) => (
                  <div key={g} className="pp__sg">
                    <span className="pp__sgt">{g}</span>
                    <div className="pp__sl">
                      {all.map(s => (
                        <button key={s} className={"psec" + (needs[gi].includes(s) ? " on" : "")} onClick={() => tn(gi, s)}>{s}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </section>

              <SCREENS.NotifyBlock events={NOTIFY} note="Новые исполнители по вашим разделам, изменения в нормативах и обновления платформы." />

              <section className="pp__card">
                <div className="pp__h">
                  <div><span className="lbl">{fiz ? "Мой объект" : "Портфель"}</span><h3>{fiz ? "Объект" : "Объекты"}</h3></div>
                  <button className="btn btn-ink btn-sm">Добавить объект <Arr s={13} /></button>
                </div>
                <div className="pp__port">
                  {objs.map(([t, s, st, id]) => (
                    <div key={id} className="pport">
                      <div className="pport__i"><image-slot id={id} shape="rounded" radius="14" placeholder="Фото или визуализация"></image-slot></div>
                      <div className="cp__pt"><b>{t}</b><span className={"cp__st cp__st--" + (st === "в работе" ? "go" : "done")}>{st}</span></div>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
                <p className="pp__note">{fiz ? "Фото участка и границы помогают исполнителю оценить объём выезда и обмеров ещё до отклика." : "Объекты видны исполнителям в вашей карточке — по ним понятно масштаб и то, что вы работаете постоянно, а не разово."}</p>
              </section>

              <section className="pp__card">
                <div className="pp__h">
                  <div><span className="lbl">Отзывы исполнителей</span><h3>Пока ни одного отзыва</h3></div>
                  <span className="pp__n"><b className="num">0</b> {plural(0, "отзыв", "отзыва", "отзывов")} · <b className="num">0</b> {plural(0, "этап", "этапа", "этапов")}</span>
                </div>
                <p className="pp__note" style={{ marginTop: 0 }}>Исполнитель оценивает заказчика после приёмки этапа — по тем же правилам: удалить или купить отзыв нельзя, ответить можно один раз. Эти оценки видят все, кто решает, откликаться на вашу заявку.</p>
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
              </section>
            </div>

            <aside className="pp__side">
              <section className="pp__card pp__prev">
                <span className="lbl">Как вас видит исполнитель</span>
                <div className="pprev">
                  <div className="pprev__t">
                    <span className="pprev__a cp__ini">{cfg.ini}</span>
                    <div>
                      <b>{fiz ? "Игорь М." : cfg.name}</b>
                      <span>{fiz ? "Частный заказчик · Москва" : kind + " · Москва"}</span>
                    </div>
                  </div>
                  <div className="pprev__s">
                    {needs[1].slice(0, 3).map(s => <span key={s} className="psec on">{s === "Проектная документация" ? "ПД" : s === "Рабочая документация" ? "РД" : s}</span>)}
                  </div>
                  <div className="pprev__f">
                    <div><span className="lbl">{fiz ? "Объект" : "Объектов"}</span><b className="num">{objs.length}</b></div>
                    <div><span className="lbl">Ответ</span><b className="num">6 ч</b></div>
                  </div>
                  <span className="pprev__w">{fiz ? "без подтверждённой личности — меньше откликов" : "без подтверждённой организации — меньше откликов"}</span>
                </div>
              </section>

              <section className="pp__card pp__stat">
                <span className="lbl">За 30 дней</span>
                <div className="pp__sts">
                  {[["Заявок опубликовано", "1"], ["Получено откликов", "4"], ["Этапов в работе", "0"], ["Оплачено", "—"]].map(([k, v]) => (
                    <div key={k}><span>{k}</span><b className="num">{v}</b></div>
                  ))}
                </div>
                <span className="pp__note">Полные цифры появятся после первого открытого этапа.</span>
              </section>

              <section className={"pp__card pp__rk" + (rkOpen ? " open" : "")}>
                <button className="prk__head" onClick={() => setRkOpen(v => !v)}>
                  <span className="prk__hl">
                    <span className="lbl">Надёжность заказчика</span>
                    <span className="prk__v"><b className="num">{score}</b><i>из 100</i></span>
                    <span className="prk__lv">уровень «Новый»</span>
                  </span>
                  <span className="prk__x">{rkOpen ? "свернуть" : "подробнее"}<Arr s={12} /></span>
                </button>
                <div className="prk__bar"><i style={{ width: score + "%" }} /></div>
                <div className="prk__pos">
                  <span>Отклик на заявку</span>
                  <b className="num">4 <i>из {fiz ? 7 : 12} в среднем</i></b>
                </div>
                {rkOpen && (
                  <div className="prk__body">
                    <div className="prk__lad">
                      {[["Новый", 0], ["Надёжный", 45], ["Постоянный", 70], ["Эталон", 90]].map(([l, v]) => (
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
                      <span className="lbl">{fiz ? "После подтверждения личности" : "После подтверждения организации"}</span>
                      <b className="num">≈ {fiz ? 6 : 9} <i>откликов на заявку</i></b>
                      <span>средние значения по проверенным заказчикам в вашем регионе</span>
                    </div>
                    <p className="prk__n">Показатель растёт после каждой оплаты этапа в срок. Затянутая приёмка и отмена заявки после выбора исполнителя снимают до 15 баллов.</p>
                  </div>
                )}
              </section>

              <section className="pp__card pp__set">
                <span className="lbl">Оплата и документы</span>
                {cfg.pay.map(([k, v]) => (
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

Object.assign(SCREENS, { ClientProfile });
