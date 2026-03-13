'use client';

import { useEffect, useRef, ReactNode, memo } from 'react';
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

  // Initial reveal animation
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    hasInitialized.current = true;

    // Wait for page transition to complete
    if (isTransitioning) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && element) {
          element.classList.add('scrollin', 'ease-epitome');
          // Reset inline styles to let CSS animation take over
          element.style.opacity = '';
          // Keep transform for parallax, only reset Y from initial state
          const currentTransform = element.style.transform;
          if (currentTransform.includes('translateY(0.5rem)')) {
            element.style.transform = currentTransform.replace('translateY(0.5rem)', 'translateY(0)');
          }
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [isTransitioning]);

  // Parallax scroll effect
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate how far through the viewport the element is
      // -1 = above viewport, 0 = top of viewport, 1 = bottom of viewport, 2 = below viewport
      const scrollProgress = 1 - (rect.top / viewportHeight);
      
      // Only apply parallax when element is in/near viewport
      if (scrollProgress > -0.5 && scrollProgress < 2) {
        // Parallax offset: difference from normal scroll speed
        // speed < 1 = slower (moves less), speed > 1 = faster (moves more)
        const parallaxOffset = (scrollProgress * viewportHeight * (1 - speed)) * 0.15;
        
        element.style.transform = `translateY(${parallaxOffset}px)`;
      }
    };

    // Throttle to 60fps
    const throttledScroll = throttle(handleScroll, 16);
    
    // Initial calculation
    handleScroll();

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [speed]);

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
        willChange: 'transform, opacity' // GPU acceleration hint
      }}
    >
      {children}
    </div>
  );
});

export default ParallaxReveal;
