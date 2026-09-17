import type { ResourceCatalog, WebResource } from '@/database';

export interface DataBackupModel {
  schemaVersion: number;
  catalogs: ResourceCatalog[];
  resources: WebResource[];
}
