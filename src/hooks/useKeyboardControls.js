import { useCharacterStore } from "../store/useCharacterStore";
import { useEffect, useRef } from "react";
import { CHARACTER_RADIUS, GOAL_POSITION, GOAL_HALF_SIZE, GOAL_TOP_Y } from '../gameConstants.js'

const MOVE_STEP = 0.4;
const ROTATE_STEP = Math.PI / 32; // 5.625 degrees


export default function useKeyboardControls() {
    const setAction = useCharacterStore((s) => s.setAction);
    const setPosition = useCharacterStore((s) => s.setPosition);
    const setRotation = useCharacterStore((s) => s.setRotation);
    const rotation = useCharacterStore((s) => s.rotation);

    const keysRef = useRef(new Set());

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

            const dx = Math.sin(newRotation) * MOVE_STEP;
            const dz = Math.cos(newRotation) * MOVE_STEP;

            if (keys.has('w')) {
                setPosition(([x, y, z]) => [x - dx, y, z - dz]);
                setAction('walk');
                moved = true;
            }

            if (keys.has('s')) {
                setPosition(([x, y, z]) => [x + dx, y, z + dz]);
                setAction('walk');
                moved = true;
            }

            let nextX = x + dx;
            let nextZ = x + dz;
            const goalOffsetX = Math.abs((GOAL_POSITION[0]) - (nextX));
            const goalOffsetZ = Math.abs((GOAL_POSITION[2]) - (nextZ));

            const overlapsGoal = goalOffsetX < GOAL_HALF_SIZE + CHARACTER_RADIUS && goalOffsetZ < GOAL_HALF_SIZE + CHARACTER_RADIUS;

            if (overlapsGoal) {
                nextX = x;
                nextZ = z;
            }
                  // Якщо жодна клавіша руху не натиснута - повертаємо персонажа в стан спокою
            if (!moved) {
                setAction('idle');
            }
           }, 1000 / 60); // ~16.67мс між тіками = 60 оновлень на секунду

           return () => clearInterval(interval);

  // ⚠️ rotation у залежностях означає, що ефект перестворює setInterval
  // при кожній зміні кута повороту - це потенційне місце для оптимізації
  // через useRef для rotation, якщо виникатимуть проблеми з продуктивністю
  }, [rotation, setPosition, setRotation, setAction]);
}