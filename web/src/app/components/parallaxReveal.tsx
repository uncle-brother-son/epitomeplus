'use client';

import { useEffect, useRef, ReactNode, memo, useState } from 'react';
import { usePageTransition } from './loadingIndicator';
import { throttle } from '../lib/utils';

interface ParallaxRevealProps {
  children: ReactNode;
  className?: string;
  speed?: number; // Parallax speed multiplier (0.8 = slower, 1.2 = faster)
}

export const ParallaxReveal = memo(function ParallaxReveal({ 
  children, 
  className = '', 
  speed = 1.0 
}: ParallaxRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const { isTransitioning } = usePageTransition();
  const hasInitialized = useRef(false);
  const [hasRevealed, setHasRevealed] = useState(false);

  // Calculate parallax offset
  const getParallaxOffset = (element: HTMLDivElement): number => {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const scrollProgress = 1 - (rect.top / viewportHeight);
    
    if (scrollProgress > -0.5 && scrollProgress < 2) {
      return (scrollProgress * viewportHeight * (1 - speed)) * 0.15;
    }
    return 0;
  };

  // Initial reveal animation with parallax
  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasRevealed) return;

    hasInitialized.current = true;

    // Wait for page transition to complete
    if (isTransitioning) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && element) {
          // Get current parallax offset
          const parallaxOffset = getParallaxOffset(element);
          
          // Set starting position (slide-up offset + parallax)
          element.style.transform = `translateY(calc(0.4rem + ${parallaxOffset}px))`;
          element.style.opacity = '0';
          
          // Trigger animation on next frame
          requestAnimationFrame(() => {
            element.style.transition = 'transform 800ms ease-epitome, opacity 800ms';
            element.style.transform = `translateY(${parallaxOffset}px)`;
            element.style.opacity = '1';
          });
          
          setHasRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [isTransitioning, hasRevealed, speed]);

  // Parallax scroll effect
  useEffect(() => {
    const element = elementRef.current;
    if (!element || !hasRevealed) return;

    const handleScroll = () => {
      const parallaxOffset = getParallaxOffset(element);
      element.style.transition = 'none'; // Remove transition during scroll
      element.style.transform = `translateY(${parallaxOffset}px)`;
    };

    // Throttle to 60fps
    const throttledScroll = throttle(handleScroll, 16);

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [speed, hasRevealed]);

  // Handle exit animation when transitioning away
  useEffect(() => {
    const element = elementRef.current;
    if (!element || !hasInitialized.current) return;

    if (isTransitioning) {
      element.style.transition = 'opacity 640ms ease-in-out';
      element.style.opacity = '0';
    }
  }, [isTransitioning]);

  return (
    <div 
      ref={elementRef} 
      className={className} 
      style={{ 
        opacity: 0,
        transform: 'translateY(0.4rem)',
        willChange: 'transform, opacity'
      }}
    >
      {children}
    </div>
  );
});

export default ParallaxReveal;
