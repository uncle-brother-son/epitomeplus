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
      <div className={`fixed inset-0 flex items-center justify-center  transition-opacity duration-640 ease-epitome pointer-events-none ${ isTransitioning ? 'opacity-100' : 'opacity-0' }`} role="status" aria-live="polite" aria-label="Loading page content">
        <div className="w-3 h-3 bg-blue animate-spin-slow" />
        {/* 
        <svg className="h-3 fill-blue animate-spin-slow" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M34 14.4978H28.4999V9.08138H23.9762V14.4978H18.4762V19.1628H23.9762V24.5792H28.4999V19.1628H34V14.4978Z" fill="#121214"/>
          <path d="M5.91237 23.8125V19.1627H14.6292V14.2804H5.91237V10.1875H16.5974V5H0V29H16.9436V23.8125H5.91237Z" fill="#121214"/>
        </svg> 
        <svg className="h-3 fill-blue animate-spin-slow" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M34 11.8828H21.9539V0H12.0461V11.8828H0V22.1172H12.0461V34H21.9539V22.1172H34V11.8828Z"/>
        </svg>
        */}
        <span className="sr-only">Loading...</span>
      </div>
      {children}
    </TransitionContext.Provider>
  );
}
