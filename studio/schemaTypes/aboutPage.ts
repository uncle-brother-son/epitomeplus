import { defineField, defineType } from 'sanity';

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Page Title', type: 'string' }),

    defineField({
      name: 'metaDescription',
      title: 'Meta Description (SEO)',
      type: 'text',
      description: 'Brief description for search engines (150-160 characters recommended)',
      rows: 3,
      validation: (rule) => rule.max(160).warning('Keep under 160 characters for optimal SEO'),
    }),

    defineField({
      name: 'ogImage',
      title: 'Social Share Image',
      type: 'image',
      description: 'Image for social media previews. Recommended: 1200x630px',
    }),

    defineField({
      name: 'mediaType',
      title: 'Media Type',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      hidden: ({ parent }) => parent?.mediaType !== 'image',
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'file',
      options: { accept: 'video/*' },
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    {
      name: 'videoCover',
      title: 'Video Cover Image',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.thumbnail !== 'video',
    },

    defineField({
      name: 'intro',
      title: 'Intro Text',
      type: 'array',
      of: [{ type: 'block' }],
    }),

    defineField({
      name: 'contactList',
      title: 'Contact List',
      type: 'array',
      of: [
        {
          name: 'contactList',
          title: 'Contact List',
          type: 'object',
          fields: [
            defineField({ name: 'contact', title: 'Contact', type: 'string' }),
            defineField({ name: 'email', title: 'Email', type: 'string' }),
          ],
        },
      ],
    }),
  ],
});