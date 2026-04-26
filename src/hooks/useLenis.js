import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

/**
 * High-Performance Scroll Controller
 * Returns the lenis instance for coordinated control.
 */
export function useLenis() {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({ 
      lerp: 0.1, 
      smoothWheel: true,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
    });

    lenisRef.current = lenis;

    const scrollHandler = ({ scroll }) => {
      document.documentElement.style.setProperty('--scroll-y', `${scroll}px`);
    };

    lenis.on('scroll', scrollHandler);

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Global access for debugging or extreme cases, but prefer the return value
    window.lenis = lenis;

    return () => {
      cancelAnimationFrame(rafId);
      lenis.off('scroll', scrollHandler);
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  return lenisRef.current;
}
