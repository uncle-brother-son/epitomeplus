import { client } from "../lib/sanityClient";

export type NavItem = {
  _key: string;
  label: string;
  link: string;
};

export type NavigationDoc = {
  navList: NavItem[];
};

export async function getNavigation(): Promise<NavigationDoc | null> {
  const query = `*[_type == "setNavigation"][0]{ navList }`;
  const result = await client.fetch<NavigationDoc | null>(query);
  return result;
}