import { client } from "@/lib/sanity/client";

export type FooterData = {
  address: string;
  addressLink: string;
  phone: string;
  email: string;
  instagram: string;
  infoLinks: { _key: string; label: string; link: string }[];
};

export const FOOTER_QUERY = `
  *[_type == "setFooter"][0]{
    address,
    addressLink,
    phone,
    email,
    instagram,
    infoLinks[]{ _key, label, link }
  }
`;

export async function getFooter(): Promise<FooterData> {
  return await client.fetch(FOOTER_QUERY);
}