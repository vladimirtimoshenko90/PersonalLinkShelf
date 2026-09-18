export class FileUtility {
  static pickJsonFile(): Promise<File | undefined> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json,.json';
      input.addEventListener('change', () => {
        resolve(input.files?.[0]);
      });
      input.click();
    });
  }
}
