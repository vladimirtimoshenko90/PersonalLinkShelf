import type { ShelfBlob } from './entities';

export type { CatalogKind, ResourceCatalog, ShelfBlob, WebResource } from './entities';

const STORAGE_KEY = 'CATALOGS_AND_RESOURCES';

export class Database {
  async get(): Promise<ShelfBlob> {
    const stored = await chrome.storage.local.get<{
      [STORAGE_KEY]?: ShelfBlob;
    }>(STORAGE_KEY);

    return (
      stored[STORAGE_KEY] ?? {
        schemaVersion: 1,
        catalogs: [],
        resources: [],
      }
    );
  }

  async set(blob: ShelfBlob): Promise<void> {
    await chrome.storage.local.set({
      [STORAGE_KEY]: {
        schemaVersion: 1,
        catalogs: blob.catalogs.map((catalog) => ({ ...catalog })),
        resources: blob.resources.map((resource) => ({ ...resource })),
      },
    });
  }
}

export const database = new Database();
