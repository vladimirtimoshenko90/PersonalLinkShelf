import { useRef, useState, type SubmitEvent } from 'react';

import { useAutoFocus } from '@/hooks/useAutoFocus';
import { useKeyPress } from '@/hooks/useKeyPress';
import { uiStore } from '@/store';
import styles from './ResourceForm.module.scss';
import { readActiveTab, tabCaptureHint } from './tabCapture.ts';

export default function ResourceForm({
  initial,
  onSave,
  captureTab = false,
}: {
  initial: { title: string; url: string };
  onSave: (title: string, url: string) => void;
  captureTab?: boolean;
}) {
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const rootRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useAutoFocus(titleRef);

  useKeyPress(rootRef, 'Escape', (event) => {
    event.preventDefault();
    uiStore.release();
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
    onSave(draft.title, draft.url);
    uiStore.release();
  }

  function onFieldChange(field: 'title' | 'url', value: string) {
    setError(null);
    setDraft({ ...draft, [field]: value });
  }

  async function onThisTab() {
    const tab = await readActiveTab();
    const hint = tabCaptureHint(tab?.url);
    if (hint !== null || tab === null) {
      setError(hint ?? "Can't use this page.");
      return;
    }
    setError(null);
    setDraft({ title: tab.title, url: tab.url });
  }

  return (
    <form ref={rootRef} className={`${styles.resourceForm} resourceForm`} onSubmit={onSubmit}>
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

      {error !== null && <p className={styles.hint}>{error}</p>}

      <div className={styles.actions}>
        {captureTab && (
          <button type="button" className={styles.thisTab} onClick={() => void onThisTab()}>
            This tab
          </button>
        )}
        <button type="submit" className={styles.save}>
          Save
        </button>
        <button type="button" className={styles.cancel} onClick={() => uiStore.release()}>
          Cancel
        </button>
      </div>
    </form>
  );
}
