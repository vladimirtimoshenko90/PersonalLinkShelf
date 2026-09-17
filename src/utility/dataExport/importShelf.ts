import { FileUtility } from '@/utility/fileUtility';
import type { ShelfExportModel } from './shelf-export-model';
import { database } from '@/database';
import { shelfStore } from '@/store';

export async function importShelf(): Promise<void> {
  const file = await FileUtility.pickJsonFile();
  if (!file) return;

  const data = JSON.parse(await file.text()) as ShelfExportModel;
  // NOTE: potentially data schema migration could be needed here

  const current = await database.get();
  await database.set(
    [...current.catalogs, ...data.catalogs],
    [...current.resources, ...data.resources],
  );

  await shelfStore.reload();
}
