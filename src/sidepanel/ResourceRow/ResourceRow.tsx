import { GripVertical, Link, Pencil, Trash2 } from 'lucide-react';

import ResourceDelete from '../ResourceDelete/ResourceDelete.tsx';
import ResourceEdit from '../ResourceEditors/ResourceEdit.tsx';
import type { WebResource } from '@/database';
import { observer } from 'mobx-react-lite';
import styles from './ResourceRow.module.scss';
import { uiStore } from '@/store';

export default observer(function ResourceRow({ resource }: { resource: WebResource }) {
  const editing = uiStore.editingResourceId === resource.id;
  const deleting = uiStore.deletingResource?.id === resource.id;

  if (editing) {
    return <ResourceEdit resource={resource} />;
  }

  const title = resource.title?.trim() ?? '';
  const url = resource.url?.trim() ?? '';

  return (
    <div className={deleting ? `${styles.resourceRow} ${styles.armed}` : styles.resourceRow}>
      <div className={styles.body}>
        <button type="button" className={styles.ico}>
          <GripVertical size={16} />
        </button>
        <span className={styles.copy}>
          {title !== '' ? <span className={styles.title}>{title}</span> : null}
          {title !== '' && url !== '' ? <span className={styles.sep}>·</span> : null}
          {url !== '' ? <span className={styles.url}>{url}</span> : null}
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
        {url !== '' ? (
          <span className={styles.mark}>
            <Link size={16} />
          </span>
        ) : null}
      </div>

      {deleting ? <ResourceDelete resource={resource} /> : null}
    </div>
  );
});
