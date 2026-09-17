import { shelfStore, uiStore } from '@/store';
import { useRef, useState } from 'react';

import type { ResourceCatalog } from '@/database';
import styles from './CatalogCard.module.scss';
import { useAutoFocus } from '@/utility/hooks/useAutoFocus';
import { useBlur } from '@/utility/hooks/useBlur';
import { useKeyPress } from '@/utility/hooks/useKeyPress';

export default function CatalogEdit({ catalog }: { catalog: ResourceCatalog }) {
  const [draft, setDraft] = useState(catalog.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useAutoFocus(inputRef);

  function submit() {
    // Escape already released edit; the input still blurs and would save without this.
    if (uiStore.editingCatalogId !== catalog.id) {
      return;
    }

    const trimmed = draft.trim();
    if (trimmed !== '') {
      shelfStore.renameCatalog(catalog.id, trimmed);
    }
    uiStore.release();
  }

  useKeyPress(inputRef, 'Escape', () => uiStore.release());
  useKeyPress(inputRef, 'Enter', submit);
  useBlur(inputRef, submit);

  return (
    <input
      ref={inputRef}
      className={styles.catalogEdit}
      type="text"
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
    />
  );
}
