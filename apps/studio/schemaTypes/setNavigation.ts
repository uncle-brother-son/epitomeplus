import { defineField, defineType } from 'sanity'

export const setNavigation = defineType({
  name: 'setNavigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'navList',
      title: 'Navigation List',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'navItem',
          title: 'Navigation Item',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
            }),
            defineField({
              name: 'link',
              title: 'Link URL',
              type: 'string',
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: title || 'Navigation' }
    },
  }
})