import { useCharacterStore } from "../store/useCharacterStore";
import { useEffect, useRef } from "react";
import {
  CHARACTER_RADIUS,
  GOAL_POSITION,
  GOAL_HALF_SIZE,
  GOAL_TOP_Y,
  MOVE_STEP,
  ROTATE_STEP,
  GRAVITY,
  JUMP_SPEED,
  FLOOR_Y,
  // ДОДАНО: Константи форми сходів — потрібні для getFloorY щоб вирахувати висоту сходинки під персонажем
  STAIRS_CX, STAIRS_W, STAIRS_H, STAIRS_D, STAIRS_Z, STAIRS_COUNT,
  // ДОДАНО: Межі підлоги мезоніну та її висота — для getFloorY
  MEZZANINE_X_MIN, MEZZANINE_X_MAX, MEZZANINE_Z_MIN, MEZZANINE_Z_MAX, MEZZANINE_FLOOR_Y,
  // ДОДАНО: Позиція дивана та параметри взаємодії — для обробника клавіші E
  SOFA_WORLD_X, SOFA_WORLD_Z, SOFA_INTERACT_DIST,
  SOFA_SIT_X, SOFA_SIT_Z, SOFA_SIT_Y, SOFA_SIT_ROTATION,
    COLLECTIBLES, COLLECT_RADIUS,
    LADDER_COLL_X_MIN, LADDER_COLL_Z_MIN, LADDER_COLL_Z_MAX, LADDER_COLL_Y_MAX,
} from '../gameConstants.js';

function getFloorY(x, z) {
    const onStairsX =
        x >= STAIRS_CX - STAIRS_W / 2 - CHARACTER_RADIUS &&
        x <= STAIRS_CX + STAIRS_W / 2 + CHARACTER_RADIUS

    if (onStairsX) {
        const i = Math.floor((STAIRS_Z + STAIRS_D / 2 - z) / STAIRS_D);
        if (i >= 0 && i < STAIRS_COUNT) {
            return (i + 1) * STAIRS_H;
        };
    };

    const onMezzanine =
        x >= MEZZANINE_X_MIN &&
        x <= MEZZANINE_X_MAX &&
        z >= MEZZANINE_Z_MIN &&
        z <= MEZZANINE_Z_MAX + CHARACTER_RADIUS;

    if (onMezzanine) {
        return MEZZANINE_FLOOR_Y;
    };

    return FLOOR_Y;
};


export default function useKeyboardControls() {
    const setAction = useCharacterStore((s) => s.setAction);
    const setPosition = useCharacterStore((s) => s.setPosition);
    const setRotation = useCharacterStore((s) => s.setRotation);
    const rotation = useCharacterStore((s) => s.rotation);

    const keysRef = useRef(new Set());

    const verticalVelocityRef = useRef(0);
    const isGroundedRef = useRef(true);

    useEffect(() => {
        function onKeyDown(event) {
            if (event.repeat) return;

            keysRef.current.add(event.key.toLowerCase());            
        }

        function onKeyUp(event) {
            keysRef.current.delete(event.key.toLowerCase());
        }

        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            
            const keys = keysRef.current;
            const { position, rotation, setPosition, setRotation, setAction, collectItem, collectedItems } = useCharacterStore.getState();
            let [x, y, z] = position;
            // console.log('Position:', position);
            let moved = false;
            let newRotation = rotation;

            if (keys.has('a')) {
                newRotation += ROTATE_STEP;
                moved = true;
            }

            if (keys.has('d')) {
                newRotation -= ROTATE_STEP;
                moved = true;
            }

            setRotation(newRotation);

            // const dx = Math.sin(newRotation) * MOVE_STEP;
            // const dz = Math.cos(newRotation) * MOVE_STEP;

            // if (keys.has('w')) {
            //     setPosition(([x, y, z]) => [x - dx, y, z - dz]);
            //     setAction('walk');
            //     moved = true;
            // }

            // if (keys.has('s')) {
            //     setPosition(([x, y, z]) => [x + dx, y, z + dz]);
            //     setAction('walk');
            //     moved = true;
            // }

            if (keys.has(' ') && isGroundedRef.current) {
                verticalVelocityRef.current = JUMP_SPEED;
                isGroundedRef.current = false;
            };

            const moveDirection = (keys.has('s') ? 1 : 0) - (keys.has('w') ? 1 : 0);
            
            const dx = Math.sin(newRotation) * MOVE_STEP * moveDirection;
            const dz = Math.cos(newRotation) * MOVE_STEP * moveDirection;

            let nextX = x + dx;
            let nextZ = z + dz;
            const goalOffsetX = Math.abs((GOAL_POSITION[0]) - (nextX));
            const goalOffsetZ = Math.abs((GOAL_POSITION[2]) - (nextZ));

            const overlapsGoal = goalOffsetX < GOAL_HALF_SIZE + CHARACTER_RADIUS && goalOffsetZ < GOAL_HALF_SIZE + CHARACTER_RADIUS;

            const canStepOverGoal = y >= GOAL_TOP_Y - 0.05;

            if (moveDirection !== 0) {
                if (overlapsGoal && !canStepOverGoal) {
                    nextX = x;
                    nextZ = z;
                }  
                moved = true;                       
            };

            verticalVelocityRef.current -= GRAVITY;
            let nextY = y + verticalVelocityRef.current;

            const goalDistanceX = Math.abs((GOAL_POSITION[0]) - (nextX));
            const goalDistanceZ = Math.abs((GOAL_POSITION[2]) - (nextZ));

            const onGoalTop = goalDistanceX < GOAL_HALF_SIZE + CHARACTER_RADIUS * 0.35 && goalDistanceZ < GOAL_HALF_SIZE + CHARACTER_RADIUS * 0.35;

            const dynamicFloorY = getFloorY(nextX, nextZ);

            if (onGoalTop && verticalVelocityRef.current <= 0 && y >= GOAL_TOP_Y - 0.05 && nextY <= GOAL_TOP_Y) {
                nextY = GOAL_TOP_Y;
                verticalVelocityRef.current = 0;
                isGroundedRef.current = true;
            } else if (nextY <= dynamicFloorY) {
                nextY = dynamicFloorY;
                verticalVelocityRef.current = 0;
                isGroundedRef.current = true;
            } else {
                isGroundedRef.current = false;
            }

            const charInLadderXZone = nextX > LADDER_COLL_X_MIN;  // чи персонаж у правій частині кімнати (біля драбини)?
                const charEntersLadderZ = nextZ > LADDER_COLL_Z_MIN && nextZ < LADDER_COLL_Z_MAX;  // чи новий Z попадає в expanded-Z драбини?
                const charBelowLadderTop = nextY < LADDER_COLL_Y_MAX; // колізія тільки нижче верху рейок (зверху можна обійти)


                if (charInLadderXZone && charEntersLadderZ && charBelowLadderTop) {
                    // Де БУЛИ по Z до цього руху?
                    const prevInLadderZ = z > LADDER_COLL_Z_MIN && z < LADDER_COLL_Z_MAX;
                    // Де БУЛИ по X до цього руху?
                    const prevInLadderX = x > LADDER_COLL_X_MIN;


                    if (!prevInLadderZ) {
                    // Персонаж щойно ввійшов у Z-зону (прийшов спереду або ззаду):
                    // блокуємо Z-рух — не даємо перейти крізь драбину
                    nextZ = z;
                    }


                    if (!prevInLadderX) {
                    // Персонаж щойно ввійшов у X-зону (прийшов з лівого боку):
                    // блокуємо X-рух — не даємо «врізатись» в бічні рейки
                    nextX = x;
                    }
                }


            setPosition([nextX, nextY, nextZ]);

            COLLECTIBLES.forEach((item) => {
                if (collectedItems.includes(item.id)) return; // вже зібраний — пропускаємо


                const [ix, iy, iz] = item.pos;
                const dist = Math.sqrt(
                (nextX - ix) ** 2 +   // відстань по X
                (nextY - iy) ** 2 +   // відстань по Y (важлива: предмети на різних висотах)
                (nextZ - iz) ** 2     // відстань по Z
                );


                if (dist <= COLLECT_RADIUS) {
                collectItem(item.id); // записуємо в стор → UI одразу оновлює лічильник
                }
            });

          
                  // Якщо жодна клавіша руху не натиснута - повертаємо персонажа в стан спокою
            // if (!moved) {
            //     setAction('idle');
            // }
            if (!isGroundedRef.current) {
                setAction('jump');
            } else if (moved) {
                setAction('walk');
            } else {
                setAction('idle');
            };

           }, 1000 / 60); // ~16.67мс між тіками = 60 оновлень на секунду

           return () => clearInterval(interval);

        

  // ⚠️ rotation у залежностях означає, що ефект перестворює setInterval
  // при кожній зміні кута повороту - це потенційне місце для оптимізації
  // через useRef для rotation, якщо виникатимуть проблеми з продуктивністю
  }, [rotation, setPosition, setRotation, setAction]);

}