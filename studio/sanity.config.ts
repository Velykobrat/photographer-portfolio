import { defineConfig, type DocumentActionComponent, type DuplicateDocumentActionComponent } from 'sanity';
import { structureTool } from 'sanity/structure';
import { ukUALocale } from '@sanity/locale-uk-ua';
import { portfolioSeries } from './schemaTypes/portfolioSeries';
import { portfolioPhoto } from './schemaTypes/portfolioPhoto';
import { lockSeriesSlug } from './actions/lockSeriesSlug';
import { duplicateSeries } from './actions/duplicateSeries';

const seriesActions = new WeakMap<DocumentActionComponent, DocumentActionComponent>();

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
      if (action.action !== 'publish' && action.action !== 'duplicate') return action;
      let wrapped = seriesActions.get(action);
      if (!wrapped) {
        wrapped = action.action === 'publish' ? lockSeriesSlug(action)
          : duplicateSeries(action as DuplicateDocumentActionComponent);
        seriesActions.set(action, wrapped);
      }
      return wrapped;
    }),
  },
});
