import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { observer } from 'mobx-react-lite';

import CatalogCard from '../CatalogCard/CatalogCard.tsx';
import type { CatalogKind, ResourceCatalog } from '@/database';
import { shelfStore } from '@/store';
import styles from './PanelBody.module.scss';

function catalogsOf(kind: CatalogKind): ResourceCatalog[] {
  return shelfStore.catalogs
    .filter((catalog) => catalog.kind === kind)
    .slice()
    .sort((left, right) => left.order - right.order);
}

function CatalogKindList({ kind, catalogs }: { kind: CatalogKind; catalogs: ResourceCatalog[] }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={({ active, over }) => {
        if (over === null || active.id === over.id) {
          return;
        }
        shelfStore.reorderCatalogs(kind, String(active.id), String(over.id));
      }}
    >
      <SortableContext
        items={catalogs.map((catalog) => catalog.id)}
        strategy={verticalListSortingStrategy}
      >
        {catalogs.map((catalog) => (
          <CatalogCard key={catalog.id} catalog={catalog} />
        ))}
      </SortableContext>
    </DndContext>
  );
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
          <CatalogKindList kind="project" catalogs={projects} />
        </section>
      ) : null}
      {topics.length > 0 ? (
        <section>
          <h2 className={styles.kicker}>Topics</h2>
          <CatalogKindList kind="topic" catalogs={topics} />
        </section>
      ) : null}
    </div>
  );
});
