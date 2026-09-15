import type { ResourceCatalog } from '@/database';
import { observer } from 'mobx-react-lite';
import { shelfStore } from '@/store';
import styles from './DeleteConfirm.module.scss';

export default observer(function DeleteConfirm({
  catalog,
  onCancel,
  onConfirm,
}: {
  catalog: ResourceCatalog;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const count = shelfStore.resources.filter((resource) => resource.catalogId === catalog.id).length;
  const resources = count === 1 ? '1 resource' : `${count} resources`;
  const question =
    count === 0 ? `Delete ${catalog.name}?` : `Delete ${catalog.name} and ${resources}?`;

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
});
