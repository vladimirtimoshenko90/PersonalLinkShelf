import { database } from '@/database';
import { readActiveTab } from '@/utility/tab.utility';

const ROOT_ID = 'pls-add-root';
const KIND_SEPARATOR_ID = 'pls-kind-separator';

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

  const projects = catalogs
    .filter((catalog) => catalog.kind === 'project')
    .sort((left, right) => left.order - right.order);
  const topics = catalogs
    .filter((catalog) => catalog.kind === 'topic')
    .sort((left, right) => left.order - right.order);

  for (const catalog of projects) {
    chrome.contextMenus.create({
      id: catalog.id,
      parentId: ROOT_ID,
      title: catalog.name,
      contexts: ['page'],
    });
  }

  if (projects.length > 0 && topics.length > 0) {
    chrome.contextMenus.create({
      id: KIND_SEPARATOR_ID,
      parentId: ROOT_ID,
      type: 'separator',
      contexts: ['page'],
    });
  }

  for (const catalog of topics) {
    chrome.contextMenus.create({
      id: catalog.id,
      parentId: ROOT_ID,
      title: catalog.name,
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
    if (menuItemId === ROOT_ID || menuItemId === KIND_SEPARATOR_ID) return;
    void savePageToCatalog(menuItemId);
  });
}
