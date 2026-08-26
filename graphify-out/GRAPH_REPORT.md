# Graph Report - .  (2026-06-14)

## Corpus Check
- 61 files · ~459,896 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 385 nodes · 539 edges · 23 communities (20 shown, 3 thin omitted)
- Extraction: 91% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 45 edges (avg confidence: 0.86)
- Token cost: 71,738 input · 23,915 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Заявки детали и создание|Заявки: детали и создание]]
- [[_COMMUNITY_Архитектура и аудит платформы|Архитектура и аудит платформы]]
- [[_COMMUNITY_Профиль дизайнера и layout|Профиль дизайнера и layout]]
- [[_COMMUNITY_Авторизация и каталог дизайнеров|Авторизация и каталог дизайнеров]]
- [[_COMMUNITY_Аналитика, чат, дашборд|Аналитика, чат, дашборд]]
- [[_COMMUNITY_Главная (лендинг) компоненты|Главная (лендинг): компоненты]]
- [[_COMMUNITY_Зависимости npm|Зависимости npm]]
- [[_COMMUNITY_Конфиг TypeScript|Конфиг TypeScript]]
- [[_COMMUNITY_Иконки и карта регионов|Иконки и карта регионов]]
- [[_COMMUNITY_Hero-изображения BIM (заявки)|Hero-изображения BIM (заявки)]]
- [[_COMMUNITY_Маскоты (JSX)|Маскоты (JSX)]]
- [[_COMMUNITY_Маскоты (TSX)|Маскоты (TSX)]]
- [[_COMMUNITY_SVG-иконки Next.js|SVG-иконки Next.js]]
- [[_COMMUNITY_Hero-изображения (public)|Hero-изображения (public)]]
- [[_COMMUNITY_Карта регионов MapLibre|Карта регионов MapLibre]]
- [[_COMMUNITY_Конфиг Next.js|Конфиг Next.js]]

## God Nodes (most connected - your core abstractions)
1. `useApp()` - 33 edges
2. `compilerOptions` - 16 edges
3. `Спецификация платформы «Функция»` - 13 edges
4. `Модель Заявка (Order)` - 8 edges
5. `typeImage()` - 6 edges
6. `formatDeadline()` - 6 edges
7. `REGIONS` - 6 edges
8. `Аудит платформы «Функция» (точность и полнота)` - 6 edges
9. `screens_orders (Orders / OrderDetail / OrderNew)` - 6 edges
10. `Отчёт о ночных исправлениях (QA-прогон, раунд 1)` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Hero Background: Aurora Tower Construction` --semantically_similar_to--> `Hero Image: Commercial Building (BIM)`  [INFERRED] [semantically similar]
  public/hero-bg.png → export-заявки/assets/hero-commercial.png
- `Тип Expert (зашит инлайн в experts/page.tsx)` --semantically_similar_to--> `Модель Проектировщик (Designer)`  [INFERRED] [semantically similar]
  AUDIT.md → SPECIFICATION.md
- `Перенос главной страницы (инструкция)` --semantically_similar_to--> `Перенос раздела «Заявки» (инструкция)`  [INFERRED] [semantically similar]
  export-главная/КАК-ПЕРЕНЕСТИ.md → export-заявки/КАК-ПЕРЕНЕСТИ.md
- `ManufacturersPage()` --calls--> `useApp()`  [EXTRACTED]
  app/(internal)/manufacturers/page.tsx → lib/store.tsx
- `SettingsPage()` --calls--> `useApp()`  [EXTRACTED]
  app/(internal)/settings/page.tsx → lib/store.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Ядро маркетплейса: заявка → отклик → выбор исполнителя** — audit_tier1_marketplace_core, audit_accept_response, report_select_executor, report_marketplace_loop_closed [INFERRED 0.85]
- **Конвейер переноса дизайна Cloud Design в проект** — cloud_design_pipeline, export_landing_transfer_guide, export_orders_transfer_guide, report_qa_night_fixes [INFERRED 0.75]
- **Модель данных платформы (спецификация §4)** — specification_order_model, specification_order_response_model, specification_designer_model, specification_manufacturer_model, specification_standard_document_model, specification_expertise_request_model, specification_expertise_project_model [EXTRACTED 1.00]
- **BIM Hero Image Visual Family** — assets_hero_commercial, assets_hero_industrial, assets_hero_private, public_hero_bg [INFERRED 0.85]

## Communities (23 total, 3 thin omitted)

### Community 0 - "Заявки: детали и создание"
Cohesion: 0.07
Nodes (33): DEMO_FILES, DEMO_MESSAGES, DEMO_REMARKS, initials(), OrderDetailContent(), TABS, TIMELINE_LABELS, isValidBudget() (+25 more)

### Community 1 - "Архитектура и аудит платформы"
Cohesion: 0.07
Nodes (42): acceptResponse (выбор исполнителя / принятие отклика), Тип Expert (зашит инлайн в experts/page.tsx), Ключи localStorage (pm_state, pm_users), Архитектурное ограничение: фронтенд-прототип на localStorage, Тост-механизм notify/notice в сторе, Аудит платформы «Функция» (точность и полнота), Tier 1 — ядро маркетплейса (выбор исполнителя), Модель данных User (не описана в спеке) (+34 more)

### Community 2 - "Профиль дизайнера и layout"
Cohesion: 0.08
Nodes (28): metadata, AVATAR_COLORS, DesignerProfilePage(), TABS, uniqueSections(), MOCK_DESIGNERS, MOCK_FAVORITES, MOCK_MANUFACTURER_PRODUCTS (+20 more)

### Community 3 - "Авторизация и каталог дизайнеров"
Cohesion: 0.08
Nodes (28): AuthPage(), ROLES, AVATAR_COLORS, DesignersPageContent(), SECTION_FILTERS, TABS, uniqueSections(), getSections() (+20 more)

### Community 4 - "Аналитика, чат, дашборд"
Cohesion: 0.07
Nodes (28): AnalyticsPage(), DEFICIT_DATA, KPI_STATS, PRICES_DATA, TRENDS_DATA, Nav(), ChatMessage, ChatPage() (+20 more)

### Community 7 - "Зависимости npm"
Cohesion: 0.10
Nodes (19): dependencies, lucide-react, maplibre-gl, next, react, react-dom, devDependencies, gh-pages (+11 more)

### Community 8 - "Конфиг TypeScript"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 10 - "Иконки и карта регионов"
Cohesion: 0.22
Nodes (8): FuncMark(), Icon(), P, paths, CITIES, LAYERS, plural(), RegionMap()

### Community 12 - "Hero-изображения BIM (заявки)"
Cohesion: 0.57
Nodes (7): Hero Image: Commercial Building (BIM), Hero Image: Industrial Plant (BIM), Hero Image: Private Residence (BIM), BIM Holographic Overlay Visual Pattern, Construction Project Category (Commercial/Industrial/Private), Designer Avatars Grid (6 Headshots), Hero Background: Aurora Tower Construction

### Community 13 - "Маскоты (JSX)"
Cohesion: 0.43
Nodes (4): Mascots(), skew(), useBlink(), useMouse()

### Community 14 - "Маскоты (TSX)"
Cohesion: 0.43
Nodes (4): Mascots(), skew(), useBlink(), useMouse()

### Community 15 - "SVG-иконки Next.js"
Cohesion: 0.40
Nodes (5): File Icon, Globe Icon, Next.js Logo, Vercel Logo, Window Icon

### Community 16 - "Hero-изображения (public)"
Cohesion: 0.50
Nodes (5): Hero image: commercial building (HUD render), Hero image: industrial plant (BIM HUD render), Hero image: private house (BIM HUD render), Category icon: private house with crane (Частное), Project showcase: photo grid of buildings

## Ambiguous Edges - Review These
- `Designer Avatars Grid (6 Headshots)` → `Construction Project Category (Commercial/Industrial/Private)`  [AMBIGUOUS]
  public/designer-avatars.png · relation: conceptually_related_to

## Knowledge Gaps
- **111 isolated node(s):** `KPI_STATS`, `DEFICIT_DATA`, `PRICES_DATA`, `TRENDS_DATA`, `ChatMessage` (+106 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Designer Avatars Grid (6 Headshots)` and `Construction Project Category (Commercial/Industrial/Private)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `useApp()` connect `Аналитика, чат, дашборд` to `Заявки: детали и создание`, `Профиль дизайнера и layout`, `Авторизация и каталог дизайнеров`, `Главная (лендинг): компоненты`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `Icon()` connect `Иконки и карта регионов` to `Главная (лендинг): компоненты`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Are the 7 inferred relationships involving `Модель Заявка (Order)` (e.g. with `acceptResponse (выбор исполнителя / принятие отклика)` and `window.DATA (ORDERS, STATUS, коды разделов/стадий)`) actually correct?**
  _`Модель Заявка (Order)` has 7 INFERRED edges - model-reasoned connections that need verification._
- **What connects `KPI_STATS`, `DEFICIT_DATA`, `PRICES_DATA` to the rest of the system?**
  _111 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Заявки: детали и создание` be split into smaller, more focused modules?**
  _Cohesion score 0.06956521739130435 - nodes in this community are weakly interconnected._
- **Should `Архитектура и аудит платформы` be split into smaller, more focused modules?**
  _Cohesion score 0.07317073170731707 - nodes in this community are weakly interconnected._