import SceneCanvas from '../components/three/SceneCanvas';
import Hero3D from '../components/three/Hero3D';
import BlurText from '../components/text/BlurText';

export default function Playground3D() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <BlurText
          text="Digital Cosmos"
          delay={120}
          animateBy="words"
          className="text-4xl md:text-5xl font-bold mb-4"
        />
        <p className="text-white/60 mb-8 max-w-2xl">
          Move your mouse — the scene reacts. Bloom, particles, and a distorted
          core running entirely in the browser.
        </p>

        <div className="h-[650px] rounded-2xl overflow-hidden border border-white/10 bg-black">
          <SceneCanvas
            variant="hero"
            camera={{ position: [0, 0, 6], fov: 50 }}
          >
            <Hero3D />
          </SceneCanvas>
        </div>
      </div>
    </div>
  );
}