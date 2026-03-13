import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { client } from "./client";

const builder = imageUrlBuilder(client);

/**
 * Generate an optimized Sanity image URL
 * Returns an ImageUrlBuilder for chaining methods like .width(), .height(), .quality(), etc.
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto('format').fit('max');
}