import styles from './DeleteConfirm.module.scss';

export default function DeleteConfirm({
  question,
  onCancel,
  onDelete,
}: {
  question: string;
  onCancel: () => void;
  onDelete: () => void;
}) {
  return (
    <div className={styles.deleteConfirm}>
      <p className={styles.question}>{question}</p>
      <div className={styles.actions}>
        <button type="button" className={styles.cancel} onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className={styles.delete} onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
