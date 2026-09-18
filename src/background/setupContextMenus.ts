import type { ResourceCatalog } from '@/database';
import { database } from '@/database';
import { readActiveTab } from '@/utility/tab.utility';

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

async function savePageToCatalog(catalogId: string): Promise<void> {
  const { done, title, url } = await readActiveTab();
  if (!done || url === null) {
    return;
  }

  const { catalogs, resources } = await database.get();
  const catalog = catalogs.find((item) => item.id === catalogId);
  if (!catalog) {
    return;
  }

  const ofCatalog = resources.filter((resource) => resource.catalogId === catalogId);
  const order = ofCatalog.reduce((min, resource) => Math.min(min, resource.order), 1) - 1;

  catalog.collapsed = false;
  resources.push({
    id: crypto.randomUUID(),
    catalogId,
    title,
    url,
    order,
    createdAt: Date.now(),
  });
  await database.set(catalogs, resources);
}

export function setupContextMenus(): void {
  void syncContextMenus();

  chrome.storage.onChanged.addListener((_changes, areaName) => {
    areaName === 'local' && syncContextMenus();
  });

  chrome.contextMenus.onClicked.addListener((info) => {
    const menuItemId = String(info.menuItemId);
    if (menuItemId === ROOT_ID) return;
    void savePageToCatalog(menuItemId);
  });
}
