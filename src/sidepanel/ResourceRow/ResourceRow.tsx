import { GripVertical, Link, Pencil } from 'lucide-react';
import { uiStore } from '@/store';

import type { WebResource } from '@/database';
import styles from './ResourceRow.module.scss';

export default function ResourceRow({ resource }: { resource: WebResource }) {
  const title = resource.title?.trim() ?? '';
  const url = resource.url?.trim() ?? '';

  return (
    <div className={styles.root}>
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
      {url !== '' ? (
        <span className={styles.mark}>
          <Link size={16} />
        </span>
      ) : null}
    </div>
  );
}
