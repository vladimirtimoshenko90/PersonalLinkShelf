import { Check, X } from 'lucide-react';
import { useRef } from 'react';

import { useClickOutside } from '@/hooks/useClickOutside';
import styles from './DeleteConfirm.module.scss';

export default function DeleteConfirm({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  useClickOutside(rootRef, onCancel);

  return (
    <div ref={rootRef} className={styles.root}>
      <span className={styles.label}>Delete?</span>
      <button type="button" className={styles.cancel} onClick={onCancel}>
        <X size={20} />
      </button>
      <button type="button" className={styles.confirm} onClick={onConfirm}>
        <Check size={20} />
      </button>
    </div>
  );
}
