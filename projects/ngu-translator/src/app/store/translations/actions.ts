import { Action } from '@ngrx/store';
import { TranslationProject } from '@shared/services';

export enum ActionTypes {
  LOAD_TRANSLATIONS = '[Counter Component] Load Translations',
  ADD_TRANSLATIONS = '[Counter Component] Add Translations',
  UPDATE_TRANSLATIONS = '[Counter Component] Update Translations',
  DELETE_TRANSLATIONS = '[Counter Component] Delete Translations',
  DOWNLOAD_TRANSLATIONS = '[Counter Component] Download Translations'
}

export class LoadTranslations implements Action {
  readonly type = ActionTypes.LOAD_TRANSLATIONS;
  constructor(public payload: TranslationProject[]) {}
}

export class AddTranslations implements Action {
  readonly type = ActionTypes.ADD_TRANSLATIONS;
  constructor(public payload: TranslationProject) {}
}

export class UpdateTranslations implements Action {
  readonly type = ActionTypes.UPDATE_TRANSLATIONS;
  constructor(public payload: TranslationProject) {}
}

export class DeleteTranslations implements Action {
  readonly type = ActionTypes.DELETE_TRANSLATIONS;
  constructor(public payload: string) {}
}

export class DownloadTranslations implements Action {
  readonly type = ActionTypes.DOWNLOAD_TRANSLATIONS;
  constructor(public payload: TranslationProject) {}
}

export type ActionUnion =
  | LoadTranslations
  | AddTranslations
  | UpdateTranslations
  | DeleteTranslations
  | DownloadTranslations;
