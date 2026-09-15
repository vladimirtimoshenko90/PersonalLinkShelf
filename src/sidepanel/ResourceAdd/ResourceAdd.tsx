import { useRef, useState, type SubmitEvent } from 'react';

import type { ResourceCatalog } from '@/database';
import { useAutoFocus } from '@/hooks/useAutoFocus';
import { useKeyPress } from '@/hooks/useKeyPress';
import { shelfStore, uiStore } from '@/store';
import styles from './ResourceAdd.module.scss';

export default function ResourceAdd({ catalog }: { catalog: ResourceCatalog }) {
  const [draft, setDraft] = useState({ title: '', url: '' });
  const [error, setError] = useState<string | null>(null);
  const rootRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useAutoFocus(titleRef);

  useKeyPress(rootRef, 'Escape', (event) => {
    event.preventDefault();
    uiStore.releaseCatalog();
  });

  function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = draft.title.trim();
    const url = draft.url.trim();
    if (title === '' && url === '') {
      setError('Title or URL needed.');
      return;
    }
    if (url !== '' && !url.startsWith('https://')) {
      setError('URL must start with https://');
      return;
    }
    shelfStore.createResource(catalog.id, draft.title, draft.url);
    uiStore.releaseCatalog();
  }

  function onFieldChange(field: 'title' | 'url', value: string) {
    setError(null);
    setDraft({ ...draft, [field]: value });
  }

  return (
    <form ref={rootRef} className={styles.root} onSubmit={onSubmit}>
      <label className={styles.field}>
        Title
        <input
          ref={titleRef}
          type="text"
          value={draft.title}
          onChange={(event) => onFieldChange('title', event.target.value)}
        />
      </label>
      <label
        className={
          error === 'URL must start with https://'
            ? `${styles.field} ${styles.invalid}`
            : styles.field
        }
      >
        URL
        <input
          type="text"
          value={draft.url}
          onChange={(event) => onFieldChange('url', event.target.value)}
        />
      </label>

      {error !== null ? <p className={styles.hint}>{error}</p> : null}

      <div className={styles.actions}>
        <button type="submit" className={styles.save}>
          Save
        </button>
        <button type="button" className={styles.cancel} onClick={() => uiStore.releaseCatalog()}>
          Cancel
        </button>
      </div>
    </form>
  );
}
