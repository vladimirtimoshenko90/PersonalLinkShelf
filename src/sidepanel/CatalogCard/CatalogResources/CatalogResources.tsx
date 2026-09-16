import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import type { ResourceCatalog } from '@/database';
import ResourceRow from '../../ResourceRow/ResourceRow.tsx';
import { observer } from 'mobx-react-lite';
import { shelfStore } from '@/store';
import styles from './CatalogResources.module.scss';

export default observer(function CatalogResources({ catalog }: { catalog: ResourceCatalog }) {
  const resources = shelfStore.resources
    .filter((resource) => resource.catalogId === catalog.id)
    .slice()
    .sort((left, right) => left.order - right.order);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  if (resources.length === 0) {
    return null;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={({ active, over }) => {
        if (over === null || active.id === over.id) {
          return;
        }
        shelfStore.reorderResources(catalog.id, String(active.id), String(over.id));
      }}
    >
      <SortableContext
        items={resources.map((resource) => resource.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className={styles.catalogResources}>
          {resources.map((resource) => (
            <ResourceRow key={resource.id} resource={resource} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
});
