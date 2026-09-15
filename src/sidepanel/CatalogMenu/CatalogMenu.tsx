import { useRef, useState } from 'react';

import { MoreHorizontal } from 'lucide-react';
import type { ResourceCatalog } from '@/database';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useKeyPress } from '@/hooks/useKeyPress';
import { uiStore } from '@/store';
import styles from './CatalogMenu.module.scss';

export default function CatalogMenu({ catalog }: { catalog: ResourceCatalog }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useClickOutside(wrapRef, () => setOpen(false));
  useKeyPress(document, 'Escape', () => setOpen(false));

  return (
    <div ref={wrapRef} className={styles.root}>
      <button type="button" className={styles.ico} onClick={() => setOpen((value) => !value)}>
        <MoreHorizontal size={16} />
      </button>
      {open ? (
        <div className={styles.menu}>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setOpen(false);
              uiStore.startEditingCatalog(catalog.id);
            }}
          >
            Rename
          </button>
          <button
            type="button"
            className={styles.delete}
            onClick={(event) => {
              event.stopPropagation();
              setOpen(false);
              uiStore.startDeletingCatalog(catalog.id);
            }}
          >
            Delete
          </button>
        </div>
      ) : null}
    </div>
  );
}
