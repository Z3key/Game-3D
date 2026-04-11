import { useCharacterStore } from "../store/useCharacterStore";
import { useEffect, useRef } from "react";
import { CHARACTER_RADIUS, 
    GOAL_POSITION, 
    GOAL_HALF_SIZE, 
    GOAL_TOP_Y,
    GRAVITY,
    JUMP_SPEED,
    MOVE_STEP,
    ROTATE_STEP,
    FLOOR_Y
 } from '../gameConstants.js'


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
            const { position, rotation, setPosition, setRotation, setAction } = useCharacterStore.getState();
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

            if (onGoalTop && verticalVelocityRef.current <= 0 && y >= GOAL_TOP_Y - 0.05 && nextY <= GOAL_TOP_Y) {
                nextY = GOAL_TOP_Y;
                verticalVelocityRef.current = 0;
                isGroundedRef.current = true;
            } else if (nextY <= FLOOR_Y) {
                nextY = FLOOR_Y;
                verticalVelocityRef.current = 0;
                isGroundedRef.current = true;
            } else {
                isGroundedRef.current = false;
            }

            setPosition([nextX, nextY, nextZ]);


          
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