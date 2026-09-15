import { makeAutoObservable } from 'mobx';

export class UiStore {
  editingCatalogId: string | null = null;
  deletingCatalogId: string | null = null;

  constructor() {
    makeAutoObservable(this);
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
    this.editingCatalogId = null;
    this.deletingCatalogId = null;
  }
}

export const uiStore = new UiStore();
