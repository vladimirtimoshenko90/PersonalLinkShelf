import type { ResourceCatalog, ShelfBlob, WebResource } from '@/types';
import { STORAGE_KEY, emptyShelfBlob, getShelfBlob, setShelfBlob } from '@/storage';
import { makeAutoObservable, reaction, runInAction } from 'mobx';

function blobSnapshot(catalogs: ResourceCatalog[], resources: WebResource[]): string {
  return JSON.stringify({ catalogs, resources });
}

export class ShelfStore {
  catalogs: ResourceCatalog[] = [];
  resources: WebResource[] = [];
  saveFailed = false;

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

  private applyBlob(blob: ShelfBlob): void {
    this.catalogs = blob.catalogs;
    this.resources = blob.resources;
  }

  private async persist(): Promise<void> {
    const blob: ShelfBlob = {
      schemaVersion: 1,
      catalogs: this.catalogs,
      resources: this.resources,
    };
    try {
      await setShelfBlob(blob);
      runInAction(() => {
        this.saveFailed = false;
      });
    } catch {
      runInAction(() => {
        this.saveFailed = true;
      });
    }
  }
}

export const shelfStore = new ShelfStore();
