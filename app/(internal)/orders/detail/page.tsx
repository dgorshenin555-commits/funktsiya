// @ts-nocheck
'use client';

/* Карточка заявки — новый дизайн «Функция» (перенос OrderDetail из Cloud Design).
   Реальные данные: сама заявка (getOrderById) и отклики (getResponsesForOrder,
   форма addResponse для проектировщиков). Вкладки Коммуникации/Замечания/Файлы —
   демо-заглушки (нет бэкенда). Дизайн заскоуплен под .fx. */

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { Icon } from '../../../_orders/icons';
import { Avatar, StatusBadge, typeImage, typeLabel, formatDeadline, formatMoney } from '../../../_orders/shared';
import { STAGE_LABELS, SCALE_LABELS } from '@/lib/constants';
import '../../../_orders/orders.css';

const TABS = ['Описание', 'Проектировщики', 'Коммуникации', 'Замечания', 'Файлы'];

const TIMELINE_LABELS = ['Принята в работу', 'Назначены проектировщики', 'Передана на экспертизу', 'Закрыта'];
const timelineDone = (o) => o.status === 'completed' ? 4 : (o.status === 'in_progress' || o.assignedDesignerId) ? 2 : 1;

/* --- демо-данные для вкладок без бэкенда (прототип) --- */
const DEMO_MESSAGES = [
  { me: false, who: 'Бюро «Контур»', t: 'Добрый день! Изучили ТЗ, готовы взяться. Уточните: подземная автостоянка на 2 уровня?', time: '10:24' },
  { me: true, who: 'Вы', t: 'Здравствуйте! Да, два уровня, около 180 машино-мест.', time: '10:31' },
  { me: false, who: 'Бюро «Контур»', t: 'Принято. Направим коммерческое предложение с разбивкой по разделам до конца дня.', time: '10:36' },
  { me: true, who: 'Вы', t: 'Отлично, ждём. Интересует срок по стадии П.', time: '10:38' },
];
const DEMO_REMARKS = [
  { sec: 'КР', txt: 'Уточнить расчёт нагрузок на плиту перекрытия 3 этажа', tag: ['wait', 'Открыто'] },
  { sec: 'ЭОМ', txt: 'Схема электроснабжения принята без замечаний', tag: ['done', 'Принято'] },
  { sec: 'ВК', txt: 'Ответ направлен эксперту, ожидается проверка', tag: ['work', 'На проверке'] },
  { sec: 'ПБ', txt: 'Добавить расчёт эвакуационных путей секции 2', tag: ['wait', 'Открыто'] },
];
const DEMO_FILES = [
  { ic: 'file', name: 'Техническое задание.pdf', size: '1,2 МБ', date: '08.06.2026' },
  { ic: 'layers', name: 'Генплан участка.dwg', size: '4,8 МБ', date: '08.06.2026' },
  { ic: 'bim', name: 'Концепция_BIM.ifc', size: '23,1 МБ', date: '07.06.2026' },
  { ic: 'file', name: 'Исходные данные.zip', size: '12,4 МБ', date: '05.06.2026' },
];

const initials = (s) => (s || '').replace(/[^А-ЯA-Zа-яa-z]/g, '').slice(0, 2).toUpperCase() || 'ЗК';
const isValidBudget = (v) => { const n = parseInt(String(v).replace(/\D/g, ''), 10); return !!n && n > 0; };

/* ====== Сравнение откликов (Cloud Design «Функция (9)») ======
   Реальная модель отклика бедная (имя, компания, бюджет, срок), поэтому
   недостающие параметры сравнения выводятся детерминированно из id/имени —
   стабильно и правдоподобно. На бою заводятся на реальные модели профиля/сделок. */
const hashStr = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; };
const rngFrom = (seed) => { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const parseRub = (s) => Number(String(s || '').replace(/[^\d]/g, '')) || 0;
const daysUntil = (iso) => { if (!iso) return 0; const d = Math.round((new Date(iso).getTime() - Date.now()) / 86400000); return d > 0 ? d : 0; };

function cmModel(r, orderSections) {
  const rnd = rngFrom(hashStr(r.id + '|' + r.designerName));
  const pick = (min, max) => min + Math.floor(rnd() * (max - min + 1));
  const trust = 82 + pick(0, 16);
  const level = trust >= 92 ? 'Эталон' : trust >= 85 ? 'Надёжный' : 'Проверенный';
  const total = orderSections?.length || 0;
  const covCount = total ? Math.max(1, Math.round(total * (0.55 + rnd() * 0.45))) : 0;
  const codes = (orderSections || []).slice(0, covCount);
  const missCodes = (orderSections || []).slice(covCount);
  const priceNum = parseRub(r.proposedBudget);
  const termDays = daysUntil(r.proposedDeadline) || (30 + pick(0, 60));
  return {
    id: r.id, r, name: r.designerName, ini: initials(r.designerName), spec: r.designerCompany || 'Проектировщик',
    vf: true, trust, level,
    priceNum, price: r.proposedBudget || 'По договорённости',
    termDays,
    total, covCount, codes, missCodes,
    rating: (4.2 + pick(0, 8) / 10).toFixed(1), reviews: 8 + pick(0, 120),
    projects: 5 + pick(0, 60), availFree: pick(0, 10) > 3, respHours: 1 + pick(0, 11),
    escrow: pick(0, 10) > 2, bim: pick(0, 10) > 3,
  };
}

const CMP_ROWS = [
  { k: 'trust', label: 'Индекс доверия', get: (m) => m.trust, best: 'max', fmt: (m) => <span className="cmp__val">{m.trust}<small>/100</small></span> },
  { k: 'price', label: 'Стоимость', hint: 'мин — лучшее', get: (m) => m.priceNum || Infinity, best: 'min', fmt: (m) => <span className="cmp__val">{m.price}</span> },
  { k: 'term', label: 'Срок', hint: 'мин — лучшее', get: (m) => m.termDays, best: 'min', fmt: (m) => <span className="cmp__val">{m.termDays}<small> дн.</small></span> },
  { k: 'cov', label: 'Покрытие разделов', get: (m) => m.covCount, best: 'max', fmt: (m) => (
    <>
      <span className="cmp__val">{m.covCount}<small>/{m.total}</small></span>
      {(m.codes.length + m.missCodes.length) > 0 && (
        <span className="cmp__chips">
          {m.codes.map((c) => <span key={c} className="cmp__chip">{c}</span>)}
          {m.missCodes.map((c) => <span key={c} className="cmp__chip cmp__chip--miss">{c}</span>)}
        </span>
      )}
    </>
  ) },
  { k: 'rating', label: 'Отзывы', get: (m) => +m.rating, best: 'max', fmt: (m) => <><span className="cmp__val">{m.rating}<small>/5</small></span><span className="cmp__sub">{m.reviews} отзывов</span></> },
  { k: 'proj', label: 'Опыт на платформе', get: (m) => m.projects, best: 'max', fmt: (m) => <span className="cmp__val">{m.projects}<small> проектов</small></span> },
  { k: 'avail', label: 'Доступность', get: (m) => (m.availFree ? 1 : 0), best: 'max', fmt: (m) => m.availFree ? <span className="cmp__yes"><Icon name="check" size={15} />Свободен</span> : <span className="cmp__no">Занят</span> },
  { k: 'resp', label: 'Время ответа', hint: 'мин — лучшее', get: (m) => m.respHours, best: 'min', fmt: (m) => <span className="cmp__val">{m.respHours}<small> ч</small></span> },
  { k: 'escrow', label: 'Безопасная сделка', get: (m) => (m.escrow ? 1 : 0), best: 'max', fmt: (m) => m.escrow ? <span className="cmp__yes"><Icon name="check" size={15} />Да</span> : <span className="cmp__no">Нет</span> },
  { k: 'bim', label: 'BIM / ТИМ', get: (m) => (m.bim ? 1 : 0), best: 'max', fmt: (m) => m.bim ? <span className="cmp__yes"><Icon name="check" size={15} />Да</span> : <span className="cmp__no">Нет</span> },
];

function CompareOverlay({ models, onClose, onChoose, onProfile }) {
  useEffect(() => {
    const esc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [onClose]);
  const cols = `168px repeat(${models.length}, minmax(190px, 1fr))`;
  return (
    <div className="cmp" onClick={onClose}>
      <div className="cmp__panel" onClick={(e) => e.stopPropagation()}>
        <div className="cmp__head">
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2>Сравнение откликов</h2>
            <p>Выберите исполнителя по параметрам — золотом отмечено лучшее значение в строке.</p>
          </div>
          <button className="cmp__close" onClick={onClose} aria-label="Закрыть"><Icon name="x" size={18} /></button>
        </div>
        <div className="cmp__scroll">
          <div className="cmp__grid" style={{ gridTemplateColumns: cols }}>
            {/* header */}
            <div className="cmp__row">
              <div className="cmp__cell cmp__cell--lbl is-sticky-top" />
              {models.map((m) => (
                <div key={m.id} className="cmp__cell cmp__cell--head is-sticky-top">
                  <div className="cmp__cand">
                    <Avatar text={m.ini} size={40} />
                    <div style={{ minWidth: 0 }}>
                      <b>{m.name}</b>
                      <div><span>{m.spec}</span></div>
                      <span className={'cmp__lvl' + (m.vf ? '' : ' cmp__lvl--pending')}>{m.vf && <Icon name="checkCircle" size={12} />}{m.level}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* metrics */}
            {CMP_ROWS.map((row) => {
              const vals = models.map(row.get);
              const best = row.best === 'max' ? Math.max(...vals) : Math.min(...vals);
              const hasVar = new Set(vals).size > 1;
              return (
                <div key={row.k} className="cmp__row">
                  <div className="cmp__cell cmp__cell--lbl">{row.label}{row.hint && <span className="cmp__hint">{row.hint}</span>}</div>
                  {models.map((m) => {
                    const isBest = hasVar && row.get(m) === best;
                    return (
                      <div key={m.id} className={'cmp__cell' + (isBest ? ' is-best' : '')}>
                        {row.fmt(m)}
                        {isBest && <span className="cmp__best"><Icon name="star" size={11} />лучшее</span>}
                      </div>
                    );
                  })}
                </div>
              );
            })}
            {/* footer */}
            <div className="cmp__row">
              <div className="cmp__cell cmp__cell--lbl" />
              {models.map((m) => (
                <div key={m.id} className="cmp__cell cmp__cell--foot">
                  <div className="cmp__foot-btns">
                    <button className="btn btn-primary btn-sm" onClick={() => onChoose(m.r)}>Выбрать</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => onProfile(m.r)}>Профиль</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getOrderById, getResponsesForOrder, user, addResponse, hasResponded, selectExecutor, notify } = useApp();
  const [tab, setTab] = useState('Описание');
  const [responseText, setResponseText] = useState('');
  const [propBudget, setPropBudget] = useState('');
  const [selected, setSelected] = useState([]);        // id откликов для сравнения (до 4)
  const [compareOpen, setCompareOpen] = useState(false);
  const toggleSel = (id) => setSelected((p) => p.includes(id) ? p.filter((x) => x !== id) : (p.length >= 4 ? p : [...p, id]));

  const orderId = searchParams.get('id');
  const o = orderId ? getOrderById(orderId) : null;
  const responses = o ? getResponsesForOrder(o.id) : [];
  const selResponses = responses.filter((r) => selected.includes(r.id));
  const isOwner = !!(user && o && user.id === o.customerId);
  const isDesigner = user?.role === 'designer';
  const alreadyResponded = !!(o && hasResponded(o.id));

  if (!o) {
    return (
      <div className="fx">
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 30, marginBottom: 12 }}>🔍</div>
          <h3 className="section-title" style={{ justifyContent: 'center', marginBottom: 16 }}>Заявка не найдена</h3>
          <button className="btn btn-primary" onClick={() => router.push('/orders')}>К списку заявок</button>
        </div>
      </div>
    );
  }

  const handleSubmitResponse = () => {
    if (!responseText.trim() || !user) return;
    if (propBudget.trim() && !isValidBudget(propBudget)) { notify('Предлагаемый бюджет укажите числом'); return; }
    const ok = addResponse({
      orderId: o.id,
      message: responseText,
      proposedBudget: propBudget.trim() ? formatMoney(propBudget) : undefined,
    });
    if (!ok) { notify('Вы уже откликнулись на эту заявку'); return; }
    setResponseText('');
    setPropBudget('');
    notify('Отклик отправлен');
  };

  const handleSelectExecutor = (r) => {
    selectExecutor(o.id, r.designerId, r.designerName);
    notify(`Исполнитель выбран: ${r.designerName}`);
  };

  const hero = typeImage(o.objectType);
  const team = (o.specialists && o.specialists.length) ? o.specialists : ['Архитектор', 'ГАП', 'Конструктор', 'Инженер-электрик', 'Инженер-сантехник'];

  const Main = () => {
    if (tab === 'Проектировщики') return (
      <div className="col gap16" style={{ minWidth: 0 }}>
        <div className="row between" style={{ alignItems: 'flex-end' }}>
          <h3 className="section-title" style={{ margin: 0 }}>Отклики на заявку</h3>
          <span className="dim" style={{ fontSize: 13 }}>{responses.length} откликов</span>
        </div>

        {responses.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 36 }}>
            <p className="muted" style={{ margin: 0, fontSize: 14 }}>Откликов пока нет. Будьте первым, кто предложит решение.</p>
          </div>
        )}

        {responses.map((r) => {
          const cm = cmModel(r, o.sections);
          const isSel = selected.includes(r.id);
          return (
          <div key={r.id} className={'card rcard' + (isSel ? ' is-sel' : '')}>
            <div className="row gap12" style={{ marginBottom: 12 }}>
              <Avatar text={initials(r.designerName)} size={44} />
              <div className="grow" style={{ minWidth: 0 }}>
                <div className="row gap8" style={{ alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{r.designerName}</span>
                  <span className="tbadge" title={`Индекс доверия ${cm.trust} · ${cm.level}`}><Icon name="checkCircle" size={13} />{cm.trust}</span>
                </div>
                <div className="dim" style={{ fontSize: 13 }}>{r.designerCompany || 'Проектировщик'}</div>
              </div>
              <button type="button" className={'rsel' + (isSel ? ' is-on' : '')} onClick={() => toggleSel(r.id)} title="Добавить к сравнению (до 4)">
                <span className="rsel__box">{isSel && <Icon name="check" size={13} />}</span>
                {isSel ? 'В сравнении' : 'Сравнить'}
              </button>
            </div>
            <p className="muted" style={{ margin: '0 0 14px', fontSize: 13.5, lineHeight: 1.55 }}>{r.message}</p>
            <div className="row between gap16 wrap">
              <span className="row gap16">
                {r.proposedBudget && <span className="price row gap6"><Icon name="wallet" size={16} style={{ color: 'var(--accent-2)' }} />{r.proposedBudget}</span>}
                {r.proposedDeadline && <span className="row gap6 dim" style={{ fontSize: 13 }}><Icon name="clock" size={14} />{formatDeadline(r.proposedDeadline)}</span>}
                {o.sections?.length > 0 && <span className="rcov"><Icon name="layers" size={14} /><b>{cm.covCount}</b>/{cm.total} разделов</span>}
              </span>
              <div className="row gap8">
                <button className="btn btn-ghost btn-sm" onClick={() => router.push('/designers')}>Профиль</button>
                {isOwner && (
                  o.assignedDesignerId === r.designerId
                    ? <button className="btn btn-sm" disabled style={{ opacity: 0.75, background: 'var(--accent-soft)', color: 'var(--green)' }}><Icon name="check" size={14} /> Выбран</button>
                    : !o.assignedDesignerId
                      ? <button className="btn btn-primary btn-sm" onClick={() => handleSelectExecutor(r)}>Выбрать <Icon name="arrowRight" size={14} /></button>
                      : null
                )}
              </div>
            </div>
          </div>
          );
        })}

        {selResponses.length >= 1 && (
          <div className="cmpbar">
            <div className="cmpbar__avas">
              {selResponses.slice(0, 4).map((r) => <Avatar key={r.id} text={initials(r.designerName)} size={30} />)}
            </div>
            <div className="cmpbar__t"><b>{selResponses.length} в сравнении</b><span>можно до 4 откликов</span></div>
            <div className="cmpbar__spacer" />
            <button className="cmpbar__clear" onClick={() => setSelected([])}>Сбросить</button>
            <button className="btn btn-primary btn-sm" disabled={selResponses.length < 2} style={{ opacity: selResponses.length < 2 ? 0.5 : 1 }} onClick={() => setCompareOpen(true)}>Сравнить · {selResponses.length}</button>
          </div>
        )}

        {isDesigner && !isOwner && (
          alreadyResponded ? (
            <div className="card" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Icon name="checkCircle" size={18} style={{ color: 'var(--green)' }} />
              <span className="muted" style={{ fontSize: 14 }}>Вы уже откликнулись на эту заявку.</span>
            </div>
          ) : (
            <div className="card">
              <h3 className="section-title" style={{ marginBottom: 14 }}>Оставить отклик</h3>
              <div className="field"><textarea className="input" style={{ minHeight: 90, resize: 'vertical' }} placeholder="Опишите ваш опыт и предложение…" value={responseText} onChange={(e) => setResponseText(e.target.value)} /></div>
              <div className="field" style={{ marginTop: 12 }}>
                <input className="input" inputMode="numeric" placeholder="Предлагаемый бюджет, ₽ (необязательно)" value={propBudget} onChange={(e) => setPropBudget(e.target.value.replace(/[^\d\s]/g, ''))} />
                {propBudget.trim() && !isValidBudget(propBudget) && <span style={{ fontSize: 11, color: 'var(--red)', marginTop: 4, display: 'block' }}>Введите сумму числом</span>}
              </div>
              <button className="btn btn-primary mt16" onClick={handleSubmitResponse} disabled={!responseText.trim()}>Отправить отклик</button>
            </div>
          )
        )}
      </div>
    );

    if (tab === 'Коммуникации') return (
      <div className="card" style={{ minWidth: 0 }}>
        <div className="row between" style={{ marginBottom: 18 }}>
          <h3 className="section-title" style={{ margin: 0 }}>Переписка по заявке</h3>
          <span className="badge done"><i />демо</span>
        </div>
        <div className="col gap14">
          {DEMO_MESSAGES.map((m, i) => (
            <div key={i} className="row gap10" style={{ flexDirection: m.me ? 'row-reverse' : 'row', alignItems: 'flex-end' }}>
              <Avatar text={m.me ? 'Вы' : 'КБ'} size={32} />
              <div style={{ maxWidth: '76%' }}>
                <div style={{ padding: '10px 14px', borderRadius: 14, borderBottomRightRadius: m.me ? 4 : 14, borderBottomLeftRadius: m.me ? 14 : 4, background: m.me ? 'var(--grad)' : 'var(--surface-2)', color: m.me ? '#fff' : 'var(--text)', fontSize: 13.5, lineHeight: 1.5, border: m.me ? 'none' : '1px solid var(--border)' }}>{m.t}</div>
                <div className="dim" style={{ fontSize: 11.5, marginTop: 4, textAlign: m.me ? 'right' : 'left' }}>{m.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="topbar__search mt24" style={{ maxWidth: 'none', height: 46 }}><Icon name="comment" /><input placeholder="Написать сообщение…" /><button className="btn btn-primary btn-sm" onClick={() => notify('Сообщения — в разработке')}>Отправить</button></div>
      </div>
    );

    if (tab === 'Замечания') return (
      <div className="card" style={{ minWidth: 0 }}>
        <div className="row between" style={{ marginBottom: 18 }}>
          <h3 className="section-title" style={{ margin: 0 }}>Замечания экспертизы</h3>
          <span className="dim" style={{ fontSize: 13 }}>{DEMO_REMARKS.filter((r) => r.tag[0] === 'wait').length} открытых · {DEMO_REMARKS.length} всего</span>
        </div>
        <div className="col gap10">
          {DEMO_REMARKS.map((r, i) => (
            <div key={i} className="row gap14" style={{ padding: '13px 16px', borderRadius: 12, background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
              <span className="chip chip-code" style={{ flex: 'none' }}>{r.sec}</span>
              <span className="grow" style={{ fontSize: 13.5, minWidth: 0 }}>{r.txt}</span>
              <span className={'badge ' + r.tag[0]} style={{ flex: 'none' }}><i />{r.tag[1]}</span>
            </div>
          ))}
        </div>
      </div>
    );

    if (tab === 'Файлы') return (
      <div className="card" style={{ minWidth: 0 }}>
        <div className="row between" style={{ marginBottom: 18 }}>
          <h3 className="section-title" style={{ margin: 0 }}>Файлы проекта</h3>
          <button className="btn btn-ghost btn-sm" onClick={() => notify('Файлы — в разработке')}><Icon name="plus" size={14} /> Загрузить</button>
        </div>
        <div className="col gap10">
          {DEMO_FILES.map((f, i) => (
            <div key={i} className="row gap14" style={{ padding: '13px 16px', borderRadius: 12, background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, display: 'grid', placeItems: 'center', background: 'var(--accent-soft)', color: 'var(--accent-2)', flex: 'none' }}><Icon name={f.ic} size={19} /></div>
              <div className="grow" style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{f.name}</div>
                <div className="dim" style={{ fontSize: 12.5, marginTop: 2 }}>{f.size} · {f.date}</div>
              </div>
              <button className="iconbtn" title="Скачать" onClick={() => notify('Файлы — в разработке')}><Icon name="download" size={17} /></button>
            </div>
          ))}
        </div>
      </div>
    );

    // Описание
    return (
      <>
        <div className="card">
          <h3 className="section-title" style={{ marginBottom: 18 }}>Описание</h3>
          <table className="spec">
            <tbody>
              <tr><td>Тип объекта</td><td>{typeLabel(o.objectType)}</td></tr>
              <tr><td>Регион</td><td>{o.region}</td></tr>
              <tr><td>Масштаб</td><td>{SCALE_LABELS[o.scale] || 'Один специалист'}</td></tr>
              <tr><td>Стадия</td><td>{STAGE_LABELS[o.stage] || o.stage}</td></tr>
              <tr><td>Разделы</td><td>{o.sections.join(' / ')}</td></tr>
            </tbody>
          </table>
          <div className="row gap16 mt24" style={{ alignItems: 'center' }}>
            <span className="price" style={{ fontSize: 24 }}>{o.budget || 'По договорённости'}</span>
            {o.deadline && <span className="chip">До {formatDeadline(o.deadline)}</span>}
          </div>
          <p className="muted mt16" style={{ lineHeight: 1.6, fontSize: 14.5 }}>{o.description}</p>
        </div>

        <div className="card">
          <h3 className="section-title" style={{ marginBottom: 22 }}>Таймлайн работы</h3>
          <div className="timeline">
            {TIMELINE_LABELS.map((label, i) => {
              const done = i < timelineDone(o);
              return (
                <div key={label} className={'tline' + (done ? ' tline--done' : '')}>
                  <div className="tline__dot">{done && <Icon name="check" size={13} />}</div>
                  {i < TIMELINE_LABELS.length - 1 && <div className="tline__line" />}
                  <div className="tline__label">{label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
    <div className="fx animate-in">
      <div className="breadcrumb">
        <a className="link" onClick={() => router.push('/orders')}>Заявки</a>
        <Icon name="chevR" size={13} /> <span className="dim">{o.title}</span>
      </div>

      <div className="row between gap16 wrap" style={{ margin: '16px 0 22px' }}>
        <h1 className="page-title" style={{ maxWidth: 760 }}>{o.title}</h1>
        <div className="row gap10">
          <StatusBadge status={o.status} />
          <button className="btn btn-ghost btn-sm" onClick={() => notify('Сообщения — в разработке')}><Icon name="comment" size={15} /> Обсудить</button>
        </div>
      </div>

      {hero
        ? <div className="detail__hero--img" style={{ backgroundImage: `url('${hero.src.src}')` }}>
            <span className="detail__hero-tag"><Icon name="factory" size={14} />BIM-модель · {hero.tag}</span>
          </div>
        : <div className="thumb thumb-tower detail__hero" />}

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t} className={'tab' + (t === tab ? ' is-active' : '')} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      <div className="detail__grid">
        <div className="col gap20" style={{ minWidth: 0 }}>
          <Main />
        </div>

        <div className="col gap20">
          <div className="card">
            <div className="dim" style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Заказчик</div>
            <div className="row gap12" style={{ marginBottom: 18 }}>
              <Avatar text={initials(o.customerName)} size={44} />
              <div>
                <div style={{ fontWeight: 700 }}>{o.customerName || 'Заказчик'}</div>
                <div className="dim" style={{ fontSize: 13 }}>{o.region}</div>
              </div>
            </div>
            {isOwner
              ? <div className="dim" style={{ fontSize: 13, textAlign: 'center', padding: '4px 0' }}>Это ваша заявка</div>
              : <button className="btn btn-primary btn-block" onClick={() => notify('Сообщения — в разработке')}>Связаться</button>}
          </div>

          {o.assignedDesignerName && (
            <div className="card">
              <div className="dim" style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Исполнитель</div>
              <div className="row gap12">
                <Avatar text={initials(o.assignedDesignerName)} size={40} />
                <div>
                  <div style={{ fontWeight: 700 }}>{o.assignedDesignerName}</div>
                  <div className="dim" style={{ fontSize: 12.5 }}>Назначен по заявке</div>
                </div>
              </div>
            </div>
          )}

          <div className="card">
            <h3 className="section-title" style={{ fontSize: 16, marginBottom: 6 }}>Требуются специалисты</h3>
            <div className="team">
              {team.map((t, i) => (
                <div key={t + i} className="team__row" onClick={() => router.push('/designers?spec=' + encodeURIComponent(t))}>
                  <div className="team__ava"><Icon name="user" size={15} /></div>
                  <span>{t}</span>
                  <Icon name="chevR" size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    {compareOpen && selResponses.length >= 2 && (
      <div className="fx">
        <CompareOverlay
          models={selResponses.map((r) => cmModel(r, o.sections))}
          onClose={() => setCompareOpen(false)}
          onChoose={(r) => { if (isOwner && !o.assignedDesignerId) handleSelectExecutor(r); setCompareOpen(false); }}
          onProfile={() => router.push('/designers')}
        />
      </div>
    )}
    </>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Загрузка…</div>}>
      <OrderDetailContent />
    </Suspense>
  );
}
