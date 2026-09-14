import { observer } from 'mobx-react-lite';

import { shelfStore } from '@/store';
import type { CatalogKind, ResourceCatalog } from '@/database';
import CatalogCard from '../CatalogCard/CatalogCard.tsx';
import styles from './PanelBody.module.scss';

function catalogsOf(kind: CatalogKind): ResourceCatalog[] {
  return shelfStore.catalogs
    .filter((catalog) => catalog.kind === kind)
    .slice()
    .sort((left, right) => left.order - right.order);
}

export default observer(function PanelBody() {
  const projects = catalogsOf('project');
  const topics = catalogsOf('topic');

  if (shelfStore.catalogs.length === 0) {
    return (
      <div className={styles.root}>
        <p className={styles.empty}>Create a topic or a project to start.</p>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      {projects.length > 0 ? (
        <section>
          <h2 className={styles.kicker}>Projects</h2>
          {projects.map((catalog) => (
            <CatalogCard key={catalog.id} catalog={catalog} />
          ))}
        </section>
      ) : null}
      {topics.length > 0 ? (
        <section>
          <h2 className={styles.kicker}>Topics</h2>
          {topics.map((catalog) => (
            <CatalogCard key={catalog.id} catalog={catalog} />
          ))}
        </section>
      ) : null}
    </div>
  );
});
