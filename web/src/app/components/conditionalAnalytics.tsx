'use client';

import { memo } from 'react';
import { GoogleAnalytics } from './googleAnalytics';
import { useAnalyticsConsent } from './cookieConsent';

type ConditionalAnalyticsProps = {
  gaId: string;
};

export const ConditionalAnalytics = memo(function ConditionalAnalytics({ gaId }: ConditionalAnalyticsProps) {
  const hasConsent = useAnalyticsConsent();

  if (!hasConsent) {
    return null;
  }

  return <GoogleAnalytics gaId={gaId} />;
});
