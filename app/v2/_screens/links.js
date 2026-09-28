"use client";

/* Единые адреса варианта Б.

   Раньше экраны вели на "/auth": без префикса подпапки GitHub Pages это 404
   (замечание Дениса «нажимаю войти — страница с ошибкой»), да и уводило в
   старый дизайн вместо своей страницы входа. Префикс и путь собираем в одном
   месте, чтобы такие ссылки больше не расходились.

   Закрывающий слэш не ставим: по адресам со слэшем хостинг отдаёт 404. */

const BASE = process.env.NODE_ENV === "production" ? "/funktsiya" : "";

export const V2_HOME = BASE + "/v2";

/* mode: "register" — сразу форма регистрации; role: "customer" | "executor" —
   какая роль будет выбрана в ней по умолчанию. */
export const authUrl = (mode, role) => {
  const q = [mode ? "mode=" + mode : "", role ? "role=" + role : ""].filter(Boolean).join("&");
  return BASE + "/v2/auth" + (q ? "?" + q : "");
};
