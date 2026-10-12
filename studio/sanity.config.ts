import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { ukUALocale } from '@sanity/locale-uk-ua';
import { portfolioSeries } from './schemaTypes/portfolioSeries';
import { portfolioPhoto } from './schemaTypes/portfolioPhoto';
import { lockSeriesSlug } from './actions/lockSeriesSlug';

const publishActions = new WeakMap();

export default defineConfig({
  name: 'mk-photography',
  title: 'MK Photography — Портфоліо',
  projectId: 'd3nr3igp',
  dataset: 'production',
  plugins: [
    ukUALocale(),
    structureTool({
      title: 'Портфоліо',
      structure: S => S.list().title('Портфоліо').items([
        S.documentTypeListItem('portfolioSeries').title('Серії фотографій')
          .child(S.documentTypeList('portfolioSeries').title('Серії фотографій')
            .defaultOrdering([{ field: 'order', direction: 'asc' }, { field: 'title.uk', direction: 'asc' }])),
      ]),
    }),
  ],
  schema: { types: [portfolioSeries, portfolioPhoto] },
  document: {
    actions: (actions, context) => context.schemaType !== 'portfolioSeries' ? actions : actions.map(action => {
      if (action.action !== 'publish') return action;
      if (!publishActions.has(action)) publishActions.set(action, lockSeriesSlug(action));
      return publishActions.get(action);
    }),
  },
});
