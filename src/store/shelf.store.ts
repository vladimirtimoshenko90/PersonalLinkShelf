import type { CatalogKind, ResourceCatalog, WebResource } from '@/database';
import { makeAutoObservable, reaction, runInAction } from 'mobx';

import { database } from '@/database';

export class ShelfStore {
  catalogs: ResourceCatalog[] = [];
  resources: WebResource[] = [];

  private started = false;
  private persistEnabled = false;

  constructor() {
    makeAutoObservable(this, {
      start: false,
    });

    reaction(
      () => JSON.stringify({ catalogs: this.catalogs, resources: this.resources }),
      () => {
        if (!this.persistEnabled) {
          return;
        }
        void this.persist();
      },
    );
  }

  async start(): Promise<void> {
    if (this.started) {
      return;
    }
    runInAction(() => {
      this.started = true;
    });

    const { catalogs, resources } = await database.get();
    runInAction(() => {
      this.catalogs = catalogs;
      this.resources = resources;
    });
    runInAction(() => {
      this.persistEnabled = true;
    });
  }

  createCatalog(kind: CatalogKind, name: string): void {
    const trimmed = name.trim();
    if (trimmed === '') {
      throw new Error('Catalog name is required');
    }

    const ofKind = this.catalogs.filter((catalog) => catalog.kind === kind);
    const order = ofKind.reduce((min, catalog) => Math.min(min, catalog.order), 1) - 1;
    this.catalogs.push({
      id: crypto.randomUUID(),
      name: trimmed,
      kind,
      order,
      collapsed: true,
      createdAt: Date.now(),
    });
  }

  renameCatalog(id: string, name: string): void {
    const trimmed = name.trim();
    if (trimmed === '') {
      throw new Error('Catalog name is required');
    }

    const catalog = this.catalogs.find((item) => item.id === id);
    if (catalog === undefined) {
      throw new Error('Catalog not found');
    }

    catalog.name = trimmed;
  }

  deleteCatalog(id: string): void {
    this.catalogs = this.catalogs.filter((catalog) => catalog.id !== id);
    this.resources = this.resources.filter((resource) => resource.catalogId !== id);
  }

  toggleCatalogCollapsed(id: string): void {
    const catalog = this.catalogs.find((item) => item.id === id);
    if (catalog === undefined) {
      throw new Error('Catalog not found');
    }

    catalog.collapsed = !catalog.collapsed;
  }

  createResource(catalogId: string, title: string, url: string): void {
    const catalog = this.catalogs.find((item) => item.id === catalogId);
    if (catalog === undefined) {
      throw new Error('Catalog not found');
    }

    const trimmedTitle = title.trim();
    const storedTitle = trimmedTitle === '' ? null : trimmedTitle;
    const trimmedUrl = url.trim();
    const storedUrl = trimmedUrl === '' ? null : trimmedUrl;
    if (storedTitle === null && storedUrl === null) {
      throw new Error('Title or URL required');
    }

    const ofCatalog = this.resources.filter((resource) => resource.catalogId === catalogId);
    const order = ofCatalog.reduce((min, resource) => Math.min(min, resource.order), 1) - 1;
    this.resources.push({
      id: crypto.randomUUID(),
      catalogId,
      title: storedTitle,
      url: storedUrl,
      order,
      createdAt: Date.now(),
    });

    catalog.collapsed = false;
  }

  updateResource(id: string, title: string, url: string): void {
    const resource = this.resources.find((item) => item.id === id);
    if (resource === undefined) {
      throw new Error('Resource not found');
    }

    const trimmedTitle = title.trim();
    const storedTitle = trimmedTitle === '' ? null : trimmedTitle;
    const trimmedUrl = url.trim();
    const storedUrl = trimmedUrl === '' ? null : trimmedUrl;
    if (storedTitle === null && storedUrl === null) {
      throw new Error('Title or URL required');
    }

    resource.title = storedTitle;
    resource.url = storedUrl;
  }

  deleteResource(id: string): void {
    this.resources = this.resources.filter((resource) => resource.id !== id);
  }

  reorderCatalogs(kind: CatalogKind, activeId: string, overId: string): void {
    const sorted = this.catalogs
      .filter((catalog) => catalog.kind === kind)
      .slice()
      .sort((left, right) => left.order - right.order);
    const from = sorted.findIndex((catalog) => catalog.id === activeId);
    const to = sorted.findIndex((catalog) => catalog.id === overId);
    if (from < 0 || to < 0 || from === to) {
      return;
    }

    const next = sorted.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    next.forEach((catalog, index) => {
      catalog.order = index;
    });
  }

  reorderResources(catalogId: string, activeId: string, overId: string): void {
    const sorted = this.resources
      .filter((resource) => resource.catalogId === catalogId)
      .slice()
      .sort((left, right) => left.order - right.order);
    const from = sorted.findIndex((resource) => resource.id === activeId);
    const to = sorted.findIndex((resource) => resource.id === overId);
    if (from < 0 || to < 0 || from === to) {
      return;
    }

    const next = sorted.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    next.forEach((resource, index) => {
      resource.order = index;
    });
  }

  private async persist(): Promise<void> {
    await database.set(this.catalogs, this.resources);
  }
}

export const shelfStore = new ShelfStore();
