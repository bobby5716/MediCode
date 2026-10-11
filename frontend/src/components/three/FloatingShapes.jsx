import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

function Shape({ position, color, geometry }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.3;
  });
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={ref} position={position} castShadow>
        {geometry === 'box' && <boxGeometry args={[0.8, 0.8, 0.8]} />}
        {geometry === 'sphere' && <sphereGeometry args={[0.5, 32, 32]} />}
        {geometry === 'torus' && <torusGeometry args={[0.5, 0.2, 16, 32]} />}
        {geometry === 'octa' && <octahedronGeometry args={[0.7]} />}
        <meshStandardMaterial color={color} roughness={0.15} metalness={0.9} />
      </mesh>
    </Float>
  );
}

export default function FloatingShapes() {
  return (
    <group>
      <Shape position={[-2.5, 0, 0]} color="#5227FF" geometry="box" />
      <Shape position={[-1, 0.5, 0]} color="#00FFB2" geometry="sphere" />
      <Shape position={[0.5, -0.3, 0]} color="#FF4D8D" geometry="torus" />
      <Shape position={[2, 0.4, 0]} color="#FFD93D" geometry="octa" />
    </group>
  );
}