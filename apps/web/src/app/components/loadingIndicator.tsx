"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition, type ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    // Reset transition when pathname changes (new page loaded)
    startTransition(() => {
      setIsTransitioning(false);
    });
  }, [pathname]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      
      if (link && link.href && !link.target && link.href.startsWith(window.location.origin)) {
        const linkUrl = new URL(link.href);
        const currentUrl = new URL(window.location.href);
        
        // Only trigger transition if navigating to a different page
        if (linkUrl.pathname !== currentUrl.pathname) {
          setIsTransitioning(true);
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      {/* Blue square loader - visible during transition */}
      <div 
        className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-640 ease-epitome pointer-events-none ${
          isTransitioning ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="w-3 h-3 bg-blue/100 animate-spin-slow" />
      </div>

      {/* Page content wrapper */}
      <div 
        className={`transition-opacity duration-640 ease-epitome grow ${
          isTransitioning 
            ? 'opacity-0' 
            : 'opacity-100'
        }`}
      >
        {children}
      </div>
    </>
  );
}
