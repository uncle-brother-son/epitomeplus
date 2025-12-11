import {defineField, defineType} from 'sanity'

export const setFooter = defineType({
  name: 'setFooter',
  title: 'Footer',
  type: 'document',
  fields: [
    defineField({
      name: 'address',
      title: 'Address',
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: 'addressLink',
      title: 'Address Link',
      type: 'url'
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string'
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string'
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram Handle',
      type: 'string'
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: title || 'Footer' }
    },
  }
})