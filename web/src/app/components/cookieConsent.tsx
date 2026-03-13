'use client';

import { useState, useEffect, memo } from 'react';
import Link from 'next/link';

export const CookieConsent = memo(function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Use setTimeout to make state update async and avoid cascade warning
    const checkConsent = () => {
      const consent = localStorage.getItem('cookie-consent');
      if (!consent) {
        setShowBanner(true);
      }
    };
    
    setTimeout(checkConsent, 0);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
    // Reload to initialize GA
    window.location.reload();
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div 
      className="fixed bottom-4 left-4 right-4 md:right-auto md:w-[calc(((100vw-168px)/5)*2+34px)] bg-blue text-neutral p-2 z-50 rounded"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className="max-w-screen-xl mx-auto flex flex-col gap-2 ">
        <div id="cookie-consent-title" className="">Cookie Preferences</div>
        <p id="cookie-consent-description" className="text-sm">
          We use cookies to improve your experience and analyze site traffic. By clicking &ldquo;Accept&rdquo;, you consent to our use of analytics cookies. {' '} <Link href="/info/privacy-policy" className="underline hover:text-blue" prefetch={false}>Learn more</Link>
        </p>
        <div className="grow flex gap-2">
          <button onClick={handleDecline} className="grow px-3 py-1 text-sm border border-neutral transition duration-320 ease-epitome" aria-label="Decline cookies">
            Decline
          </button>
          <button onClick={handleAccept} className="grow px-3 py-1 text-sm bg-neutral text-black transition duration-320 ease-epitome" aria-label="Accept cookies">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
});

// Hook to check if analytics consent is given
export function useAnalyticsConsent(): boolean {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Use setTimeout to make state update async and avoid cascade warning
    const checkConsent = () => {
      const consent = localStorage.getItem('cookie-consent');
      setHasConsent(consent === 'accepted');
    };
    
    setTimeout(checkConsent, 0);
  }, []);

  return hasConsent;
}
