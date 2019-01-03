import { Action } from '@ngrx/store';
import { TranslationProject } from '../shared/services';

export enum ActionTypes {
  Increment = '[Counter Component] Increment',
  Add = '[Counter Component] Add',
  Decrement = '[Counter Component] Decrement',
  Reset = '[Counter Component] Reset'
}

export class Increment implements Action {
  readonly type = ActionTypes.Increment;
}

export class Add implements Action {
  readonly type = ActionTypes.Add;
  constructor(public payload: { projects: TranslationProject[]; currentId: string }) {}
}

export class Decrement implements Action {
  readonly type = ActionTypes.Decrement;
}

export class Reset implements Action {
  readonly type = ActionTypes.Reset;
}

export type ActionsUnion = Increment | Add | Decrement | Reset;
