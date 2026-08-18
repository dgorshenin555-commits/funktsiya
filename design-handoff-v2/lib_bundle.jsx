/* lib_bundle.jsx — общая логика платформы для прототипа в Cloud Design.

   ФАЙЛ СГЕНЕРИРОВАН из lib/ основного проекта командой
   python3 tools/build_lib_for_design.py — правки вносить туда, иначе
   при следующей сборке они пропадут.

   Подключать ПЕРВЫМ, до экранов: они берут отсюда данные и состояние.
   Оболочку приложения нужно обернуть в <AppProvider>, иначе useApp
   не найдёт контекст. */
(function () {
  const { createContext, useContext, useState, useEffect, useCallback, useRef } = React;

  /* ---------- constants ---------- */
  // === Типы объектов ===
  // icon — ключ именованной SVG-иконки (_orders/icons), как в форме создания заявки.
  const OBJECT_TYPES = [
      { value: 'private', label: 'Частное строительство', icon: 'pin' },
      { value: 'commercial', label: 'Коммерческая недвижимость', icon: 'building' },
      { value: 'residential', label: 'Жилая недвижимость', icon: 'grid' },
      { value: 'industrial', label: 'Промышленность', icon: 'factory' },
      { value: 'linear', label: 'Линейные объекты', icon: 'globe' },
      { value: 'buildings', label: 'Здания и сооружения', icon: 'layers' },
  ];
  // === Регионы ===
  const REGIONS = [
      'Москва', 'Московская область', 'Санкт-Петербург', 'Ленинградская область',
      'Краснодарский край', 'Свердловская область', 'Новосибирская область',
      'Республика Татарстан', 'Нижегородская область', 'Самарская область',
      'Ростовская область', 'Челябинская область', 'Воронежская область',
      'Красноярский край', 'Пермский край', 'Другой регион',
  ];
  // === Категории исполнителя (вопрос 18) ===
  const EXECUTOR_CATEGORIES = [
      { value: 'designer', label: 'Проектировщик', hint: 'Разделы ПД и РД по выбранным направлениям' },
      { value: 'surveyor', label: 'Обследователь', hint: 'Обследование зданий, обмеры, техсостояние' },
      { value: 'calculator', label: 'Расчётчик', hint: 'Расчётно-конструкторские работы' },
      { value: 'draftsman', label: 'Чертёжник', hint: 'Чертёжно-графические работы, 2D/BIM' },
      { value: 'scan3d', label: '3D-сканирование', hint: 'Лазерное сканирование, облака точек' },
  ];
  const EXECUTOR_CATEGORY_LABELS = Object.fromEntries(EXECUTOR_CATEGORIES.map((c) => [c.value, c.label]));
  const STAGE_P_CAPITAL = [
      { code: 'ПЗ', name: 'Пояснительная записка', specialists: ['Генпроектировщик', 'Технический писатель', 'Архитектор'] },
      { code: 'ПЗУ', name: 'Схема планировочной организации', specialists: ['Архитектор', 'Генпланист', 'Геодезист'] },
      { code: 'АР', name: 'Архитектурные решения', specialists: ['Архитектор', 'ГАП', 'BIM-менеджер'] },
      { code: 'КР', name: 'Конструктивные решения', specialists: ['Конструктор', 'Инженер-строитель', 'BIM-специалист'] },
      { code: 'ЭОМ', name: 'Система электроснабжения', specialists: ['Инженер-электрик', 'Энергетик'] },
      { code: 'ВК', name: 'Водоснабжение / водоотведение', specialists: ['Инженер-сантехник', 'Гидравлик'] },
      { code: 'ОВиК', name: 'Отопление, вентиляция', specialists: ['Инженер-теплоэнергетик'] },
      { code: 'СС', name: 'Сети связи', specialists: ['Инженер слаботочных систем'] },
      { code: 'ГС', name: 'Газоснабжение', specialists: ['Инженер-газовик'] },
      { code: 'ТХ', name: 'Технологические решения', specialists: ['Технолог'] },
      { code: 'ПОС', name: 'Проект организации строительства', specialists: ['Инженер-сметчик', 'Технолог строительного производства'] },
      { code: 'ООС', name: 'Охрана окружающей среды', specialists: ['Инженер-эколог'] },
      { code: 'ПБ', name: 'Пожарная безопасность', specialists: ['Специалист по ПБ'] },
      { code: 'ТБЭ', name: 'Безопасная эксплуатация', specialists: ['Спец. по промбезопасности'] },
      { code: 'ОДИ', name: 'Доступ инвалидов', specialists: ['Архитектор', 'Эргономист'] },
      { code: 'СМ', name: 'Сметная документация', specialists: ['Инженер-сметчик'] },
      { code: 'ГОЧС', name: 'ГО и ЧС', specialists: ['Специалист по ГОиЧС'] },
      { code: 'ПОД', name: 'Проект организации работ по сносу (демонтажу)', specialists: ['Инженер по демонтажу', 'Технолог строительного производства'] },
      { code: 'ЭЭ', name: 'Энергоэффективность', specialists: ['Энергоаудитор'] },
      { code: 'РАСЧ', name: 'Расчётно-конструкторские работы', specialists: ['Инженер-расчётчик'] },
      { code: 'ЧЕРТ', name: 'Чертёжно-графические работы (2D/BIM)', specialists: ['Чертёжник', 'BIM-техник'] },
      { code: '3DSK', name: 'Лазерное 3D-сканирование', specialists: ['Инженер по лазерному сканированию', 'BIM-координатор'] },
  ];
  // === Стадия П — Линейные объекты ===
  const STAGE_P_LINEAR = [
      { code: 'ПЗ', name: 'Пояснительная записка', specialists: ['Генпроектировщик', 'Инженер-строитель (дороги, трассы)'] },
      { code: 'ППО', name: 'Проект полосы отвода', specialists: ['Землеустроитель', 'Кадастровый инженер'] },
      { code: 'ТКР', name: 'Технологические и конструктивные решения', specialists: ['Технолог', 'Инженер-путеец', 'Мостовик'] },
      { code: 'ИЛО', name: 'Инфраструктура линейного объекта', specialists: ['Архитектор', 'Конструктор'] },
      { code: 'ПОС', name: 'Проект организации строительства', specialists: ['Инженер ППР/ПОС', 'Сметчик'] },
      { code: 'ООС', name: 'Охрана окружающей среды', specialists: ['Инженер-эколог', 'Биолог'] },
      { code: 'ПБ', name: 'Пожарная безопасность', specialists: ['Специалист по ПБ'] },
      { code: 'ТБЭ', name: 'Безопасная эксплуатация', specialists: ['Спец. по промбезопасности'] },
      { code: 'СМ', name: 'Сметная документация', specialists: ['Инженер-сметчик'] },
      { code: 'ГОЧС', name: 'ГО и ЧС', specialists: ['Специалист по ГОиЧС'] },
  ];
  const STAGE_RD_GROUPS = [
      {
          letter: 'А', name: 'Архитектурно-строительные решения',
          sections: [
              { code: 'АР', name: 'Архитектурные решения', specialists: ['Архитектор', 'ГАП'] },
              { code: 'АС', name: 'Архитектурно-строительные решения', specialists: ['Архитектор', 'Конструктор'] },
              { code: 'АВ', name: 'Автомобильные дороги', specialists: ['Инженер-дорожник'] },
              { code: 'АГ', name: 'Мосты, путепроводы, эстакады', specialists: ['Мостовик', 'Генпланист'] },
          ],
      },
      {
          letter: 'Б', name: 'Конструктивные решения',
          sections: [
              { code: 'КР', name: 'Конструктивные решения (сборные)', specialists: ['Конструктор (расчётчик)'] },
              { code: 'КЖ', name: 'Конструкции железобетонные', specialists: ['Инженер-конструктор (ЖБК)'] },
              { code: 'КМ', name: 'Конструкции металлические', specialists: ['Инженер-конструктор (МК)'] },
              { code: 'КД', name: 'Конструкции деревянные', specialists: ['Инженер-конструктор (дерево)'] },
              { code: 'КМД', name: 'Металлические деталировочные', specialists: ['Инженер-КМДшник'] },
              { code: 'КТ', name: 'Подземные сооружения', specialists: ['Специалист по подземным сооружениям'] },
          ],
      },
      {
          letter: 'В', name: 'Инженерные системы и оборудование',
          sections: [
              { code: 'ВК', name: 'Внутренний водопровод и канализация', specialists: ['Инженер-сантехник'] },
              { code: 'ОВ', name: 'Отопление, вентиляция, кондиционирование', specialists: ['Инженер ОВиК'] },
              { code: 'ГС', name: 'Внутреннее газоснабжение', specialists: ['Инженер-газовик'] },
              { code: 'ЭО', name: 'Электроснабжение', specialists: ['Инженер-электрик (проектировщик)'] },
              { code: 'ЭМ', name: 'Электрооборудование (силовое)', specialists: ['Инженер-электрик (схемотехник)'] },
              { code: 'ЭС', name: 'Электроснабжение (освещение)', specialists: ['Инженер-светотехник'] },
              { code: 'СС', name: 'Сети связи', specialists: ['Инженер слаботочных систем'] },
              { code: 'СКС', name: 'Структурированные кабельные системы', specialists: ['Инженер ИТ-инфраструктуры'] },
              { code: 'АК', name: 'Автоматизация и диспетчеризация', specialists: ['Инженер-автоматизатор (АСУ ТП)'] },
              { code: 'ОС', name: 'Охранно-пожарная сигнализация', specialists: ['Инженер пожарной автоматики'] },
              { code: 'ВН', name: 'Видеонаблюдение и контроль доступа', specialists: ['Инженер систем безопасности'] },
              { code: 'РТ', name: 'Радио, телевидение, часофикация', specialists: ['Инженер слаботочных систем'] },
          ],
      },
      {
          letter: 'Г', name: 'Внешние инженерные сети',
          sections: [
              { code: 'НВ', name: 'Наружные сети водоснабжения', specialists: ['Инженер наружных сетей (ВС)'] },
              { code: 'НК', name: 'Наружные канализации', specialists: ['Инженер наружных сетей (КН)'] },
              { code: 'НТ', name: 'Наружные сети теплоснабжения', specialists: ['Инженер-теплоэнергетик (сетевой)'] },
              { code: 'НГ', name: 'Наружные сети газоснабжения', specialists: ['Инженер-газовик (сетевой)'] },
              { code: 'НЭ', name: 'Наружные сети электроснабжения', specialists: ['Инженер-электрик (сетевой)'] },
              { code: 'НС', name: 'Наружные сети связи', specialists: ['Инженер слаботочных систем (сетевой)'] },
          ],
      },
      {
          letter: 'Д', name: 'Технологические решения и специальные разделы',
          sections: [
              { code: 'ТХ', name: 'Технологические решения', specialists: ['Технолог (по отрасли)'] },
              { code: 'ТМ', name: 'Технология монтажа', specialists: ['Инженер-механик / технолог монтажа'] },
              { code: 'ОД', name: 'Озеленение и дендроплан', specialists: ['Дендролог', 'Ландшафтный архитектор'] },
              { code: 'БЛ', name: 'Благоустройство территории', specialists: ['Архитектор', 'Генпланист'] },
              { code: 'АД', name: 'Антикоррозийная защита', specialists: ['Инженер по коррозионной защите'] },
              { code: 'АКР', name: 'Акустические решения', specialists: ['Акустик'] },
              { code: 'ТР', name: 'Транспортные решения', specialists: ['Генпланист', 'Спец. по транспорту'] },
              { code: 'ПС', name: 'Противопожарные мероприятия', specialists: ['Специалист по ПБ'] },
          ],
      },
      {
          letter: 'Е', name: 'Организация строительства и демонтажа',
          sections: [
              { code: 'ПОС', name: 'Проект организации строительства', specialists: ['Инженер ППР/ПОС'] },
              { code: 'ПДР', name: 'Проект производства работ', specialists: ['Инженер ППР'] },
          ],
      },
      {
          letter: 'Ж', name: 'Основные прилагаемые документы',
          sections: [
              { code: 'ИР', name: 'Исходные данные', specialists: ['Генпроектировщик'] },
              { code: 'СМ', name: 'Сметная документация', specialists: ['Инженер-сметчик'] },
              { code: 'ОП', name: 'Оборудование, изделия', specialists: ['Технолог'] },
              { code: 'ГЭ', name: 'Энергоэффективность', specialists: ['Энергоаудитор'] },
              { code: 'ЗЧ', name: 'Запасные части', specialists: ['Технолог', 'Механик'] },
              { code: 'ЭД', name: 'Электродетализация', specialists: ['Инженер-электрик'] },
          ],
      },
  ];
  // === Функция получения разделов по стадии и типу объекта ===
  // РД — группы разделов рабочей документации. Эскиз, П и ПД — единый состав
  // проектной документации (стадия «П») по ПП РФ №87; для линейных объектов — свой список.
  function getSections(stage, objectType) {
      if (stage === 'RD') {
          return STAGE_RD_GROUPS;
      }
      return objectType === 'linear' ? STAGE_P_LINEAR : STAGE_P_CAPITAL;
  }
  // Отображаемые ярлыки стадий проектирования (для детали заявки, формы, превью).
  const STAGE_LABELS = {
      sketch: 'Эскиз',
      P: 'П',
      PD: 'ПД',
      RD: 'РД',
  };
  // Отображаемые ярлыки типа привлечения (масштаба).
  const SCALE_LABELS = {
      single: 'Один специалист',
      team: 'Формирование команды',
      org: 'Организация',
  };
  // === Статусы заявок ===
  const ORDER_STATUS_MAP = {
      draft: { label: 'Черновик', color: '#6b7280' },
      published: { label: 'Опубликована', color: '#8b5cf6' },
      in_progress: { label: 'В работе', color: '#3b82f6' },
      completed: { label: 'Завершена', color: '#10b981' },
      cancelled: { label: 'Отменена', color: '#ef4444' },
  };
  const OBJECT_TYPE_LABELS = {
      private: 'Частное строительство',
      commercial: 'Коммерческая недвижимость',
      residential: 'Жилая недвижимость',
      industrial: 'Промышленность',
      linear: 'Линейные объекты',
      buildings: 'Здания и сооружения',
  };

  /* ---------- mock-data ---------- */
  const MOCK_ORDERS = [
      {
          id: 'order1',
          customerId: 'cust1',
          customerName: 'ООО «СтройИнвест»',
          title: 'Проектирование жилого комплекса «Парк Резиденс»',
          description: 'Требуется разработка проектной документации стадии П для жилого комплекса бизнес-класса. 3 секции, 18 этажей, подземная автостоянка. Общая площадь 45 000 м².',
          objectType: 'commercial',
          region: 'Москва',
          scale: 'team',
          stage: 'P',
          sections: ['АР', 'КР', 'ЭОМ', 'ВК', 'ОВиК', 'ПОС', 'ПБ', 'СМ'],
          specialists: ['Архитектор', 'ГАП', 'Конструктор', 'Инженер-электрик', 'Инженер-сантехник'],
          budget: '12 000 000 ₽',
          deadline: '2026-09-01',
          status: 'published',
          responsesCount: 2,
          createdAt: '2026-03-15T10:00:00Z',
      },
      {
          id: 'order2',
          customerId: 'cust2',
          customerName: 'ИП Козлов А.В.',
          title: 'Рабочая документация коттеджа 350 м²',
          description: 'Нужна РД для двухэтажного коттеджа с цокольным этажом. Кирпич, монолитный фундамент. Участок 15 соток в Подмосковье.',
          objectType: 'private',
          region: 'Московская область',
          scale: 'single',
          stage: 'RD',
          sections: ['АР', 'КР', 'ВК', 'ОВ', 'ЭО'],
          specialists: ['Архитектор', 'Конструктор', 'Инженер-сантехник'],
          budget: '800 000 ₽',
          deadline: '2026-06-15',
          status: 'published',
          responsesCount: 1,
          createdAt: '2026-03-14T15:30:00Z',
      },
      {
          id: 'order3',
          customerId: 'cust3',
          customerName: 'АО «НефтеХимПром»',
          title: 'Проект модернизации установки ЭЛОУ-АВТ',
          description: 'Проектная документация на модернизацию атмосферно-вакуумной установки. Производительность 6 млн т/год. Требуется опыт работы с объектами нефтепереработки.',
          objectType: 'industrial',
          region: 'Республика Татарстан',
          scale: 'team',
          stage: 'P',
          sections: ['ТХ', 'КР', 'ЭОМ', 'АК', 'ПБ', 'ООС', 'СМ'],
          specialists: ['Технолог', 'Конструктор', 'Инженер-электрик', 'Специалист по ПБ'],
          budget: '28 000 000 ₽',
          deadline: '2026-12-01',
          status: 'published',
          responsesCount: 0,
          createdAt: '2026-03-13T09:00:00Z',
      },
      {
          id: 'order4',
          customerId: 'cust1',
          customerName: 'ООО «СтройИнвест»',
          title: 'Водоснабжение микрорайона «Солнечный»',
          description: 'Проектирование наружных сетей водоснабжения и канализации для нового микрорайона. Протяжённость сетей — 4.2 км.',
          objectType: 'linear',
          region: 'Краснодарский край',
          scale: 'team',
          stage: 'P',
          sections: ['ПЗ', 'ТКР', 'ПОС', 'ООС', 'СМ'],
          specialists: ['Инженер наружных сетей (ВС)', 'Инженер наружных сетей (КН)'],
          budget: '5 500 000 ₽',
          deadline: '2026-08-01',
          status: 'in_progress',
          responsesCount: 0,
          createdAt: '2026-03-10T12:00:00Z',
      },
      {
          id: 'order5',
          customerId: 'cust4',
          customerName: 'МКУ «Управление капстроительства»',
          title: 'Проект школы на 1100 мест',
          description: 'Требуется полный комплект ПД для общеобразовательной школы. 4 этажа, спортзал, бассейн, актовый зал. Площадь участка 2.5 га.',
          objectType: 'buildings',
          region: 'Новосибирская область',
          scale: 'team',
          stage: 'P',
          sections: ['ПЗ', 'ПЗУ', 'АР', 'КР', 'ЭОМ', 'ВК', 'ОВиК', 'СС', 'ПОС', 'ООС', 'ПБ', 'ОДИ', 'СМ', 'ГОЧС'],
          specialists: ['Генпроектировщик', 'Архитектор', 'ГАП', 'Конструктор'],
          budget: 'Ждём предложений',
          deadline: '2026-11-30',
          status: 'published',
          responsesCount: 1,
          createdAt: '2026-03-12T08:00:00Z',
      },
      {
          id: 'order6',
          customerId: 'cust5',
          customerName: 'ООО «АвтоТранс»',
          title: 'Реконструкция складского комплекса',
          description: 'Реконструкция складского комплекса класса А. Общая площадь 12 000 м². Замена кровли, утепление, модернизация инженерных систем.',
          objectType: 'commercial',
          region: 'Свердловская область',
          scale: 'team',
          stage: 'RD',
          sections: ['АР', 'КР', 'ЭО', 'ОВ', 'ВК', 'ПОС'],
          specialists: ['Архитектор', 'Конструктор', 'Инженер ОВиК'],
          budget: '3 200 000 ₽',
          deadline: '2026-07-15',
          status: 'completed',
          responsesCount: 0,
          createdAt: '2026-02-20T10:00:00Z',
      },
  ];
  const MOCK_RESPONSES = [
      {
          id: 'resp1',
          orderId: 'order1',
          designerId: 'des1',
          designerName: 'Архитектурное бюро «ПРОЕКТ.А»',
          designerCompany: 'ООО «ПРОЕКТ.А»',
          message: 'Имеем опыт проектирования ЖК бизнес-класса. Выполнили более 15 аналогичных проектов. Готовы приступить в течение 2 недель.',
          proposedBudget: '10 800 000 ₽',
          proposedDeadline: '2026-08-15',
          createdAt: '2026-03-15T14:00:00Z',
      },
      {
          id: 'resp2',
          orderId: 'order1',
          designerId: 'des2',
          designerName: 'ГК «ИнжПроектСервис»',
          designerCompany: 'ООО «ИнжПроектСервис»',
          message: 'Специализируемся на комплексном проектировании. В штате 50+ специалистов. СРО уровень 3.',
          proposedBudget: '11 500 000 ₽',
          proposedDeadline: '2026-09-01',
          createdAt: '2026-03-15T16:30:00Z',
      },
      {
          id: 'resp3',
          orderId: 'order2',
          designerId: 'des3',
          designerName: 'Иванов Сергей Петрович',
          message: 'Проектирую частные дома 8 лет. Портфолио: 40+ реализованных проектов. Работаю в Revit.',
          proposedBudget: '650 000 ₽',
          proposedDeadline: '2026-05-30',
          createdAt: '2026-03-14T18:00:00Z',
      },
      {
          id: 'resp4',
          orderId: 'order5',
          designerId: 'des1',
          designerName: 'Архитектурное бюро «ПРОЕКТ.А»',
          designerCompany: 'ООО «ПРОЕКТ.А»',
          message: 'Имеем опыт проектирования образовательных учреждений. Выполнили 5 школ и 3 детских сада.',
          proposedBudget: '18 000 000 ₽',
          proposedDeadline: '2026-11-01',
          createdAt: '2026-03-12T14:00:00Z',
      },
  ];
  // === Проектировщики ===
  const MOCK_DESIGNERS = [
      {
          id: 'dsn1',
          name: 'Олег Соколов',
          type: 'person',
          sections: ['АР', 'ЧЕРТ'],
          city: 'Санкт-Петербург',
          region: 'Санкт-Петербург',
          sroNumber: 'СРО ООО «Альфа-Проект»',
          rating: 4.6,
          reviewsLabel: 'Рейтинг',
          projectsCount: 198,
          yearsExperience: 12,
          phone: '+7 912 345-67-89',
          email: 'sokolov@proekt.ru',
          achievements: ['Заявки', 'Звонки'],
          description: 'Архитектор с опытом проектирования жилых комплексов. Работает в AutoCAD, Revit и ArchiCAD.',
      },
      {
          id: 'dsn2',
          name: 'Вадим Петров',
          type: 'person',
          sections: ['КР', 'АР', 'РАСЧ'],
          city: 'Санкт-Петербург',
          region: 'Санкт-Петербург',
          sroNumber: 'СРО НБПI-04-032',
          rating: 4.8,
          reviewsLabel: 'Рейтинг',
          projectsCount: 21,
          yearsExperience: 6,
          phone: '+7 987 125-45-67',
          email: 'petrov@design.ru',
          achievements: ['С 2020 года в проектировании', '6 лет стажа в проектировании', 'Первые места в конкурсах'],
      },
      {
          id: 'dsn3',
          name: 'ООО «ПроектСити»',
          type: 'company',
          sections: ['КР'],
          city: 'Москва',
          region: 'Москва',
          sroNumber: 'СРО ДОМФ-01-134',
          rating: 4.7,
          reviewsLabel: 'Рейтинг',
          projectsCount: 86,
          yearsExperience: 15,
          phone: '+7 495 123-45-67',
          email: 'info@proektcity.ru',
          achievements: ['Заявки', 'Звонки'],
      },
      {
          id: 'dsn4',
          name: 'Андрей Смирнов',
          type: 'person',
          sections: ['КР'],
          city: 'Воронеж',
          region: 'Воронежская область',
          sroNumber: 'СРО ПТЗ-05-456',
          rating: 4.5,
          reviewsLabel: 'Рейтинг',
          projectsCount: 48,
          yearsExperience: 8,
          phone: '+7 920 111-22-33',
          email: 'smirnov@arch.ru',
          achievements: ['АР', 'Звонки'],
      },
      {
          id: 'dsn5',
          name: 'АрхПроект Строй',
          type: 'company',
          sections: ['КР', 'АР', '3DSK'],
          city: 'Санкт-Петербург',
          region: 'Санкт-Петербург',
          sroNumber: 'СРО ППЦ-02-467',
          rating: 4.7,
          reviewsLabel: 'Рейтинг',
          projectsCount: 66,
          yearsExperience: 10,
          phone: '+7 812 222-33-44',
          email: 'info@archproekt.ru',
          achievements: ['АР', 'Звонки'],
      },
      {
          id: 'dsn6',
          name: 'Елена Волкова',
          type: 'person',
          sections: ['ЭОМ', 'ВК', 'ЭС'],
          city: 'Москва',
          region: 'Москва',
          sroNumber: 'СРО ИНЖ-07-891',
          rating: 4.9,
          reviewsLabel: 'Рейтинг',
          projectsCount: 74,
          yearsExperience: 14,
          phone: '+7 926 555-66-77',
          email: 'volkova@eng.ru',
          achievements: ['Заявки', 'Звонки'],
          description: 'Инженер электрик-сетей. Более 70 реализованных проектов.',
      },
      {
          id: 'dsn7',
          name: 'ООО «СПД»',
          type: 'company',
          sections: ['ТУС'],
          city: 'Москва',
          region: 'Москва',
          sroNumber: 'СРО СПП-77-187',
          rating: 4.5,
          reviewsLabel: 'Рейтинг',
          projectsCount: 188,
          yearsExperience: 20,
          phone: '+7 495 999-88-77',
          email: 'info@spd.ru',
          achievements: ['ТЕВ', 'Звонки'],
      },
      {
          id: 'dsn8',
          name: 'Дмитрий Орлов',
          type: 'person',
          sections: ['ОВиК', 'ГС'],
          city: 'Краснодар',
          region: 'Краснодарский край',
          sroNumber: 'СРО КРД-12-345',
          rating: 4.3,
          reviewsLabel: 'Рейтинг',
          projectsCount: 35,
          yearsExperience: 7,
          phone: '+7 918 444-55-66',
          email: 'orlov@vent.ru',
          achievements: ['Заявки', 'Звонки'],
      },
  ];
  // === Последние проекты ===
  const MOCK_PROJECTS = [
      { id: 'prj1', title: 'ЖК «Ренессанс»', location: 'Санкт-Петербург', projectsCount: 67 },
      { id: 'prj2', title: 'МФК «Старый город»', location: 'Казань', projectsCount: 17 },
      { id: 'prj3', title: 'ТЦ «Галерея»', location: 'Москва', projectsCount: 42 },
      { id: 'prj4', title: 'БЦ «Высота»', location: 'Новосибирск', projectsCount: 23 },
  ];
  // === Производители и Решения ===
  const MOCK_MANUFACTURERS = [
      {
          id: 'mfg1',
          name: 'ООО «ТехФасад»',
          description: 'Производитель фасадных систем и узлов для жилых и коммерческих зданий',
          tags: ['BIM', 'Узлы', 'СП / ГОСТ', 'АР / КР'],
          rating: 4.8,
          projectsCount: 120,
          deliveryRegion: 'РФ / СНГ',
          website: 'www.techfasad.ru',
          email: 'info@techfasad.ru',
          phone: '+7 495 125-45-67',
      },
      {
          id: 'mfg2',
          name: 'Завод ЖБИ «ЗапСибСтрой»',
          description: 'Производство ЖБИ изделий для промышленного и гражданского строительства',
          tags: ['КР', 'Нормативы', 'Промышленность'],
          rating: 4.9,
          projectsCount: 87,
          deliveryRegion: 'РФ / СНГ',
      },
      {
          id: 'mfg3',
          name: 'Завод ЖБИ «ЗапСибСтрой»',
          description: 'Производство ЖБИ изделий для промышленного и гражданского строительства',
          tags: ['КР', 'Нормативы', 'Промышленность'],
          rating: 4.9,
          projectsCount: 87,
          deliveryRegion: 'РФ / СНГ',
      },
      {
          id: 'mfg4',
          name: 'АО «ПрофМет»',
          description: 'Производитель металлических конструкций, поставщик для кровельных систем',
          tags: ['КР', 'Металл', 'ГОСТ'],
          rating: 4.6,
          projectsCount: 65,
          deliveryRegion: 'РФ',
      },
  ];
  const MOCK_MANUFACTURER_PRODUCTS = [
      {
          id: 'prod1',
          name: 'Фасадная система F-300',
          subtitle: 'Навес на фасад',
          tags: ['BIM', 'Узлы', 'FC', 'Сертификаты'],
          spec: 'СП 60, ГОСТ-31231',
          certCount: 18,
      },
      {
          id: 'prod2',
          name: 'Узел крепления UF-12',
          subtitle: 'Узел фасада',
          tags: ['BIM', 'Узлы', 'ГОСТ', 'КР'],
          spec: 'ФС ГОСТ-31231',
          certCount: 68,
      },
  ];
  // === Нормативные документы ===
  const MOCK_STANDARDS = [
      { id: 'std1', code: 'ГОСТ 21.602-2016', title: 'Проектная документация', type: 'ГОСТ', section: 'Общие положения', year: 2023, status: 'Актуален', updatedYear: 2023, isFeatured: true },
      { id: 'std2', code: 'ГОСТ 34.201-2021', title: 'АСУ ТП', type: 'ГОСТ', section: 'АСУ ТП', year: 2024, status: 'Актуален', updatedYear: 2024, isFeatured: true },
      { id: 'std3', code: 'ГОСТ 21.412-2022', title: 'Автоматизация', type: 'ГОСТ', section: 'Автоматизация', year: 2024, status: 'Актуален', updatedYear: 2024, isFeatured: true },
      { id: 'std4', code: 'ГОСТ 21.1101', title: 'Основные требования к проектной документации', type: 'ГОСТ', section: 'Общие положения', year: 2022, status: 'Актуален' },
      { id: 'std5', code: 'СП 60.13330', title: 'Отопление, вентиляция и кондиционирование', type: 'СП', section: 'Отопление', year: 2023, status: 'Актуален' },
      { id: 'std6', code: 'СНиП 2.04', title: 'Водоснабжение наружное', type: 'СНиП', section: 'Водоснабжение', year: 2001, status: 'Устарел' },
      { id: 'std7', code: 'ISO 9001-2015', title: 'Системы менеджмента качества', type: 'ISO', section: 'Системы менеджмента', year: 2015, status: 'Актуален' },
      { id: 'std8', code: 'ГОСТ-66-3020', title: 'Нефть и газ', type: 'ГОСТ', section: 'Нефть и газ', year: 2024, status: 'Актуален' },
      { id: 'std9', code: 'ГОСТ-62.3341', title: 'Теплоизоляция', type: 'ГОСТ', section: 'Тепловая изоляция', year: 2020, status: 'Актуален' },
  ];
  // Свежие изменения за неделю
  const MOCK_RECENT_CHANGES = [
      { code: 'ГОСТ 2104-2024', spec: 'СП ГОСТ-2.2036', count: 925, status: 'Актуален' },
      { code: 'СП 301.3330-2023', spec: 'СП ГОСТ-8.2019', count: 924, status: 'Ситуацион.' },
      { code: 'ГОСТ 13109-2024', spec: 'СП ГОСТ-8.24036', count: 925, status: 'Ситуацион.' },
  ];
  // Избранное проектировщика
  const MOCK_FAVORITES = [
      { code: 'ГОСТ 28.13330', spec: 'СП МОС-01.2021' },
      { code: 'СНиП 23.101', spec: 'СП МОС-01.2004' },
      { code: 'ГОСТ 32800-2013', spec: 'СП МОС-01.2014' },
  ];
  // === Заявки на экспертизу ===
  const MOCK_EXPERTISE_REQUESTS = [
      {
          id: 'expReq1',
          title: 'Комплексная экспертиза ПД для ЖК «Северный»',
          description: 'Требуется негосударственная экспертиза проектной документации для жилого комплекса (3 корпуса по 15 этажей). Обязательно наличие аккредитации.',
          objectType: 'commercial',
          sections: ['ПЗ', 'АР', 'КР', 'ЭОМ', 'ВК', 'ОВ', 'ПОС', 'СМ'],
          requiredSro: true,
          budget: '450 000 ₽',
          deadline: '2026-05-15',
          responsesCount: 4,
          createdAt: '2026-03-24T10:00:00Z',
          region: 'Москва',
          area: '45 000 м²',
          stage: 'П',
          expType: 'Негосударственная',
          detail: 'Жилой комплекс бизнес-класса: 3 секции, 16–18 этажей, двухуровневая подземная автостоянка на 180 машино-мест. Требуется комплексная негосударственная экспертиза проектной документации с выдачей положительного заключения для получения разрешения на строительство. Проект разработан в BIM, исходные материалы предоставляются полным комплектом.',
          client: 'ООО «СтройИнвест»',
          clientCity: 'Москва',
          files: [
              ['file', 'Проектная документация — 8 разделов.zip', '210 МБ'],
              ['layers', 'Архитектурные чертежи АР.pdf', '48 МБ'],
              ['bim', 'BIM-модель объекта.ifc', '320 МБ'],
              ['file', 'Техническое задание.pdf', '2.4 МБ'],
          ],
      },
      {
          id: 'expReq2',
          title: 'Проверка раздела КР (Складской комплекс)',
          description: 'Нужна проверка расчетов и узлов металлокаркаса складского комплекса (12 000 м²).',
          objectType: 'industrial',
          sections: ['КР'],
          requiredSro: false,
          budget: '50 000 ₽',
          deadline: '2026-04-10',
          responsesCount: 12,
          createdAt: '2026-03-25T14:30:00Z',
          region: 'Московская область',
          area: '12 000 м²',
          stage: 'РД',
          expType: 'Технический аудит',
          detail: 'Одноэтажный складской комплекс класса А, пролёт 24 м, несущий металлический каркас. Требуется проверка статических расчётов несущих конструкций, узлов сопряжения и соответствия СП по нагрузкам и воздействиям. Заключение — в свободной форме, с перечнем замечаний по расчётной части.',
          client: 'ООО «УралЛогистик»',
          clientCity: 'Екатеринбург',
          files: [
              ['file', 'Раздел КР — расчёты и ПЗ.pdf', '36 МБ'],
              ['layers', 'Узлы металлокаркаса.dwg', '12 МБ'],
          ],
      },
      {
          id: 'expReq3',
          title: 'Аудит инженерных систем (Индустриальный парк)',
          description: 'Технический аудит разделов ВВ, ОВиК и ЭОМ для нового индустриального парка.',
          objectType: 'industrial',
          sections: ['ЭОМ', 'ВК', 'ОВ'],
          requiredSro: true,
          budget: '120 000 ₽',
          deadline: '2026-04-20',
          responsesCount: 2,
          createdAt: '2026-03-20T09:15:00Z',
          region: 'Калужская область',
          area: '28 000 м²',
          stage: 'П',
          expType: 'Государственная',
          detail: 'Новый индустриальный парк: производственный корпус и административно-бытовой комплекс. Требуется технический аудит инженерных разделов — электроснабжение, водоснабжение и водоотведение, отопление и вентиляция — на соответствие нормативам и оптимальность решений перед прохождением государственной экспертизы.',
          client: 'АО «ИндустрияДевелопмент»',
          clientCity: 'Калуга',
          files: [
              ['file', 'Разделы ЭОМ, ВК, ОВ.zip', '96 МБ'],
              ['file', 'Техническое задание на аудит.pdf', '3.1 МБ'],
          ],
      }
  ];
  // === Проекты на экспертизе (Dashboard) ===
  const MOCK_EXPERTISE_PROJECTS = [
      {
          id: 'expPrj1',
          title: 'Реконструкция школы №15',
          company: 'ООО «СтройПроект»',
          status: 'На проверке',
          totalRemarks: 12,
          fixedRemarks: 0,
          criticalRemarks: 3,
          dueDate: '2026-04-05'
      },
      {
          id: 'expPrj2',
          title: 'Торговый центр «Галерея»',
          company: 'АО «ИнвестСтрой»',
          status: 'Ожидает исправлений',
          totalRemarks: 24,
          fixedRemarks: 18,
          criticalRemarks: 0,
          dueDate: '2026-03-30'
      },
      {
          id: 'expPrj3',
          title: 'Коттеджный посёлок «Лесной»',
          company: 'ИП Смирнов А.В.',
          status: 'Положительное заключение',
          totalRemarks: 8,
          fixedRemarks: 8,
          criticalRemarks: 0,
          dueDate: '2026-03-20'
      }
  ];
  // === Отклики на заявки на экспертизу ===
  const MOCK_EXPERTISE_RESPONSES = [
      {
          id: 'expRes1', expertiseId: 'expReq1', expertId: 'demo-expert', expertName: 'Демо Обследователь',
          message: 'Готов выполнить обследование несущих конструкций, есть опыт по аналогичным объектам.',
          proposedBudget: '180 000 ₽', proposedDeadline: '20 дней', status: 'sent', createdAt: '2026-06-12T09:00:00.000Z',
      },
      {
          id: 'expRes2', expertiseId: 'expReq2', expertId: 'demo-expert', expertName: 'Демо Обследователь',
          message: 'Проведём инструментальное обследование с тепловизионной съёмкой. Аккредитация в наличии.',
          proposedBudget: '240 000 ₽', proposedDeadline: '25 дней', status: 'accepted', createdAt: '2026-06-13T11:30:00.000Z',
      },
  ];

  /* ---------- store ---------- */
  'use client';
  const AppContext = createContext(undefined);
  function generateId() {
      return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
  }
  // Код восстановления пароля вида XXXX-XXXX. Алфавит без похожих символов (I, O, 0, 1).
  const RECOVERY_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  function generateRecoveryCode() {
      let out = '';
      for (let i = 0; i < 8; i++) {
          if (i === 4)
              out += '-';
          out += RECOVERY_ALPHABET[Math.floor(Math.random() * RECOVERY_ALPHABET.length)];
      }
      return out;
  }
  // Сравнение кодов без учёта регистра, дефисов и пробелов.
  function normalizeRecoveryCode(code) {
      return (code || '').replace(/[\s-]/g, '').toUpperCase();
  }
  const DEFAULT_FAVORITES = MOCK_STANDARDS.filter((s) => s.isFeatured).map((s) => s.code);
  function loadState() {
      if (typeof window === 'undefined')
          return { user: null, orders: MOCK_ORDERS, responses: MOCK_RESPONSES, favoriteStandardsByUser: {} };
      try {
          const saved = localStorage.getItem('pm_state');
          if (saved) {
              const parsed = JSON.parse(saved);
              return {
                  user: parsed.user || null,
                  orders: parsed.orders?.length ? parsed.orders : MOCK_ORDERS,
                  responses: parsed.responses?.length ? parsed.responses : MOCK_RESPONSES,
                  favoriteStandardsByUser: parsed.favoriteStandardsByUser && typeof parsed.favoriteStandardsByUser === 'object' ? parsed.favoriteStandardsByUser : {},
              };
          }
      }
      catch { }
      return { user: null, orders: MOCK_ORDERS, responses: MOCK_RESPONSES, favoriteStandardsByUser: {} };
  }
  function saveState(state) {
      if (typeof window === 'undefined')
          return;
      localStorage.setItem('pm_state', JSON.stringify(state));
  }
  function AppProvider({ children }) {
      const [state, setState] = useState({ user: null, orders: MOCK_ORDERS, responses: MOCK_RESPONSES, favoriteStandardsByUser: {} });
      const [mounted, setMounted] = useState(false);
      const [notice, setNotice] = useState(null);
      const noticeCounter = useRef(0);
      const notify = useCallback((message) => {
          noticeCounter.current += 1;
          setNotice({ id: noticeCounter.current, message });
      }, []);
      useEffect(() => {
          setState(loadState());
          setMounted(true);
      }, []);
      useEffect(() => {
          if (mounted)
              saveState(state);
      }, [state, mounted]);
      const login = useCallback((email, password) => {
          if (typeof window === 'undefined')
              return false;
          const users = JSON.parse(localStorage.getItem('pm_users') || '[]');
          const found = users.find((u) => u.email.trim().toLowerCase() === email.trim().toLowerCase());
          if (!found)
              return false;
          // Проверяем пароль. У старых аккаунтов пароль мог не сохраниться —
          // для обратной совместимости такие пускаем по email.
          if (found.password && found.password !== password)
              return false;
          const { password: _pw, recoveryCode: _rc, ...safe } = found;
          // Миграция аккаунтов, созданных до модели категорий (вопрос 18):
          // категории исполнителя выводим из legacy-роли.
          if (!safe.executorCategories && (safe.role === 'designer' || safe.role === 'expert')) {
              safe.executorCategories = [safe.role === 'designer' ? 'designer' : 'surveyor'];
          }
          setState((prev) => ({ ...prev, user: safe }));
          return true;
      }, []);
      const register = useCallback((userData) => {
          if (typeof window === 'undefined')
              return false;
          const users = JSON.parse(localStorage.getItem('pm_users') || '[]');
          const email = (userData.email || '').trim().toLowerCase();
          // Дубликат email недопустим (BUG-002).
          if (users.some((u) => u.email.trim().toLowerCase() === email)) {
              return false;
          }
          const name = (userData.name || '').trim();
          if (!name)
              return false;
          const recoveryCode = generateRecoveryCode();
          const newUser = {
              ...userData,
              email,
              name,
              company: userData.company?.trim(),
              recoveryCode,
              id: generateId(),
              createdAt: new Date().toISOString(),
          };
          users.push(newUser);
          localStorage.setItem('pm_users', JSON.stringify(users));
          const { password: _pw, recoveryCode: _rc, ...safe } = newUser;
          setState((prev) => ({ ...prev, user: safe }));
          return recoveryCode;
      }, []);
      // Сброс пароля по коду восстановления. Пользователь не в сессии — правим только pm_users.
      const resetPasswordByCode = useCallback((email, code, newPassword) => {
          if (typeof window === 'undefined')
              return false;
          const users = JSON.parse(localStorage.getItem('pm_users') || '[]');
          const idx = users.findIndex((u) => u.email.trim().toLowerCase() === email.trim().toLowerCase());
          if (idx < 0)
              return false;
          const stored = users[idx].recoveryCode;
          if (!stored)
              return false;
          if (normalizeRecoveryCode(stored) !== normalizeRecoveryCode(code))
              return false;
          users[idx] = { ...users[idx], password: newPassword };
          localStorage.setItem('pm_users', JSON.stringify(users));
          return true;
      }, []);
      const logout = useCallback(() => {
          setState((prev) => ({ ...prev, user: null }));
      }, []);
      const updateUser = useCallback((patch) => {
          setState((prev) => {
              if (!prev.user)
                  return prev;
              const updated = { ...prev.user, ...patch };
              if (typeof window !== 'undefined') {
                  const users = JSON.parse(localStorage.getItem('pm_users') || '[]');
                  const idx = users.findIndex((u) => u.id === updated.id);
                  if (idx >= 0) {
                      users[idx] = { ...users[idx], ...patch };
                  }
                  else {
                      users.push(updated);
                  }
                  localStorage.setItem('pm_users', JSON.stringify(users));
              }
              return { ...prev, user: updated };
          });
      }, []);
      const addOrder = useCallback((orderData) => {
          const newOrder = {
              ...orderData,
              id: generateId(),
              customerId: state.user?.id || '',
              customerName: state.user?.name || '',
              responsesCount: 0,
              createdAt: new Date().toISOString(),
          };
          setState((prev) => ({ ...prev, orders: [newOrder, ...prev.orders] }));
          return newOrder;
      }, [state.user]);
      const addResponse = useCallback((responseData) => {
          const me = state.user?.id || '';
          // Один проектировщик — один отклик на заявку (BUG-021).
          if (state.responses.some((r) => r.orderId === responseData.orderId && r.designerId === me)) {
              return false;
          }
          const newResponse = {
              ...responseData,
              id: generateId(),
              designerId: me,
              designerName: state.user?.name || '',
              designerCompany: state.user?.company,
              createdAt: new Date().toISOString(),
          };
          setState((prev) => {
              // Повторная проверка внутри апдейтера — защита от гонки при двойном клике.
              if (prev.responses.some((r) => r.orderId === responseData.orderId && r.designerId === me)) {
                  return prev;
              }
              return {
                  ...prev,
                  responses: [newResponse, ...prev.responses],
                  orders: prev.orders.map((o) => o.id === responseData.orderId
                      ? { ...o, responsesCount: o.responsesCount + 1 }
                      : o),
              };
          });
          return true;
      }, [state.user, state.responses]);
      const hasResponded = useCallback((orderId) => {
          const me = state.user?.id;
          return !!me && state.responses.some((r) => r.orderId === orderId && r.designerId === me);
      }, [state.responses, state.user]);
      // Выбор исполнителя заказчиком: заявка переходит «В работу» (BUG-019).
      const selectExecutor = useCallback((orderId, designerId, designerName) => {
          setState((prev) => ({
              ...prev,
              orders: prev.orders.map((o) => o.id === orderId
                  ? { ...o, status: 'in_progress', assignedDesignerId: designerId, assignedDesignerName: designerName }
                  : o),
          }));
      }, []);
      // Приглашение проектировщика в «Команду проекта» заявки (I15).
      const toggleInvitedDesigner = useCallback((orderId, designerId) => {
          setState((prev) => ({
              ...prev,
              orders: prev.orders.map((o) => {
                  if (o.id !== orderId)
                      return o;
                  const invited = o.invitedDesignerIds ?? [];
                  return {
                      ...o,
                      invitedDesignerIds: invited.includes(designerId)
                          ? invited.filter((x) => x !== designerId)
                          : [...invited, designerId],
                  };
              }),
          }));
      }, []);
      const getOrderById = useCallback((id) => {
          return state.orders.find((o) => o.id === id);
      }, [state.orders]);
      const getResponsesForOrder = useCallback((orderId) => {
          return state.responses.filter((r) => r.orderId === orderId);
      }, [state.responses]);
      const getMyOrders = useCallback(() => {
          return state.orders.filter((o) => o.customerId === state.user?.id);
      }, [state.orders, state.user]);
      const getMyResponses = useCallback(() => {
          return state.responses.filter((r) => r.designerId === state.user?.id);
      }, [state.responses, state.user]);
      const toggleFavoriteStandard = useCallback((code) => {
          setState((prev) => {
              const key = prev.user?.id ?? 'anon';
              const current = prev.favoriteStandardsByUser[key] ?? DEFAULT_FAVORITES;
              const updated = current.includes(code) ? current.filter((c) => c !== code) : [...current, code];
              return { ...prev, favoriteStandardsByUser: { ...prev.favoriteStandardsByUser, [key]: updated } };
          });
      }, []);
      const favoriteStandards = state.favoriteStandardsByUser[state.user?.id ?? 'anon'] ?? DEFAULT_FAVORITES;
      const getFavoriteStandards = useCallback(() => MOCK_STANDARDS.filter((s) => favoriteStandards.includes(s.code)), [favoriteStandards]);
      // Сторона обследователя: мок представляет «текущего» эксперта прототипа.
      // Шов изоляции данных — этот геттер; в реальном бэкенде фильтр будет по user.id.
      const getMyExpertiseResponses = useCallback(() => (state.user?.role === 'expert' ? MOCK_EXPERTISE_RESPONSES : []), [state.user]);
      const getMyExpertiseProjects = useCallback(() => (state.user?.role === 'expert' ? MOCK_EXPERTISE_PROJECTS : []), [state.user]);
      const getRecommendedExpertise = useCallback(() => MOCK_EXPERTISE_REQUESTS.slice(0, 4), []);
      // Рекомендации исполнителю: опубликованные заявки, пересекающиеся со
      // специализацией пользователя; если совпадений нет — свежие опубликованные.
      const getRecommendedOrders = useCallback(() => {
          const published = state.orders.filter((o) => o.status === 'published');
          const specs = state.user?.specializations || [];
          const matched = specs.length
              ? published.filter((o) => o.sections?.some((s) => specs.includes(s)))
              : [];
          return (matched.length ? matched : published).slice(0, 4);
      }, [state.orders, state.user]);
      return (<AppContext.Provider value={{
              ...state,
              favoriteStandards,
              hydrated: mounted,
              login, register, resetPasswordByCode, logout, updateUser,
              addOrder, addResponse, hasResponded, selectExecutor, toggleInvitedDesigner,
              getOrderById, getResponsesForOrder,
              getMyOrders, getMyResponses,
              toggleFavoriteStandard, getFavoriteStandards, getMyExpertiseResponses, getMyExpertiseProjects, getRecommendedOrders, getRecommendedExpertise,
              notice, notify,
          }}>
        {children}
      </AppContext.Provider>);
  }
  function useApp() {
      const ctx = useContext(AppContext);
      if (!ctx)
          throw new Error('useApp must be used inside AppProvider');
      return ctx;
  }

  Object.assign(window, { AppProvider, EXECUTOR_CATEGORIES, EXECUTOR_CATEGORY_LABELS, MOCK_DESIGNERS, MOCK_EXPERTISE_PROJECTS, MOCK_EXPERTISE_REQUESTS, MOCK_EXPERTISE_RESPONSES, MOCK_FAVORITES, MOCK_MANUFACTURERS, MOCK_MANUFACTURER_PRODUCTS, MOCK_ORDERS, MOCK_PROJECTS, MOCK_RECENT_CHANGES, MOCK_RESPONSES, MOCK_STANDARDS, OBJECT_TYPES, OBJECT_TYPE_LABELS, ORDER_STATUS_MAP, REGIONS, SCALE_LABELS, STAGE_LABELS, STAGE_P_CAPITAL, STAGE_P_LINEAR, STAGE_RD_GROUPS, getSections, useApp });
})();
