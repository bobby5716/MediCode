import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, Line } from '@react-three/drei';
import * as THREE from 'three';

const NODES = [
  { label: 'MongoDB', color: '#00ED64', position: [-2.5, 0.6, 0] },
  { label: 'Express', color: '#ffffff', position: [-0.8, -0.8, 0.5] },
  { label: 'React',   color: '#61DAFB', position: [0.8, 0.8, -0.5] },
  { label: 'Node.js', color: '#68A063', position: [2.5, -0.4, 0] },
];

function Node({ position, color, label }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = position[1] + Math.sin(t + position[0]) * 0.15;
  });

  return (
    <group ref={ref} position={position}>
      <mesh castShadow>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>
      <Text
        position={[0, -0.7, 0]}
        fontSize={0.22}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

export default function TechNodes() {
  const group = useRef();
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.1;
  });

  return (
    <group ref={group}>
      {NODES.map((n, i) => (
        <Node key={i} {...n} />
      ))}

      {/* Connecting lines between every pair */}
      {NODES.map((a, i) =>
        NODES.slice(i + 1).map((b, j) => (
          <Line
            key={`${i}-${j}`}
            points={[a.position, b.position]}
            color="#5227FF"
            lineWidth={1}
            transparent
            opacity={0.35}
          />
        ))
      )}
    </group>
  );
}