#!/usr/bin/env python3
"""Загоняет все селекторы CSS варианта Б под корневой класс .nd,
чтобы стили не пересекались со стилями варианта А."""
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SCOPE = ".nd"

SRC = os.path.join(ROOT, "design-handoff-v2", "new_design.css")
DST = os.path.join(ROOT, "app", "v2", "v2.css")


def scope_one(sel):
    """Префиксует один селектор классом .nd."""
    s = sel.strip()
    if not s:
        return s
    # корневые токены переезжают на саму обёртку
    if s == ":root":
        return SCOPE
    # html/body — это теперь сама обёртка
    if s in ("html", "body"):
        return SCOPE
    # уже заскоуплено
    if s == SCOPE or s.startswith(SCOPE + " ") or s.startswith(SCOPE + ":") \
       or s.startswith(SCOPE + ",") or s.startswith(SCOPE + "."):
        return s
    # универсальный селектор и его псевдоэлементы: * , *::-webkit-scrollbar
    if s == "*":
        return f"{SCOPE}, {SCOPE} *"
    if s.startswith("*::") or s.startswith("*:"):
        return f"{SCOPE} {s}"
    # псевдоэлементы верхнего уровня: ::selection
    if s.startswith("::"):
        return f"{SCOPE} {s}"
    return f"{SCOPE} {s}"


def scope_selector_list(sel_list):
    """Префиксует список селекторов, разделённых запятыми."""
    parts = [p for p in sel_list.split(",")]
    out = []
    for p in parts:
        scoped = scope_one(p)
        if scoped:
            out.append(scoped)
    return ", ".join(out)


def transform(css):
    out = []
    i = 0
    n = len(css)
    depth = 0
    buf = ""
    # стек: на какой глубине мы внутри @keyframes/@font-face (не трогать)
    raw_until = None

    while i < n:
        ch = css[i]

        # комментарии копируем как есть
        if css.startswith("/*", i):
            end = css.find("*/", i + 2)
            end = end + 2 if end != -1 else n
            out.append(buf)
            buf = ""
            out.append(css[i:end])
            i = end
            continue

        if ch == "{":
            sel = buf.strip()
            buf = ""

            if raw_until is not None:
                # внутри @keyframes — селекторы (from/to/0%) не трогаем
                out.append(sel + "{")
            elif sel.startswith("@"):
                at = sel.split()[0].lower()
                if at in ("@keyframes", "@-webkit-keyframes", "@font-face"):
                    raw_until = depth
                out.append(sel + "{")
            else:
                out.append(scope_selector_list(sel) + "{")

            depth += 1
            i += 1
            continue

        if ch == "}":
            out.append(buf)
            buf = ""
            depth -= 1
            if raw_until is not None and depth <= raw_until:
                raw_until = None
            out.append("}")
            i += 1
            continue

        buf += ch
        i += 1

    out.append(buf)
    return "".join(out)


def main():
    css = open(SRC, encoding="utf-8").read()
    result = transform(css)

    # #root в Next.js не существует — правило бессмысленно
    result = re.sub(r"\.nd #root\{[^}]*\}", "", result)

    # высота/фон/скролл переезжают на .nd; body страницы не трогаем
    header = (
        "/* Вариант Б — стили из Cloud Design (new_design.css).\n"
        "   Все селекторы заскоуплены под .nd, чтобы не пересекаться\n"
        "   со стилями варианта А. Файл сгенерирован, правки вносить\n"
        "   в design-handoff-v2/new_design.css и пересобирать. */\n"
        ".nd{min-height:100vh;background:var(--paper);color:var(--ink);"
        "font-family:var(--fb);-webkit-font-smoothing:antialiased}\n"
    )
    result = header + result

    open(DST, "w", encoding="utf-8").write(result)

    # отчёт
    total = len(re.findall(r"\{", result))
    unscoped = []
    for m in re.finditer(r"(^|\})([^{}@/]+)\{", result):
        sel = m.group(2).strip()
        if sel and not sel.startswith(".nd") and not sel.startswith("@") \
           and not re.match(r"^(from|to|\d+%)", sel):
            unscoped.append(sel[:60])
    print(f"правил всего: {total}")
    print(f"незаскоупленных селекторов: {len(unscoped)}")
    for u in unscoped[:15]:
        print("   ", u)


if __name__ == "__main__":
    main()
