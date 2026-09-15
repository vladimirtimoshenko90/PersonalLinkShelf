import { ChevronDown, ChevronRight, ExternalLink, GripVertical } from 'lucide-react';
import { shelfStore, uiStore } from '@/store';

import { CSS } from '@dnd-kit/utilities';
import CatalogMenu from '../CatalogMenu/CatalogMenu.tsx';
import CatalogNameEdit from '../CatalogNameEdit/CatalogNameEdit.tsx';
import DeleteConfirm from '../DeleteConfirm/DeleteConfirm.tsx';
import type { ResourceCatalog } from '@/database';
import ResourceAdd from '../ResourceAdd/ResourceAdd.tsx';
import ResourceRow from '../ResourceRow/ResourceRow.tsx';
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
  const resources = shelfStore.resources
    .filter((resource) => resource.catalogId === catalog.id)
    .slice()
    .sort((left, right) => left.order - right.order);
  const count = resources.length;
  const openAllDisabled = !resources.some(
    (resource) => resource.url !== null && resource.url !== '',
  );
  const Chevron = catalog.collapsed ? ChevronRight : ChevronDown;

  useClickOutside(rootRef, () => deleting && uiStore.releaseCatalog());

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

        {editing ? (
          <CatalogNameEdit catalog={catalog} />
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
        <CatalogMenu catalog={catalog} />
      </div>

      {deleting ? <DeleteConfirm catalog={catalog} /> : null}

      {resources.length > 0 ? (
        <div className={styles.rows}>
          {resources.map((resource) => (
            <ResourceRow key={resource.id} resource={resource} />
          ))}
        </div>
      ) : null}

      {addingResource ? <ResourceAdd catalog={catalog} /> : null}
    </article>
  );
});
