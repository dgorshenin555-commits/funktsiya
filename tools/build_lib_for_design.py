#!/usr/bin/env python3
"""Собирает общую логику проекта в один браузерный модуль для Cloud Design.

В проекте состояние и данные лежат в lib/ как ES-модули на TypeScript.
Прототип в Cloud Design работает иначе: глобальный React, скрипты
подключаются тегами, модули видят друг друга через window. Этот сборщик
переводит одно в другое:

  lib/constants.ts  ─┐
  lib/mock-data.ts  ─┼─ снять типы (tsc) ─ убрать import/export ─ IIFE ─ window
  lib/store.tsx     ─┘

На выходе lib_bundle.jsx: подключается в Cloud Design первым, после чего
экраны берут данные и состояние через window.useApp и window.MOCK_*.

Запуск: python3 tools/build_lib_for_design.py
Требует предварительной транспиляции — она делается внутри.
"""
import os
import re
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "design-handoff-v2", "lib_bundle.jsx")

# порядок важен: store опирается на данные, данные — ни на что
SOURCES = ["constants", "mock-data", "store"]

# Лёгкий режим (--data-only): без store.
# Прототип получает настоящие данные, но остаётся витриной — кнопки
# ничего не меняют. Этого хватает, чтобы ловить огрехи вёрстки: они
# вылезают на длинных названиях и полных списках, а не на переходах.
# Полный режим тащит в Cloud Design состояние, которое потом расходится
# с проектом и требует слияния при каждом обмене.
DATA_ONLY_SHIM = '''
  /* Чтение — из настоящих данных проекта, запись — заглушки.
     Прототип показывает платформу как есть, но ничего не меняет. */
  const DEMO_USER = {
    id: "u-demo", name: "Игорь Савельев", role: "customer",
    company: "ООО «Ситипроект»", city: "Москва",
  };
  function useApp() {
    return {
      user: DEMO_USER,
      orders: MOCK_ORDERS,
      getOrderById: (id) => MOCK_ORDERS.find((o) => o.id === id) || null,
      getResponsesForOrder: (id) => MOCK_RESPONSES.filter((r) => r.orderId === id),
      hasResponded: () => false,
      addOrder: () => {},
      addResponse: () => false,
      selectExecutor: () => {},
      notify: () => {},
    };
  }
'''


def transpile(tmp):
    files = [os.path.join(ROOT, "lib", n) for n in
             ("constants.ts", "mock-data.ts", "store.tsx")]
    r = subprocess.run(
        ["npx", "tsc", *files, "--jsx", "preserve", "--target", "es2020",
         "--module", "esnext", "--moduleResolution", "bundler",
         "--outDir", tmp, "--skipLibCheck"],
        cwd=ROOT, capture_output=True, text=True)
    # tsc может ругаться на типы, но файлы всё равно пишет
    return r.returncode


def strip_module_syntax(src):
    """Убирает import/export — в браузерной сборке всё в одной области."""
    exported = []
    out = []
    for line in src.split("\n"):
        if re.match(r"^\s*import\s", line):
            continue
        m = re.match(r"^export\s+(function|const|let|var|class)\s+([A-Za-z_]\w*)", line)
        if m:
            exported.append(m.group(2))
            out.append(line[len("export "):])
            continue
        if re.match(r"^export\s*\{", line):
            for name in re.findall(r"[A-Za-z_]\w*", line[line.find("{") + 1:line.find("}")] if "}" in line else ""):
                if name not in exported:
                    exported.append(name)
            continue
        if re.match(r"^export\s+default\s", line):
            out.append(re.sub(r"^export\s+default\s", "", line))
            continue
        out.append(line)
    return "\n".join(out), exported


def main():
    data_only = "--data-only" in sys.argv
    tmp = tempfile.mkdtemp(prefix="lib-js-")
    transpile(tmp)

    sources = [s for s in SOURCES if not (data_only and s == "store")]
    parts = []
    all_exports = []
    for name in sources:
        path = os.path.join(tmp, name + (".jsx" if name == "store" else ".js"))
        if not os.path.exists(path):
            print("не собрался:", name)
            sys.exit(1)
        body, exported = strip_module_syntax(open(path, encoding="utf-8").read())
        parts.append(f"/* ---------- {name} ---------- */\n" + body.strip())
        all_exports.extend(exported)
        print(f"  {name:<12} экспортов: {len(exported)}")

    if data_only:
        parts.append("/* ---------- витрина вместо состояния ---------- */"
                     + DATA_ONLY_SHIM)
        all_exports.append("useApp")
    names = ", ".join(sorted(set(all_exports)))
    header = '''/* lib_bundle.jsx — общая логика платформы для прототипа в Cloud Design.

   ФАЙЛ СГЕНЕРИРОВАН из lib/ основного проекта командой
   python3 tools/build_lib_for_design.py — правки вносить туда, иначе
   при следующей сборке они пропадут.

   Подключать ПЕРВЫМ, до экранов: они берут отсюда данные. */
(function () {
  const { createContext, useContext, useState, useEffect, useCallback, useRef } = React;

'''
    footer = "\n\n  Object.assign(window, { %s });\n})();\n" % names

    body = "\n\n".join(parts)
    # внутри IIFE React уже разобран на хуки выше
    body = re.sub(r"^import.*$", "", body, flags=re.M)
    body = "\n".join("  " + ln if ln.strip() else ln for ln in body.split("\n"))

    open(OUT, "w", encoding="utf-8").write(header + body + footer)
    print()
    print("собран:", OUT, os.path.getsize(OUT), "байт")
    print("в window попадут:", names)


if __name__ == "__main__":
    main()
