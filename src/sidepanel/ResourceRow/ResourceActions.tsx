import { ExternalLink, Pencil, Trash2 } from 'lucide-react';

import type { WebResource } from '@/database';
import styles from './ResourceRow.module.scss';
import { uiStore } from '@/store';

export default function ResourceActions({ resource }: { resource: WebResource }) {
  const url = resource.url?.trim() ?? '';

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
      {url !== '' && (
        <button
          type="button"
          className={styles.ico}
          onClick={() => void chrome.tabs.create({ url })}
        >
          <ExternalLink size={16} />
        </button>
      )}
    </>
  );
}
