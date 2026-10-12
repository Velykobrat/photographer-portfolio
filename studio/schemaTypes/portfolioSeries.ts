import { defineArrayMember, defineField, defineType } from 'sanity';
import { SERIES_SLUG_MAX_LENGTH, validateSeriesSlug } from '../utils/seriesSlug';

export const portfolioSeries = defineType({
  name: 'portfolioSeries', type: 'document', title: 'Серія фотографій',
  groups: [
    { name: 'details', title: 'Про серію', default: true },
    { name: 'photos', title: 'Фотографії' },
    { name: 'display', title: 'Вигляд у портфоліо' },
  ],
  initialValue: { category: 'portrait', order: 10, featured: false },
  fields: [
    defineField({ name: 'title', title: 'Назва серії', type: 'object', group: 'details',
      fields: [
        defineField({ name: 'uk', title: 'Українською', type: 'string', validation: Rule => Rule.required().max(120) }),
        defineField({ name: 'en', title: 'Англійською', type: 'string', validation: Rule => Rule.required().max(120) }),
      ], validation: Rule => Rule.required() }),
    defineField({ name: 'slug', title: 'Адреса серії', type: 'slug', group: 'details',
      description: 'Латиниця, цифри та дефіси, наприклад kyiv-portraits. Після першої публікації адреса фіксується, щоб зберегти посилання.',
      options: { source: 'title.en', maxLength: SERIES_SLUG_MAX_LENGTH },
      readOnly: ({ document }) => Boolean(document?.publishedSlug),
      validation: Rule => Rule.required().custom(validateSeriesSlug) }),
    defineField({ name: 'publishedSlug', title: 'Первинна адреса', type: 'string', hidden: true, readOnly: true }),
    defineField({ name: 'category', title: 'Категорія', type: 'string', group: 'details',
      options: { list: [
        { title: 'Портрети', value: 'portrait' }, { title: 'Мода', value: 'fashion' },
        { title: 'Особисті зйомки', value: 'personal' }, { title: 'Комерційні зйомки', value: 'commercial' },
      ] }, validation: Rule => Rule.required() }),
    defineField({ name: 'description', title: 'Опис серії', type: 'object', group: 'details', fields: [
      defineField({ name: 'uk', title: 'Українською', type: 'text', rows: 3, validation: Rule => Rule.max(1000) }),
      defineField({ name: 'en', title: 'Англійською', type: 'text', rows: 3, validation: Rule => Rule.max(1000) }),
    ] }),
    defineField({ name: 'cover', title: 'Обкладинка', type: 'image', group: 'display',
      description: 'Завантажте або виберіть фото з уже завантажених. За потреби налаштуйте кадрування й точку фокуса.',
      options: { hotspot: true, metadata: ['lqip', 'palette'] }, validation: Rule => Rule.required().assetRequired() }),
    defineField({ name: 'photos', title: 'Фотографії серії', type: 'array', group: 'photos',
      description: 'Перетягніть сюди одразу кілька фото. Змінюйте їхній порядок перетягуванням карток і додайте описи двома мовами. Прибирання фото із серії не видаляє оригінал із бібліотеки.',
      of: [defineArrayMember({ type: 'portfolioPhoto' })], options: { layout: 'grid' },
      validation: Rule => Rule.required().min(1).max(300) }),
    defineField({ name: 'order', title: 'Порядок серії', type: 'number', group: 'display',
      description: 'Менше число — вище у списку. Наприклад: 10, 20, 30.', validation: Rule => Rule.required().integer().min(0).max(100000) }),
    defineField({ name: 'featured', title: 'Вибрана серія', type: 'boolean', group: 'display',
      description: 'Показувати великим блоком на початку портфоліо. Якщо позначено кілька серій, першою буде серія з меншим номером порядку.' }),
  ],
  orderings: [{ title: 'Порядок у портфоліо', name: 'portfolioOrder', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title.uk', subtitle: 'category', media: 'cover' } },
});
