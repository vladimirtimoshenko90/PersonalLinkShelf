import type { ResourceCatalog, WebResource } from '@/database';

export interface ShelfExportModel {
  schemaVersion: 1;
  catalogs: ResourceCatalog[];
  resources: WebResource[];
}
