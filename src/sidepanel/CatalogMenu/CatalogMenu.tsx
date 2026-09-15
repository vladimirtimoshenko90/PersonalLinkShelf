import { useRef, useState } from 'react';

import { MoreHorizontal } from 'lucide-react';
import styles from './CatalogMenu.module.scss';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useKeyPress } from '@/hooks/useKeyPress';

export default function CatalogMenu({ onRename }: { onRename: () => void }) {
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
            onClick={() => {
              setOpen(false);
              onRename();
            }}
          >
            Rename
          </button>
          <button type="button" className={styles.delete} onClick={() => setOpen(false)}>
            Delete
          </button>
        </div>
      ) : null}
    </div>
  );
}
