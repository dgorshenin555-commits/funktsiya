"use client";

/* Экран варианта Б. Источник: design-handoff-v2/auth_panel.jsx
   Первоначально импортирован скриптом tools/transform_jsx.py, но это был
   разовый перенос: дальше экран дописывается прямо здесь. Повторно
   генератор не гоняем — он вернёт файл к состоянию выгрузки. */
import * as React from "react";
import { SCREENS } from "./registry";
const { useState, useEffect, useRef } = React;
const I = ({ d, s = 15 }) => (<svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{d}</svg>);
const IcoPhone = p => <I {...p} d={<><path d="M6.5 2.5h-2a1.5 1.5 0 0 0-1.5 1.6c.3 3 1.5 5.8 3.5 8s4.7 3.4 7.7 3.7a1.5 1.5 0 0 0 1.6-1.5v-2a1.5 1.5 0 0 0-1.3-1.5 8 8 0 0 1-1.8-.4 1.5 1.5 0 0 0-1.6.3l-.8.8a11 11 0 0 1-3.5-3.5l.8-.8a1.5 1.5 0 0 0 .3-1.6 8 8 0 0 1-.4-1.8 1.5 1.5 0 0 0-1.5-1.3Z" /></>} />;
const IcoKey = p => <I {...p} d={<><circle cx="7" cy="13" r="3" /><path d="M9 11l7-7M14 4h3v3" /></>} />;
const IcoWarn = p => <I {...p} d={<><path d="M10 3l7 13H3l7-13ZM10 8v4M10 14h.01" /></>} />;
const IcoOk = p => <I {...p} d={<><path d="M4 10.5l4 4L16 6" /></>} />;
const Arr = ({ s = 13 }) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>);
const Spin = ({ s = 15 }) => (<svg className="aspin" width={s} height={s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 2.5a7.5 7.5 0 1 0 7.5 7.5" /></svg>);

const digits = v => v.replace(/\D/g, "").slice(0, 10);
const mask = v => {
  const d = digits(v);
  if (!d) return "";
  return [d.slice(0, 3), d.slice(3, 6), d.slice(6, 8), d.slice(8, 10)].filter(Boolean).join(" ").replace(/ (\d\d) (\d\d)$/, "-$1-$2");
};

function AuthPanel({ onEnterClient, onEnterPro, onRegClient, onRegPro, onClose }) {
  const [tab, setTab] = useState("in");          /* in | up */
  const [role, setRole] = useState("cli");       /* cli | pro */
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState("phone");     /* phone | code | ok */
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [touched, setTouched] = useState(false);
  const [remember, setRemember] = useState(true);
  const codeRef = useRef(null);

  /* Номер запоминаем только если пользователь сам попросил. */
  useEffect(() => {
    try {
      const s = localStorage.getItem("fn.auth.phone");
      if (s) setPhone(mask(s));
    } catch (e) {}
  }, []);
  useEffect(() => { if (step === "code" && codeRef.current) codeRef.current.focus(); }, [step]);

  const phoneErr = touched && digits(phone).length < 10 ? "Введите 10 цифр номера" : null;

  const send = () => {
    setTouched(true);
    if (digits(phone).length < 10) { setErr("Проверьте номер телефона"); return; }
    setErr(null); setBusy(true);
    setTimeout(() => { setBusy(false); setStep("code"); }, 700);
  };
  const enter = () => {
    if (code.length < 4) { setErr("Код из четырёх цифр"); return; }
    setErr(null); setBusy(true);
    setTimeout(() => {
      setBusy(false); setStep("ok");
      try { remember ? localStorage.setItem("fn.auth.phone", digits(phone)) : localStorage.removeItem("fn.auth.phone"); } catch (e) {}
      setTimeout(() => (role === "cli" ? onEnterClient && onEnterClient() : onEnterPro && onEnterPro()), 500);
    }, 700);
  };

  return (
    <div className="auth" onClick={e => e.stopPropagation()}>
      <div className="auth__tabs">
        {[["in", "Вход"], ["up", "Регистрация"]].map(([k, l]) => (
          <button key={k} className={tab === k ? "on" : ""} onClick={() => { setTab(k); setErr(null); setStep("phone"); }}>{l}</button>
        ))}
      </div>

      <div className="auth__role">
        {[["cli", "Заказчик"], ["pro", "Исполнитель"]].map(([k, l]) => (
          <button key={k} className={role === k ? "on" : ""} onClick={() => setRole(k)}>{l}</button>
        ))}
      </div>

      {tab === "up" ? (
        <div className="auth__b">
          <p className="auth__note">Регистрация занимает один шаг — номер телефона. Профиль и объекты заполняются после входа.</p>
          <button className="auth__go" onClick={() => role === "cli" ? onRegClient && onRegClient() : onRegPro && onRegPro()}>
            {role === "cli" ? "Регистрация заказчика" : "Регистрация исполнителя"} <Arr />
          </button>
          <button className="auth__link" onClick={() => setTab("in")}>У меня уже есть аккаунт</button>
        </div>
      ) : step === "ok" ? (
        <div className="auth__b auth__done">
          <span className="auth__ok"><IcoOk s={18} /></span>
          <b>Вход выполнен</b>
          <span>Открываем {role === "cli" ? "кабинет заказчика" : "кабинет исполнителя"}…</span>
        </div>
      ) : (
        <div className="auth__b">
          {step === "phone" ? (
            <>
              <label className="afield">
                <span className="afield__i"><IcoPhone /></span>
                <span className="afield__c">+7</span>
                <input className={"afield__in num" + (phoneErr ? " bad" : "")} inputMode="numeric" placeholder="900 000-00-00"
                  value={phone} onChange={e => setPhone(mask(e.target.value))} onBlur={() => setTouched(true)}
                  onKeyDown={e => e.key === "Enter" && send()} />
              </label>
              {phoneErr && <span className="aerr"><IcoWarn s={13} />{phoneErr}</span>}
              <label className="arem">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                <i />
                <span>Запомнить номер на этом устройстве</span>
              </label>
              <button className="auth__go" disabled={busy} onClick={send}>
                {busy ? <><Spin /> Отправляем код</> : <>Получить код <Arr /></>}
              </button>
            </>
          ) : (
            <>
              <span className="auth__sent">Код отправлен на +7 {phone}</span>
              <label className="afield">
                <span className="afield__i"><IcoKey /></span>
                <input ref={codeRef} className="afield__in afield__in--code num" inputMode="numeric" maxLength={4} placeholder="· · · ·"
                  value={code} onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  onKeyDown={e => e.key === "Enter" && enter()} />
              </label>
              <button className="auth__go" disabled={busy || code.length < 4} onClick={enter}>
                {busy ? <><Spin /> Проверяем</> : <>Войти в кабинет <Arr /></>}
              </button>
              <button className="auth__link" onClick={() => { setStep("phone"); setCode(""); setErr(null); }}>Изменить номер</button>
            </>
          )}
          {err && <span className="aerr"><IcoWarn s={13} />{err}</span>}
          <div className="auth__alt">
            <span>или войдите через</span>
            <div>{["Госуслуги", "СБИС"].map(v => <button key={v}>{v}</button>)}</div>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(SCREENS, { AuthPanel });
