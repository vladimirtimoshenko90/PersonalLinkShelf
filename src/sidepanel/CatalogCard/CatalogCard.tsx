import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  GripVertical,
  MoreHorizontal,
} from 'lucide-react';

import type { ResourceCatalog } from '@/types';
import { observer } from 'mobx-react-lite';
import { shelfStore } from '@/store';
import styles from './CatalogCard.module.scss';

export default observer(function CatalogCard({ catalog }: { catalog: ResourceCatalog }) {
  const count = shelfStore.resources.filter((resource) => resource.catalogId === catalog.id).length;
  const openAllDisabled = !shelfStore.resources.some(
    (resource) => resource.catalogId === catalog.id && resource.url !== null && resource.url !== '',
  );
  const Chevron = catalog.collapsed ? ChevronRight : ChevronDown;

  return (
    <article className={styles.card}>
      <div className={styles.head}>
        <button type="button" className={styles.ico} aria-label="Reorder">
          <GripVertical size={16} aria-hidden="true" />
        </button>
        <span className={styles.name}>{catalog.name}</span>
        <span className={styles.count}>{count}</span>
        <button
          type="button"
          className={styles.ico}
          aria-label={catalog.collapsed ? 'Expand' : 'Collapse'}
        >
          <Chevron size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={styles.ico}
          aria-label="Open all"
          disabled={openAllDisabled}
        >
          <ExternalLink size={16} aria-hidden="true" />
        </button>
        <button type="button" className={styles.ico} aria-label="More">
          <MoreHorizontal size={16} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
});
