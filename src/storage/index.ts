import type { ShelfBlob } from '@/types'

export const STORAGE_KEY = 'pls'

export function emptyShelfBlob(): ShelfBlob {
  return {
    schemaVersion: 1,
    catalogs: [],
    resources: [],
  }
}

export async function getShelfBlob(): Promise<ShelfBlob> {
  const result = await chrome.storage.local.get(STORAGE_KEY)
  const blob = result[STORAGE_KEY] as ShelfBlob | undefined
  if (blob === undefined) {
    return emptyShelfBlob()
  }
  return blob
}

export async function setShelfBlob(blob: ShelfBlob): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEY]: blob })
}

export async function deleteCatalog(catalogId: string): Promise<ShelfBlob> {
  const blob = await getShelfBlob()
  const next: ShelfBlob = {
    schemaVersion: 1,
    catalogs: blob.catalogs.filter((catalog) => catalog.id !== catalogId),
    resources: blob.resources.filter((resource) => resource.catalogId !== catalogId),
  }
  await setShelfBlob(next)
  return next
}
