import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

@Injectable()
export class IdbService {
  constructor() {}

  get<T = any>(key: any): Observable<T> {
    return of(null);
  }

  set(
    key: string | number | IDBKeyRange | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey,
    val: any
  ) {
    return of(null);
  }

  delete(key: string | number | IDBKeyRange | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey) {
    return of(this.test());
  }

  clear() {
    return of(this.test());
  }

  keys() {
    return of([] as string[]);
  }

  private test() {}
}
