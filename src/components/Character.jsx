import React, { useRef, useEffect } from 'react';
import { useCharacterStore } from '../store/useCharacterStore.js';
import { useFBX, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export default function Character() {
    const group = useRef();

    const character = useFBX('/models/character.fbx');

    const idleFBX = useFBX('/models/Idle.fbx');
    const walkFBX = useFBX('/models/Sneak-Walk.fbx');
    const jumpFBX = useFBX('/models/Jumping.fbx');
    const sitFBX = useFBX('/models/Sitting.fbx');
    const sleepFBX = useFBX('/models/Sleeping.fbx');

    idleFBX.animations[0].name = 'Idle';
    walkFBX.animations[0].name = 'Walk';
    jumpFBX.animations[0].name = 'Jump';
    sitFBX.animations[0].name = 'Sitting Idle';
    sleepFBX.animations[0].name = 'Sleeping Idle';

    const { actions } = useAnimations(
        [idleFBX.animations[0], walkFBX.animations[0], jumpFBX.animations[0], sitFBX.animations[0], sleepFBX.animations[0]], group
    );

    const currentAction = useCharacterStore((s) => s.currentAction);
    const position = useCharacterStore((s) => s.position);
    const rotation = useCharacterStore((s) => s.rotation);

    useEffect(() => {
        Object.values(actions).forEach((action) => action.stop());

        if (actions[currentAction.charAt(0).toUpperCase() + currentAction.slice(1)]) {
            actions[currentAction.charAt(0).toUpperCase() + currentAction.slice(1)].reset().fadeIn(0.2).play();
        } 
    }, [currentAction, actions]);

    useFrame(() => {
        if (!group.current) return;
            group.current.position.set(position[0], position[1], position[2]);
            group.current.rotation.y = rotation;
    });

    return (
        <group ref={group}>
            <primitive object={character.clone()} scale={0.01} />
        </group>
    );
}