import { useRef, useState, type ChangeEvent } from 'react';

import { Download, Upload } from 'lucide-react';

import type { CatalogKind } from '@/database';
import { useClickOutside } from '@/utility/hooks/useClickOutside';
import { useKeyPress } from '@/utility/hooks/useKeyPress';
import { shelfStore } from '@/store';
import { exportShelf } from '@/utility/dataExport/exportShelf';
import { importShelf } from '@/utility/dataExport/importShelf';
import type { ShelfExportModel } from '@/utility/dataExport/shelf-export-model';
import styles from './PanelFooter.module.scss';

export default function PanelFooter({ onPickKind }: { onPickKind: (kind: CatalogKind) => void }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useClickOutside(wrapRef, () => setOpen(false));
  useKeyPress(document, 'Escape', () => setOpen(false));

  function pick(kind: CatalogKind) {
    onPickKind(kind);
    setOpen(false);
  }

  async function onImportFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const data = JSON.parse(await file.text()) as ShelfExportModel;
    await importShelf(data);
  }

  return (
    <footer className={styles.panelFooter}>
      <div className={styles.tools}>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className={styles.file}
          onChange={onImportFile}
        />
        <button
          type="button"
          className={styles.ico}
          title="Import data"
          onClick={() => fileRef.current?.click()}
        >
          <Download size={16} />
        </button>
        <button
          type="button"
          className={styles.ico}
          title="Export data"
          onClick={() => exportShelf(shelfStore.catalogs, shelfStore.resources)}
        >
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
