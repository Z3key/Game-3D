import React, { useRef, useEffect, useMemo } from 'react';
import { useCharacterStore } from '../store/useCharacterStore.js';
import { useFBX, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js';

const ACTION_MAP = {
    idle: 'Idle',
    walk: 'Walk',
    jump: 'Jump',
    sit: 'Sit',
    jump: 'Jump',
};

const MODEL_FACING_OFFSET = Math.PI;

export default function Character() {
    const group = useRef();

    const character = useFBX('/models/character.fbx');

    const idleFBX = useFBX('/models/Idle.fbx');
    const walkFBX = useFBX('/models/Sneak-Walk.fbx');
    const jumpFBX = useFBX('/models/Jumping.fbx');
    const sitFBX = useFBX('/models/Sitting.fbx');
    const sleepFBX = useFBX('/models/Sleeping.fbx');

    const animationClips = useMemo(() => {
        const clips = [
            { clip: idleFBX.animations[0], name: 'Idle' },
            { clip: walkFBX.animations[0], name: 'Walk' },
            { clip: jumpFBX.animations[0], name: 'Jump' },
            { clip: sitFBX.animations[0], name: 'Sitting Idle' },
            { clip: sleepFBX.animations[0], name: 'Sleeping Idle' },
        ];

        return clips.flatMap(({ clip, name }) => {
            if (!clip) return [];
            const clonedClip = clip.clone();
            clonedClip.name = name;
            return clonedClip;
        });
    }, [idleFBX, walkFBX, jumpFBX, sitFBX, sleepFBX]);

    // idleFBX.animations[0].name = 'Idle';
    // walkFBX.animations[0].name = 'Walk';
    // jumpFBX.animations[0].name = 'Jump';
    // sitFBX.animations[0].name = 'Sitting Idle';
    // sleepFBX.animations[0].name = 'Sleeping Idle';

    const { actions } = useAnimations(
        animationClips, 
        group
    );

    // const { actions } = useAnimations(
    //     [
    //         idleFBX.animations[0], 
    //         walkFBX.animations[0], 
    //         jumpFBX.animations[0], 
    //         sitFBX.animations[0], 
    //         sleepFBX.animations[0]
    //     ], group
    // );

    const currentAction = useCharacterStore((s) => s.currentAction);
    const position = useCharacterStore((s) => s.position);
    const rotation = useCharacterStore((s) => s.rotation);

    useEffect(() => {
        Object.values(actions).forEach((action) => action.fadeOut(0.2));
        // Object.values(actions).forEach((action) => action.stop());

        const nextAction = actions[ACTION_MAP[currentAction]]; //ACTION_MAP[currentAction] -> name
        if (nextAction) {
            nextAction.reset().fadeIn(0.2).play();
        }
        // const name = currentAction.charAt(0).toUpperCase() + currentAction.slice(1);
        // if (actions[name]) {
        //     actions[name].reset().fadeIn(0.2).play();
        // }

        return () => {
            if (nextAction) nextAction.fadeOut(0.2);
        };
    }, [currentAction, actions]);

    useFrame(() => {
        if (!group.current) return;
        group.current.position.set(position[0], position[1], position[2]);
        group.current.rotation.y = rotation + MODEL_FACING_OFFSET;
    });

    const clonedCharacter = useMemo(() => {
        const clone = cloneSkeleton(character);
        clone.scale.set(0.03, 0.03, 0.03);
        return clone;
    }, [character]);

    return (
        <group ref={group}>
           <primitive object={clonedCharacter}/>
        </group>
    );
};
    // console.log(character.scale);
//     useEffect (() => {
//         if (clonedCharacter) {
//             clonedCharacter.scale.set(0.01, 0.01, 0.01);
//         }
//     }, [clonedCharacter]);
//     return (
//         <group ref={group}>
//            {/* <primitive object={character.clone()}/> */}
//            <primitive object={clonedCharacter}/>
//         </group>
//     );
// }
