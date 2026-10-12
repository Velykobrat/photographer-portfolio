import type { DuplicateDocumentActionComponent } from 'sanity';

export function duplicateSeries(OriginalAction: DuplicateDocumentActionComponent): DuplicateDocumentActionComponent {
  const DuplicateSeries: DuplicateDocumentActionComponent = props => OriginalAction({
    ...props,
    mapDocument: document => {
      const duplicate = { ...(props.mapDocument?.(document) ?? document) };
      delete duplicate.slug;
      delete duplicate.publishedSlug;
      return duplicate;
    },
  });
  DuplicateSeries.action = OriginalAction.action;
  return DuplicateSeries;
}
