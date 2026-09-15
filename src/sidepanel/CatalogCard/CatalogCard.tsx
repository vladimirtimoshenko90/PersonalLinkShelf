import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, ChevronRight, ExternalLink, GripVertical } from 'lucide-react';
import { useRef, useState } from 'react';

import CatalogMenu from '../CatalogMenu/CatalogMenu.tsx';
import CatalogNameEdit from '../CatalogNameEdit/CatalogNameEdit.tsx';
import DeleteConfirm from '../DeleteConfirm/DeleteConfirm.tsx';
import type { ResourceCatalog } from '@/database';
import ResourceRow from '../ResourceRow/ResourceRow.tsx';
import { observer } from 'mobx-react-lite';
import { shelfStore } from '@/store';
import styles from './CatalogCard.module.scss';
import { useClickOutside } from '@/hooks/useClickOutside';

export default observer(function CatalogCard({ catalog }: { catalog: ResourceCatalog }) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
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

  useClickOutside(rootRef, () => setDeleting(false));

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

      {resources.length > 0 ? (
        <div className={styles.rows}>
          {resources.map((resource) => (
            <ResourceRow key={resource.id} resource={resource} />
          ))}
        </div>
      ) : null}
    </article>
  );
});
