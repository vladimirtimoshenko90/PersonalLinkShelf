import type { ResourceCatalog, WebResource } from '@/database';

type ShelfData = { catalogs: ResourceCatalog[]; resources: WebResource[] };

export function mergeDataBackup(current: ShelfData, incoming: ShelfData): ShelfData {
  const catalogs = current.catalogs.map((catalog) => ({ ...catalog }));
  const catalogIdMap = new Map<string, string>();

  for (const imported of incoming.catalogs) {
    const match = findCatalog(catalogs, imported);
    if (match !== undefined) {
      catalogIdMap.set(imported.id, match.id);
      match.name = imported.name;
      match.kind = imported.kind;
      match.order = imported.order;
    } else {
      catalogs.push({ ...imported });
      catalogIdMap.set(imported.id, imported.id);
    }
  }

  const resources = current.resources.map((resource) => ({ ...resource }));

  for (const imported of incoming.resources) {
    const catalogId = catalogIdMap.get(imported.catalogId) ?? imported.catalogId;
    const candidate = { ...imported, catalogId };
    const match = findResource(resources, candidate);
    if (match !== undefined) {
      match.catalogId = catalogId;
      match.title = imported.title;
      match.url = imported.url;
      match.order = imported.order;
    } else {
      resources.push(candidate);
    }
  }

  return { catalogs, resources };
}

function findCatalog(catalogs: ResourceCatalog[], imported: ResourceCatalog) {
  return (
    catalogs.find((catalog) => catalog.id === imported.id) ??
    catalogs.find((catalog) => catalog.name === imported.name && catalog.kind === imported.kind)
  );
}

function findResource(resources: WebResource[], imported: WebResource) {
  return (
    resources.find((resource) => resource.id === imported.id) ??
    resources.find(
      (resource) =>
        resource.catalogId === imported.catalogId &&
        resource.title === imported.title &&
        resource.url === imported.url,
    )
  );
}
