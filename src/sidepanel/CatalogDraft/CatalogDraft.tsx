import { useRef, useState } from 'react';

import type { CatalogKind } from '@/database';
import { shelfStore } from '@/store';
import styles from './CatalogDraft.module.scss';
import { useAutoFocus } from '@/hooks/useAutoFocus';
import { useBlur } from '@/hooks/useBlur';
import { useKeyPress } from '@/hooks/useKeyPress';

export default function CatalogDraft({ kind, onDone }: { kind: CatalogKind; onDone: () => void }) {
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  useAutoFocus(inputRef);

  useKeyPress(inputRef, 'Escape', (event) => {
    event.preventDefault();
    onDone();
  });

  useBlur(inputRef, () => {
    if (name.trim() === '') {
      onDone();
    }
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
