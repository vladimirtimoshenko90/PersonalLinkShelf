import { useEffect, useRef, useState } from 'react';

import styles from './Header.module.scss';

export default function Header() {
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

  return (
    <header className={styles.header}>
      <h1 className={styles.name}>Personal Link Shelf</h1>
      <div ref={wrapRef} className={styles.newWrap}>
        <button
          type="button"
          className={styles.newButton}
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => setOpen((value) => !value)}
        >
          + New
        </button>
        {open ? (
          <div className={styles.menu} role="menu">
            <button type="button" role="menuitem" onClick={() => setOpen(false)}>
              Topic
            </button>
            <button type="button" role="menuitem" onClick={() => setOpen(false)}>
              Project
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
