// @ts-nocheck
'use client';

/* Раздел «Доверие» — верификация (онбординг-флоу) + Индекс доверия.
   Перенос TrustCenter из Cloud Design «Функция (9)». Данные демонстрационные
   (mock) — на бою заводятся на реальные модели профиля/сделок. Дизайн под .fx. */

import React from 'react';
import { Icon } from '../../_orders/icons';
import '../../_orders/orders.css';

/* ---------------- Верификация ---------------- */
const STEPS = [
  {
    key: 'identity', st: 'done', icon: 'user',
    name: 'Личность и организация',
    sub: 'KYC · ЕГРЮЛ · ИНН',
    title: 'Личность и организация',
    lead: 'Подтверждаем, что за профилем стоит реальное лицо или компания. Проверка занимает несколько минут через Госключ и открытые реестры.',
    reqs: [
      ['ok', 'Подтверждение личности (Госключ)', 'Пройдено 14.03.2025'],
      ['ok', 'Выписка ЕГРЮЛ / ЕГРИП', 'ООО «ПроектБюро», ИНН 7728116152 — сверено'],
      ['ok', 'Контактный телефон и e-mail', 'Подтверждены по коду'],
    ],
    note: ['Данные сверяются автоматически с ФНС и Госуслугами.', ' Ручная загрузка сканов не требуется.'],
    foot: 'Проверено платформой · 14.03.2025',
  },
  {
    key: 'docs', st: 'done', icon: 'cert',
    name: 'Документы и допуски',
    sub: 'СРО · НРС · лицензии · страхование',
    title: 'Документы и профессиональные допуски',
    lead: 'Членство в СРО и записи НРС сверяются с реестрами НОПРИЗ и НОСТРОЙ. Полисы и лицензии — по номеру и сроку действия.',
    reqs: [
      ['ok', 'Членство в СРО', 'СРО НБПИ-04-032 · подтверждено в реестре НОПРИЗ'],
      ['ok', 'Специалист НРС (ГИП)', '№ П-145122 · действует'],
      ['ok', 'Страхование ответственности', 'Полис 24/0915 · до 31.12.2026'],
      ['ok', 'Лицензии по видам работ', '3 из 3 сверены'],
    ],
    note: ['Каждый документ переопрашивается в реестре раз в 30 дней.', ' Истекающие допуски подсвечиваются заранее.'],
    foot: 'Все допуски активны · следующая сверка 12.04.2025',
  },
  {
    key: 'skills', st: 'review', icon: 'layers',
    name: 'Компетенции по разделам',
    sub: 'Аттестация · тестирование',
    title: 'Профессиональные компетенции',
    lead: 'Заявленные разделы проектной документации подтверждаются аттестацией: короткий тест на знание норм + разбор реального узла с экспертом платформы.',
    reqs: [
      ['ok', 'Раздел АР — Архитектурные решения', 'Аттестация пройдена · 92/100'],
      ['ok', 'Раздел КР — Конструктивные решения', 'Аттестация пройдена · 88/100'],
      ['wait', 'Раздел ГП — Генеральный план', 'Тест сдан, ждём разбора эксперта'],
      ['todo', 'Раздел ПОС', 'Запишитесь на аттестацию'],
    ],
    note: ['Аттестация по разделу поднимает вес фактора «Качество» в вашем индексе и открывает заявки с требованием подтверждённой компетенции.'],
    foot: 'На проверке эксперта · обычно до 2 рабочих дней',
  },
  {
    key: 'portfolio', st: 'action', icon: 'portfolio',
    name: 'Портфолио',
    sub: 'Подтверждённые проекты',
    title: 'Портфолио и подтверждённые проекты',
    lead: 'Проекты со сделок внутри Функции подтверждаются автоматически. Внешние работы можно подтвердить справкой заказчика или ссылкой на объект в ГИСОГД.',
    reqs: [
      ['ok', 'ЖК «Северный парк» — АР, КР', 'Сделка на платформе · подтверждён'],
      ['ok', 'МФК «Старый город» — АР', 'Сделка на платформе · подтверждён'],
      ['todo', 'БЦ «Приморский» — КР', 'Внешний проект — приложите справку заказчика'],
      ['todo', 'Добавьте ещё 1 проект', 'Для перехода на уровень «Надёжный»'],
    ],
    note: ['Подтверждённое портфолио видно заказчику отдельно от заявленного —', ' это главный фактор доверия при первом контакте.'],
    foot: 'Требуется действие · 2 проекта ждут подтверждения',
  },
  {
    key: 'deals', st: 'auto', icon: 'shield',
    name: 'История сделок',
    sub: 'Начисляется автоматически',
    title: 'История и надёжность сделок',
    lead: 'Копится сама по мере работы через безопасную сделку: соблюдение сроков, снятые замечания экспертизы, отсутствие срывов. Накрутить нельзя — учитываются только закрытые этапы.',
    reqs: [
      ['ok', 'Закрытых сделок через эскроу', '12 · без единого спора'],
      ['ok', 'Сдач в срок или раньше', '11 из 12 (92%)'],
      ['ok', 'Замечаний экспертизы снято с 1-й итерации', 'в 9 из 12 проектов'],
    ],
    note: ['Этот раздел нельзя пройти вручную — он растёт вместе с вашей историей на платформе. Первые сделки весят больше для новичков.'],
    foot: 'Обновляется автоматически после каждой закрытой сделки',
  },
  {
    key: 'reviews', st: 'auto', icon: 'star',
    name: 'Отзывы заказчиков',
    sub: 'Только по закрытым сделкам',
    title: 'Отзывы и оценки заказчиков',
    lead: 'Оставить отзыв может только заказчик, оплативший работу через платформу. Один отзыв на одну закрытую сделку — фейковые и заказные отзывы исключены.',
    reqs: [
      ['ok', 'Отзывов по закрытым сделкам', '76 · средняя 4.6 из 5'],
      ['ok', 'Развёрнутых оценок по критериям', 'сроки, качество, коммуникация'],
      ['ok', 'Спорных отзывов на модерации', 'нет'],
    ],
    note: ['Оценка привязана к конкретной сделке и разделу, поэтому её видно в контексте: за что именно поставили балл.'],
    foot: 'Обновляется автоматически · последний отзыв 3 дня назад',
  },
];

const ST_LABEL = {
  done:   ['t-done', 'Проверено'],
  review: ['t-review', 'На проверке'],
  action: ['t-action', 'Требует действия'],
  auto:   ['t-auto', 'Авто'],
};

function Ring({ pct, size = 64, sw = 7 }) {
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={sw} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--accent)" strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} style={{ transition: 'stroke-dashoffset .8s cubic-bezier(.22,1,.36,1)' }} />
    </svg>
  );
}

function Verify() {
  const [active, setActive] = React.useState('skills');
  const [uploads, setUploads] = React.useState({});
  const onUpload = (key, e) => {
    const f = (e.target.files || [])[0];
    if (f) setUploads((p) => ({ ...p, [key]: f.name }));
    e.target.value = '';
  };
  const step = STEPS.find((s) => s.key === active) || STEPS[0];
  const total = STEPS.length;
  const pct = Math.round((4 / total) * 100);

  return (
    <div className="tr-verify">
      {/* left: progress + stepper */}
      <div>
        <div className="card tr-prog">
          <div className="tr-prog__top">
            <div className="tr-prog__ring" style={{ position: 'relative' }}>
              <Ring pct={pct} size={68} sw={7} />
              <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 14, fontWeight: 800, color: '#fff', whiteSpace: 'nowrap' }}>{pct}%</div>
            </div>
            <div className="tr-prog__meta">
              <b>Профиль верифицирован</b>
              <span>4 из 6 разделов пройдены</span>
            </div>
          </div>
          <div className="tr-prog__bar"><span className="tr-prog__fill" style={{ width: pct + '%' }} /></div>
          <div className="tr-prog__legend"><span>Уровень «Проверенный»</span><span>дальше — «Надёжный»</span></div>
        </div>

        <div className="tr-steps">
          {STEPS.map((s) => {
            const [cls, lbl] = ST_LABEL[s.st];
            return (
              <button key={s.key} className={'tr-step s-' + s.st + (active === s.key ? ' is-active' : '')} onClick={() => setActive(s.key)}>
                <span className="tr-step__ic"><Icon name={s.icon} /></span>
                <span className="tr-step__b"><b>{s.name}</b><span>{s.sub}</span></span>
                <span className={'tr-tag ' + cls} style={{ padding: '4px 9px' }}><i />{lbl}</span>
                <Icon name="chevR" size={16} className="tr-step__go" />
              </button>
            );
          })}
        </div>
      </div>

      {/* right: detail */}
      <div className="card tr-panel">
        <div className="tr-panel__head">
          <div className="tr-panel__ic"><Icon name={step.icon} size={26} /></div>
          <div className="tr-panel__ttl">
            <h2>{step.title}</h2>
            <p>{step.lead}</p>
          </div>
          <span className={'tr-tag ' + ST_LABEL[step.st][0]}><i />{ST_LABEL[step.st][1]}</span>
        </div>
        <div className="tr-panel__body">
          <p className="tr-overline">Что проверяется</p>
          {step.reqs.map((r, i) => {
            const [state0, name, sub] = r;
            const ukey = step.key + '-' + i;
            const uploaded = uploads[ukey];
            const state = state0 === 'todo' && uploaded ? 'wait' : state0;
            const ric = state === 'ok' ? 'check' : state === 'wait' ? 'clock' : 'plus';
            return (
              <div key={i} className={'tr-req r-' + state}>
                <span className="tr-req__ic"><Icon name={ric} size={15} /></span>
                <span className="tr-req__b"><b>{name}</b><span>{uploaded ? ('Загружено: ' + uploaded + ' · на проверке') : sub}</span></span>
                {state0 === 'todo' && !uploaded && (
                  <label className="btn btn-outline btn-sm tr-req__act" style={{ cursor: 'pointer' }}>
                    <input type="file" hidden onChange={(e) => onUpload(ukey, e)} />
                    <Icon name="download" size={14} style={{ transform: 'rotate(180deg)' }} />Загрузить
                  </label>
                )}
                {state === 'wait' && <span className="tr-req__act dim" style={{ fontSize: 12 }}>ожидание</span>}
              </div>
            );
          })}
          <div className="tr-note">
            <Icon name={step.st === 'auto' ? 'shield' : 'bulb'} />
            <p>{step.note.map((t, i) => (i % 2 ? <b key={i}>{t}</b> : t))}</p>
          </div>
        </div>
        <div className="tr-panel__foot">
          <span className="dim row gap6" style={{ display: 'inline-flex', alignItems: 'center' }}><Icon name="clock" size={14} />{step.foot}</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            {step.st === 'action' && (
              <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
                <input type="file" hidden multiple onChange={(e) => { const f = (e.target.files || [])[0]; if (f) setUploads((p) => ({ ...p, [step.key + '-2']: f.name })); e.target.value = ''; }} />
                <Icon name="paperclip" size={15} />Загрузить справку
              </label>
            )}
            {step.st === 'review' && <button className="btn btn-ghost"><Icon name="calendar" size={15} />Запись на аттестацию</button>}
            {step.st === 'done' && <button className="btn btn-ghost"><Icon name="eye" size={15} />Как это видит заказчик</button>}
            {step.st === 'auto' && <button className="btn btn-ghost"><Icon name="chart" size={15} />История начислений</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Индекс доверия ---------------- */
const FACTORS = [
  { icon: 'layers',  nm: 'Качество документации', sub: 'Снятые замечания экспертизы, чистота BIM-модели', val: 92, wt: 30, color: 'var(--green)' },
  { icon: 'clock',   nm: 'Соблюдение сроков',      sub: 'Сдачи в срок и раньше по закрытым сделкам',       val: 84, wt: 25, color: 'var(--accent-2)' },
  { icon: 'shield',  nm: 'Надёжность сделок',      sub: 'Закрытые эскроу-сделки без споров и срывов',        val: 96, wt: 20, color: 'var(--green)' },
  { icon: 'comment', nm: 'Коммуникация',           sub: 'Скорость ответа и оценки заказчиков за общение',    val: 88, wt: 15, color: 'var(--accent-2)' },
  { icon: 'cert',    nm: 'Верификация и допуски',  sub: 'Личность, СРО, НРС, страхование, аттестация',       val: 100, wt: 10, color: 'var(--green)' },
];
const INDEX = Math.round(FACTORS.reduce((a, f) => a + f.val * f.wt, 0) / 100);

const SIGNALS = [
  { g: 'pos',  ic: 'checkCircle', t: 'Снято 12 из 12 замечаний экспертизы с первой итерации', d: 'ЖК «Ренессанс» · раздел КР · 5 дней назад', vf: true },
  { g: 'pos',  ic: 'clock',       t: 'Стадия «П» сдана на 4 дня раньше срока', d: 'МФК «Старый город» · 2 недели назад', vf: true },
  { g: 'pos',  ic: 'shield',      t: 'Сделка закрыта через безопасную сделку без спора', d: 'Эскроу · 2.4 млн ₽ · 2 недели назад', vf: true },
  { g: 'neu',  ic: 'star',        t: 'Новый отзыв заказчика — 5.0', d: '«На связи постоянно, документация по ГОСТ» · 3 дня назад', vf: true },
  { g: 'warn', ic: 'alert',       t: '1 сдача с задержкой на 2 дня', d: 'БЦ «Приморский» · учтено в факторе «Сроки»', vf: true },
];

const LADDER = [
  { n: '1', nm: 'Базовый', sub: 'Профиль и контакты подтверждены', state: 'passed' },
  { n: '2', nm: 'Проверенный', sub: 'Личность, допуски и 3+ сделки', state: 'passed' },
  { n: '3', nm: 'Надёжный', sub: 'Индекс ≥ 85 и 10+ закрытых сделок', state: 'current' },
  { n: '4', nm: 'Эталон', sub: 'Индекс ≥ 92 и 25+ сделок без споров', state: 'locked' },
];

function TrustIndex() {
  const size = 148, sw = 11, r = (size - sw) / 2, c = 2 * Math.PI * r;
  return (
    <div>
      {/* hero */}
      <div className="card tr-score" style={{ marginBottom: 22 }}>
        <div className="tr-gaugewrap">
          <svg width={size} height={size} className="tr-gauge" style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <linearGradient id="trgrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="var(--accent-2)" />
                <stop offset="1" stopColor="var(--accent)" />
              </linearGradient>
            </defs>
            <circle className="tr-gauge__track" cx={size / 2} cy={size / 2} r={r} />
            <circle className="tr-gauge__val" cx={size / 2} cy={size / 2} r={r} strokeDasharray={c} strokeDashoffset={c * (1 - INDEX / 100)} />
          </svg>
          <div className="tr-gauge__center">
            <span className="tr-gauge__num">{INDEX}</span>
            <span className="tr-gauge__of">из 100</span>
          </div>
        </div>
        <div className="tr-score__b">
          <span className="tr-score__badge"><Icon name="checkCircle" />Проверенный профиль</span>
          <h2 className="tr-score__h">Индекс доверия — «Надёжный»</h2>
          <p className="tr-score__p">Составная оценка из пяти факторов по закрытым сделкам на платформе. Считается только по подтверждённым событиям — накрутить нельзя.</p>
          <div className="tr-score__stats">
            <div className="tr-score__stat"><b>12</b><span>сделок через эскроу</span></div>
            <div className="tr-score__stat"><b>92%</b><span>сдач в срок</span></div>
            <div className="tr-score__stat"><b>4.6</b><span>средняя оценка</span></div>
            <div className="tr-score__stat"><b>76</b><span>отзывов</span></div>
          </div>
        </div>
      </div>

      <div className="tr-index">
        {/* left column: factors + how */}
        <div className="col gap20">
          <div className="card">
            <div className="row between" style={{ marginBottom: 6 }}>
              <h3 className="section-title">Из чего складывается</h3>
              <span className="dim" style={{ fontSize: 12.5 }}>вес фактора в скобках</span>
            </div>
            <div>
              {FACTORS.map((f) => (
                <div key={f.nm} className="tr-factor">
                  <div className="tr-factor__top">
                    <span className="tr-factor__ic"><Icon name={f.icon} /></span>
                    <span className="tr-factor__nm"><b>{f.nm}</b><span>{f.sub}</span></span>
                    <span className="tr-factor__wt">{f.wt}%</span>
                    <span className="tr-factor__val">{f.val}<small>/100</small></span>
                  </div>
                  <span className="tr-factor__track"><span className="tr-factor__fill" style={{ width: f.val + '%', background: f.color }} /></span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="section-title" style={{ marginBottom: 6 }}>Как считается индекс</h3>
            <p className="muted" style={{ margin: '0 0 16px', fontSize: 13.5, lineHeight: 1.55 }}>Средневзвешенное по факторам. Прозрачно и одинаково для всех — заказчик видит ту же формулу.</p>
            <div className="tr-how">
              {FACTORS.map((f, i) => (
                <React.Fragment key={f.nm}>
                  {i > 0 && <span className="tr-how__op">+</span>}
                  <span className="tr-how__chip"><b>{f.val}</b>×<em>{f.wt}%</em></span>
                </React.Fragment>
              ))}
              <span className="tr-how__op">=</span>
              <span className="tr-how__chip" style={{ borderColor: 'var(--accent-line)', background: 'var(--accent-soft)' }}><em style={{ fontSize: 14 }}>{INDEX}</em></span>
            </div>
          </div>

          <div className="card">
            <div className="row between" style={{ marginBottom: 14 }}>
              <h3 className="section-title">Подтверждённые события</h3>
              <span className="tr-tag t-done"><i />все проверены</span>
            </div>
            <div>
              {SIGNALS.map((s, i) => (
                <div key={i} className={'tr-signal g-' + s.g}>
                  <span className="tr-signal__ic"><Icon name={s.ic} /></span>
                  <span className="tr-signal__b">
                    <b>{s.t}</b>
                    <span>{s.d}</span>
                    {s.vf && <span className="tr-signal__vf"><Icon name="shield" />Подтверждено платформой</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* right column: ladder + what changes */}
        <div className="col gap20">
          <div className="card">
            <h3 className="section-title" style={{ marginBottom: 4 }}>Уровни доверия</h3>
            <p className="muted" style={{ margin: '0 0 12px', fontSize: 13 }}>Уровень открывает доступ к более крупным заявкам.</p>
            <div className="tr-ladder">
              {LADDER.map((l) => (
                <div key={l.n} className={'tr-rung is-' + l.state}>
                  <span className="tr-rung__dot">{l.state === 'passed' ? <Icon name="check" size={15} /> : l.n}</span>
                  <span className="tr-rung__b"><b>{l.nm}</b><span>{l.sub}</span></span>
                  {l.state === 'current' && <span className="tr-rung__now">вы здесь</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ background: 'var(--surface-2)' }}>
            <div className="row gap12" style={{ marginBottom: 12 }}>
              <span style={{ width: 38, height: 38, borderRadius: 10, display: 'grid', placeItems: 'center', background: 'var(--accent-soft)', color: 'var(--accent-2)', flex: 'none' }}><Icon name="trendUp" size={19} /></span>
              <b style={{ fontSize: 14.5, color: '#fff' }}>До уровня «Эталон»</b>
            </div>
            <div className="col gap10">
              {[['Закрыть ещё 13 сделок через эскроу', '12 из 25'], ['Поднять фактор «Сроки» до 90', 'сейчас 84'], ['Подтвердить компетенцию по ГП', 'на проверке']].map(([t, s]) => (
                <div key={t} className="row gap10" style={{ fontSize: 13.5 }}>
                  <Icon name="target" size={16} style={{ color: 'var(--accent-2)', flex: 'none' }} />
                  <span className="grow">{t}</span>
                  <span className="dim" style={{ fontSize: 12 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="section-title" style={{ fontSize: 16, marginBottom: 12 }}>Значок в каталоге</h3>
            <p className="muted" style={{ margin: '0 0 14px', fontSize: 13, lineHeight: 1.5 }}>Так профиль выглядит для заказчика при подборе исполнителя.</p>
            <div className="row gap12" style={{ padding: '13px 15px', borderRadius: 12, background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
              <div className="avatar" style={{ width: 44, height: 44, fontSize: 15 }}>ОС</div>
              <div className="grow" style={{ minWidth: 0 }}>
                <div className="row gap8" style={{ alignItems: 'center' }}>
                  <b style={{ fontSize: 14.5, color: '#fff' }}>Олег Соколов</b>
                  <span className="tbadge"><Icon name="checkCircle" size={13} />91</span>
                </div>
                <div className="dim" style={{ fontSize: 12, marginTop: 3 }}>Надёжный · 76 отзывов · 4.6</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Wrapper ---------------- */
export default function TrustPage() {
  const [tab, setTab] = React.useState('verify');
  return (
    <div className="fx animate-in">
      <div className="tr-head">
        <div>
          <p className="tr-eyebrow">Доверие</p>
          <h1 className="tr-title">Верификация и репутация</h1>
          <p className="tr-lead">Прозрачная система доверия: сначала подтверждаем, кто вы и что умеете, затем репутация растёт сама — по закрытым сделкам и подтверждённым событиям.</p>
        </div>
        <div className="tr-level">
          <span className="tr-level__ic"><Icon name="shield" /></span>
          <span className="tr-level__t"><small>Ваш уровень</small><b>Надёжный · индекс 91</b></span>
        </div>
      </div>

      <div className="tr-seg" style={{ marginBottom: 24 }}>
        <button className={tab === 'verify' ? 'is-on' : ''} onClick={() => setTab('verify')}><Icon name="scan" />Верификация</button>
        <button className={tab === 'index' ? 'is-on' : ''} onClick={() => setTab('index')}><Icon name="chart" />Индекс доверия</button>
      </div>

      {tab === 'verify' ? <Verify /> : <TrustIndex />}
    </div>
  );
}
