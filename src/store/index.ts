import type { CatalogKind, ResourceCatalog, ShelfBlob, WebResource } from '@/database';
import { database } from '@/database';
import { makeAutoObservable, reaction, runInAction } from 'mobx';

function blobSnapshot(catalogs: ResourceCatalog[], resources: WebResource[]): string {
  return JSON.stringify({ catalogs, resources });
}

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
      () => blobSnapshot(this.catalogs, this.resources),
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

    const blob = await database.get();
    runInAction(() => {
      this.applyBlob(blob);
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
      collapsed: false,
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

  private applyBlob(blob: ShelfBlob): void {
    this.catalogs = blob.catalogs;
    this.resources = blob.resources;
  }

  private async persist(): Promise<void> {
    await database.set({
      schemaVersion: 1,
      catalogs: this.catalogs,
      resources: this.resources,
    });
  }
}

export const shelfStore = new ShelfStore();
