import { DATA_SCHEMA_VERSION, database } from '@/database';
import { shelfStore } from '@/store';
import { FileUtility } from '@/utility/fileUtility';

import type { DataBackupModel } from './data-backup-model';

const EXPORT_FILENAME = 'personal-link-shelf.json';

export class BackupService {
  async export(): Promise<void> {
    const { catalogs, resources } = await database.get();
    const payload: DataBackupModel = {
      schemaVersion: DATA_SCHEMA_VERSION,
      catalogs,
      resources,
    };
    const json = JSON.stringify(payload, null, 2);
    const file = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = EXPORT_FILENAME;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async import(): Promise<void> {
    const file = await FileUtility.pickJsonFile();
    if (!file) return;

    const data = JSON.parse(await file.text()) as DataBackupModel;
    // NOTE: potentially data schema migration could be needed here

    const current = await database.get();
    await database.set(
      [...current.catalogs, ...data.catalogs],
      [...current.resources, ...data.resources],
    );

    await shelfStore.reload();
  }
}

export const backupService = new BackupService();
