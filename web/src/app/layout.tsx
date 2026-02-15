import { Metadata } from "next";
import type { ReactNode } from "react";
import { Roboto } from "next/font/google";
import { client } from "@/lib/sanity/client";
import { getSitedata } from "./queries/getSitedata";
import { getNavigation } from "./queries/getNavigation";
import { getAllInfoPages } from "./queries/getInfo";
import Header from "./components/header";
import Footer from "./components/footer";
import FadeReveal from "./components/fadeReveal";
import { PageTransition } from "./components/loadingIndicator";
import { OrganizationSchema, WebSiteSchema } from "./components/structuredData";
import { GoogleAnalytics } from "./components/googleAnalytics";
import "../styles/globals.css";

const roboto = Roboto({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const sitedata = await getSitedata();
  
  return {
    title: sitedata.title,
    description: sitedata.description,
    openGraph: sitedata.ogImage?.asset?.url ? {
      images: [sitedata.ogImage.asset.url],
    } : undefined,
    icons: sitedata.favicon?.asset?.url ? {
      icon: sitedata.favicon.asset.url,
      shortcut: sitedata.favicon.asset.url,
    } : undefined,
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const navigation = await getNavigation();
  const sitedata = await getSitedata();
  const infoPages = await getAllInfoPages();
  const footer = await client.fetch(
    `*[_type == "setFooter"][0]{ address, addressLink, phone, email, instagram }`
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <OrganizationSchema sitedata={sitedata} />
        <WebSiteSchema sitedata={sitedata} />
        {sitedata.googleAnalyticsId && (
          <GoogleAnalytics gaId={sitedata.googleAnalyticsId} />
        )}
      </head>
      <body className={roboto.className} suppressHydrationWarning>
        <Header nav={navigation?.navList} />
        <PageTransition>
          {children}
          <Footer footer={footer} nav={navigation?.navList} siteTitle={sitedata.title} infoPages={infoPages} />
        </PageTransition>
      </body>
    </html>
  );
}