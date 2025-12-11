import {defineField, defineType} from 'sanity'

export const workType = defineType({
  name: 'workType',
  title: 'Project',
  type: 'document',
  fields: [
    
    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'string',
    }),
    
    defineField({
      name: 'campaign',
      title: 'Campaign',
      type: 'string',
    }),

    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: (doc) => `${doc.brand}-${doc.campaign}` },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'thumbnailGroup',
      title: 'Thumbnail',
      type: 'object',
      options: { columns: 1 }, // ← THIS makes 2-column layout
      fields: [
        {
          name: 'thumbnail',
          title: 'Media Type',
          type: 'string',
          options: {
            list: [
              { title: 'Image', value: 'image' },
              { title: 'Video', value: 'video' },
            ],
            layout: 'radio',
          },
          validation: (rule) => rule.required()
        },
        {
          name: 'thumbnailImage',
          title: 'Image',
          type: 'image',
          hidden: ({ parent }) => parent?.thumbnail !== 'image',
        },
        {
          name: 'thumbnailVideo',
          title: 'Video',
          type: 'file',
          options: { accept: 'video/*' },
          hidden: ({ parent }) => parent?.thumbnail !== 'video',
        },
        {
          name: 'videoCover',
          title: 'Video Cover Image',
          type: 'image',
          options: { hotspot: true },
          hidden: ({ parent }) => parent?.thumbnail !== 'video',
        },
      ],
    }),

    defineField({
      name: 'intro',
      type: 'array',
      of: [{type: 'block'}],
    }),

    defineField({
      name: 'services',
      type: 'array',
      of: [{type: 'block'}],
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Stills', value: 'stills' },
          { title: 'Motion', value: 'motion' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required().error("Select a category."),
    }),

    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Grid', value: 'grid' },
          { title: 'Carousel', value: 'carousel' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'gridColumns',
      title: 'Grid Columns',
      type: 'number',
      options: {
        list: [
          { title: '4 Columns', value: 4 },
          { title: '3 Columns', value: 3 },
        ],
        layout: 'radio',
      },
      initialValue: 4,
      hidden: ({ document }) => document?.layout !== 'grid' || document?.category !== 'stills',
      validation: (rule) => rule.custom((value, context) => {
        const doc = context.document as { layout?: string; category?: string };
        if (doc?.layout === 'grid' && doc?.category === 'stills' && !value) {
          return 'Grid columns is required for grid layout';
        }
        return true;
      }),
    }),

    defineField({
      name: 'gridColumnsMotion',
      title: 'Grid Columns',
      type: 'number',
      options: {
        list: [
          { title: '4 Columns', value: 4 },
          { title: '3 Columns', value: 3 },
          { title: '2 Columns', value: 2 },
          { title: '1 Column', value: 1 },
        ],
        layout: 'radio',
      },
      initialValue: 4,
      hidden: ({ document }) => document?.layout !== 'grid' || document?.category !== 'motion',
      validation: (rule) => rule.custom((value, context) => {
        const doc = context.document as { layout?: string; category?: string };
        if (doc?.layout === 'grid' && doc?.category === 'motion' && !value) {
          return 'Grid columns is required for grid layout';
        }
        return true;
      }),
    }),

    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      hidden: ({ document }) => document?.category !== 'stills',
      validation: (rule) => rule.custom((value, context) => {
        const doc = context.document as { category?: string };
        if (doc?.category === 'stills' && (!value || value.length === 0)) {
          return 'Add at least one image';
        }
        return true;
      }),
    }),

    defineField({
      name: 'videos',
      title: 'Videos',
      type: 'array',
      of: [
        { 
          type: 'object',
          name: 'videoWithCaption',
          fields: [
            {
              name: 'file',
              title: 'Video File',
              type: 'file',
              options: {
                accept: 'video/mp4,video/quicktime,video/x-msvideo,video/webm'
              },
              validation: (rule) => rule.required(),
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }
          ],
          preview: {
            select: {
              caption: 'caption',
              file: 'file.asset.originalFilename'
            },
            prepare({ caption, file }) {
              return {
                title: caption || file || 'Video',
              };
            },
          },
        },
        // Keep old format for backwards compatibility during migration
        { 
          type: 'file',
          options: {
            accept: 'video/mp4,video/quicktime,video/x-msvideo,video/webm'
          }
        }
      ],
      hidden: ({ document }) => document?.category !== 'motion',
      validation: (rule) => rule.custom((value, context) => {
        const doc = context.document as { category?: string };
        if (doc?.category === 'motion' && (!value || value.length === 0)) {
          return 'Add at least one video';
        }
        return true;
      }),
    }),

  ],
  preview: {
    select: {
      title: 'brand',
      subtitle: 'campaign',
      category: 'category',
      mediaType: 'thumbnailGroup.thumbnail',
      thumbnail: 'thumbnailGroup.thumbnailImage.asset',
      videocover: 'thumbnailGroup.videoCover.asset',
    },
    prepare({ title, subtitle, category, mediaType, thumbnail, videocover }: { title: string; subtitle?: string; category?: string; mediaType?: string; thumbnail?: any; videocover?: any; }) {
      const mediaToUse = mediaType === 'image' ? thumbnail : videocover;
      const categoryLabel = category === 'motion' ? 'Motion' : category === 'stills' ? 'Stills' : category;
      return {
        title: `${title} ${subtitle}`,
        subtitle: `Category: ${categoryLabel}`,
        media: mediaToUse,
      };
    },
  },
})