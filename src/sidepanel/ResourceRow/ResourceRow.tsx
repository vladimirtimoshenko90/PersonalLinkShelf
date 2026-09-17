import { shelfStore, uiStore } from '@/store';

import { CSS } from '@dnd-kit/utilities';
import DeleteConfirm from '../components/DeleteConfirm/DeleteConfirm.tsx';
import { GripVertical } from 'lucide-react';
import ResourceActions from './ResourceActions.tsx';
import ResourceEdit from './ResourceEditors/ResourceEdit.tsx';
import type { WebResource } from '@/database';
import { observer } from 'mobx-react-lite';
import styles from './ResourceRow.module.scss';
import { useClickOutside } from '@/utility/hooks/useClickOutside';
import { useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';

export default observer(function ResourceRow({ resource }: { resource: WebResource }) {
  const editing = uiStore.editingResourceId === resource.id;
  const deleting = uiStore.deletingResource?.id === resource.id;
  const rootRef = useRef<HTMLDivElement>(null);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: resource.id,
    disabled: editing || deleting,
  });

  useClickOutside(rootRef, () => deleting && uiStore.release());

  if (editing) {
    return (
      <div
        ref={setNodeRef}
        className={styles.resourceRow}
        style={{ transform: CSS.Transform.toString(transform), transition }}
      >
        <ResourceEdit resource={resource} />
      </div>
    );
  }

  const title = resource.title?.trim() ?? '';
  const url = resource.url?.trim() ?? '';

  return (
    <div
      ref={(node) => {
        rootRef.current = node;
        setNodeRef(node);
      }}
      className={[
        styles.resourceRow,
        deleting ? styles.armed : null,
        isDragging ? styles.dragging : null,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <div className={styles.body}>
        <button
          type="button"
          className={`${styles.ico} ${styles.handle}`}
          {...attributes}
          {...listeners}
        >
          <GripVertical size={16} />
        </button>

        <span className={styles.copy}>
          {title !== '' && <span className={styles.title}>{title}</span>}
          {title !== '' && url !== '' && <span className={styles.sep}>·</span>}
          {url !== '' && <span className={styles.url}>{url}</span>}
        </span>

        <ResourceActions resource={resource} />
      </div>

      {deleting && (
        <DeleteConfirm
          question={`Delete ${title !== '' ? title : url}?`}
          onCancel={() => uiStore.release()}
          onDelete={() => {
            shelfStore.deleteResource(resource.id);
            uiStore.release();
          }}
        />
      )}
    </div>
  );
});
