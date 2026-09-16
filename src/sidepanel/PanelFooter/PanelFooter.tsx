import { useRef, useState } from 'react';

import { Download, Upload } from 'lucide-react';

import type { CatalogKind } from '@/database';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useKeyPress } from '@/hooks/useKeyPress';
import styles from './PanelFooter.module.scss';

export default function PanelFooter({ onPickKind }: { onPickKind: (kind: CatalogKind) => void }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useClickOutside(wrapRef, () => setOpen(false));
  useKeyPress(document, 'Escape', () => setOpen(false));

  function pick(kind: CatalogKind) {
    onPickKind(kind);
    setOpen(false);
  }

  return (
    <footer className={styles.panelFooter}>
      <div className={styles.tools}>
        <button type="button" className={styles.ico} title="Import from JSON">
          <Download size={16} />
        </button>
        <button type="button" className={styles.ico} title="Export as JSON">
          <Upload size={16} />
        </button>
      </div>
      <div ref={wrapRef} className={styles.newWrap}>
        <button
          type="button"
          className={styles.newButton}
          onClick={() => setOpen((value) => !value)}
        >
          + New
        </button>
        {open && (
          <div className={styles.menu}>
            <button type="button" onClick={() => pick('topic')}>
              Topic
            </button>
            <button type="button" onClick={() => pick('project')}>
              Project
            </button>
          </div>
        )}
      </div>
    </footer>
  );
}
