import type { ShelfExportModel } from './shelf-export-model';
import { database } from '@/database';
import { shelfStore } from '@/store';

export async function importShelf(): Promise<void> {
  const file = await pickJsonFile();
  if (!file) return;
  const data = JSON.parse(await file.text()) as ShelfExportModel;

  const current = await database.get();
  await database.set(
    [...current.catalogs, ...data.catalogs],
    [...current.resources, ...data.resources],
  );

  await shelfStore.reload();
}

function pickJsonFile(): Promise<File | undefined> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.addEventListener('change', () => {
      resolve(input.files?.[0]);
    });
    input.click();
  });
}
