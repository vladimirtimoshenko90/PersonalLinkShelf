import type { CatalogKind, ResourceCatalog, ShelfBlob, WebResource } from '@/types';
import { STORAGE_KEY, emptyShelfBlob, getShelfBlob, setShelfBlob } from '@/storage';
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

    const blob = await getShelfBlob();
    runInAction(() => {
      this.applyBlob(blob);
    });
    runInAction(() => {
      this.persistEnabled = true;
    });

    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== 'local') {
        return;
      }
      const change = changes[STORAGE_KEY];
      if (change === undefined) {
        return;
      }
      runInAction(() => {
        this.persistEnabled = false;
        this.applyBlob((change.newValue as ShelfBlob | undefined) ?? emptyShelfBlob());
      });
      runInAction(() => {
        this.persistEnabled = true;
      });
    });
  }

  createCatalog(kind: CatalogKind, name: string): void {
    const trimmed = name.trim();
    if (trimmed === '') {
      throw new Error('Catalog name is required');
    }

    const ofKind = this.catalogs.filter((catalog) => catalog.kind === kind);
    const order = ofKind.reduce((max, catalog) => Math.max(max, catalog.order), -1) + 1;
    this.catalogs.push({
      id: crypto.randomUUID(),
      name: trimmed,
      kind,
      order,
      collapsed: false,
      createdAt: Date.now(),
    });
  }

  private applyBlob(blob: ShelfBlob): void {
    this.catalogs = blob.catalogs;
    this.resources = blob.resources;
  }

  private async persist(): Promise<void> {
    await setShelfBlob({
      schemaVersion: 1,
      catalogs: this.catalogs,
      resources: this.resources,
    });
  }
}

export const shelfStore = new ShelfStore();
