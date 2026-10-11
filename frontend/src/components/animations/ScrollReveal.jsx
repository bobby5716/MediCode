'use client';

import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollReveal.css';
import { useLanguage } from '../../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const ScrollReveal = ({
  children,
  text = '',
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom bottom'
}) => {
  const { t } = useLanguage();
  const localizedChildren = typeof children === 'string' ? t(children) : (children ?? t(text));
  const containerRef = useRef(null);

  const splitText = useMemo(() => {
    const text = typeof localizedChildren === 'string' ? localizedChildren : '';
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="word" key={index}>
          {word}
        </span>
      );
    });
  }, [localizedChildren]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

    gsap.fromTo(el, { transformOrigin: '0% 50%', rotate: baseRotation }, {
      ease: 'none',
      rotate: 0,
      scrollTrigger: {
        trigger: el,
        scroller,
        start: 'top bottom',
        end: rotationEnd,
        scrub: true
      }
    });

    const wordElements = el.querySelectorAll('.word');

    gsap.fromTo(wordElements, { opacity: baseOpacity, willChange: 'opacity' }, {
      ease: 'none',
      opacity: 1,
      stagger: 0.05,
      scrollTrigger: {
        trigger: el,
        scroller,
        start: 'top bottom-=20%',
        end: wordAnimationEnd,
        scrub: true
      }
    });

    if (enableBlur) {
      gsap.fromTo(wordElements, { filter: `blur(${blurStrength}px)` }, {
        ease: 'none',
        filter: 'blur(0px)',
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom-=20%',
          end: wordAnimationEnd,
          scrub: true
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);

  return (
    <h2 ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
      <p className={`scroll-reveal-text ${textClassName}`}>{splitText}</p>
    </h2>
  );
};

export default ScrollReveal;
