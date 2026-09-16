import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import { shelfStore, uiStore } from '@/store';

import DeleteConfirm from '../components/DeleteConfirm/DeleteConfirm.tsx';
import ResourceEdit from '../ResourceEditors/ResourceEdit.tsx';
import type { WebResource } from '@/database';
import { observer } from 'mobx-react-lite';
import styles from './ResourceRow.module.scss';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useRef } from 'react';

export default observer(function ResourceRow({ resource }: { resource: WebResource }) {
  const editing = uiStore.editingResourceId === resource.id;
  const deleting = uiStore.deletingResource?.id === resource.id;
  const rootRef = useRef<HTMLDivElement>(null);

  useClickOutside(rootRef, () => deleting && uiStore.release());

  if (editing) {
    return <ResourceEdit resource={resource} />;
  }

  const title = resource.title?.trim() ?? '';
  const url = resource.url?.trim() ?? '';

  return (
    <div
      ref={rootRef}
      className={deleting ? `${styles.resourceRow} ${styles.armed}` : styles.resourceRow}
    >
      <div className={styles.body}>
        <button type="button" className={styles.ico}>
          <GripVertical size={16} />
        </button>
        <span className={styles.copy}>
          {title !== '' && <span className={styles.title}>{title}</span>}
          {title !== '' && url !== '' && <span className={styles.sep}>·</span>}
          {url !== '' && <span className={styles.url}>{url}</span>}
        </span>

        <button
          type="button"
          className={`${styles.ico} ${styles.edit}`}
          onClick={() => uiStore.startEditingResource(resource.id)}
        >
          <Pencil size={16} />
        </button>
        <button
          type="button"
          className={`${styles.ico} ${styles.delete}`}
          onClick={() => uiStore.startDeletingResource(resource)}
        >
          <Trash2 size={16} />
        </button>
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
