import { Action } from '@ngrx/store';
import { TranslationProject, TranslationUnit } from '../shared/services';
import { Translationss } from './translation.selectors';

export enum ActionTypes {
  LoadProject = '[Counter Component] Load Project',
  AddProject = '[Counter Component] Add Project',
  DeleteProject = '[Counter Component] Delete Project',
  SelectTransUnit = '[Counter Component] Select TransUnit',
  SetCurrentProject = '[Counter Component] Set Current Project',
  Reset = '[Counter Component] Reset'
}

export class LoadProject implements Action {
  readonly type = ActionTypes.LoadProject;
  constructor(public payload: Translationss) {}
}

export class AddProject implements Action {
  readonly type = ActionTypes.AddProject;
  constructor(public payload: TranslationProject) {}
}

export class DeleteProject implements Action {
  readonly type = ActionTypes.DeleteProject;
  constructor(public payload: TranslationProject) {}
}

export class SetCurrentProject implements Action {
  readonly type = ActionTypes.SetCurrentProject;
  constructor(public payload: TranslationProject) {}
}

export class SelectTransUnit implements Action {
  readonly type = ActionTypes.SelectTransUnit;
  constructor(public payload: TranslationUnit) {}
}

export class Reset implements Action {
  readonly type = ActionTypes.Reset;
}

export type ActionsUnion =
  | LoadProject
  | AddProject
  | SelectTransUnit
  | SetCurrentProject
  | DeleteProject
  | Reset;
