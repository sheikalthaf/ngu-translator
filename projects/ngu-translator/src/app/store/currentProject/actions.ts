import { Action } from '@ngrx/store';
import { Projectss } from '@ngrxstore/reducers/interface';

export enum ActionTypes {
  SetCurrentProject = '[Counter Component] SetCurrentProject',
  LoadCurrentProject = '[Counter Component] Load Current Project'
}

export class SetCurrentProject implements Action {
  readonly type = ActionTypes.SetCurrentProject;
  constructor(public payload: Projectss) {}
}

export class LoadCurrentProject implements Action {
  readonly type = ActionTypes.LoadCurrentProject;
  constructor(public payload: string) {}
}

export type Union = SetCurrentProject | LoadCurrentProject;
