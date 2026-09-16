import { Pencil, Trash2 } from 'lucide-react';

import type { WebResource } from '@/database';
import styles from './ResourceRow.module.scss';
import { uiStore } from '@/store';

export default function ResourceActions({ resource }: { resource: WebResource }) {
  return (
    <>
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
    </>
  );
}
