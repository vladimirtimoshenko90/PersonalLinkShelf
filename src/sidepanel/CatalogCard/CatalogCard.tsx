import { shelfStore, uiStore } from '@/store';

import { CSS } from '@dnd-kit/utilities';
import CatalogActions from './CatalogActions/CatalogActions.tsx';
import CatalogEdit from './CatalogEdit.tsx';
import CatalogResources from './CatalogResources/CatalogResources.tsx';
import CatalogView from './CatalogView.tsx';
import DeleteConfirm from '../components/DeleteConfirm/DeleteConfirm.tsx';
import { GripVertical } from 'lucide-react';
import ResourceAdd from '../ResourceRow/ResourceEditors/ResourceAdd.tsx';
import type { ResourceCatalog } from '@/database';
import { observer } from 'mobx-react-lite';
import styles from './CatalogCard.module.scss';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';

export default observer(function CatalogCard({ catalog }: { catalog: ResourceCatalog }) {
  const editing = uiStore.editingCatalogId === catalog.id;
  const deleting = uiStore.deletingCatalogId === catalog.id;
  const addingResource = uiStore.addingResourceCatalogId === catalog.id;
  const rootRef = useRef<HTMLElement>(null);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: catalog.id,
  });
  const count = shelfStore.resources.filter((resource) => resource.catalogId === catalog.id).length;

  useClickOutside(rootRef, () => deleting && uiStore.release());

  const rootClass = [
    styles.root,
    deleting ? styles.armed : null,
    isDragging ? styles.dragging : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article
      ref={(node) => {
        rootRef.current = node;
        setNodeRef(node);
      }}
      className={rootClass}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <div className={styles.head}>
        <button
          type="button"
          className={`${styles.ico} ${styles.handle}`}
          {...attributes}
          {...listeners}
        >
          <GripVertical size={16} />
        </button>

        {editing ? <CatalogEdit catalog={catalog} /> : <CatalogView catalog={catalog} />}

        <CatalogActions catalog={catalog} />
      </div>

      {deleting && (
        <DeleteConfirm
          question={
            count === 0
              ? `Delete ${catalog.name}?`
              : `Delete ${catalog.name} and its ${count} resources?`
          }
          onCancel={() => uiStore.release()}
          onDelete={() => {
            shelfStore.deleteCatalog(catalog.id);
            uiStore.release();
          }}
        />
      )}

      {!deleting && addingResource && <ResourceAdd catalog={catalog} />}

      {!deleting && !catalog.collapsed && <CatalogResources catalog={catalog} />}
    </article>
  );
});
