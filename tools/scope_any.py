#!/usr/bin/env python3
"""Загоняет CSS под указанный корневой класс.

Обобщение scope_css.py на случай, когда у страницы свой корень, а не .nd:
лендинги варианта Б живут под .land / .l2 / .l3, регистрация — под .sg3.
Без скоупа их общие имена (.scroll, .lbl, .btn-pill) столкнулись бы
со стилями варианта А, у которого всё лежит глобально.

    python3 tools/scope_any.py <исходный.css> <целевой.css> <.корневой-класс>
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def scope_one(sel, scope):
    s = sel.strip()
    if not s:
        return s
    if s == ":root" or s in ("html", "body"):
        return scope
    if s == scope or s.startswith(scope + " ") or s.startswith(scope + ":") \
       or s.startswith(scope + ".") or s.startswith(scope + ","):
        return s
    if s == "*":
        return f"{scope}, {scope} *"
    if s.startswith("*:") or s.startswith("::"):
        return f"{scope} {s}"
    # Корневой класс экрана висит на том же узле, что и обёртка:
    # <div className="nd cw">. Селектор-потомок «.nd .cw» такой узел не ловит,
    # нужен «.nd.cw». Какой из двух случаев — по разметке не угадать,
    # поэтому выдаём оба: лишний селектор безвреден, отсутствующий ломает вид.
    if s.startswith("."):
        return f"{scope} {s}, {scope}{s}"
    return f"{scope} {s}"


def scope_list(sel_list, scope):
    return ", ".join(scope_one(p, scope) for p in sel_list.split(",") if p.strip())


def transform(css, scope):
    out, buf, i, n, depth = [], "", 0, len(css), 0
    raw_until = None
    while i < n:
        if css.startswith("/*", i):
            end = css.find("*/", i + 2)
            end = end + 2 if end != -1 else n
            out.append(buf); buf = ""
            out.append(css[i:end]); i = end
            continue
        ch = css[i]
        if ch == "{":
            sel = buf.strip(); buf = ""
            if raw_until is not None:
                out.append(sel + "{")
            elif sel.startswith("@"):
                at = sel.split()[0].lower()
                if at in ("@keyframes", "@-webkit-keyframes", "@font-face"):
                    raw_until = depth
                out.append(sel + "{")
            else:
                out.append(scope_list(sel, scope) + "{")
            depth += 1; i += 1
            continue
        if ch == "}":
            out.append(buf); buf = ""
            depth -= 1
            if raw_until is not None and depth <= raw_until:
                raw_until = None
            out.append("}"); i += 1
            continue
        buf += ch; i += 1
    out.append(buf)
    return "".join(out)


def main():
    if len(sys.argv) < 4:
        print(__doc__)
        sys.exit(1)
    src, dst, scope = sys.argv[1], sys.argv[2], sys.argv[3]
    css = open(src, encoding="utf-8").read()
    res = transform(css, scope)
    header = (f"/* Сгенерировано из {os.path.basename(src)}: все селекторы\n"
              f"   заскоуплены под {scope}, чтобы не пересекаться со стилями\n"
              f"   остальных страниц. Правки вносить в источник и пересобирать\n"
              f"   командой tools/scope_any.py — см. tools/README.md. */\n")
    open(dst, "w", encoding="utf-8").write(header + res)

    unscoped = [m.group(2).strip()[:50]
                for m in re.finditer(r"(^|\})([^{}@/]+)\{", res)
                if m.group(2).strip()
                and not m.group(2).strip().startswith(scope)
                and not re.match(r"^(from|to|\d+%)", m.group(2).strip())]
    print(f"{os.path.basename(src)} -> {os.path.basename(dst)} под {scope}: "
          f"правил {res.count('{')}, незаскоупленных {len(unscoped)}")
    for u in unscoped[:5]:
        print("   ", u)


if __name__ == "__main__":
    main()
