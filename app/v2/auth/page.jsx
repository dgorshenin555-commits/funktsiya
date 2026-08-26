'use client';
/* Вход и регистрация в оформлении варианта Б.

   Зачем отдельная страница, если есть /auth: аккаунт на платформе один и
   тот же — та же функция register/login из lib/store, те же роли и
   категории. Отличается только внешний вид. Раньше кнопки варианта Б
   уводили на /auth, и человек посреди нового интерфейса оказывался в
   старом; экраны же самого варианта Б спрашивают один телефон, чего для
   настоящего аккаунта не хватает — заявку с таким профилем не
   опубликовать. Эта страница закрывает разрыв: вид новый, аккаунт общий.

   Вариант А продолжает пользоваться /auth — там ничего не менялось. */

import { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { EXECUTOR_CATEGORIES, STAGE_LABELS, STAGE_P_CAPITAL } from '@/lib/constants';
import './auth.css';

/* Префикс подпапки на GitHub Pages, как в next.config.ts. Пути собираем
   руками и без закрывающего слэша: по адресам со слэшем хостинг отдаёт 404. */
const BASE = process.env.NODE_ENV === 'production' ? '/funktsiya' : '';

const ROLES = [
  { value: 'customer', label: 'Заказчик', hint: 'Публикую заявки на проектирование и обследование' },
  { value: 'executor', label: 'Исполнитель', hint: 'Проектирую, считаю, обследую, черчу' },
  { value: 'manufacturer', label: 'Производитель', hint: 'Поставляю оборудование и материалы' },
];

const Arr = ({ s = 14 }) => (
  <svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
);

/* знак — тот же, что в шапке главной (new_design.jsx) */
const Mark = ({ s = 26 }) => (
  <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="11" fill="#14161A" />
    <rect x="13" y="10" width="4.4" height="21" rx="2.2" fill="#C9F24A" />
    <rect x="13" y="10" width="17" height="4.4" rx="2.2" fill="#C9F24A" />
    <rect x="13" y="18.5" width="12" height="4.4" rx="2.2" fill="#C9F24A" />
  </svg>
);

export default function V2Auth() {
  const { login, register, resetPasswordByCode, user, hydrated } = useApp();

  const [mode, setMode] = useState('login');       // login | register | reset
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [roleKind, setRoleKind] = useState('customer');
  const [cats, setCats] = useState([]);
  const [secs, setSecs] = useState([]);
  const [stages, setStages] = useState([]);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  /* Код восстановления показывается один раз — сразу после регистрации.
     Пока он на экране, никуда не уходим, иначе человек его потеряет. */
  const [recovery, setRecovery] = useState('');

  const isLogin = mode === 'login';
  const isRegister = mode === 'register';
  const isReset = mode === 'reset';
  const isExecutor = roleKind === 'executor';

  /* Режим приходит из адреса: кнопки на главной ведут сюда с ?mode=register.
     Читаем разово — useSearchParams в статическом экспорте требует Suspense. */
  useEffect(() => {
    const m = new URLSearchParams(window.location.search).get('mode');
    if (m === 'register' || m === 'reset') setMode(m);
  }, []);

  /* Уже вошёл — возвращаем в интерфейс варианта Б: он сам разберётся,
     кабинет заказчика показывать или исполнителя. */
  useEffect(() => {
    if (hydrated && user && !recovery) window.location.href = BASE + '/v2';
  }, [hydrated, user, recovery]);

  const toggle = (setter) => (v) =>
    setter((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));

  const switchMode = (next) => { setMode(next); setError(''); setInfo(''); };

  const submit = (e) => {
    e.preventDefault();
    setError(''); setInfo('');

    if (isLogin) {
      if (login(email, password)) window.location.href = BASE + '/v2';
      else setError('Неверная почта или пароль.');
      return;
    }

    if (isReset) {
      if (resetPasswordByCode(email, code, password)) {
        setCode(''); setPassword(''); setMode('login');
        setInfo('Пароль изменён — войдите с новым.');
      } else setError('Неверная почта или код восстановления.');
      return;
    }

    if (!name.trim()) { setError('Введите имя или название компании.'); return; }
    if (isExecutor && cats.length === 0) { setError('Отметьте хотя бы одну категорию.'); return; }

    /* role в хранилище — производная от категорий, так устроен ролевой
       кабинет платформы: исполнитель-проектировщик хранится как designer. */
    const role = isExecutor ? (cats.includes('designer') ? 'designer' : 'expert') : roleKind;
    const created = register({
      email, name, role, company, phone: '', password,
      ...(isExecutor ? {
        executorCategories: cats,
        specializations: cats.includes('designer') ? secs : undefined,
        stages: cats.includes('designer') && stages.length ? stages : undefined,
      } : {}),
    });
    if (created) setRecovery(created);
    else setError('Эта почта уже занята — войдите в существующий аккаунт.');
  };

  /* ─── экран с кодом восстановления ─── */
  if (recovery) {
    return (
      <div className="nd va">
        <header className="topbar">
          <div className="mark"><Mark /><b>Функция</b></div>
        </header>
        <div className="scroll">
          <section className="wrap va__done">
            <span className="lbl">Аккаунт создан</span>
            <h1>Сохраните код восстановления</h1>
            <p>Он показывается один раз. По нему можно сменить пароль, если забудете его.</p>
            <div className="va__code num">{recovery}</div>
            <button className="btn btn-acid btn-lg"
              onClick={() => { setRecovery(''); window.location.href = BASE + '/v2'; }}>
              Записал, перейти в кабинет <Arr />
            </button>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="nd va">
      <header className="topbar">
        <div className="mark" onClick={() => { window.location.href = BASE + '/v2'; }} style={{ cursor: 'pointer' }}>
          <Mark /><b>Функция</b>
        </div>
        <span className="spacer" />
        <button className="btn btn-line btn-sm" onClick={() => { window.location.href = BASE + '/v2'; }}>
          На главную
        </button>
      </header>

      <div className="scroll">
        <section className="wrap va__wrap">

          <aside className="va__side">
            <span className="lbl">{isRegister ? 'Регистрация' : 'Вход'}</span>
            <h1>{isRegister ? 'Аккаунт на платформе' : 'С возвращением'}</h1>
            <p>
              {isRegister
                ? 'Один аккаунт на всё: публикация заявок, отклики, переписка и файлы. Роль можно указать сейчас — она определяет, что вы увидите в кабинете.'
                : 'Войдите, чтобы продолжить работу с заявками и откликами.'}
            </p>
            <ul className="va__list">
              <li>Заявки и профили открыты без регистрации</li>
              <li>Аккаунт нужен, чтобы откликаться и публиковать</li>
              <li>Переписка и публикация — бесплатны</li>
            </ul>
          </aside>

          <form className="va__form card" onSubmit={submit}>
            <div className="seg va__seg">
              <button type="button" className={isLogin ? 'on' : ''} onClick={() => switchMode('login')}>Вход</button>
              <button type="button" className={isRegister ? 'on' : ''} onClick={() => switchMode('register')}>Регистрация</button>
            </div>

            {isRegister && (
              <div className="va__f">
                <label className="lbl">Ваша роль</label>
                <div className="va__roles">
                  {ROLES.map((r) => (
                    <button type="button" key={r.value} title={r.hint}
                      className={'va__role' + (roleKind === r.value ? ' on' : '')}
                      onClick={() => setRoleKind(r.value)}>
                      <b>{r.label}</b><span>{r.hint}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isRegister && (
              <>
                <div className="va__f">
                  <label className="lbl">{isExecutor ? 'ФИО или название' : 'Название компании или ФИО'}</label>
                  <input className="inp" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Как к вам обращаться" autoComplete="name" />
                </div>
                <div className="va__f">
                  <label className="lbl">Организация <span className="va__opt">необязательно</span></label>
                  <input className="inp" value={company} onChange={(e) => setCompany(e.target.value)}
                    placeholder="ООО «Пример»" autoComplete="organization" />
                </div>
              </>
            )}

            {isRegister && isExecutor && (
              <div className="va__f">
                <label className="lbl">Категории — можно несколько</label>
                <div className="va__chips">
                  {EXECUTOR_CATEGORIES.map((c) => (
                    <button type="button" key={c.value} title={c.hint}
                      className={'chip' + (cats.includes(c.value) ? ' on' : '')}
                      onClick={() => toggle(setCats)(c.value)}>{c.label}</button>
                  ))}
                </div>
              </div>
            )}

            {isRegister && isExecutor && cats.includes('designer') && (
              <>
                <div className="va__f">
                  <label className="lbl">Разделы проектирования</label>
                  <div className="va__chips">
                    {STAGE_P_CAPITAL.map((s) => (
                      <button type="button" key={s.code} title={s.name}
                        className={'chip' + (secs.includes(s.code) ? ' on' : '')}
                        onClick={() => toggle(setSecs)(s.code)}>{s.code}</button>
                    ))}
                  </div>
                  <span className="va__hint">По этим разделам вам будут подбираться заявки.</span>
                </div>
                <div className="va__f">
                  <label className="lbl">Стадии</label>
                  <div className="va__chips">
                    {Object.entries(STAGE_LABELS).map(([c, l]) => (
                      <button type="button" key={c}
                        className={'chip' + (stages.includes(c) ? ' on' : '')}
                        onClick={() => toggle(setStages)(c)}>{l}</button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="va__f">
              <label className="lbl">Почта</label>
              <input className="inp" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.ru" autoComplete="email" required />
            </div>

            {isReset && (
              <div className="va__f">
                <label className="lbl">Код восстановления</label>
                <input className="inp num" value={code} onChange={(e) => setCode(e.target.value)}
                  placeholder="XXXX-XXXX" />
              </div>
            )}

            <div className="va__f">
              <label className="lbl">{isReset ? 'Новый пароль' : 'Пароль'}</label>
              <div className="va__pw">
                <input className="inp" type={show ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isLogin ? 'current-password' : 'new-password'} required />
                <button type="button" className="va__eye" onClick={() => setShow(!show)}>
                  {show ? 'скрыть' : 'показать'}
                </button>
              </div>
            </div>

            {error && <div className="va__err">{error}</div>}
            {info && <div className="va__info">{info}</div>}

            <button type="submit" className="btn btn-acid btn-lg va__go">
              {isLogin ? 'Войти' : isReset ? 'Сменить пароль' : 'Создать аккаунт'} <Arr />
            </button>

            <div className="va__alt">
              {isLogin && <button type="button" onClick={() => switchMode('reset')}>Забыли пароль?</button>}
              {!isLogin && <button type="button" onClick={() => switchMode('login')}>Уже есть аккаунт — войти</button>}
            </div>
          </form>

        </section>
      </div>
    </div>
  );
}
