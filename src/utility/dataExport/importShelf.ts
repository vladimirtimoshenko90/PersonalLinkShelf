import { database } from '@/database';
import { shelfStore } from '@/store';

import type { ShelfExportModel } from './shelf-export-model';

export async function importShelf(data: ShelfExportModel): Promise<void> {
  const current = await database.get();
  await database.set(
    [...current.catalogs, ...data.catalogs],
    [...current.resources, ...data.resources],
  );
  await shelfStore.reload();
}
