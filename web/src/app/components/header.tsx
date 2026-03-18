"use client"; 
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, startTransition } from "react";
import { debounce, throttle } from "../lib/utils";

type NavItem = { _key: string; label: string; link: string };

export default function Header({ nav = [], siteTitle }: { nav?: NavItem[]; siteTitle: string }) {
  const pathname = usePathname();
  const [showNav, setShowNav] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef(0);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    if (!showNav) return; // Only listen when menu is open

    const handleResize = () => {
      if (window.innerWidth >= 900) { // md breakpoint
        setShowNav(false);
      }
    };

    const debouncedResize = debounce(handleResize, 150);
    
    window.addEventListener('resize', debouncedResize);
    return () => window.removeEventListener('resize', debouncedResize);
  }, [showNav]);

  // Focus trap when menu is open
  useEffect(() => {
    if (!showNav || !menuRef.current) return;

    const menuElement = menuRef.current;
    const focusableElements = menuElement.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    menuElement.addEventListener('keydown', handleTabKey);
    
    // Focus first element when menu opens
    firstElement?.focus();

    return () => {
      menuElement.removeEventListener('keydown', handleTabKey);
    };
  }, [showNav]);

  // Scroll direction detection
  useEffect(() => {
    const handleScroll = () => {
      const header = headerRef.current;
      if (!header) return;

      const headerHeight = header.offsetHeight;
      const currentScrollPos = document.body.getBoundingClientRect().top;

      if (scrollPosRef.current >= 0) {
        header.classList.remove("animate");
      }

      // Scrolling up
      if (currentScrollPos > scrollPosRef.current) {
        if (scrollPosRef.current < -headerHeight) {
          header.classList.add("animate");
          header.style.top = '0';
        }
      } 
      // Scrolling down
      else {
        header.style.top = `-${headerHeight}px`;
      }

      scrollPosRef.current = currentScrollPos;
    };

    // Throttle scroll to max 60fps (every 16ms)
    const throttledScroll = throttle(handleScroll, 16);

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, []);

  // Close nav when route changes
  useEffect(() => {
    startTransition(() => {
      setShowNav(false);
    });
  }, [pathname]);

  return (
    <header ref={headerRef} id="header" className="menu sticky top-0 z-50 transition-all duration-320 ease-epitome">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-16 focus:left-2 focus:z-60 focus:px-2 focus:py-1 focus:bg-blue focus:text-neutral">Skip to main content</a>
      <div className={showNav ? 'fixed bg-neutral inset-0 flex flex-col' : 'mx-2 mt-2 grid10_'}>
        <div className={showNav ? 'mx-2 mt-2' : 'relative col-start-1 col-span-2 md:col-start-1 md:col-span-4 flex'}>
          <Link href="/" aria-label={siteTitle}>
            <svg
              className="fill-black hover:fill-blue transition duration-320 h-4"
              viewBox="0 0 210 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>{siteTitle}</title>
              <path d="M209.458 12.72H202.415V5.62H196.623V12.72H189.58V18.835H196.623V25.935H202.415V18.835H209.458V12.72Z" />
              <path d="M124.908 0.269989H134.415L142.947 21.75L151.484 0.269989H160.992V31.73H153.421V13.77L146.289 31.73H139.615L132.483 13.77V31.73H124.912V0.269989H124.908Z" />
              <path d="M106.206 0C97.2156 0 91.1244 6.875 91.1244 16C91.1244 25.125 97.2156 32 106.206 32C115.195 32 121.282 25.125 121.282 16C121.282 6.875 115.19 0 106.206 0ZM106.206 25.2C101.594 25.2 98.6998 21.275 98.6998 16C98.6998 10.725 101.594 6.8 106.206 6.8C110.818 6.8 113.716 10.725 113.716 16C113.716 21.275 110.822 25.2 106.206 25.2Z" />
              <path d="M90.3125 0.269989H65.1507V7.06999H73.9464V31.73H81.5169V7.06999H90.3125V0.269989Z" />
              <path d="M38.8683 0.269989H26.2974V31.73H33.8678V22.02H38.8683C45.9855 22.02 50.732 17.75 50.732 11.145C50.732 4.53999 45.9855 0.269989 38.8683 0.269989ZM38.7139 15.22H33.8678V7.06999H38.7139C41.3835 7.06999 43.1616 8.66999 43.1616 11.145C43.1616 13.62 41.3835 15.22 38.7139 15.22Z" />
              <path d="M54.2234 0.269989H61.7938V31.73H54.2234V0.269989Z" />
              <path d="M7.57045 24.93V18.835H18.7319V12.435H7.57045V7.06999H21.2521V0.269989H0V31.73H21.6953V24.93H7.57045Z" />
              <path d="M173.493 24.93V18.835H184.654V12.435H173.493V7.06999H187.174V0.269989H165.922V31.73H187.618V24.93H173.493Z" />
            </svg>
          </Link>
        </div>

        <nav id="navigation-menu" aria-label="Main navigation" className={showNav ? 'mx-2 grow content-center font-medium flex flex-col' : 'grow col-start-3 col-span-1 md:col-start-5 md:col-span-6 font-medium'}>
          {/* Menu button - visible on mobile, hidden on desktop */}
          {!showNav && (
            <div className="text-right block md:hidden">
              <button onClick={() => setShowNav(true)} aria-label="Open navigation menu" aria-expanded={showNav} aria-controls="navigation-menu">
                Menu
              </button>
            </div>
          )}
          
          {/* Desktop nav - hidden on mobile, visible on desktop */}
          {!showNav && (
            <ul className="w-full flex-row gap-4 hidden md:flex">
              {nav.map((item) => {
                const isCurrent = pathname.startsWith(item.link);
                return (
                  <li
                    key={item._key}
                    className={`grow basis-1/3 text-right text-lg ${isCurrent ? "active" : ""}`}
                  >
                    <Link href={item.link}>{item.label}</Link>
                  </li>
                );
              })}
            </ul>
          )}

          {showNav && (
            <>
              <div ref={menuRef} className="grow flex flex-col">
                <div className="absolute top-2 right-2">
                  <button 
                    onClick={() => setShowNav(false)}
                    aria-label="Close navigation menu"
                    aria-expanded={showNav}
                    aria-controls="navigation-menu"
                  >
                    Close
                  </button>
                </div>
                <ul className="mx-2 grow justify-center md:justify-start font-medium w-full flex flex-col gap-1">
                  {nav.map((item) => {
                    const isCurrent = pathname.startsWith(item.link);
                    return (
                      <li key={item._key} className={`md:grow text-lg ${isCurrent ? "active" : ""}`}>
                        <Link href={item.link}>{item.label}</Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="mb-2 text-xs">
                <Link href="/" prefetch={false}>&#169; {new Date().getFullYear()} {siteTitle}</Link>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}