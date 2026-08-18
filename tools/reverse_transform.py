#!/usr/bin/env python3
"""Переводит экраны варианта Б обратно в браузерный формат Cloud Design.

Зеркало transform_jsx.py. Там модули из выгрузки приводились к виду
Next.js; здесь наоборот — код проекта готовится к заливке в прототип:

  "use client" + import        ->  обёртка (function () { ... })()
  SCREENS.Foo                  ->  window.Foo
  IMG["hero.png"]              ->  "assets/hero.png"
  import { useApp } from lib   ->  useApp берётся из window (lib_bundle.jsx)

Запуск: python3 tools/reverse_transform.py
Результат кладётся в design-handoff-v2/for-design/ — оттуда заливается
в Cloud Design. Локальный код не меняется.
"""
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "app", "v2", "_screens")
DST = os.path.join(ROOT, "design-handoff-v2", "for-design")

SKIP = {"registry.js"}


def reverse(src, name):
    body = src

    # шапка модуля Next: директива и импорты
    body = re.sub(r'^\s*["\']use client["\'];\s*\n', "", body)
    body = re.sub(r'^\s*import\s+\*\s+as\s+React\s+from\s+["\']react["\'];\s*\n', "", body, flags=re.M)
    body = re.sub(r'^\s*import\s+\{[^}]*\}\s+from\s+["\']\./registry["\'];\s*\n', "", body, flags=re.M)
    body = re.sub(r'^\s*import\s+\{[^}]*\}\s+from\s+["\']\.\./_assets["\'];\s*\n', "", body, flags=re.M)

    # импорты из lib: имена станут глобальными из lib_bundle.jsx
    lib_names = []
    for m in re.finditer(r'^\s*import\s+\{([^}]*)\}\s+from\s+["\']@/lib/[^"\']+["\'];\s*$', body, flags=re.M):
        lib_names += [n.strip() for n in m.group(1).split(",") if n.strip()]
    body = re.sub(r'^\s*import\s+\{[^}]*\}\s+from\s+["\']@/lib/[^"\']+["\'];\s*\n', "", body, flags=re.M)

    # реестр и картинки — обратно к глобальным именам и путям
    body = re.sub(r"\bObject\.assign\(SCREENS,", "Object.assign(window,", body)
    body = re.sub(r"\bSCREENS\.", "window.", body)
    body = re.sub(r'IMG\["([^"]+)"\]', r'"assets/\1"', body)
    # в JSX-атрибутах после подстановки строки скобки лишние: src={"assets/x"} -> src="assets/x"
    body = re.sub(r'=\{"assets/([^"]+)"\}', r'="assets/\1"', body)

    # шапка файла остаётся, но переписывается под новое назначение
    body = re.sub(r"/\* Экран варианта Б\..*?\*/\s*", "", body, flags=re.S, count=1)

    head = [f"/* {name} — экран варианта Б, выгружен из основного проекта.",
            "   Сгенерировано tools/reverse_transform.py: правки вносить в",
            "   app/v2/_screens/ в проекте, иначе они разойдутся."]
    if lib_names:
        head.append("   Использует из lib_bundle.jsx: " + ", ".join(sorted(set(lib_names))) + ".")
    head.append("   Подключать после lib_bundle.jsx. */")

    inner = "\n".join("  " + ln if ln.strip() else ln for ln in body.strip().split("\n"))
    return "\n".join(head) + "\n(function () {\n" + inner + "\n})();\n"


def main():
    os.makedirs(DST, exist_ok=True)
    n = 0
    for name in sorted(os.listdir(SRC)):
        if not name.endswith(".jsx") or name in SKIP:
            continue
        src = open(os.path.join(SRC, name), encoding="utf-8").read()
        out = reverse(src, name)
        open(os.path.join(DST, name), "w", encoding="utf-8").write(out)
        left = out.count("SCREENS.") + len(re.findall(r'^\s*import\s', out, flags=re.M))
        print(f"  {name:<26} {len(out):>7} символов   остаточных ссылок: {left}")
        n += 1
    print(f"\nготово: {n} экранов в {DST}")


if __name__ == "__main__":
    main()
