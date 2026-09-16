import { ChevronDown, ChevronRight, ExternalLink, MoreHorizontal } from 'lucide-react';
import { shelfStore, uiStore } from '@/store';
import { useRef, useState, type MouseEvent } from 'react';

import type { ResourceCatalog } from '@/database';
import { observer } from 'mobx-react-lite';
import styles from './CatalogActions.module.scss';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useKeyPress } from '@/hooks/useKeyPress';

export default observer(function CatalogActions({ catalog }: { catalog: ResourceCatalog }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const count = shelfStore.resources.filter((resource) => resource.catalogId === catalog.id).length;
  const openAllDisabled = !shelfStore.resources.some(
    (resource) => resource.catalogId === catalog.id && resource.url !== null && resource.url !== '',
  );
  const Chevron = catalog.collapsed ? ChevronRight : ChevronDown;

  useClickOutside(wrapRef, () => setOpen(false));
  useKeyPress(document, 'Escape', () => setOpen(false));

  function onAdd(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    setOpen(false);
    uiStore.startAddingResource(catalog.id);
  }

  function onRename(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    setOpen(false);
    uiStore.startEditingCatalog(catalog.id);
  }

  function onDelete(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    setOpen(false);
    uiStore.startDeletingCatalog(catalog.id);
  }

  return (
    <div className={styles.catalogActions}>
      {count > 0 && (
        <>
          <span className={styles.count}>{count}</span>
          <button
            type="button"
            className={styles.ico}
            onClick={() => shelfStore.toggleCatalogCollapsed(catalog.id)}
          >
            <Chevron size={16} />
          </button>
        </>
      )}

      <button type="button" className={styles.ico} disabled={openAllDisabled}>
        <ExternalLink size={16} />
      </button>

      <div ref={wrapRef} className={styles.menuWrap}>
        <button type="button" className={styles.ico} onClick={() => setOpen((value) => !value)}>
          <MoreHorizontal size={16} />
        </button>
        {open && (
          <div className={styles.menu}>
            <button type="button" onClick={onAdd}>
              Add
            </button>
            <button type="button" onClick={onRename}>
              Rename
            </button>
            <button type="button" className={styles.delete} onClick={onDelete}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
});
