import type { WebResource } from '@/database';
import { observer } from 'mobx-react-lite';
import { shelfStore, uiStore } from '@/store';
import styles from './ResourceDelete.module.scss';

export default observer(function ResourceDelete({ resource }: { resource: WebResource }) {
  const title = resource.title?.trim() ?? '';
  const url = resource.url?.trim() ?? '';
  const label = title !== '' ? title : url;

  return (
    <div className={styles.resourceDelete}>
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
