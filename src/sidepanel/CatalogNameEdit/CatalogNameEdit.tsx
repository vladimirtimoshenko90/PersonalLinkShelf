import { useRef, useState } from 'react';

import type { ResourceCatalog } from '@/database';
import { useAutoFocus } from '@/hooks/useAutoFocus';
import { useBlur } from '@/hooks/useBlur';
import { useKeyPress } from '@/hooks/useKeyPress';
import { shelfStore, uiStore } from '@/store';
import styles from './CatalogNameEdit.module.scss';

export default function CatalogNameEdit({ catalog }: { catalog: ResourceCatalog }) {
  const [draft, setDraft] = useState(catalog.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useAutoFocus(inputRef);

  function submit() {
    const trimmed = draft.trim();
    if (trimmed !== '') {
      shelfStore.renameCatalog(catalog.id, trimmed);
    }
    uiStore.releaseCatalog();
  }

  useKeyPress(inputRef, 'Enter', submit);
  useBlur(inputRef, submit);

  return (
    <input
      ref={inputRef}
      className={styles.root}
      type="text"
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
    />
  );
}
