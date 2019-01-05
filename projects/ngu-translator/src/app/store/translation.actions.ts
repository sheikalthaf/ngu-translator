import { Action } from '@ngrx/store';
import { TranslationProject, TranslationUnit, NormalizedMessage } from '@shared/services';
import { I18nTranslation } from './reducers';
// import { AppState } from './translation.selectors';
// import { Translationss } from './translation.selectors';

export enum ActionTypes {
  LoadProject = '[Counter Component] Load Project',
  CommitTransUnit = '[Counter Component] commit Trans Unit',
  AddProject = '[Counter Component] Add Project',
  DeleteProject = '[Counter Component] Delete Project',
  SelectTransUnit = '[Counter Component] Select Trans Unit',
  SaveTransUnit = '[Counter Component] Save Trans Unit',
  SetCurrentProject = '[Counter Component] Set Current Project',
  Reset = '[Counter Component] Reset'
}

export class LoadProject implements Action {
  readonly type = ActionTypes.LoadProject;
  constructor(public payload: I18nTranslation) {}
}

export class CommitTransUnit implements Action {
  readonly type = ActionTypes.CommitTransUnit;
  constructor(public payload: { message: NormalizedMessage; isMarkedAsReviewed: boolean }) {}
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

export class SaveTransUnit implements Action {
  readonly type = ActionTypes.SaveTransUnit;
  constructor(public payload: TranslationUnit) {}
}

export class Reset implements Action {
  readonly type = ActionTypes.Reset;
}

export type ActionsUnion =
  | LoadProject
  | CommitTransUnit
  | AddProject
  | SelectTransUnit
  | SaveTransUnit
  | SetCurrentProject
  | DeleteProject
  | Reset;
