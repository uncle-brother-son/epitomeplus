import {defineField, defineType} from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home',
  type: 'document',
  fields: [
    defineField({
      name: 'featuredProjects',
      title: 'Featured Projects',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'workType' }] }],
      validation: (Rule) => Rule.max(6),
      description: 'Select up to 6 project posts to feature on the homepage. Drag to reorder.',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Homepage',
      }
    }
  }
})