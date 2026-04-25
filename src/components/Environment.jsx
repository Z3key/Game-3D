import React from 'react';

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
    {[-6, -3, 0, 3, 6].map((z) => (
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
        <meshStandardMaterial color="#274f5a" />
    </mesh>
    </group>
  );
};

export default function Environment() {
    return (
        <group>
            <Floor />
            <Box 
                position={[0, 10, -20]}
                args={[40, 20, 0.3]}
                color="blue"
                receiveShadow    
            />
            <Box
                position={[-20, 10, 0]}
                args={[0.3, 20, 40]}
                color="blue"
                receiveShadow 
            />
            <Box
                position={[20, 10, 0]}
                args={[0.3, 20, 40]}
                color="blue"
                receiveShadow 
            />
            <Box
                position={[-8, 10, 20]}
                args={[24, 20, 0.3]}
                color="blue"
                receiveShadow 
            />
            <Box
                position={[15, 10, 20]}
                args={[10, 20, 0.3]}
                color="blue"
                receiveShadow 
            />
        </group>
    );
};