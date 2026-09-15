import { ChevronDown, ChevronRight, ExternalLink, GripVertical } from 'lucide-react';

import CatalogMenu from '../CatalogMenu/CatalogMenu.tsx';
import CatalogNameEdit from '../CatalogNameEdit/CatalogNameEdit.tsx';
import type { ResourceCatalog } from '@/database';
import { observer } from 'mobx-react-lite';
import { shelfStore } from '@/store';
import styles from './CatalogCard.module.scss';
import { useState } from 'react';

export default observer(function CatalogCard({ catalog }: { catalog: ResourceCatalog }) {
  const [editing, setEditing] = useState(false);
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

        {editing ? (
          <CatalogNameEdit
            name={catalog.name}
            onCancel={() => setEditing(false)}
            onSave={(name) => {
              shelfStore.renameCatalog(catalog.id, name);
              setEditing(false);
            }}
          />
        ) : (
          <span className={styles.name}>{catalog.name}</span>
        )}

        <span className={styles.count}>{count}</span>
        <button type="button" className={styles.ico}>
          <Chevron size={16} />
        </button>
        <button type="button" className={styles.ico} disabled={openAllDisabled}>
          <ExternalLink size={16} />
        </button>
        <CatalogMenu onRename={() => setEditing(true)} />
      </div>
    </article>
  );
});
