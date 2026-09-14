import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

import { shelfStore } from '@/store';
import type { CatalogKind } from '@/types';
import styles from './CatalogDraft.module.scss';

export default function CatalogDraft({ kind, onDone }: { kind: CatalogKind; onDone: () => void }) {
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      onDone();
      return;
    }
    if (event.key !== 'Enter') {
      return;
    }
    event.preventDefault();
    if (shelfStore.createCatalog(kind, name)) {
      onDone();
    }
  }

  return (
    <input
      ref={inputRef}
      className={styles.root}
      type="text"
      placeholder={kind === 'project' ? 'Project name' : 'Topic name'}
      value={name}
      onChange={(event) => setName(event.target.value)}
      onKeyDown={onKeyDown}
    />
  );
}
