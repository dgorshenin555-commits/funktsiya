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
import { EXECUTOR_CATEGORIES } from '@/lib/constants';
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
  const { login, register, resetPasswordByCode, findUserByPhone, registerByPhone, loginByPhone, user, hydrated } = useApp();

  const [mode, setMode] = useState('login');       // login | register | reset
  const [method, setMethod] = useState('email');   // email | phone — способ входа
  const [phone, setPhone] = useState('');
  /* Код подтверждения живёт в состоянии страницы и показывается на экране.
     Отправить настоящую СМС нечем: у прототипа нет ни сервера, ни СМС-шлюза.
     Для настоящей отправки код должен рождаться и сверяться на сервере, а
     браузер его не видеть — здесь это честно помечено как демонстрация. */
  const [smsCode, setSmsCode] = useState('');
  const [smsInput, setSmsInput] = useState('');
  const [phoneOk, setPhoneOk] = useState(false);   // номер подтверждён кодом
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [roleKind, setRoleKind] = useState('customer');
  const [cats, setCats] = useState([]);
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
  /* Сброс пароля возможен только по почте: у телефонного аккаунта пароля нет. */
  const isPhone = method === 'phone' && !isReset;

  /* Та же арифметика, что в store: важны 10 цифр после кода страны, а как
     человек написал код страны — +7, 7 или 8 — неважно. */
  const digits = phone.replace(/\D/g, '');
  const phoneReady = digits.length === 10 || (digits.length === 11 && (digits[0] === '7' || digits[0] === '8'));

  /* Три шага телефонного входа: номер → код → профиль (только если аккаунта нет). */
  const phonePhase = !smsCode ? 'number' : !phoneOk ? 'code' : 'profile';
  /* Имя, роль и категории спрашиваем при регистрации по почте и после
     подтверждения номера — блоки те же, дублировать их не нужно. */
  const askProfile = isPhone ? phonePhase === 'profile' : isRegister;

  /* role в хранилище — производная от категорий, так устроен ролевой
     кабинет платформы: исполнитель-проектировщик хранится как designer. */
  const role = isExecutor ? (cats.includes('designer') ? 'designer' : 'expert') : roleKind;

  /* Режим приходит из адреса: кнопки на главной ведут сюда с ?mode=register.
     Читаем разово — useSearchParams в статическом экспорте требует Suspense. */
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const m = q.get('mode');
    if (m === 'register' || m === 'reset') setMode(m);
    /* Роль приходит с главной: кнопка «Зарегистрироваться как исполнитель»
       должна открывать форму уже с выбранной ролью, а не с заказчиком. */
    const r = q.get('role');
    if (r === 'customer' || r === 'executor' || r === 'manufacturer') setRoleKind(r);
  }, []);

  /* Уже вошёл — возвращаем в интерфейс варианта Б: он сам разберётся,
     кабинет заказчика показывать или исполнителя. */
  useEffect(() => {
    if (hydrated && user && !recovery) window.location.href = BASE + '/v2';
  }, [hydrated, user, recovery]);

  const toggle = (setter) => (v) =>
    setter((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));

  /* Смена номера обнуляет выданный код: он был выдан на прежний номер. */
  const resetPhone = () => { setSmsCode(''); setSmsInput(''); setPhoneOk(false); };

  const switchMode = (next) => { setMode(next); setError(''); setInfo(''); resetPhone(); };
  const switchMethod = (next) => { setMethod(next); setError(''); setInfo(''); resetPhone(); };

  const sendCode = () => {
    setError(''); setInfo('');
    if (!phoneReady) { setError('Введите номер целиком — 10 цифр после кода страны.'); return; }
    setSmsCode(String(Math.floor(1000 + Math.random() * 9000)));
    setSmsInput(''); setPhoneOk(false);
  };

  const confirmCode = () => {
    setError(''); setInfo('');
    if (smsInput.replace(/\D/g, '') !== smsCode) {
      setError('Код не совпадает — он показан выше, или запросите другой.');
      return;
    }
    setPhoneOk(true);
    /* Номер уже за кем-то закреплён — это вход, а не регистрация, независимо
       от открытой вкладки: второй аккаунт на тот же номер платформе не нужен. */
    if (findUserByPhone(phone)) {
      if (loginByPhone(phone)) window.location.href = BASE + '/v2';
      else setError('Не удалось войти по этому номеру.');
      return;
    }
    /* Тупика «такого номера нет» не делаем: номер подтверждён, осталось
       спросить имя и роль — это и есть регистрация тем же номером. */
    if (isLogin) setMode('register');
    setInfo('Аккаунта с таким номером нет — заполните имя и роль, чтобы создать его.');
  };

  const submit = (e) => {
    e.preventDefault();
    setError(''); setInfo('');

    if (isPhone) {
      if (phonePhase === 'number') { sendCode(); return; }
      if (phonePhase === 'code') { confirmCode(); return; }
      if (!name.trim()) { setError('Введите имя или название компании.'); return; }
      if (isExecutor && cats.length === 0) { setError('Отметьте хотя бы одну категорию.'); return; }
      const created = registerByPhone({
        phone, name, role, company,
        ...(isExecutor ? { executorCategories: cats } : {}),
      });
      if (created) setRecovery(created);
      else setError('Не удалось создать аккаунт с этим номером — попробуйте войти.');
      return;
    }

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

    const created = register({
      email, name, role, company, phone: '', password,
      ...(isExecutor ? {
        executorCategories: cats,
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

            {!isReset && (
              <div className="va__f">
                <label className="lbl">Способ входа</label>
                <div className="seg">
                  <button type="button" className={!isPhone ? 'on' : ''} onClick={() => switchMethod('email')}>Почта и пароль</button>
                  <button type="button" className={isPhone ? 'on' : ''} onClick={() => switchMethod('phone')}>Телефон</button>
                </div>
              </div>
            )}

            {isPhone && (
              <div className="va__f">
                <label className="lbl">Номер телефона</label>
                <input className="inp num" type="tel" value={phone} autoComplete="tel"
                  placeholder="+7 900 000-00-00"
                  onChange={(e) => { setPhone(e.target.value); if (smsCode) resetPhone(); }} />
                {phoneOk
                  ? <span className="va__hint">Номер подтверждён.</span>
                  : <span className="va__hint">Номер заменяет логин и пароль: по нему вы и входите, и регистрируетесь.</span>}
              </div>
            )}

            {isPhone && phonePhase === 'code' && (
              <>
                <div className="va__info">
                  Демонстрационный режим: СМС не отправляется, код показан здесь.
                  Для настоящей отправки нужен сервер и СМС-сервис.
                </div>
                <div className="va__code num">{smsCode}</div>
                <div className="va__f">
                  <label className="lbl">Код подтверждения</label>
                  <input className="inp num" value={smsInput} inputMode="numeric" maxLength={4}
                    placeholder="0000" autoComplete="one-time-code"
                    onChange={(e) => setSmsInput(e.target.value)} />
                </div>
              </>
            )}

            {askProfile && (
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

            {askProfile && (
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

            {askProfile && isExecutor && (
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

            {/* Разделы и стадии из регистрации убраны (замечание Дениса-4:
                форма исполнителя была нагромождена). Их выбирают уже в аккаунте,
                в настройках — там же, где направления: так обещает и текст на
                странице «направления, разделы и документы заполним после входа». */}
            {askProfile && isExecutor && cats.includes('designer') && (
              <span className="va__hint">Разделы и стадии выберете в настройках после входа — подбор заявок настроится по ним.</span>
            )}

            {!isPhone && (
              <div className="va__f">
                <label className="lbl">Почта</label>
                <input className="inp" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.ru" autoComplete="email" required />
              </div>
            )}

            {isReset && (
              <div className="va__f">
                <label className="lbl">Код восстановления</label>
                <input className="inp num" value={code} onChange={(e) => setCode(e.target.value)}
                  placeholder="XXXX-XXXX" />
              </div>
            )}

            {!isPhone && (
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
            )}

            {error && <div className="va__err">{error}</div>}
            {info && <div className="va__info">{info}</div>}

            <button type="submit" className="btn btn-acid btn-lg va__go">
              {isPhone
                ? (phonePhase === 'number' ? 'Получить код' : phonePhase === 'code' ? 'Подтвердить номер' : 'Создать аккаунт')
                : isLogin ? 'Войти' : isReset ? 'Сменить пароль' : 'Создать аккаунт'} <Arr />
            </button>

            <div className="va__alt">
              {isPhone && phonePhase === 'code' && <button type="button" onClick={sendCode}>Отправить другой код</button>}
              {isLogin && !isPhone && <button type="button" onClick={() => switchMode('reset')}>Забыли пароль?</button>}
              {!isLogin && <button type="button" onClick={() => switchMode('login')}>Уже есть аккаунт — войти</button>}
            </div>
          </form>

        </section>
      </div>
    </div>
  );
}
