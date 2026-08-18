/* lib_bundle.jsx — общая логика платформы для прототипа в Cloud Design.

   ФАЙЛ СГЕНЕРИРОВАН из lib/ основного проекта командой
   python3 tools/build_lib_for_design.py — правки вносить туда, иначе
   при следующей сборке они пропадут.

   Подключать ПЕРВЫМ, до экранов: они берут отсюда данные. */
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

  /* ---------- витрина вместо состояния ---------- */
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


  Object.assign(window, { EXECUTOR_CATEGORIES, EXECUTOR_CATEGORY_LABELS, MOCK_DESIGNERS, MOCK_EXPERTISE_PROJECTS, MOCK_EXPERTISE_REQUESTS, MOCK_EXPERTISE_RESPONSES, MOCK_FAVORITES, MOCK_MANUFACTURERS, MOCK_MANUFACTURER_PRODUCTS, MOCK_ORDERS, MOCK_PROJECTS, MOCK_RECENT_CHANGES, MOCK_RESPONSES, MOCK_STANDARDS, OBJECT_TYPES, OBJECT_TYPE_LABELS, ORDER_STATUS_MAP, REGIONS, SCALE_LABELS, STAGE_LABELS, STAGE_P_CAPITAL, STAGE_P_LINEAR, STAGE_RD_GROUPS, getSections, useApp });
})();
