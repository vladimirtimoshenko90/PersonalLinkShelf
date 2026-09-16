import type { WebResource } from '@/database';
import { makeAutoObservable } from 'mobx';

export class UiStore {
  addingResourceCatalogId: string | null = null;
  editingResourceId: string | null = null;
  deletingResource: WebResource | null = null;
  editingCatalogId: string | null = null;
  deletingCatalogId: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  startAddingResource(catalogId: string): void {
    this.release();
    this.addingResourceCatalogId = catalogId;
  }

  startEditingResource(resourceId: string): void {
    this.release();
    this.editingResourceId = resourceId;
  }

  startDeletingResource(resource: WebResource): void {
    this.release();
    this.deletingResource = resource;
  }

  startEditingCatalog(catalogId: string): void {
    this.release();
    this.editingCatalogId = catalogId;
  }

  startDeletingCatalog(catalogId: string): void {
    this.release();
    this.deletingCatalogId = catalogId;
  }

  release(): void {
    this.addingResourceCatalogId = null;
    this.editingResourceId = null;
    this.deletingResource = null;
    this.editingCatalogId = null;
    this.deletingCatalogId = null;
  }
}

export const uiStore = new UiStore();
