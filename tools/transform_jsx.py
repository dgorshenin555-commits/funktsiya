#!/usr/bin/env python3
"""РАЗОВЫЙ импорт варианта Б из Cloud Design в модули Next.js.

ВНИМАНИЕ: скрипт перезаписывает app/v2/_screens/ целиком. Экраны там
уже дописаны вручную, поэтому по умолчанию он откажется работать.
Подробности и порядок действий при новой выгрузке — в tools/README.md.

Переводит модули варианта Б из браузерных IIFE в модули Next.js.

Что делает с каждым файлом:
  1. снимает обёртку (function () { ... })();
  2. добавляет "use client" и импорт React
  3. Object.assign(window, {...})  ->  Object.assign(SCREENS, {...})
  4. window.Foo                    ->  S.Foo
  5. "assets/x.png"                ->  IMG["x.png"]  (basePath-safe пути)
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SRC_DIR = os.path.join(ROOT, "design-handoff-v2")
DST_DIR = os.path.join(ROOT, "app", "v2", "_screens")

MODULES = [
    # общий источник данных формы заявки — должен грузиться раньше остальных
    "request_form.jsx",
    "new_design.jsx",
    "new_design_detail.jsx",
    "new_design_dirs.jsx",
    "new_design_extra.jsx",
    "new_design_flow.jsx",
    "new_design_more.jsx",
    "new_design_order.jsx",
    "new_design_pad.jsx",
    "new_design_scrub.jsx",
    "new_design_solo.jsx",
    "new_design_wizard.jsx",
    "new_design_land.jsx",
    "new_design_land2.jsx",
    "new_design_land3.jsx",
    "new_design_signup.jsx",
    "new_design_client.jsx",
]


def strip_iife(src):
    """Убирает обёртку (function () { ... })(); и снимает один уровень отступа."""
    # выгрузки Cloud Design встречаются в двух формах обёртки:
    # (function () { ... })();  и  (() => { ... })();
    m = re.search(r"^\((?:function\s*\(\s*\)|\(\s*\)\s*=>)\s*\{\s*$", src, re.M)
    if not m:
        return src, False
    start = m.end()
    # ищем закрывающую строку })(); с конца
    m2 = None
    for mm in re.finditer(r"^\}\)\(\);\s*$", src, re.M):
        m2 = mm
    if not m2:
        return src, False
    body = src[start:m2.start()]
    # снять ведущие два пробела у строк
    lines = body.split("\n")
    out = []
    for ln in lines:
        out.append(ln[2:] if ln.startswith("  ") else ln)
    return "\n".join(out), True


def transform(path):
    src = open(path, encoding="utf-8").read()
    name = os.path.basename(path)

    header_comment = ""
    m = re.match(r"(/\*.*?\*/\s*)", src, re.S)
    if m:
        header_comment = m.group(1).strip()

    body, stripped = strip_iife(src)

    # реестр вместо window
    body = re.sub(r"\bObject\.assign\(\s*window\s*,", "Object.assign(SCREENS,", body)
    body = re.sub(r"\bwindow\.(?=[A-Z])", "SCREENS.", body)

    # пути к картинкам -> карта статических импортов.
    # В JSX-атрибуте значение должно быть в фигурных скобках (src={IMG[...]}),
    # а в обычном JS-коде — без них, поэтому два прохода, атрибуты первыми.
    n_assets = len(re.findall(r'"assets/[^"]+"', body))
    body = re.sub(r'(\b[A-Za-z_][\w-]*)="assets/([^"]+)"', r'\1={IMG["\2"]}', body)
    body = re.sub(r'"assets/([^"]+)"', r'IMG["\1"]', body)

    uses_img = n_assets > 0
    uses_registry = "SCREENS." in body or "Object.assign(SCREENS," in body

    head = ['"use client";', "", "/* Экран варианта Б. Источник: design-handoff-v2/" + name,
            "   Первоначально импортирован скриптом tools/transform_jsx.py, но это был",
            "   разовый перенос: дальше экран дописывается прямо здесь. Повторно",
            "   генератор не гоняем — он вернёт файл к состоянию выгрузки. */",
            'import * as React from "react";']
    if uses_registry:
        head.append('import { SCREENS } from "./registry";')
    if uses_img:
        head.append('import { IMG } from "../_assets";')
    head.append("")

    result = "\n".join(head) + body.lstrip("\n")
    if not result.endswith("\n"):
        result += "\n"

    return result, stripped, n_assets


def guard():
    """Не даёт затереть код, который уже развивают вручную.

    Скрипт был написан для разового переноса варианта Б из Cloud Design.
    После переноса экраны дописывались руками: подключение к хранилищу,
    работа с реальными заявками, модель исполнителя. Ничего из этого
    генератор не знает и восстановить не сможет — повторный прогон
    просто вернёт файлы к состоянию выгрузки.
    """
    if "--overwrite" in sys.argv:
        return
    existing = [n for n in MODULES
                if os.path.exists(os.path.join(DST_DIR, n))]
    if not existing:
        return
    print("Отказ: экраны варианта Б уже существуют и, скорее всего,")
    print("дописаны вручную — генератор их перезапишет и правки пропадут.")
    print(f"Найдено файлов: {len(existing)} в {DST_DIR}")
    print()
    print("Этот скрипт — разовый импорт, а не регулярная процедура.")
    print("Новую выгрузку из Cloud Design переносите точечно: сравните")
    print("её с design-handoff-v2/ и перенесите нужные куски руками.")
    print()
    print("Если действительно нужно перегенерировать с нуля, сначала")
    print("убедитесь, что всё закоммичено, и запустите с --overwrite.")
    sys.exit(1)


def main():
    guard()
    os.makedirs(DST_DIR, exist_ok=True)
    print(f"{'модуль':<26} {'IIFE снят':<10} {'картинок':<9} размер")
    for name in MODULES:
        src_path = os.path.join(SRC_DIR, name)
        out, stripped, n_assets = transform(src_path)
        dst_path = os.path.join(DST_DIR, name)
        open(dst_path, "w", encoding="utf-8").write(out)
        print(f"{name:<26} {'да' if stripped else 'НЕТ':<10} {n_assets:<9} {len(out)}")

    # реестр
    registry = '''"use client";

/* Реестр экранов варианта Б.

   В исходниках Cloud Design модули регистрировали экраны в window
   и обращались друг к другу через window.Foo. Реестр повторяет эту
   схему без глобальных переменных: каждый модуль кладёт свои экраны
   сюда, а ссылается на чужие через SCREENS.Foo. Так сохраняется исходная
   структура и не возникает циклических импортов. */
export const SCREENS = {};
'''
    open(os.path.join(DST_DIR, "registry.js"), "w", encoding="utf-8").write(registry)
    print("\nregistry.js записан")


if __name__ == "__main__":
    main()
