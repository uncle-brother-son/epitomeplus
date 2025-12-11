'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
}

export default function ScrollReveal({ children, className = '' }: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Set initial state before animation
    element.style.opacity = '0';
    element.style.transform = 'translateY(0.4rem)';

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
  }, []);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}
