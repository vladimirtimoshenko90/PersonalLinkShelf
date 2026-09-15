import { useRef, useState } from 'react';

import styles from './CatalogNameEdit.module.scss';
import { useAutoFocus } from '@/hooks/useAutoFocus';
import { useBlur } from '@/hooks/useBlur';
import { useKeyPress } from '@/hooks/useKeyPress';

export default function CatalogNameEdit({
  name,
  onCancel,
  onSave,
}: {
  name: string;
  onCancel: () => void;
  onSave: (name: string) => void;
}) {
  const [draft, setDraft] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  useAutoFocus(inputRef);

  function submit() {
    const trimmed = draft.trim();
    if (trimmed === '') {
      onCancel();
    } else {
      onSave(trimmed);
    }
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
