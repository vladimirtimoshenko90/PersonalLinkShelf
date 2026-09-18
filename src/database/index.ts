import type { ResourceCatalog, ShelfBlob, WebResource } from './entities';

export type { CatalogKind, ResourceCatalog, ShelfBlob, WebResource } from './entities';

const STORAGE_KEY = 'CATALOGS_AND_RESOURCES';
export const DATA_SCHEMA_VERSION = 1 as const;

export class Database {
  async get(): Promise<{ catalogs: ResourceCatalog[]; resources: WebResource[] }> {
    const stored = await chrome.storage.local.get<{
      [STORAGE_KEY]?: ShelfBlob;
    }>(STORAGE_KEY);

    const blob = stored[STORAGE_KEY] ?? {
      schemaVersion: DATA_SCHEMA_VERSION,
      catalogs: [],
      resources: [],
    };

    return {
      catalogs: blob.catalogs,
      resources: blob.resources,
    };
  }

  async set(catalogs: ResourceCatalog[], resources: WebResource[]): Promise<void> {
    await chrome.storage.local.set({
      [STORAGE_KEY]: {
        schemaVersion: DATA_SCHEMA_VERSION,
        catalogs: catalogs.map((catalog) => ({ ...catalog })),
        resources: resources.map((resource) => ({ ...resource })),
      },
    });
  }

  onChange(listener: () => void): () => void {
    const handler = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string,
    ) => {
      if (areaName !== 'local' || !changes[STORAGE_KEY]) {
        return;
      }
      listener();
    };

    chrome.storage.onChanged.addListener(handler);
    return () => chrome.storage.onChanged.removeListener(handler);
  }
}

export const database = new Database();
