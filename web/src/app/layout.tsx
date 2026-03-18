import { Metadata } from "next";
import type { ReactNode } from "react";
import { getSitedata } from "./queries/getSitedata";
import { getNavigation } from "./queries/getNavigation";
import { getAllInfoPages } from "./queries/getInfo";
import { getFooter } from "./queries/getFooter";
import Header from "./components/header";
import Footer from "./components/footer";
import { PageTransition } from "./components/loadingIndicator";
import { OrganizationSchema, WebSiteSchema } from "./components/structuredData";
import { ConditionalAnalytics } from "./components/conditionalAnalytics";
import { CookieConsent } from "./components/cookieConsent";
import "../styles/globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const sitedata = await getSitedata();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://epitomeplus.co.uk';
  const ogImage = sitedata.ogImage?.asset?.url;

  return {
    metadataBase: new URL(siteUrl),
    title: sitedata.title,
    description: sitedata.description,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      siteName: sitedata.title,
      title: sitedata.title,
      description: sitedata.description,
      url: siteUrl,
      ...(ogImage && {
        images: [{
          url: ogImage,
          width: 1200,
          height: 630,
          alt: sitedata.title,
        }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: sitedata.title,
      description: sitedata.description,
      ...(ogImage && { images: [ogImage] }),
    },
    icons: sitedata.favicon?.asset?.url ? {
      icon: sitedata.favicon.asset.url,
      shortcut: sitedata.favicon.asset.url,
    } : undefined,
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Parallelize independent queries (sitedata cached from generateMetadata)
  const [navigation, sitedata, infoPages, footer] = await Promise.all([
    getNavigation(),
    getSitedata(),
    getAllInfoPages(),
    getFooter(),
  ]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <OrganizationSchema sitedata={sitedata} />
        <WebSiteSchema sitedata={sitedata} />
      </head>
      <body suppressHydrationWarning>
        {sitedata.googleAnalyticsId && (
          <ConditionalAnalytics gaId={sitedata.googleAnalyticsId} />
        )}
        <Header nav={navigation?.navList} siteTitle={sitedata.title} />
        <PageTransition>
          {children}
          <Footer footer={footer} nav={navigation?.navList} siteTitle={sitedata.title} infoPages={infoPages} />
        </PageTransition>
        <CookieConsent />
      </body>
    </html>
  );
}