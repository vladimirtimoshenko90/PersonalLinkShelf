import type { CatalogKind, ResourceCatalog } from '@/database';
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import CatalogCard from '../../CatalogCard/CatalogCard.tsx';
import { shelfStore } from '@/store';

export default function CatalogKindList({
  kind,
  catalogs,
}: {
  kind: CatalogKind;
  catalogs: ResourceCatalog[];
}) {
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
