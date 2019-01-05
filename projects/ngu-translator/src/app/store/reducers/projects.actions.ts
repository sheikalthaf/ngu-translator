import { Action } from '@ngrx/store';
import { TranslationProject } from '@shared/services';
import { Projectss } from './interface';
import { BackendServiceAPI } from '@shared/services/backend-service-api';

export const CREATE = '[Pizzas] Create';
export const UPDATE = '[Pizzas] Update';
export const DELETE = '[Pizzas] Delete';
export const LOAD = '[Pizzas] LOAD';
export const SELECT_PROJECT = '[Pizzas] SELECT PROJECT';

export class Create implements Action {
  readonly type = CREATE;
  constructor(public pizza: Projectss) {
    pizza.id = BackendServiceAPI.generateUUID();
  }
}

export class Load implements Action {
  readonly type = LOAD;
  constructor(public pizza: Projectss[]) {}
}

export class Update implements Action {
  readonly type = UPDATE;
  constructor(public id: string, public changes: Partial<Projectss>) {}
}

export class SelectProject implements Action {
  readonly type = SELECT_PROJECT;
  constructor(public project: Projectss) {}
}

export class Delete implements Action {
  readonly type = DELETE;
  constructor(public id: string) {}
}

export type projectActions = Create | Update | Delete | SelectProject | Load;
