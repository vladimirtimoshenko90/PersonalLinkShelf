import type { ResourceCatalog, WebResource } from '@/database';
import { DATA_SCHEMA_VERSION } from '@/database';

import type { ShelfExportModel } from './shelf-export-model';

const EXPORT_FILENAME = 'personal-link-shelf.json';

export function exportShelf(catalogs: ResourceCatalog[], resources: WebResource[]): void {
  const payload: ShelfExportModel = {
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
