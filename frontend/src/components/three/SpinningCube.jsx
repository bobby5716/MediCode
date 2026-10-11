import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function SpinningCube({ color = 'hotpink', ...props }) {
  const ref = useRef();

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.4;
    ref.current.rotation.y += delta * 0.6;
  });

  return (
    <mesh ref={ref} castShadow {...props}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
    </mesh>
  );
}