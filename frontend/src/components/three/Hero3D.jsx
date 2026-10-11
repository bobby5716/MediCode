import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Points, PointMaterial } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

/* ---------- Particle Field ---------- */
function ParticleField({ count = 2500 }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.04;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#a78bfa"
        size={0.035}
        sizeAttenuation
        depthWrite={false}
        opacity={0.9}
      />
    </Points>
  );
}

/* ---------- Glowing Core ---------- */
function CoreSphere() {
  const ref = useRef();

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.15;
    ref.current.rotation.x += delta * 0.05;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.7}>
      <mesh ref={ref} scale={1.4}>
        <icosahedronGeometry args={[1, 32]} />
        <MeshDistortMaterial
          color="#5227FF"
          emissive="#7c3aed"
          emissiveIntensity={0.7}
          roughness={0.05}
          metalness={0.95}
          distort={0.45}
          speed={1.6}
        />
      </mesh>
    </Float>
  );
}

/* ---------- Mouse Parallax Camera ---------- */
function MouseParallax() {
  const { camera, pointer } = useThree();
  useFrame(() => {
    camera.position.x += (pointer.x * 0.6 - camera.position.x) * 0.05;
    camera.position.y += (pointer.y * 0.4 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ---------- Root Scene ---------- */
export default function Hero3D({ bloom = true }) {
  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[5, 5, 5]} intensity={2.2} color="#a78bfa" />
      <pointLight position={[-5, -4, 4]} intensity={1.6} color="#22d3ee" />

      <CoreSphere />
      <ParticleField count={2500} />
      <MouseParallax />

      {bloom && (
        <EffectComposer>
          <Bloom
            intensity={1.3}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </>
  );
}