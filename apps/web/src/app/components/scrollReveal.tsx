'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { usePageTransition } from './loadingIndicator';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
}

export default function ScrollReveal({ children, className = '' }: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const { isTransitioning } = usePageTransition();
  const hasInitialized = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Mark as initialized
    hasInitialized.current = true;

    // Wait for page transition to complete
    if (isTransitioning) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && element) {
          element.classList.add('scrollin', 'ease-epitome');
          // Reset inline styles to let CSS animation take over
          element.style.opacity = '';
          element.style.transform = '';
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [isTransitioning]);

  // Handle exit animation when transitioning away
  useEffect(() => {
    const element = elementRef.current;
    if (!element || !hasInitialized.current) return;

    if (isTransitioning) {
      element.style.transition = 'opacity 640ms ease-in-out, transform 640ms ease-in-out';
      element.style.opacity = '0';
      element.style.transform = 'translateY(0.5rem)';
    }
  }, [isTransitioning]);

  return (
    <div ref={elementRef} className={className} style={{ opacity: 0, transform: 'translateY(0.5rem)' }}>
      {children}
    </div>
  );
}
