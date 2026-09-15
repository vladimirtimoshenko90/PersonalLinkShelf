import { ChevronDown, ChevronRight, ExternalLink, GripVertical } from 'lucide-react';
import { useRef, useState } from 'react';

import CatalogMenu from '../CatalogMenu/CatalogMenu.tsx';
import CatalogNameEdit from '../CatalogNameEdit/CatalogNameEdit.tsx';
import DeleteConfirm from '../DeleteConfirm/DeleteConfirm.tsx';
import type { ResourceCatalog } from '@/database';
import { observer } from 'mobx-react-lite';
import { shelfStore } from '@/store';
import styles from './CatalogCard.module.scss';
import { useClickOutside } from '@/hooks/useClickOutside';

export default observer(function CatalogCard({ catalog }: { catalog: ResourceCatalog }) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const count = shelfStore.resources.filter((resource) => resource.catalogId === catalog.id).length;
  const openAllDisabled = !shelfStore.resources.some(
    (resource) => resource.catalogId === catalog.id && resource.url !== null && resource.url !== '',
  );
  const Chevron = catalog.collapsed ? ChevronRight : ChevronDown;

  useClickOutside(rootRef, () => setDeleting(false));

  return (
    <article ref={rootRef} className={deleting ? `${styles.root} ${styles.armed}` : styles.root}>
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
        <CatalogMenu onRename={() => setEditing(true)} onDelete={() => setDeleting(true)} />
      </div>

      {deleting ? (
        <DeleteConfirm
          catalog={catalog}
          onCancel={() => setDeleting(false)}
          onConfirm={() => {
            shelfStore.deleteCatalog(catalog.id);
            setDeleting(false);
          }}
        />
      ) : null}
    </article>
  );
});
