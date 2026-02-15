import { defineField, defineType } from 'sanity';

export const setCategoryMetadata = defineType({
  name: 'setCategoryMetadata',
  title: 'Category Metadata',
  type: 'document',
  fields: [
    defineField({
      name: 'stillsTitle',
      title: 'Stills Page Title',
      type: 'string',
      description: 'SEO title for Stills category page',
      validation: (rule) => rule.max(60).warning('Keep under 60 characters for optimal SEO'),
    }),
    defineField({
      name: 'stillsDescription',
      title: 'Stills Meta Description',
      type: 'text',
      description: 'Brief description for search engines (150-160 characters recommended)',
      rows: 3,
      validation: (rule) => rule.max(160).warning('Keep under 160 characters for optimal SEO'),
    }),
    defineField({
      name: 'stillsOgImage',
      title: 'Stills Social Share Image',
      type: 'image',
      description: 'Image for social media previews of Stills page. Recommended: 1200x630px',
    }),
    defineField({
      name: 'motionTitle',
      title: 'Motion Page Title',
      type: 'string',
      description: 'SEO title for Motion category page',
      validation: (rule) => rule.max(60).warning('Keep under 60 characters for optimal SEO'),
    }),
    defineField({
      name: 'motionDescription',
      title: 'Motion Meta Description',
      type: 'text',
      description: 'Brief description for search engines (150-160 characters recommended)',
      rows: 3,
      validation: (rule) => rule.max(160).warning('Keep under 160 characters for optimal SEO'),
    }),
    defineField({
      name: 'motionOgImage',
      title: 'Motion Social Share Image',
      type: 'image',
      description: 'Image for social media previews of Motion page. Recommended: 1200x630px',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Category Metadata',
      };
    },
  },
});
