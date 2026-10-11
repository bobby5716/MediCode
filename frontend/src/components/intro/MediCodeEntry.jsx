import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

/**
 * Cinematic transition overlay — plays after the user clicks "Enter MediCode".
 * Renders a full-screen black overlay with the MediCode wordmark fading in,
 * then navigates to the real app.
 */
export default function MediCodeEntry() {
  const navigate = useNavigate();
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => navigate('/dashboard', { replace: true }),
      });

      tl.from('.me-bar', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.5,
        ease: 'power3.inOut',
      })
        .from('.me-word', {
          y: 40,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
        }, '-=0.2')
        .from('.me-sub', {
          opacity: 0,
          duration: 0.4,
        }, '-=0.3')
        .to({}, { duration: 0.4 });
    }, rootRef);

    return () => ctx.revert();
  }, [navigate]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#050507] text-white"
    >
      <div className="me-bar h-px w-32 bg-gradient-to-r from-emerald-400 to-cyan-400 mb-8" />
      <h1 className="me-word text-5xl md:text-7xl font-bold tracking-tighter">
        Medi<span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Code</span>
      </h1>
      <p className="me-sub mt-4 text-xs uppercase tracking-[0.3em] text-white/40 font-mono">
        Loading your health copilot…
      </p>
    </div>
  );
}