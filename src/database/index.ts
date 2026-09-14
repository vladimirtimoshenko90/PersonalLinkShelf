import type { ShelfBlob } from '@/types';

const KEY = 'pls';
const SCHEME = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;

export class Database {
  emptyBlob(): ShelfBlob {
    return {
      schemaVersion: 1,
      catalogs: [],
      resources: [],
    };
  }

  async get(): Promise<ShelfBlob> {
    const result = await chrome.storage.local.get(KEY);
    const blob = result[KEY] as ShelfBlob | undefined;
    if (blob === undefined) {
      return this.emptyBlob();
    }
    return blob;
  }

  async set(blob: ShelfBlob): Promise<void> {
    const next: ShelfBlob = {
      ...blob,
      resources: blob.resources.map((resource) => ({
        ...resource,
        url: this.normalizeUrl(resource.url),
      })),
    };
    await chrome.storage.local.set({ [KEY]: next });
  }

  async deleteCatalog(catalogId: string): Promise<ShelfBlob> {
    const blob = await this.get();
    const next: ShelfBlob = {
      schemaVersion: 1,
      catalogs: blob.catalogs.filter((catalog) => catalog.id !== catalogId),
      resources: blob.resources.filter((resource) => resource.catalogId !== catalogId),
    };
    await this.set(next);
    return next;
  }

  private normalizeUrl(url: string | null): string | null {
    if (url === null) {
      return null;
    }
    const trimmed = url.trim();
    if (trimmed === '' || SCHEME.test(trimmed)) {
      return trimmed;
    }
    return `https://${trimmed}`;
  }
}

export const database = new Database();
