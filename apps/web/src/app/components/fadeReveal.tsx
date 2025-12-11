'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface FadeRevealProps {
  children: ReactNode;
  className?: string;
}

export default function FadeReveal({ children, className = '' }: FadeRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Set initial state before animation
    element.style.opacity = '0';

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && element) {
          element.classList.add('fadein', 'ease-epitome');
          // Reset inline styles to let CSS animation take over
          element.style.opacity = '';
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
