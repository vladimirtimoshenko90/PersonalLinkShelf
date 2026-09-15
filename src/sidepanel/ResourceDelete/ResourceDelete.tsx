import { observer } from 'mobx-react-lite';
import { shelfStore, uiStore } from '@/store';
import styles from './ResourceDelete.module.scss';

export default observer(function ResourceDelete() {
  const resource = uiStore.deletingResource;
  if (resource === null) {
    return null;
  }

  const title = resource.title?.trim() ?? '';
  const url = resource.url?.trim() ?? '';
  const label = title !== '' ? title : url;

  return (
    <div className={styles.root}>
      <p className={styles.question}>{`Delete ${label}?`}</p>
      <div className={styles.actions}>
        <button type="button" className={styles.cancel} onClick={() => uiStore.releaseCatalog()}>
          Cancel
        </button>
        <button
          type="button"
          className={styles.delete}
          onClick={() => {
            shelfStore.deleteResource(resource.id);
            uiStore.releaseCatalog();
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
});
