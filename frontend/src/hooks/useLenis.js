import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Mount Lenis smooth scroll on a specific container (or root).
 * - Syncs with GSAP ScrollTrigger via a single RAF loop
 * - Respects prefers-reduced-motion
 * - Returns a ref to the Lenis instance for programmatic scrollTo
 */
export default function useLenis(options = {}) {
  const lenisRef = useRef(null);

  useEffect(() => {
    // ─── Accessibility: skip Lenis entirely if reduced motion ───
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 1.5,
      wheelMultiplier: 1,
      infinite: false,
      autoRaf: false,          // GSAP drives the loop
      anchors: { offset: -80 }, // auto-smooth anchor links
      ...options,
    });

    // ─── Sync with GSAP ScrollTrigger ───
    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // ─── Scroll progress → CSS var for progress bar ───
    const onScroll = ({ progress }) => {
      document.documentElement.style.setProperty('--scroll-progress', progress);
    };
    lenis.on('scroll', onScroll);

    lenisRef.current = lenis;

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}