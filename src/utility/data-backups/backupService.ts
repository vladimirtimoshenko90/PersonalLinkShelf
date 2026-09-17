import { DATA_SCHEMA_VERSION, database } from '@/database';

import type { DataBackupModel } from './data-backup-model';
import { FileUtility } from '@/utility/fileUtility';
import { mergeDataBackup } from './mergeDataBackup';
import { shelfStore } from '@/store';

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

    const data_incoming = JSON.parse(await file.text()) as DataBackupModel;
    // NOTE: potentially data schema migration could be needed here

    const data_existing = await database.get();
    const data_merged = mergeDataBackup(data_existing, data_incoming);
    await database.set(data_merged.catalogs, data_merged.resources);

    await shelfStore.reload();
  }
}

export const backupService = new BackupService();
