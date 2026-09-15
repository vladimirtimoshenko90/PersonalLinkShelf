import { shelfStore, uiStore } from '@/store';
import { useRef, useState } from 'react';

import type { ResourceCatalog } from '@/database';
import styles from './ResourceAdd.module.scss';
import { useAutoFocus } from '@/hooks/useAutoFocus';
import { useClickOutside } from '@/hooks/useClickOutside';

export default function ResourceAdd({ catalog }: { catalog: ResourceCatalog }) {
  const [draft, setDraft] = useState({ title: '', url: '' });
  const isBlank = draft.title.trim() === '' && draft.url.trim() === '';

  const rootRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useAutoFocus(titleRef);
  useClickOutside(rootRef, () => isBlank && uiStore.releaseCatalog());

  return (
    <form
      ref={rootRef}
      className={styles.root}
      onSubmit={(event) => {
        event.preventDefault();
        if (isBlank) {
          return;
        }
        shelfStore.createResource(catalog.id, draft.title, draft.url);
        uiStore.releaseCatalog();
      }}
    >
      <input
        ref={titleRef}
        className={styles.field}
        type="text"
        placeholder="Title"
        value={draft.title}
        onChange={(event) => setDraft({ ...draft, title: event.target.value })}
      />
      <input
        className={styles.field}
        type="text"
        placeholder="URL"
        value={draft.url}
        onChange={(event) => setDraft({ ...draft, url: event.target.value })}
      />
      <button type="submit" className={styles.save} disabled={isBlank}>
        Save
      </button>
    </form>
  );
}
