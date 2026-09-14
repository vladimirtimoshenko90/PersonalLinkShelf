import { useEffect, useRef, useState } from 'react';

import type { CatalogKind } from '@/types';
import styles from './PanelHeader.module.scss';

export default function PanelHeader({ onPickKind }: { onPickKind: (kind: CatalogKind) => void }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onPointerDown(event: PointerEvent) {
      if (wrapRef.current?.contains(event.target as Node)) {
        return;
      }
      setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  function pick(kind: CatalogKind) {
    onPickKind(kind);
    setOpen(false);
  }

  return (
    <header className={styles.root}>
      <h1 className={styles.name}>Personal Link Shelf</h1>
      <div ref={wrapRef} className={styles.newWrap}>
        <button
          type="button"
          className={styles.newButton}
          onClick={() => setOpen((value) => !value)}
        >
          + New
        </button>
        {open ? (
          <div className={styles.menu}>
            <button type="button" onClick={() => pick('topic')}>
              Topic
            </button>
            <button type="button" onClick={() => pick('project')}>
              Project
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
