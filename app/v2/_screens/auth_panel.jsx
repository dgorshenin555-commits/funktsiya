"use client";

/* Экран варианта Б. Источник: design-handoff-v2/auth_panel.jsx
   Первоначально импортирован скриптом tools/transform_jsx.py, но это был
   разовый перенос: дальше экран дописывается прямо здесь. Повторно
   генератор не гоняем — он вернёт файл к состоянию выгрузки. */
import * as React from "react";
import { SCREENS } from "./registry";
import { useApp } from "@/lib/store";
const { useState, useEffect, useRef } = React;
const I = ({ d, s = 15 }) => (<svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{d}</svg>);
const IcoKey = p => <I {...p} d={<><circle cx="7" cy="13" r="3" /><path d="M9 11l7-7M14 4h3v3" /></>} />;
const IcoWarn = p => <I {...p} d={<><path d="M10 3l7 13H3l7-13ZM10 8v4M10 14h.01" /></>} />;
const IcoMail = p => <I {...p} d={<><rect x="2.5" y="4.5" width="15" height="11" rx="2" /><path d="M3 6l7 5 7-5" /></>} />;
const IcoUser = p => <I {...p} d={<><circle cx="10" cy="7" r="3.2" /><path d="M4 17c.8-3 3.2-4.5 6-4.5s5.2 1.5 6 4.5" /></>} />;
const IcoOk = p => <I {...p} d={<><path d="M4 10.5l4 4L16 6" /></>} />;
const Arr = ({ s = 13 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>);
const Spin = ({ s = 15 }) => (<svg className="aspin" width={s} height={s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 2.5a7.5 7.5 0 1 0 7.5 7.5" /></svg>);


/* Панель «Войти / Регистрация» в шапке (выгрузка v3).
   Разметка и приёмы — из дизайна; вход и регистрация — настоящие, через общий
   аккаунт платформы (login/register из lib/store), на месте, без перехода.
   В дизайне вход по телефону и коду, но аккаунты платформы держатся на
   email и пароле (решение от 28.09) — поля заменены, остальное как в макете.
   /v2/auth остаётся запасным входом по прямой ссылке (там же сброс пароля). */
const BASE = process.env.NODE_ENV === "production" ? "/funktsiya" : "";

function AuthPanel({ onEnterClient, onEnterPro, onRegClient, onRegPro, onClose }) {
  const { login, register } = useApp();
  const [tab, setTab] = useState("in");          /* in | up */
  const [role, setRole] = useState("cli");       /* cli | pro — для регистрации */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [done, setDone] = useState(null);        /* { kind: "in" | "up", pro, code } */
  const firstRef = useRef(null);

  useEffect(() => { if (firstRef.current) firstRef.current.focus(); }, [tab]);

  const okMail = /.+@.+\..+/.test(email.trim());
  const switchTab = k => { setTab(k); setErr(null); };

  /* Кто вошёл — решает хранилище: исполнитель определяется по категориям
     (модель в.18), остальным — кабинет заказчика. */
  const isPro = u => !!u && ((u.executorCategories || []).length > 0 || u.role === "designer" || u.role === "expert");

  const enter = () => {
    if (!okMail) { setErr("Проверьте адрес почты"); return; }
    if (!password) { setErr("Введите пароль"); return; }
    setErr(null); setBusy(true);
    const ok = login(email, password);
    setBusy(false);
    if (!ok) { setErr("Неверная почта или пароль"); return; }
    let u = null;
    try { u = JSON.parse(localStorage.getItem("pm_users") || "[]").find(x => x.email.trim().toLowerCase() === email.trim().toLowerCase()); } catch (e) {}
    const pro = isPro(u);
    setDone({ kind: "in", pro });
    setTimeout(() => (pro ? onEnterPro && onEnterPro() : onEnterClient && onEnterClient()), 600);
  };

  const signUp = () => {
    if (!name.trim()) { setErr(role === "cli" ? "Введите имя или название компании" : "Введите имя"); return; }
    if (!okMail) { setErr("Проверьте адрес почты"); return; }
    if (password.length < 6) { setErr("Пароль — не короче 6 символов"); return; }
    setErr(null);
    /* как на /v2/auth: исполнитель по умолчанию — проектировщик, категории уточняются в анкете */
    const code = register(role === "pro"
      ? { email, name, role: "designer", phone: "", password, executorCategories: ["designer"] }
      : { email, name, role: "customer", phone: "", password });
    if (!code) { setErr("Эта почта уже занята — войдите в существующий аккаунт"); return; }
    setDone({ kind: "up", pro: role === "pro", code });
  };

  const onEnterKey = f => e => { if (e.key === "Enter") f(); };

  return (
    <div className="auth" onClick={e => e.stopPropagation()}>
      <div className="auth__tabs">
        {[["in", "Вход"], ["up", "Регистрация"]].map(([k, l]) => (
          <button key={k} className={tab === k ? "on" : ""} onClick={() => switchTab(k)}>{l}</button>
        ))}
      </div>

      {done ? (
        <div className="auth__b auth__done">
          <span className="auth__ok"><IcoOk s={18} /></span>
          {done.kind === "in" ? (<>
            <b>Вход выполнен</b>
            <span>Открываем {done.pro ? "кабинет исполнителя" : "кабинет заказчика"}…</span>
          </>) : (<>
            <b>Аккаунт создан</b>
            <span>Код восстановления пароля — сохраните его:</span>
            <b className="num" style={{ letterSpacing: ".12em" }}>{done.code}</b>
            <button className="auth__go" onClick={() => (done.pro ? onRegPro && onRegPro() : onRegClient && onRegClient())}>
              {done.pro ? "Заполнить анкету исполнителя" : "Рассказать об объекте"} <Arr />
            </button>
          </>)}
        </div>
      ) : (
        <div className="auth__b">
          {tab === "up" && (
            <div className="auth__role">
              {[["cli", "Заказчик"], ["pro", "Исполнитель"]].map(([k, l]) => (
                <button key={k} className={role === k ? "on" : ""} onClick={() => setRole(k)}>{l}</button>
              ))}
            </div>
          )}
          {tab === "up" && (
            <label className="afield">
              <span className="afield__i"><IcoUser /></span>
              <input ref={firstRef} className="afield__in" placeholder={role === "cli" ? "Имя или компания" : "Имя и фамилия"}
                value={name} onChange={e => setName(e.target.value)} onKeyDown={onEnterKey(signUp)} autoComplete="name" />
            </label>
          )}
          <label className="afield">
            <span className="afield__i"><IcoMail /></span>
            <input ref={tab === "in" ? firstRef : null} className="afield__in" type="email" placeholder="you@example.ru"
              value={email} onChange={e => setEmail(e.target.value)} onKeyDown={onEnterKey(tab === "in" ? enter : signUp)} autoComplete="email" />
          </label>
          <label className="afield">
            <span className="afield__i"><IcoKey /></span>
            <input className="afield__in" type="password" placeholder={tab === "in" ? "Пароль" : "Пароль, от 6 символов"}
              value={password} onChange={e => setPassword(e.target.value)} onKeyDown={onEnterKey(tab === "in" ? enter : signUp)}
              autoComplete={tab === "in" ? "current-password" : "new-password"} />
          </label>
          {err && <span className="aerr"><IcoWarn s={13} />{err}</span>}
          {tab === "in" ? (<>
            <button className="auth__go" disabled={busy} onClick={enter}>
              {busy ? <><Spin /> Проверяем</> : <>Войти в кабинет <Arr /></>}
            </button>
            <a className="auth__link" href={BASE + "/v2/auth?mode=reset"}>Забыли пароль?</a>
          </>) : (<>
            <button className="auth__go" onClick={signUp}>
              {role === "cli" ? "Регистрация заказчика" : "Регистрация исполнителя"} <Arr />
            </button>
            <button className="auth__link" onClick={() => switchTab("in")}>У меня уже есть аккаунт</button>
          </>)}
        </div>
      )}
    </div>
  );
}

Object.assign(SCREENS, { AuthPanel });
