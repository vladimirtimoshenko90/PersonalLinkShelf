import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  GripVertical,
  MoreHorizontal,
} from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { shelfStore } from '@/store';
import type { ResourceCatalog } from '@/types';
import styles from './CatalogCard.module.scss';

export default observer(function CatalogCard({ catalog }: { catalog: ResourceCatalog }) {
  const count = shelfStore.resources.filter((resource) => resource.catalogId === catalog.id).length;
  const openAllDisabled = !shelfStore.resources.some(
    (resource) => resource.catalogId === catalog.id && resource.url !== null && resource.url !== '',
  );
  const Chevron = catalog.collapsed ? ChevronRight : ChevronDown;

  return (
    <article className={styles.root}>
      <div className={styles.head}>
        <button type="button" className={styles.ico}>
          <GripVertical size={16} />
        </button>
        <span className={styles.name}>{catalog.name}</span>
        <span className={styles.count}>{count}</span>
        <button type="button" className={styles.ico}>
          <Chevron size={16} />
        </button>
        <button type="button" className={styles.ico} disabled={openAllDisabled}>
          <ExternalLink size={16} />
        </button>
        <button type="button" className={styles.ico}>
          <MoreHorizontal size={16} />
        </button>
      </div>
    </article>
  );
});
