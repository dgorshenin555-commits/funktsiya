// @ts-nocheck
'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { UserRole, ExecutorCategory } from '@/lib/types';
import { EXECUTOR_CATEGORIES, STAGE_P_CAPITAL, STAGE_LABELS } from '@/lib/constants';
import Link from 'next/link';
import { Icon } from '../_orders/icons';
import '../_orders/orders.css';

/* Регистрация по модели «Исполнитель с категориями» (решение 16.08, вопрос 18):
   роли — Заказчик / Исполнитель / Производитель; исполнитель отмечает категории
   (можно несколько), для «Проектировщика» дополнительно разделы и стадии.
   В хранилище role остаётся производной (designer|expert) для совместимости. */
const ROLE_KINDS = [
  { value: 'customer', label: 'Заказчик', icon: 'building' },
  { value: 'executor', label: 'Исполнитель', icon: 'pen' },
  { value: 'manufacturer', label: 'Производитель', icon: 'factory' },
];
const REG_STAGES = Object.entries(STAGE_LABELS); // [['sketch','Эскиз'], …]

/* ───────────────────────── animated characters (ported from Cloud Design) ───────────────────────── */

/* eye with white sclera + tracking pupil */
function EyeBall({ size = 18, pupilSize = 7, max = 5, blinking, lookX, lookY, mouse }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useLayoutEffect(() => {
    if (lookX !== undefined) { setPos({ x: lookX, y: lookY }); return; }
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = mouse.x - (r.left + r.width / 2), dy = mouse.y - (r.top + r.height / 2);
    const dist = Math.min(Math.hypot(dx, dy), max), a = Math.atan2(dy, dx);
    setPos({ x: Math.cos(a) * dist, y: Math.sin(a) * dist });
  }, [mouse.x, mouse.y, lookX, lookY]);
  return (
    <div ref={ref} className="eye" style={{ width: size, height: blinking ? 2 : size }}>
      {!blinking && <div className="pupil" style={{ width: pupilSize, height: pupilSize, transform: `translate(${pos.x}px,${pos.y}px)` }} />}
    </div>
  );
}

/* bare pupil (no sclera) */
function Pupil({ size = 12, max = 5, lookX, lookY, mouse }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useLayoutEffect(() => {
    if (lookX !== undefined) { setPos({ x: lookX, y: lookY }); return; }
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = mouse.x - (r.left + r.width / 2), dy = mouse.y - (r.top + r.height / 2);
    const dist = Math.min(Math.hypot(dx, dy), max), a = Math.atan2(dy, dx);
    setPos({ x: Math.cos(a) * dist, y: Math.sin(a) * dist });
  }, [mouse.x, mouse.y, lookX, lookY]);
  return <div ref={ref} className="pupil pupil--bare" style={{ width: size, height: size, transform: `translate(${pos.x}px,${pos.y}px)` }} />;
}

function useBlink() {
  const [b, setB] = useState(false);
  useEffect(() => {
    let t;
    const loop = () => { t = setTimeout(() => { setB(true); setTimeout(() => { setB(false); loop(); }, 150); }, Math.random() * 4000 + 3000); };
    loop();
    return () => clearTimeout(t);
  }, []);
  return b;
}

function skew(ref, mouse) {
  const el = ref.current; if (!el) return 0;
  const r = el.getBoundingClientRect();
  return Math.max(-6, Math.min(6, -(mouse.x - (r.left + r.width / 2)) / 120));
}

function Characters({ mouse, typing, hideEyes, peek }) {
  const purple = useRef(null), dark = useRef(null), amber = useRef(null), rose = useRef(null);
  const blinkP = useBlink(), blinkD = useBlink();
  // forced looks
  const away = hideEyes ? { lookX: -4, lookY: -5 } : {};
  const peekLook = peek ? { lookX: 3, lookY: 5 } : away;
  const glanceR = typing ? { lookX: 4, lookY: 2 } : {};
  const glanceL = typing ? { lookX: -4, lookY: 2 } : {};
  return (
    <div className="chars">
      {/* purple — tall, back */}
      <div ref={purple} className="char char--purple" style={{ transform: `skewX(${(hideEyes ? 0 : skew(purple, mouse)) + (typing ? -10 : 0)}deg)` }}>
        <div className="char__eyes" style={{ gap: 22 }}>
          <EyeBall mouse={mouse} blinking={blinkP} {...(hideEyes ? peekLook : glanceR)} />
          <EyeBall mouse={mouse} blinking={blinkP} {...(hideEyes ? peekLook : glanceR)} />
        </div>
      </div>
      {/* dark — middle */}
      <div ref={dark} className="char char--dark" style={{ transform: `skewX(${(hideEyes ? 0 : skew(dark, mouse)) + (typing ? 9 : 0)}deg)` }}>
        <div className="char__eyes" style={{ gap: 16, top: 30 }}>
          <EyeBall size={16} pupilSize={6} max={4} mouse={mouse} blinking={blinkD} {...(hideEyes ? away : glanceL)} />
          <EyeBall size={16} pupilSize={6} max={4} mouse={mouse} blinking={blinkD} {...(hideEyes ? away : glanceL)} />
        </div>
      </div>
      {/* amber — semicircle, front-left */}
      <div ref={amber} className="char char--amber" style={{ transform: `skewX(${hideEyes ? 0 : skew(amber, mouse)}deg)` }}>
        <div className="char__eyes" style={{ gap: 30, top: 92, left: 78 }}>
          <Pupil mouse={mouse} {...(hideEyes ? away : {})} />
          <Pupil mouse={mouse} {...(hideEyes ? away : {})} />
        </div>
      </div>
      {/* rose — front-right, with mouth */}
      <div ref={rose} className="char char--rose" style={{ transform: `skewX(${hideEyes ? 0 : skew(rose, mouse)}deg)` }}>
        <div className="char__eyes" style={{ gap: 18, top: 42, left: 48 }}>
          <Pupil mouse={mouse} {...(hideEyes ? away : {})} />
          <Pupil mouse={mouse} {...(hideEyes ? away : {})} />
        </div>
        <div className="char__mouth" />
      </div>
    </div>
  );
}

/* brand mark (inline svg, как на текущей странице) */
function BrandMark() {
  return (
    <div className="brand__logo" style={{ width: 32, height: 32 }}>
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="4" width="4" height="12" rx="1" fill="#fff" />
        <rect x="8" y="2" width="4" height="16" rx="1" fill="#fff" />
        <rect x="14" y="6" width="4" height="10" rx="1" fill="#fff" />
      </svg>
    </div>
  );
}

/* ───────────────────────── page ───────────────────────── */

export default function AuthPage() {
  const router = useRouter();
  const { login, register, resetPasswordByCode, user, hydrated } = useApp();
  // Три режима формы: вход / регистрация / сброс пароля по коду восстановления.
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const isLogin = mode === 'login';
  const isRegister = mode === 'register';
  const isReset = mode === 'reset';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [roleKind, setRoleKind] = useState('customer');
  const [cats, setCats] = useState<ExecutorCategory[]>([]);
  const [secs, setSecs] = useState<string[]>([]);
  const [stages, setStages] = useState<string[]>([]);
  const toggleIn = (setter) => (v) => setter((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  // Код восстановления показывается один раз сразу после регистрации.
  const [recoveryCode, setRecoveryCode] = useState('');

  // Кнопка «Регистрация» должна открывать форму регистрации, а не вход
  // (?mode=register). Читаем адрес вручную: useSearchParams в статическом
  // экспорте требует Suspense-обёртки, а тут достаточно разового чтения.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const m = new URLSearchParams(window.location.search).get('mode');
    if (m === 'register' || m === 'reset') setMode(m);
  }, []);

  // presentation-only state (анимация персонажей, не влияет на логику входа)
  const [show, setShow] = useState(false);
  const [typing, setTyping] = useState(false);
  const [glance, setGlance] = useState(false);
  const [peek, setPeek] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // Уже авторизован → в кабинет (BUG-006).
  // Исключение: экран с кодом восстановления после регистрации — уходим по кнопке.
  useEffect(() => {
    if (hydrated && user && !recoveryCode) router.replace('/dashboard');
  }, [hydrated, user, recoveryCode, router]);

  // mouse-трекинг для глаз персонажей
  useEffect(() => {
    let raf;
    const onMove = (e) => { cancelAnimationFrame(raf); const x = e.clientX, y = e.clientY; raf = requestAnimationFrame(() => setMouse({ x, y })); };
    window.addEventListener('mousemove', onMove);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);

  // короткий «переглядываются» при фокусе поля
  useEffect(() => {
    if (!typing) { setGlance(false); return; }
    setGlance(true);
    const t = setTimeout(() => setGlance(false), 850);
    return () => clearTimeout(t);
  }, [typing]);

  const hideEyes = password.length > 0 && !show; // закрывают глаза, пока пароль скрыт

  // purple подглядывает, когда пароль раскрыт
  useEffect(() => {
    if (!(password.length > 0 && show)) { setPeek(false); return; }
    let t1, t2;
    const loop = () => { t1 = setTimeout(() => { setPeek(true); t2 = setTimeout(() => { setPeek(false); loop(); }, 800); }, Math.random() * 3000 + 2000); };
    loop();
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [password, show]);

  const switchMode = (next: 'login' | 'register' | 'reset') => { setMode(next); setError(''); setInfo(''); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    if (isLogin) {
      const ok = login(email, password);
      if (ok) {
        router.push('/dashboard');
      } else {
        setError('Неверный email или пароль.');
      }
    } else if (isReset) {
      const ok = resetPasswordByCode(email, code, password);
      if (ok) {
        setCode('');
        setPassword('');
        setMode('login');
        setInfo('Пароль изменён, войдите с новым паролем.');
      } else {
        setError('Неверный email или код восстановления.');
      }
    } else {
      if (!name.trim()) {
        setError('Введите ФИО или название компании.');
        return;
      }
      const isExecutor = roleKind === 'executor';
      if (isExecutor && cats.length === 0) {
        setError('Отметьте хотя бы одну категорию исполнителя.');
        return;
      }
      // role — производная от категорий (совместимость с ролевым кабинетом).
      const role: UserRole = isExecutor
        ? (cats.includes('designer') ? 'designer' : 'expert')
        : (roleKind as UserRole);
      const created = register({
        email, name, role, company, phone: '', password,
        ...(isExecutor ? {
          executorCategories: cats,
          specializations: cats.includes('designer') ? secs : undefined,
          stages: cats.includes('designer') && stages.length ? stages : undefined,
        } : {}),
      });
      if (created) {
        setRecoveryCode(created);
      } else {
        setError('Этот email уже зарегистрирован — войдите в существующий аккаунт.');
      }
    }
  };

  return (
    <div className="fx">
      <div className="authx">
        <aside className="authx__brand">
          <Link href="/" className="authx__top brand-link" style={{ textDecoration: 'none' }}>
            <BrandMark />
            <div className="brand__name" style={{ fontSize: 18 }}>ФУНКЦИЯ</div>
          </Link>

          <div className="authx__stage">
            <Characters mouse={mouse} typing={glance} hideEyes={hideEyes || (password.length > 0 && show)} peek={peek} />
          </div>

          <div className="authx__foot">
            <span>Единая платформа ПИР</span>
            <span className="dim">Проектирование · Экспертиза · Подбор</span>
          </div>
          <div className="authx__glow authx__glow--1" />
          <div className="authx__glow authx__glow--2" />
        </aside>

        <div className="authx__form">
          <div className="authx__formwrap">
            {recoveryCode ? (
              <>
                <div className="authx__head">
                  <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, color: '#fff' }}>Код восстановления</h1>
                  <p className="muted" style={{ margin: '8px 0 0', fontSize: 14.5 }}>Сохраните код восстановления — он понадобится, если забудете пароль. Показывается один раз.</p>
                </div>

                <div style={{ marginTop: 30, textAlign: 'center', fontSize: 26, fontWeight: 800, letterSpacing: 4, color: '#fff', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.16)', borderRadius: 10, padding: '18px 14px' }}>
                  {recoveryCode}
                </div>

                <button type="button" className="btn btn-primary btn-block" style={{ height: 50, fontSize: 15, marginTop: 22 }} onClick={() => router.push('/dashboard')}>
                  Я сохранил код — продолжить
                </button>
              </>
            ) : (
              <>
                <div className="authx__head">
                  <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, color: '#fff' }}>{isLogin ? 'С возвращением' : isReset ? 'Восстановление доступа' : 'Регистрация'}</h1>
                  <p className="muted" style={{ margin: '8px 0 0', fontSize: 14.5 }}>{isLogin ? 'Войдите для доступа к заявкам и кабинету' : isReset ? 'Введите email и код восстановления, чтобы задать новый пароль' : 'Создайте аккаунт для работы на платформе'}</p>
                </div>

                <form onSubmit={handleSubmit} className="col gap18" style={{ marginTop: 30 }}>
                  {isRegister && (
                    <>
                      <div className="field">
                        <label>Ваша роль</label>
                        <div className="role-selector" role="radiogroup" aria-label="Ваша роль">
                          {ROLE_KINDS.map((r) => (
                            <div
                              key={r.value}
                              className={`role-option ${roleKind === r.value ? 'selected' : ''}`}
                              role="radio"
                              aria-checked={roleKind === r.value}
                              tabIndex={0}
                              onClick={() => setRoleKind(r.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setRoleKind(r.value); } }}
                            >
                              <div className="role-option-icon"><Icon name={r.icon} size={22} /></div>
                              <div className="role-option-label">{r.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {roleKind === 'executor' && (
                        <>
                          <div className="field">
                            <label>Категории — можно несколько</label>
                            <div className="chips">
                              {EXECUTOR_CATEGORIES.map((c) => (
                                <button type="button" key={c.value} title={c.hint}
                                  className={'chip chip-toggle' + (cats.includes(c.value) ? ' is-sel' : '')}
                                  onClick={() => toggleIn(setCats)(c.value)}>
                                  {c.label}
                                </button>
                              ))}
                            </div>
                          </div>
                          {cats.includes('designer') && (
                            <>
                              <div className="field">
                                <label>Разделы проектирования</label>
                                <div className="chips">
                                  {STAGE_P_CAPITAL.map((s) => (
                                    <button type="button" key={s.code} title={s.name}
                                      className={'chip chip-toggle' + (secs.includes(s.code) ? ' is-sel' : '')}
                                      onClick={() => toggleIn(setSecs)(s.code)}>
                                      {s.code}
                                    </button>
                                  ))}
                                </div>
                                <span style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 4, display: 'block' }}>По этим разделам вам будут рекомендоваться заявки.</span>
                              </div>
                              <div className="field">
                                <label>Стадии</label>
                                <div className="chips">
                                  {REG_STAGES.map(([code, label]) => (
                                    <button type="button" key={code}
                                      className={'chip chip-toggle' + (stages.includes(code) ? ' is-sel' : '')}
                                      onClick={() => toggleIn(setStages)(code)}>
                                      {label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      )}
                      <div className="field">
                        <label>ФИО / Название компании</label>
                        <input className="input" placeholder="Иванов Иван Иванович" value={name} onChange={(e) => setName(e.target.value)} required
                          onFocus={() => setTyping(true)} onBlur={() => setTyping(false)} />
                      </div>
                      <div className="field">
                        <label>Компания (необязательно)</label>
                        <input className="input" placeholder="ООО «Проект»" value={company} onChange={(e) => setCompany(e.target.value)}
                          onFocus={() => setTyping(true)} onBlur={() => setTyping(false)} />
                      </div>
                    </>
                  )}

                  <div className="field">
                    <label>Email</label>
                    <input className="input" type="email" placeholder="mail@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required
                      autoComplete="off" onFocus={() => setTyping(true)} onBlur={() => setTyping(false)} />
                  </div>

                  {isReset && (
                    <div className="field">
                      <label>Код восстановления</label>
                      <input className="input" placeholder="XXXX-XXXX" value={code} onChange={(e) => setCode(e.target.value)} required
                        autoComplete="off" onFocus={() => setTyping(true)} onBlur={() => setTyping(false)} />
                      <span style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 4, display: 'block' }}>Код выдавался при регистрации. Если у вашего аккаунта кода нет — войдите по email или зарегистрируйтесь заново.</span>
                    </div>
                  )}

                  <div className="field">
                    <label>{isReset ? 'Новый пароль' : 'Пароль'}</label>
                    <div className="inputwrap">
                      <input className="input" type={show ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                        onFocus={() => setTyping(true)} onBlur={() => setTyping(false)} />
                      <button type="button" className="inputwrap__btn" onClick={() => setShow((s) => !s)} title={show ? 'Скрыть' : 'Показать'} aria-label={show ? 'Скрыть пароль' : 'Показать пароль'}>
                        <Icon name={show ? 'eyeOff' : 'eye'} size={18} />
                      </button>
                    </div>
                    {!isLogin && <span style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 4, display: 'block' }}>Минимум 6 символов</span>}
                    {isLogin && <a className="link" style={{ fontSize: 12.5, marginTop: 6, display: 'inline-block' }} onClick={() => switchMode('reset')}>Забыли пароль?</a>}
                  </div>

                  {error && (
                    <div role="alert" style={{ background: 'rgba(244,113,127,0.12)', color: '#f4717f', border: '1px solid rgba(244,113,127,0.32)', borderRadius: 8, padding: '10px 14px', fontSize: 13.5 }}>
                      {error}
                    </div>
                  )}

                  {info && (
                    <div role="status" style={{ background: 'rgba(52,211,153,0.12)', color: 'var(--green)', border: '1px solid rgba(52,211,153,0.32)', borderRadius: 8, padding: '10px 14px', fontSize: 13.5 }}>
                      {info}
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary btn-block" style={{ height: 50, fontSize: 15 }}>
                    {isLogin ? 'Войти' : isReset ? 'Сбросить пароль' : 'Зарегистрироваться'}
                  </button>
                </form>

                <p className="muted" style={{ textAlign: 'center', marginTop: 26, fontSize: 14 }}>
                  {isLogin ? (
                    <>Нет аккаунта? <a className="link" onClick={() => switchMode('register')}>Зарегистрируйтесь</a></>
                  ) : isReset ? (
                    <>Вспомнили пароль? <a className="link" onClick={() => switchMode('login')}>Войдите</a></>
                  ) : (
                    <>Уже есть аккаунт? <a className="link" onClick={() => switchMode('login')}>Войдите</a></>
                  )}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
