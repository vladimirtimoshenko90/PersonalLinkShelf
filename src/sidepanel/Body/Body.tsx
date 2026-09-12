import { observer } from 'mobx-react-lite';

import { shelfStore } from '@/store';
import styles from './Body.module.scss';

export default observer(function Body() {
  const projects = shelfStore.catalogs.filter((catalog) => catalog.kind === 'project');
  const topics = shelfStore.catalogs.filter((catalog) => catalog.kind === 'topic');

  if (shelfStore.catalogs.length === 0) {
    return (
      <div className={styles.body}>
        <p className={styles.empty}>Create a topic or a project to start.</p>
      </div>
    );
  }

  return (
    <div className={styles.body}>
      {projects.length > 0 ? (
        <section>
          <h2 className={styles.kicker}>Projects</h2>
        </section>
      ) : null}
      {topics.length > 0 ? (
        <section>
          <h2 className={styles.kicker}>Topics</h2>
        </section>
      ) : null}
    </div>
  );
});
