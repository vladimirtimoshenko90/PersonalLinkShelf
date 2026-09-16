import { shelfStore } from '@/store';

import type { ResourceCatalog } from '@/database';
import ResourceRow from '../../ResourceRow/ResourceRow.tsx';
import { observer } from 'mobx-react-lite';
import styles from './CatalogResources.module.scss';

export default observer(function CatalogResources({ catalog }: { catalog: ResourceCatalog }) {
  const resources = shelfStore.resources
    .filter((resource) => resource.catalogId === catalog.id)
    .slice()
    .sort((left, right) => left.order - right.order);

  if (resources.length === 0) {
    return null;
  }

  return (
    <div className={styles.catalogResources}>
      {resources.map((resource) => (
        <ResourceRow key={resource.id} resource={resource} />
      ))}
    </div>
  );
});
