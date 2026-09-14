import { useRef, useState } from 'react';

import { useAutoFocus } from '@/hooks/useAutoFocus';
import { useKeyPress } from '@/hooks/useKeyPress';
import { shelfStore } from '@/store';
import type { CatalogKind } from '@/database';
import styles from './CatalogDraft.module.scss';

export default function CatalogDraft({ kind, onDone }: { kind: CatalogKind; onDone: () => void }) {
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  useAutoFocus(inputRef);

  useKeyPress(inputRef, 'Escape', (event) => {
    event.preventDefault();
    onDone();
  });

  useKeyPress(inputRef, 'Enter', (event) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (trimmed !== '') {
      shelfStore.createCatalog(kind, trimmed);
    }
    onDone();
  });

  return (
    <input
      ref={inputRef}
      className={styles.root}
      type="text"
      placeholder={kind === 'project' ? 'Project name' : 'Topic name'}
      value={name}
      onChange={(event) => setName(event.target.value)}
    />
  );
}
