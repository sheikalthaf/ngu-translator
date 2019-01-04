import { Injectable } from '@angular/core';

@Injectable()
export class IndexedDBService {
  constructor() {}

  initialize() {
    return new Promise((resolve, reject) => {
      // This first deletes any database of the same name
      const dRequest = indexedDB.deleteDatabase('myDatabase');
      dRequest.onerror = function() {
        reject(dRequest.error);
      };
      // Then creates a new one
      const request = indexedDB.open('myDatabase');
      request.onupgradeneeded = function() {
        request.result.createObjectStore('myStore');
        resolve();
      };
      request.onerror = function() {
        reject(request.error);
      };
    });
  }

  get(key: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange) {
    return new Promise((resolve, reject) => {
      const oRequest = indexedDB.open('myDatabase');
      oRequest.onsuccess = function() {
        const db = oRequest.result;
        const tx = db.transaction('myStore', 'readonly');
        const st = tx.objectStore('myStore');
        const gRequest = st.get(key);
        gRequest.onsuccess = function() {
          resolve(gRequest.result);
        };
        gRequest.onerror = function() {
          reject(gRequest.error);
        };
      };
      oRequest.onerror = function() {
        reject(oRequest.error);
      };
    });
  }

  set(
    key: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange,
    value: any
  ) {
    return new Promise((resolve, reject) => {
      const oRequest = indexedDB.open('myDatabase');
      oRequest.onsuccess = function() {
        const db = oRequest.result;
        const tx = db.transaction('myStore', 'readwrite');
        const st = tx.objectStore('myStore');
        const sRequest = st.put(value, key);
        sRequest.onsuccess = function() {
          resolve();
        };
        sRequest.onerror = function() {
          reject(sRequest.error);
        };
      };
      oRequest.onerror = function() {
        reject(oRequest.error);
      };
    });
  }

  remove(key: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange) {
    return new Promise((resolve, reject) => {
      const oRequest = indexedDB.open('myDatabase');
      oRequest.onsuccess = function() {
        const db = oRequest.result;
        const tx = db.transaction('myStore', 'readwrite');
        const st = tx.objectStore('myStore');
        const rRequest = st.delete(key);
        rRequest.onsuccess = function() {
          resolve();
        };
        rRequest.onerror = function() {
          reject(rRequest.error);
        };
      };
      oRequest.onerror = function() {
        reject(oRequest.error);
      };
    });
  }
}

// The rest is just Vue and UI things vvv

// new Vue({
//   el: '#app',
//   data: () => ({
//     initialized: false,
//     key1: '',
//     val1: '',
//     error1: null,
//     key2: '',
//     error2: null,
//     databaseOutput: null
//   }),
//   methods: {
//     initialize () {
//       this.initialized = true
//       SimpleIDB.initialize()
//     },
//     insertObject () {
//       this.error1 = null
//       try {
//         let jsonVal = (this.val1.includes('{')) ? JSON.parse(this.val1) : this.val1
//         SimpleIDB.set(this.key1, jsonVal)
//       } catch(e) { this.error1 = e.message }
//     },
//     removeObject () {
//       this.error2 = null
//       try {
//         SimpleIDB.remove(this.key2)
//       } catch(e) { this.error2 = e.message }
//     }
//   }
// })
