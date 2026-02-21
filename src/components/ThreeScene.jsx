import React from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';


function Box() {
    return (
        <mesh rotation={[0.4, 0.2, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial />
        </mesh>
    )
}

export default function ThreeScene() {
    return (
        <Canvas style={{height: 400}}>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Box />
	        <primitive object={new THREE.AxesHelper(2)} />
	        <primitive object={new THREE.GridHelper(10, 10)} />
            <OrbitControls />
        </Canvas>
    )
}
