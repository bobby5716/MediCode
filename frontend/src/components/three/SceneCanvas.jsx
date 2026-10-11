import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';

export default function SceneCanvas({
  children,
  camera = { position: [0, 0, 5], fov: 50 },
  controls = true,
  environment = 'city',
  shadows = true,
  variant = 'default', // 'default' | 'hero'
  className = '',
}) {
  const isHero = variant === 'hero';

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={camera}
        shadows={!isHero && shadows}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {!isHero && (
            <>
              <ambientLight intensity={0.4} />
              <directionalLight
                position={[5, 5, 5]}
                intensity={1}
                castShadow
                shadow-mapSize={[1024, 1024]}
              />
            </>
          )}

          {children}

          {!isHero && environment && <Environment preset={environment} />}

          {!isHero && shadows && (
            <ContactShadows
              position={[0, -1.5, 0]}
              opacity={0.5}
              scale={10}
              blur={2.5}
              far={4}
            />
          )}

          {!isHero && controls && (
            <OrbitControls
              enablePan={false}
              enableZoom
              minDistance={2}
              maxDistance={12}
              autoRotate
              autoRotateSpeed={0.6}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}