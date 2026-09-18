import type { ResourceCatalog } from '@/database';
import { database } from '@/database';

const ROOT_ID = 'pls-add-root';

function catalogLabel(catalog: ResourceCatalog): string {
  const kind = catalog.kind === 'project' ? 'Project' : 'Topic';
  return `${kind}: ${catalog.name}`;
}

function sortedCatalogs(catalogs: ResourceCatalog[]): ResourceCatalog[] {
  return [...catalogs].sort((left, right) => {
    if (left.kind !== right.kind) {
      return left.kind === 'project' ? -1 : 1;
    }
    return left.order - right.order;
  });
}

async function syncContextMenus(): Promise<void> {
  await chrome.contextMenus.removeAll();

  const { catalogs } = await database.get();
  if (catalogs.length === 0) {
    return;
  }

  chrome.contextMenus.create({
    id: ROOT_ID,
    title: 'Add to Personal Link Shelf',
    contexts: ['page'],
  });

  for (const catalog of sortedCatalogs(catalogs)) {
    chrome.contextMenus.create({
      id: catalog.id,
      parentId: ROOT_ID,
      title: catalogLabel(catalog),
      contexts: ['page'],
    });
  }
}

export function setupContextMenus(): void {
  void syncContextMenus();

  chrome.storage.onChanged.addListener((_changes, areaName) => {
    areaName === 'local' && syncContextMenus();
  });
}
