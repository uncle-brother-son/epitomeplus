"use client";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState, useTransition, type ReactNode } from "react";

const TransitionContext = createContext({ isTransitioning: false });

export function usePageTransition() {
  return useContext(TransitionContext);
}

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [, startTransition] = useTransition();
  const contextValue = useMemo(() => ({ isTransitioning }), [isTransitioning]);

  useEffect(() => {
    // Scroll to top when pathname changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Wait for all images to load before hiding the loader
    const images = Array.from(document.querySelectorAll('img'));
    
    const imagePromises = images.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.addEventListener('load', () => resolve());
        img.addEventListener('error', () => resolve()); // Resolve even on error
      });
    });
    
    // Wait for images to load
    Promise.all(imagePromises).then(() => {
      startTransition(() => {
        setIsTransitioning(false);
      });
    });
  }, [pathname]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      
      if (link && link.href && !link.target && link.href.startsWith(window.location.origin)) {
        // Allow default behavior for modifier keys (Cmd/Ctrl click for new tab, etc.)
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
          return;
        }
        
        const linkUrl = new URL(link.href);
        const currentUrl = new URL(window.location.href);
        
        // Only trigger transition if navigating to a different page
        if (linkUrl.pathname !== currentUrl.pathname) {
          e.preventDefault(); // Stop Next.js Link navigation
          setIsTransitioning(true); // Trigger exit animations
          
          // Wait for exit animations to complete (640ms) then navigate
          setTimeout(() => {
            router.push(linkUrl.pathname + linkUrl.search + linkUrl.hash);
          }, 640);
        }
      }
    };

    document.addEventListener("click", handleClick, { capture: true }); // Use capture phase
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, [router]);

  return (
    <TransitionContext.Provider value={contextValue}>
      {/* Blue square loader - visible during transition */}
      <div 
        className={`fixed inset-0 flex items-center justify-center  transition-opacity duration-640 ease-epitome pointer-events-none ${
          isTransitioning ? 'opacity-100' : 'opacity-0'
        }`}
        role="status"
        aria-live="polite"
        aria-label="Loading page content"
      >
        <div className="w-3 h-3 bg-blue/100 animate-spin-slow" />
        <span className="sr-only">Loading...</span>
      </div>
      {children}
    </TransitionContext.Provider>
  );
}
