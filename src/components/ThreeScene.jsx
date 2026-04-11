import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Character from './Character.jsx'
import { useCharacterStore } from '../store/useCharacterStore.js';
import useKeyboardControls from '../hooks/useKeyboardControls.js'
import { Environment, OrbitControls } from '@react-three/drei';
import { GOAL_POSITION, GOAL_SIZE, GOAL_HEIGHT, GOAL_HALF_SIZE, GOAL_TOP_Y } from '../gameConstants.js';

function Goal() {
  const mesh = useRef();
  const setGoalReached = useCharacterStore((s) => s.setAction);
  const position = useCharacterStore((s) => s.position);
  const goalReached = useCharacterStore((s) => s.goalReached)

  useFrame (() => {
    if (!mesh.current) return;
    const [px, py, pz] = position;
    const dx = GOAL_POSITION[0] - px;
    const dz = GOAL_POSITION[2] - pz;
    const absDx = Math.abs(dx);
    const absDz = Math.abs(dz);
    const isBesideGoal = py < GOAL_TOP_Y - 0.25;
    const touchesGoalSide = absDx < GOAL_HALF_SIZE + 0.45 && absDz < GOAL_HALF_SIZE + 0.45;

    if(!goalReached && isBesideGoal && touchesGoalSide) {
      setGoalReached(true);
    }


  });

  return (
    <mesh ref={mesh} position={GOAL_POSITION} castShadow receiveShadow>
      <boxGeometry args ={[GOAL_SIZE, GOAL_HEIGHT, GOAL_SIZE]}/>
      <meshStandardMaterial color="gold"/>
    </mesh>
  );
};

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial map={texture} />
      {/* <meshStandardMaterial color="#2d5a27" /> */}
    </mesh>
  );
}

function BoxRoom() {
  return (
    <mesh position={[0, 20, 0]}>
      <boxGeometry args ={[40, 40, 40]} />
      <meshStandardMaterial 
        // map={}
        envMapIntensity={1}
        side={THREE.BackSide}
        
      />
    </mesh>
  );
};

function CameraController() {
  const position = useCharacterStore((s) => s.position);
  const rotation = useCharacterStore((s) => s.rotation);
  const { camera } = useThree();
  useFrame(() => {
    const [x, y, z] = position;
    const dist = 20;
    const height = 10;
    camera.position.set(
      x + Math.sin(rotation) * dist,
      y + height,
      z + Math.cos(rotation) * dist
    );
    camera.lookAt(x, y + 1.5, z);
    camera.updateProjectionMatrix();
  });
  return null;
}

export default function ThreeScene() {
  useKeyboardControls();
  return (
    <Canvas
        style={{
          height: 600,
          // background: "url(/Sky.jpg) center/cover"
      }}
      shadows
      camera={{ position: [0, 7, 10], fov: 40 }}
    >
      {/* <Environment files="HDR/pergola_walkaway_4k.hdr" background /> */}
      {/* <Environment files="/sky2.hdr" background /> */}
      <OrbitControls />
      {/* <color attach="background" args={["#759bc7"]} /> */}
      <ambientLight intensity={0.6} />
      {/* <pointLight position={[10, 10, 10]} /> */}
      <directionalLight
          position={[5, 5, 5]}
          // position={[10, 15, 10]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
      />

      <CameraController />
      <BoxRoom />
      {/* <Floor /> */}
      <Goal />
      <Character />

      <gridHelper args={[40, 40, '#444', '#333']} position={[0, 0.01, 0]}/>

      {/* <OrbitControls /> */}
    </Canvas>
  )
}
