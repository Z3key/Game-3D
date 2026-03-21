import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import Character from './Character.jsx'
import { useCharacterStore } from '../store/useCharacterStore.js';
import useKeyboardControls from '../hooks/useKeyboardControls.js'
import { Environment } from '@react-three/drei';

function Goal() {
  const mesh = useRef();
  const setGoalReached = useCharacterStore((s) => s.setAction);
  const position = useCharacterStore((s) => s.position);

  useFrame (() => {
    if (!mesh.current) return;
    const [px, , pz] = position;
    const dx = mesh.current.position.x - px;
    const dz = mesh.current.position.z - pz;
    if(dx * dx + dz * dz < 4) setGoalReached(true);
  });

  return (
    <mesh ref={mesh} position={[10, 0.5, 10]} castShadow receiveShadow>
      <boxGeometry args ={[1, 1, 1]}/>
      <meshStandardMaterial color="gold"/>
    </mesh>
  );
};

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#2d5a27" />
    </mesh>
  );
}

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
      camera={{ position: [0, 5, 10], fov: 80 }}
    >
      <Environment files="/sky2.hdr" background />
      {/* <color attach="background" args={["#759bc7"]} /> */}
      <ambientLight intensity={0.6} />
      {/* <pointLight position={[10, 10, 10]} /> */}
      <directionalLight
          position={[10, 15, 10]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
      />

      <Floor />
      <Goal />
      <CameraController />
      <Character />

      <gridHelper args={[40, 40, '#444', '#333']} position={[0, 0.01, 0]}/>

      {/* <OrbitControls /> */}
    </Canvas>
  )
}
