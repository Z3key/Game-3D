import { useFrame } from '@react-three/fiber';
import { useState, useRef } from 'react';
import React from 'react';
import { xor } from 'three/tsl';
import * as THREE from 'three';

function Box({ position, args, color, castShadow, receiveShadow }) {
    return (
        <mesh 
            position={position}
            castShadow={castShadow}
            receiveShadow={receiveShadow}
        >
            <boxGeometry args={args}/>
            <meshStandardMaterial color={color} />
        </mesh>
    );
};

function Floor() {
  return (
    <group>
    {[-18, -15, -12, -9, -6, -3, 0, 3, 6, 9, 12, 15, 18].map((z) => (
        <mesh
            key={z}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.001, z]}
            receiveShadow
        >
            <planeGeometry args={[40, 0.05]} />
            <meshStandardMaterial color="#010405" />
        </mesh>
    ))};

    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#2b3c41" />
    </mesh>
    </group>
  );
};

function Ceiling() {
    return (
        <group>
            <mesh position={[0, 11, 0]} receiveShadow>
                <boxGeometry args={[40, 0.3, 40]} />
                <meshStandardMaterial color="#232c2f" />
            </mesh>

            {[-16, -9, -5, 5, 9, 16].map((z) => (
                <mesh
                    key={z}
                    position={[0, 11.001, z]}
                    receiveShadow
                >
                    <boxGeometry args={[40, 0.5, 0.3]} />
                    <meshStandardMaterial color="#1a1f20" />
                </mesh>

            ))}
        </group>
    );
};

function Wardrobe() {
    return(
        <group>
            <mesh position={[19.3, 1.94, 0]} castShadow receiveShadow>
                <boxGeometry args={[1, 0.12, 6]} />
                <meshStandardMaterial color="#364145" />
            </mesh>

            <mesh position={[19.3, 4.94, 0]} castShadow receiveShadow>
                <boxGeometry args={[1, 0.12, 6]} />
                <meshStandardMaterial color="#364145" />
            </mesh>

            {[-2.5, 2.5].map((z) => (
                <React.Fragment key={z}>
                    <Box position={[19.82, 3, z]} args={[0.07, 6.1, 0.07]} 
                    color="#293134" castShadow />
                </React.Fragment>
            ))}
        </group>
    );
};

function Cabinet({ position }) {
    return (
        <group position={position}>
            <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
                <boxGeometry args={[3, 3, 2]} />
                <meshStandardMaterial color="#364145" />
            </mesh>

            <mesh position={[-0.75, 1.5, 1]} castShadow>
                <boxGeometry args={[1.46, 2.9, 0.1]} />
                <meshStandardMaterial color="#526369" />
            </mesh>

            <mesh position={[0.75, 1.5, 1]} castShadow>
                <boxGeometry args={[1.46, 2.9, 0.1]} />
                <meshStandardMaterial color="#526369" />
            </mesh>
        </group>
    );
};

// ДОДАНО: Компонент InteractiveWardrobe — шафа з дверцятами що плавно відкриваються по кліку та предметами всередині (відкриття поки не реалізовано)
function InteractiveWardrobe({ position }) {

    const [leftOpen, setLeftOpen] = useState(false);
    const [rightOpen, setRightOpen] = useState(false);
    const leftDoorRef = useRef();
    const rightDoorRef = useRef();

    const W = 2.4; // Ширина шафи (x)
    const H = 3.2; // Висота шафи (y)
    const D = 1.2; // Глибина шафи (z)

    useFrame(() => {
        if (leftDoorRef.current) {
            leftDoorRef.current.rotation.y = THREE.MathUtils.lerp(
                leftDoorRef.current.rotation.y, 
                leftOpen ? -Math.PI / 2 : 0, 0.1);
        };

        if (rightDoorRef.current) {
            rightDoorRef.current.rotation.y = THREE.MathUtils.lerp(
                rightDoorRef.current.rotation.y, 
                rightOpen ? Math.PI / 2 : 0, 0.1);
        };
    })

    
    return (
        <group position={position}> {/* Загальна група шафи, переміщується через prop position */}
            {/* Задня внутрішня стінка шафи — видно коли дверцята відкриті */}
            <mesh position={[0, H / 2, -D / 2 + 0.04]} castShadow receiveShadow>
                <boxGeometry args={[W - 0.1, H, 0.06]} /> {/* Задня стінка всередині корпусу */}
                <meshStandardMaterial color="#3D1F0D" />
            </mesh>
            {/* Ліва бічна стінка корпусу шафи */}
            <mesh position={[-W / 2 + 0.04, H / 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.06, H, D]} /> {/* Бічна стінка по всій висоті та глибині */}
                <meshStandardMaterial color="#5A2E1A" />
            </mesh>
            {/* Права бічна стінка корпусу шафи */}
            <mesh position={[W / 2 - 0.04, H / 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.06, H, D]} /> {/* Симетрична права стінка */}
                <meshStandardMaterial color="#5A2E1A" />
            </mesh>
            {/* Верхня кришка шафи */}
            <mesh position={[0, H - 0.03, 0]} castShadow receiveShadow>
                <boxGeometry args={[W, 0.06, D]} /> {/* Кришка на повну ширину та глибину */}
                <meshStandardMaterial color="#5A2E1A" />
            </mesh>
            {/* Дно шафи */}
            <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
                <boxGeometry args={[W, 0.06, D]} /> {/* Дно на повну ширину та глибину */}
                <meshStandardMaterial color="#5A2E1A" />
            </mesh>
            {/* Середня полиця всередині шафи — розділяє простір на дві секції */}
            <mesh position={[0, H * 0.5, 0]} castShadow receiveShadow>
                <boxGeometry args={[W - 0.13, 0.05, D - 0.1]} /> {/* Полиця трохи менша ніж внутрішній простір */}
                <meshStandardMaterial color="#4A2C17" />
            </mesh>

            {/* Предмет у нижній секції — дерев'яна скринька */}
            <mesh position={[-0.55, 0.28, 0]} castShadow>
                <boxGeometry args={[0.5, 0.42, 0.5]} /> {/* Розмір скриньки */}
                <meshStandardMaterial color="#8B4513" /> {/* Коричневе дерево скриньки */}
            </mesh>
            {/* Предмет у нижній секції — капелюх (циліндрична форма) */}
            <mesh position={[0.48, 0.36, 0.08]} castShadow>
                <cylinderGeometry args={[0.22, 0.27, 0.38, 16]} /> {/* Циліндр: верхній r=0.22, нижній r=0.27, висота 0.38 */}
                <meshStandardMaterial color="#1A0A00" /> {/* Майже чорний капелюх */}
            </mesh>
            {/* Предмет у верхній секції — червона книга */}
            <mesh position={[0.22, H * 0.5 + 0.2, 0.08]} castShadow>
                <boxGeometry args={[0.24, 0.34, 0.38]} /> {/* Розміри книги */}
                <meshStandardMaterial color="#8B0000" /> {/* Темно-червона обкладинка */}
            </mesh>
            {/* Предмет у верхній секції — зелена книга поруч */}
            <mesh position={[-0.14, H * 0.5 + 0.2, 0.05]} castShadow>
                <boxGeometry args={[0.2, 0.36, 0.36]} /> {/* Трохи інший розмір для різноманітності */}
                <meshStandardMaterial color="#004d00" /> {/* Темно-зелена обкладинка */}
            </mesh>

            {/* Ліві дверцята — обертаються навколо лівого переднього ребра шафи */}
            <group
                ref={leftDoorRef}
                position={[-W / 2 + 0.04, 0, D / 2 - 0.04]}  // Вісь повороту = лівий передній кут корпусу
            >
                {/* Полотно лівих дверцят */}
                <mesh
                    position={[W / 4 - 0.03, H / 2, 0.04]}       // Зміщено вправо від осі повороту на півширини
                    
                    onClick={() => setLeftOpen(prev => !prev)}

                    castShadow
                >
                    <boxGeometry args={[W / 2 - 0.06, H - 0.1, 0.05]} /> {/* Розмір полотна дверцяти */}
                    <meshStandardMaterial color="#6B3A2A" />
                </mesh>
                {/* Кругла золотиста ручка лівих дверцят */}
                <mesh position={[W / 2 - 0.2, H / 2, 0.07]} castShadow>
                    <sphereGeometry args={[0.046, 12, 12]} /> {/* Сфера-ручка */}
                    <meshStandardMaterial color="#C8A060" metalness={0.8} roughness={0.2} /> {/* Металевий блиск ручки */}
                </mesh>
            </group>

            {/* Праві дверцята — обертаються навколо правого переднього ребра шафи */}
            <group
                ref={rightDoorRef}
                
                position={[W / 2 - 0.04, 0, D / 2 - 0.04]}   // Вісь повороту = правий передній кут корпусу
            >
                {/* Полотно правих дверцят */}
                <mesh
                    position={[-(W / 4 - 0.03), H / 2, 0.04]}    // Зміщено вліво від осі повороту на півширини
                    
                    onClick={() => setRightOpen(prev => !prev)}

                    castShadow
                >
                    <boxGeometry args={[W / 2 - 0.06, H - 0.1, 0.05]} /> {/* Розмір полотна дверцяти */}
                    <meshStandardMaterial color="#6B3A2A" />
                </mesh>
                {/* Кругла золотиста ручка правих дверцят */}
                <mesh position={[-(W / 2 - 0.2), H / 2, 0.07]} castShadow>
                    <sphereGeometry args={[0.046, 12, 12]} /> {/* Сфера-ручка */}
                    <meshStandardMaterial color="#C8A060" metalness={0.8} roughness={0.2} /> {/* Металевий матеріал ручки */}
                </mesh>
            </group>
        </group>
    );
}

// ДОДАНО: Компонент MezzanineLamp — торшер на мезоніні, вмикається та вимикається кліком на абажур
function MezzanineLamp({ position }) {    

    const [isOn, setIsOn] = useState(false); // Стан лампи: увімкнено/вимкнено

    return (
        <group position={position}> {/* Група торшера */}
            {/* Основа торшера */}
            <mesh position={[0, 0.06, 0]} castShadow>
                <cylinderGeometry args={[0.2, 0.26, 0.12, 16]} /> {/* Важка кругла основа */}
                <meshStandardMaterial color="#1C1C1C" metalness={0.7} roughness={0.3} /> {/* Металева основа */}
            </mesh>
            {/* Вертикальна стійка (штанга) торшера */}
            <mesh position={[0, 0.87, 0]} castShadow>
                <cylinderGeometry args={[0.03, 0.03, 1.5, 10]} /> {/* Тонка вертикальна труба */}
                <meshStandardMaterial color="#1C1C1C" metalness={0.85} roughness={0.15} />
            </mesh>
            {/* Абажур (конус) — клік вмикає/вимикає лампу */}
            <mesh
                position={[0, 1.73, 0]}

                onClick={() => setIsOn(prev => !prev)}
                
                castShadow
            >
                <coneGeometry args={[0.36, 0.46, 16, 1, true]} /> {/* Відкритий знизу конус-абажур */}
                
                <meshStandardMaterial 
                    color={isOn ? "#c8f0ff" : "#4a4a4a"} // Світлий колір коли увімкнено, темний коли вимкнено
                    emissive={isOn ? "#607178" : "#000000"} // Емісія світла для ефекту світіння
                    emissiveIntensity={isOn ? 0.65 : 0} // Інтенсивність світіння
                    side={THREE.DoubleSide} // Двосторонній матеріал для видимості абажура з будь-якого боку
                />
            </mesh>
            {/* Лампочка всередині абажура — світиться коли увімкнено */}
            <mesh position={[0, 1.57, 0]}>
                <sphereGeometry args={[0.07, 10, 10]} /> {/* Маленька сфера-лампочка */}
                
                <meshStandardMaterial 
                    color={isOn ? "#c8f0ff" : "#aaaaaa"} // Світлий колір коли увімкнено, темний коли вимкнено
                    emissive={isOn ? "#c8f0ff" : "#000000"} // Емісія світла для ефекту світіння
                    emissiveIntensity={isOn ? 4 : 0} // Інтенсивність світіння
                />

            </mesh>

            {isOn && (
                <group>
                <pointLight 
                    position={[0, 1.5, 0]} // Розташування світла в точці лампочки
                    intensity={3.5} // Інтенсивність світла
                    distance={7.5} // Радіус дії світла
                    decay={1} // Затухання світла
                    color="#c8f0ff" // Колір світла
                    castShadow // Лампа відкидає тіні
                />
                <directionalLight
                    position={[0, 5, 0]} // Додаткове спрямоване світло зверху для підсвічування з верхнього ракурсу
                    intensity={0.5} // Невелика інтенсивність для м'якого освітлення
                    color="#c8f0ff" // Такий же теплий колір
                    castShadow
                />  
                </group>
            )};

        </group>
    );
}

// ДОДАНО: Компонент Mezzanine — піднята платформа у лівій задній частині кімнати з огорожею та колонами
function Mezzanine() {
    return (
        <group> {/* Загальна група всіх елементів мезоніну */}
            {/* Підлога мезоніну — горизонтальна платформа на висоті 5 одиниць */}
            <mesh position={[-6.0, 5, -5.5]} castShadow receiveShadow>
                <boxGeometry args={[8, 0.2, 5]} /> {/* Ширина 8 (x:-10 до -2), глибина 5 (z:-8 до -3) */}
                <meshStandardMaterial color="#8B6347" /> {/* Колір дощатої підлоги мезоніну */}
            </mesh>
            {/* Декоративні стики між дошками підлоги мезоніну */}
            {[-7.2, -5.8, -4.4, -3.0].map((z) => (
                <mesh key={z} position={[-6.0, 5.11, z]} castShadow> {/* Виступаюча рейка між дошками */}
                    <boxGeometry args={[8, 0.04, 0.06]} /> {/* Тонка декоративна рейка */}
                    <meshStandardMaterial color="#7B5C38" /> {/* Темніший відтінок для ліній між дошками */}
                </mesh>
            ))}
            {/* Верхній поручень тільки лівої частини огорожі — x:-10 до -4, щоб залишити вхід зі сходів (x:-4 до -2) */}
            <mesh position={[-7.0, 5.72, -3.1]} castShadow>
                <boxGeometry args={[6, 0.09, 0.09]} /> {/* Ширина 6, центр -7.0 (ліва половина) */}
                <meshStandardMaterial color="#4A2C17" />
            </mesh>
            {/* Нижня рейка огорожі — теж тільки ліва частина x:-10 до -4 */}
            <mesh position={[-7.0, 5.32, -3.1]} castShadow>
                <boxGeometry args={[6, 0.06, 0.06]} /> {/* Ширина 6, центр -7.0 */}
                <meshStandardMaterial color="#4A2C17" />
            </mesh>
            {/* Балюстради тільки там де є огорожа (x < -4); -3.8 та -2.8 прибрані — вони були в зоні входу */}
            {[-9.8, -8.8, -7.8, -6.8, -5.8, -4.8].map((x) => (
                <mesh key={x} position={[x, 5.36, -3.1]} castShadow>
                    <boxGeometry args={[0.07, 0.72, 0.07]} />
                    <meshStandardMaterial color="#4A2C17" />
                </mesh>
            ))}
            {/* Стовпчик входу на мезонін — правий край огорожі, позначає початок вільного проходу */}
            <mesh position={[-4.0, 5.36, -3.1]} castShadow>
                <boxGeometry args={[0.12, 0.85, 0.12]} /> {/* Трохи товщий ніж балюстрада — маркер входу */}
                <meshStandardMaterial color="#3D1F0D" />
            </mesh>
            {/* Стовпчик входу на мезонін — лівий край огорожі (що з права), позначає кінець вільного проходу */}
            <mesh position={[-2.1, 5.36, -3.1]} castShadow>
                <boxGeometry args={[0.12, 0.85, 0.12]} /> {/* Трохи товщий ніж балюстрада — маркер входу */}
                <meshStandardMaterial color="#3D1F0D" />
            </mesh>
            {/* Верхній поручень бокової (правої) огорожі мезоніну вздовж z */}
            <mesh position={[-2.1, 5.72, -5.5]} castShadow>
                <boxGeometry args={[0.09, 0.09, 4.9]} /> {/* Бічний поручень вздовж осі z */}
                <meshStandardMaterial color="#4A2C17" />
            </mesh>
            {/* Вертикальні балюстради бокової огорожі */}
            {[-3.5, -5.0, -6.5].map((z) => (
                <mesh key={z} position={[-2.1, 5.36, z]} castShadow> {/* Бокова балюстрада */}
                    <boxGeometry args={[0.07, 0.72, 0.07]} />
                    <meshStandardMaterial color="#4A2C17" />
                </mesh>
            ))}
            {/* Ліва несуча колона мезоніну (від підлоги до платформи) */}
            <mesh position={[-9, 2.5, -3.1]} castShadow receiveShadow>
                <boxGeometry args={[0.22, 5, 0.22]} /> {/* Висота 5 — від y=0 до y=5 */}
                <meshStandardMaterial color="#3D1F0D" />
            </mesh>
            {/* Права несуча колона мезоніну (від підлоги до платформи) */}
            <mesh position={[-2.1, 2.5, -3.1]} castShadow receiveShadow>
                <boxGeometry args={[0.22, 5, 0.22]} /> {/* Симетрична права колона */}
                <meshStandardMaterial color="#3D1F0D" />
            </mesh>
        </group>
    );
}

// ДОДАНО: Компонент StairsToMezzanine — 10 сходинок що піднімаються від підлоги до платформи мезоніну
function StairsToMezzanine() {
    const stepCount = 10; // Кількість сходинок (10 × 0.5м = 5 одиниць висоти до рівня мезоніну)
    const stepH = 0.5;    // Висота кожної сходинки
    const stepD = 0.5;    // Глибина кожної сходинки (крок по z)
    const stepW = 2.0;    // Ширина сходів
    const startZ = 1.5;   // Z-координата нижньої сходинки (від'ємний напрям — до мезоніну)
    const cx = -3.0;      // X-центр сходів (між двома несучими колонами мезоніну)

    return (
        <group> {/* Загальна група сходів */}
            {/* Генерація 10 сходинок — кожна наступна вище (y) та далі до мезоніну (-z) */}
            {Array.from({ length: stepCount }).map((_, i) => (
                <mesh
                    key={i}
                    position={[cx, i * stepH + stepH / 2, startZ - i * stepD]} // i=0 → y=0.25,z=1.5; i=9 → y=4.75,z=-3.0
                    castShadow
                    receiveShadow
                >
                    <boxGeometry args={[stepW, stepH, stepD]} /> {/* Розміри однієї сходинки */}
                    <meshStandardMaterial color="#8B6347" /> {/* Колір дощатих сходинок */}
                </mesh>
            ))}
            {/* Ліве поручень сходів — нахилений під 45° вздовж підйому */}
            <mesh
                position={[cx - stepW / 2 - 0.06, 2.9, -0.75]} // Центр поручня по діагоналі сходів
                rotation={[Math.PI / 4, 0, 0]} // Поворот 45° навколо x — відповідає куту підйому сходинок
                castShadow
            >
                <boxGeometry args={[0.07, 0.07, 6.8]} /> {/* Довжина поручня по гіпотенузі підйому */}
                <meshStandardMaterial color="#3D1F0D" />
            </mesh>
            {/* Праве поручень сходів — дзеркальне до лівого */}
            <mesh
                position={[cx + stepW / 2 + 0.06, 2.9, -0.75]} // Симетрично справа
                rotation={[Math.PI / 4, 0, 0]} // Такий самий кут нахилу 45°
                castShadow
            >
                <boxGeometry args={[0.07, 0.07, 6.8]} /> {/* Симетричний правий поручень */}
                <meshStandardMaterial color="#3D1F0D" />
            </mesh>
        </group>
    );
}


export default function Environment() {
    return (
        <group>
            <Floor />
            <Box 
                position={[0, 10, -20]}
                args={[40, 20, 0.3]}
                color="#758282"
                receiveShadow    
            />
            <Box
                position={[-20, 10, 0]}
                args={[0.3, 20, 40]}
                color="#758282"
                receiveShadow 
            />
            <Box
                position={[20, 10, 0]}
                args={[0.3, 20, 40]}
                color="#758282"
                receiveShadow 
            />
            <Box
                position={[-8, 10, 20]}
                args={[24, 20, 0.3]}
                color="#758282"
                receiveShadow 
            />
            <Box
                position={[15, 10, 20]}
                args={[10, 20, 0.3]}
                color="#758282"
                receiveShadow 
            />

            <Ceiling />
            <Wardrobe />
            <Cabinet position={[0, 5.5, -18.9]}/>
            <InteractiveWardrobe />
            <MezzanineLamp position={[-4.5, 5.1, -6.8]}/>
            <Mezzanine />
            <StairsToMezzanine />
            
        </group>

    );
};