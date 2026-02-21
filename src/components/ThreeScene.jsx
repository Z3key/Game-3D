import React from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import Character from './Character.jsx'
import { useCharacterStore } from '../store/useCharacterStore.js';

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
    const dist = 8;
    const height = 5;
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
    return (
        <Canvas style={{height: 400}}>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />

            <Floor />
            <CameraController />
            <Character />

	        <primitive object={new THREE.AxesHelper(2)} />
	        <primitive object={new THREE.GridHelper(10, 10)} />
            {/* <OrbitControls /> */}
        </Canvas>
    )
}
