import idb, { DB } from 'idb';
import { from } from 'rxjs';
import { IdbService } from './idb.service';

export class RxiDB extends IdbService {
  dbPromise: Promise<DB>;

  constructor(name: string, public storeName: string) {
    super();
    this.dbPromise = idb.open(name, 1, upgradeDB => {
      upgradeDB.createObjectStore(storeName);
    });
  }

  get(key: any) {
    return from(this._get(key));
  }

  private async _get(key: any) {
    const db = await this.dbPromise;
    return db
      .transaction(this.storeName)
      .objectStore(this.storeName)
      .get(key);
  }

  set(
    key: string | number | IDBKeyRange | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey,
    val: any
  ) {
    return from(this._set(key, val));
  }

  private async _set(
    key: string | number | IDBKeyRange | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey,
    val: any
  ) {
    const db = await this.dbPromise;
    const tx = db.transaction(this.storeName, 'readwrite');
    tx.objectStore(this.storeName).put(val, key);
    return tx.complete;
  }

  delete(key: string | number | IDBKeyRange | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey) {
    return from(this._delete(key));
  }

  private async _delete(
    key: string | number | IDBKeyRange | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey
  ) {
    const db = await this.dbPromise;
    const tx = db.transaction(this.storeName, 'readwrite');
    tx.objectStore(this.storeName).delete(key);
    return tx.complete;
  }

  clear() {
    return from(this._clear());
  }

  private async _clear() {
    const db = await this.dbPromise;
    const tx = db.transaction(this.storeName, 'readwrite');
    tx.objectStore(this.storeName).clear();
    return tx.complete;
  }

  keys() {
    return from(this._keys());
  }

  private async _keys() {
    const db = await this.dbPromise;
    const tx = db.transaction(this.storeName);
    const keys = [];
    const store = tx.objectStore(this.storeName);

    // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
    // openKeyCursor isn't supported by Safari, so we fall back
    (store.iterateKeyCursor || store.iterateCursor).call(
      store,
      (cursor: { key: any; continue: () => void }) => {
        if (!cursor) return;
        keys.push(cursor.key);
        cursor.continue();
      }
    );
    await tx.complete;
    return keys as string[];
    // return tx.complete.then(() => keys);
  }
}
