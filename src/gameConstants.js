export const GOAL_POSITION = [10, 0.5, 10];
export const GOAL_SIZE = 1.6;
export const GOAL_HEIGHT = 1;
export const GOAL_HALF_SIZE = GOAL_SIZE / 2;
export const GOAL_TOP_Y = GOAL_POSITION[1] + GOAL_HEIGHT / 2;

export const CHARACTER_RADIUS = 0.45;

export const GRAVITY = 0.012;
export const JUMP_SPEED = 0.24;

export const MOVE_STEP = 0.4;
export const ROTATE_STEP = Math.PI / 32; // 5.625 degrees

export const FLOOR_Y = 0;

export const STAIRS_CX = -3.0;
export const STAIRS_W = 2.0;
export const STAIRS_H = 1;
export const STAIRS_D = 0.5;
export const STAIRS_Z = 1.5;
export const STAIRS_COUNT = 10;

// ─── ДОДАНО: Межі підлоги мезоніну ────────────────────────────────────────────
// Збігаються з геометрією mesh платформи: position=[-6,5,-5.5], args=[8,0.2,5]
export const MEZZANINE_X_MIN    = -10.0; // Ліва межа мезоніну по X  (-6.0 - 8/2 = -10)
export const MEZZANINE_X_MAX    =  -2.0; // Права межа мезоніну по X (-6.0 + 8/2 = -2)
export const MEZZANINE_Z_MIN    =  -8.0; // Задня межа мезоніну по Z  (-5.5 - 5/2 = -8)
export const MEZZANINE_Z_MAX    =  -3.0; // Передня межа мезоніну по Z(-5.5 + 5/2 = -3)
export const MEZZANINE_FLOOR_Y  =   5.1; // Висота верхньої поверхні платформи (5 + 0.2/2 = 5.1)

// ─── ДОДАНО: Параметри взаємодії з диваном ────────────────────────────────────
// Збігаються з position дивана у Environment.jsx: <MezzanineSofa position={[-7, 5.1, -6.8]} />
export const SOFA_WORLD_X        = -7.0;         // Центр дивана по X у сцені
export const SOFA_WORLD_Z        = -6.8;         // Центр дивана по Z у сцені
export const SOFA_INTERACT_DIST  =  1.8;         // Радіус (у XZ), у якому спрацьовує клавіша E
export const SOFA_SIT_X          = -7.0;         // X персонажа під час сидіння
export const SOFA_SIT_Z          = -6.5;         // Z персонажа під час сидіння (на сидінні дивана)
export const SOFA_SIT_Y          =  5.1;         // Y ніг персонажа — рівень підлоги мезоніну
export const SOFA_SIT_ROTATION   = Math.PI;      // Кут повороту при сидінні (обличчям від спинки, до кімнати)

export const COLLECTIBLES = [
  // ── Підлога кімнати (6 предметів) ───────────────────────────────────────────
  { id: 'c1',  pos: [ 2.0,  0.45,  3.5],  label: 'Золота монета' },        // біля входу
  { id: 'c2',  pos: [-7.5,  0.45,  5.0],  label: 'Бронзовий диск' },       // дальній лівий кут
  { id: 'c3',  pos: [ 9.0,  0.45,  1.0],  label: 'Срібна монета' },        // підлога біля стелажу
  { id: 'c4',  pos: [ 9.0,  0.45, -2.0],  label: 'Антична чаша' },         // стелаж, інша сторона
  { id: 'c5',  pos: [ 5.0,  0.45, -6.0],  label: 'Кристал' },              // перед інтерактивною шафою
  { id: 'c6',  pos: [-6.0,  0.45, -4.5],  label: 'Медальйон' },            // біля тумбочки Cabinet
  // ── Сходи (1 предмет) ───────────────────────────────────────────────────────
  { id: 'c7',  pos: [-3.0,  2.3,   0.0],  label: 'Рубін на сходах' },      // 4-та сходинка
  // ── Мезонін (3 предмети) ────────────────────────────────────────────────────
  { id: 'c8',  pos: [-3.0,  5.55, -4.5],  label: 'Сапфір біля входу' },    // одразу після входу
  { id: 'c9',  pos: [-7.0,  5.55, -5.5],  label: 'Смарагд біля дивана' },  // поруч з диваном
  { id: 'c10', pos: [-8.5,  5.55, -7.0],  label: 'Давня реліквія' },       // дальній кут мезоніну
];

export const COLLECT_RADIUS = 1.2; // Радіус, у якому можна збирати предмет (відстань до позиції предмета)

//
// Звідки беруться числа — геометрія стін у Environment.jsx:
//   Ліва стіна  : Box pos=[-10, 5, 0]   args=[0.3, 10, 16]
//                 → внутрішня поверхня по X = -10 + 0.3/2 = -9.85
//   Права стіна : Box pos=[ 10, 5, 0]   args=[0.3, 10, 16]
//                 → внутрішня поверхня по X =  10 - 0.3/2 =  9.85
//   Задня стіна : Box pos=[  0, 5,-8]   args=[20, 10, 0.3]
//                 → внутрішня поверхня по Z =  -8 + 0.3/2 = -7.85
//   Передня ст. : Box pos=[ -4, 5, 8]   args=[12, 10, 0.3]
//                 → внутрішня поверхня по Z =   8 - 0.3/2 =  7.85
//
// Від кожної внутрішньої поверхні віднімаємо CHARACTER_RADIUS (= 0.45),
// тому що перевіряємо центр персонажа, а не його края.
// Іншими словами: якщо центр персонажа дійшов до цієї межі — його бік
// вже торкається стіни, і далі рухатись не можна.
export const ROOM_CHAR_X_MIN = -19.40; // = -9.85 + 0.45
export const ROOM_CHAR_X_MAX =  19.40; // =  9.85 - 0.45
export const ROOM_CHAR_Z_MIN = -19.40; // = -7.85 + 0.45
export const ROOM_CHAR_Z_MAX =  19.40; // =  7.85 - 0.45


// ─── Межі кімнати: колізія КАМЕРИ (точка, без радіуса) ───────────────────────
//
// Камера — це просто точка у просторі, радіуса не має.
// Обмежуємо трохи далі від inner surface (відступ ~0.05),
// щоб камера не "пірнала" у полігон стіни і не давала Z-fighting.
// ROOM_CAM_Y_MIN = 0.40, щоб камера не ховалась під підлогу (y=0).
// ROOM_CAM_Y_MAX = 9.80, щоб не виходила крізь стелю (inner у y=9.85).
export const ROOM_CAM_X_MIN = -19.80;
export const ROOM_CAM_X_MAX =  19.80;
export const ROOM_CAM_Y_MIN =  0.40;
export const ROOM_CAM_Y_MAX =  19.80;
export const ROOM_CAM_Z_MIN = -19.80;
export const ROOM_CAM_Z_MAX =  19.80;


// ─── AABB-колізія ДРАБИНИ (простір, у який центр персонажа не може заходити) ─
//
// LadderToShelves (Environment.jsx): group pos = [9.5, 0, 3.05]
//   Ліва рейка  : local [-0.18, 2.2, 0] → world x = 9.32,  ширина 0.07  → зовн. край x = 9.285
//   Права рейка : local [ 0.18, 2.2, 0] → world x = 9.68,  ширина 0.07  → зовн. край x = 9.715
//   Перекладини : local [0, y,    0]    → world z = 3.05,  глибина 0.06 → z [3.017..3.083]
//   Висота рейок: 4.4 одиниці (від y=0 до y=4.4)
//
// До кожної грані додаємо CHARACTER_RADIUS (0.45), щоб перевіряти центр персонажа:
//   LADDER_COLL_X_MIN = 9.285 - 0.45 = 8.835 → округлено до 8.80
//   LADDER_COLL_Z_MIN = 3.017 - 0.45 = 2.567 → округлено до 2.55
//   LADDER_COLL_Z_MAX = 3.083 + 0.45 = 3.533 → округлено до 3.55
//
// LADDER_COLL_X_MIN — ліва "зона дії" (перевіряємо тільки коли x > цього значення),
// бо драбина стоїть у правій частині кімнати; для лівої частини — колізія не потрібна.
export const LADDER_COLL_X_MIN =  8.80; // ліва межа зони дії (x > 8.80 = біля правої стіни)
export const LADDER_COLL_Z_MIN =  2.55; // передній край expanded-AABB (перед драбиною)
export const LADDER_COLL_Z_MAX =  3.55; // задній  край expanded-AABB (за драбиною)
export const LADDER_COLL_Y_MAX =  4.50; // верхня  межа (вище рейок — колізія вимикається)
