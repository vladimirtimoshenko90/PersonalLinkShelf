import { ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react';
import { shelfStore, uiStore } from '@/store';

import type { ResourceCatalog } from '@/database';
import { observer } from 'mobx-react-lite';
import styles from './CatalogActions.module.scss';

export default observer(function CatalogActions({ catalog }: { catalog: ResourceCatalog }) {
  const openableUrls = shelfStore.resources
    .filter((resource) => resource.catalogId === catalog.id)
    .slice()
    .sort((left, right) => left.order - right.order)
    .map((resource) => resource.url?.trim() ?? '')
    .filter((url) => url !== '');

  return (
    <div className={styles.catalogActions}>
      <span className={`catHover ${styles.hover}`}>
        <button
          type="button"
          className={styles.ico}
          onClick={() => uiStore.startAddingResource(catalog.id)}
        >
          <Plus size={16} />
        </button>
        <button
          type="button"
          className={styles.ico}
          onClick={() => uiStore.startEditingCatalog(catalog.id)}
        >
          <Pencil size={16} />
        </button>
        <button
          type="button"
          className={`${styles.ico} ${styles.kill}`}
          onClick={() => uiStore.startDeletingCatalog(catalog.id)}
        >
          <Trash2 size={16} />
        </button>
      </span>

      {openableUrls.length > 0 && (
        <button
          type="button"
          className={styles.ico}
          onClick={() => {
            for (const url of openableUrls) {
              void chrome.tabs.create({ url });
            }
          }}
        >
          <ExternalLink size={16} />
        </button>
      )}
    </div>
  );
});
