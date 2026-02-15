import {defineField, defineType} from 'sanity'

export const setSitedata = defineType({
  name: 'setSitedata',
  title: 'Site Info',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string'
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text'
    }),
    defineField({ 
      name: 'ogImage',
      title: 'Open Graph Image', 
      type: 'image',
      description: 'Default social media share image for the site. Recommended size: 1200x630px'
    }),
    defineField({ 
      name: 'favicon',
      title: 'Favicon', 
      type: 'file' 
    }),
    defineField({
      name: 'googleAnalyticsId',
      title: 'Google Analytics ID',
      type: 'string',
      description: 'Google Analytics 4 Measurement ID (e.g., G-XXXXXXXXXX)',
      validation: (Rule) => Rule.regex(/^G-[A-Z0-9]+$/).warning('Should be in format G-XXXXXXXXXX'),
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: title || 'Site Data' }
    },
  }
})