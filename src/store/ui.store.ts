import { makeAutoObservable } from 'mobx';

export class UiStore {
  addingResourceCatalogId: string | null = null;
  editingResourceId: string | null = null;
  editingCatalogId: string | null = null;
  deletingCatalogId: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  startAddingResource(catalogId: string): void {
    this.releaseCatalog();
    this.addingResourceCatalogId = catalogId;
  }

  startEditingResource(resourceId: string): void {
    this.releaseCatalog();
    this.editingResourceId = resourceId;
  }

  startEditingCatalog(catalogId: string): void {
    this.releaseCatalog();
    this.editingCatalogId = catalogId;
  }

  startDeletingCatalog(catalogId: string): void {
    this.releaseCatalog();
    this.deletingCatalogId = catalogId;
  }

  releaseCatalog(): void {
    this.addingResourceCatalogId = null;
    this.editingResourceId = null;
    this.editingCatalogId = null;
    this.deletingCatalogId = null;
  }
}

export const uiStore = new UiStore();
