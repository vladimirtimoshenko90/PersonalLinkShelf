import { makeAutoObservable } from 'mobx';

export class UiStore {
  constructor() {
    makeAutoObservable(this);
  }
}

export const uiStore = new UiStore();
