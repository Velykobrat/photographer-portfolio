import { useState } from 'react';
import { useClient, type DocumentActionComponent } from 'sanity';

export function lockSeriesSlug(PublishAction: DocumentActionComponent): DocumentActionComponent {
  const LockedPublish: DocumentActionComponent = props => {
    const action = PublishAction(props);
    const client = useClient({ apiVersion: '2026-10-12' });
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    if (!action) return null;
    return {
      ...action,
      disabled: action.disabled || pending,
      dialog: error ? { type: 'confirm', message: error, onCancel: () => setError(null), onConfirm: () => setError(null) } : action.dialog,
      onHandle: async () => {
        setPending(true);
        const slug = (props.draft?.slug as { current?: string } | undefined)?.current;
        try {
          if (slug && !props.draft?.publishedSlug) {
            await client.patch(`drafts.${props.id}`).setIfMissing({ publishedSlug: slug }).commit();
          }
          action.onHandle?.();
        } catch {
          setError('Не вдалося опублікувати серію. Перевірте з’єднання та спробуйте ще раз.');
        } finally {
          setPending(false);
        }
      },
    };
  };
  LockedPublish.action = PublishAction.action;
  return LockedPublish;
}
