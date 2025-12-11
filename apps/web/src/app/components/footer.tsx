"use client"; 
import Link from "next/link";
import type { PortableTextBlock } from '@portabletext/types';
import { PortableText } from "@portabletext/react";
import { usePathname } from "next/navigation";

type NavItem = { _key: string; label: string; link: string };
type InfoPage = { _id: string; title: string; slug: { current: string } };

type FooterData = {
  address: PortableTextBlock[];
  addressLink: string;
  phone: string;
  email: string;
  instagram: string;
};

type FooterProps = {
  nav?: NavItem[];
  footer?: FooterData;
  siteTitle?: string;
  infoPages?: InfoPage[];
};

export default function Footer({ nav = [], footer, siteTitle, infoPages = [] }: FooterProps) {
  const pathname = usePathname(); // current path

  if (!footer) return null;

  return (
    <footer>
      <div className="grid5_ gap-y-3 my-20">
        <ul className="col-start-1 col-end-4 md:col-start-2 md:col-end-4 font-medium ease-epitome">

          {nav.map((item) => {
              const isCurrent = pathname.startsWith(item.link);
              return (
                <li key={item._key} className={`mb-1 ${isCurrent ? "active" : ""}`}>
                  <Link href={item.link}>{item.label}</Link>
                </li>
              );
            })}
        </ul>

        <div className="col-start-1 col-end-3 md:col-start-4 md:col-end-5 ease-epitome">
          <Link href={footer.addressLink} target="_blank">
            <PortableText value={footer.address} />
          </Link>
        </div>

        <div className="col-start-1 col-end-3 md:col-start-5 md:col-end-6 ease-epitome">
            
            {footer.phone && (
              <div className="w-full"><Link href={`mailto:${footer.phone}`} target="_blank">{footer.phone}</Link></div>
            )}
            {footer.email && (
              <div className="w-full"><Link href={`mailto:${footer.email}`} target="_blank">{footer.email}</Link></div>
            )}
            
            {footer.instagram && (
              <div className="w-full mt-1"><Link href={`https://www.instagram.com/${footer.instagram}`} target="_blank">{footer.instagram}</Link></div>
            )}
            
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mx-2 mb-2 text-12 ease-epitome">
        <div className="grow">
          <Link href="/">© {new Date().getFullYear()} {siteTitle}</Link>
        </div>
        <ul className="flex flex-row justify-between md:gap-3">
          {infoPages.map((page) => {
            const isCurrentPage = pathname === `/info/${page.slug.current}`;
            return (
              <li key={page._id} className={`text-right ${isCurrentPage ? "active" : ""}`}>
                <Link href={`/info/${page.slug.current}`}>{page.title}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </footer>
  );
}