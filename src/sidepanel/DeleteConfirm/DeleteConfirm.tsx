import styles from './DeleteConfirm.module.scss';

export default function DeleteConfirm({
  name,
  count,
  onCancel,
  onConfirm,
}: {
  name: string;
  count: number;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const resources = count === 1 ? '1 resource' : `${count} resources`;
  const question = count === 0 ? `Delete ${name}?` : `Delete ${name} and ${resources}?`;

  return (
    <div className={styles.root}>
      <p className={styles.question}>{question}</p>
      <div className={styles.actions}>
        <button type="button" className={styles.cancel} onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className={styles.delete} onClick={onConfirm}>
          Delete
        </button>
      </div>
    </div>
  );
}
