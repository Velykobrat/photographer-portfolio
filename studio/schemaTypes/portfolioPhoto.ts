import { defineField, defineType } from 'sanity';

export const portfolioPhoto = defineType({
  name: 'portfolioPhoto', type: 'image', title: 'Фотографія',
  options: { hotspot: true, metadata: ['lqip', 'palette'] },
  fields: [
    defineField({ name: 'altUk', type: 'string', title: 'Опис фото українською',
      description: 'Коротко опишіть, що зображено на фото. Цей текст допомагає людям, які користуються озвучуванням сторінки.',
      validation: Rule => Rule.required().max(300) }),
    defineField({ name: 'altEn', type: 'string', title: 'Опис фото англійською', validation: Rule => Rule.required().max(300) }),
  ],
  preview: { select: { title: 'altUk', media: 'asset' }, prepare: ({ title, media }) => ({ title: title || 'Додайте опис фото', media }) },
});
