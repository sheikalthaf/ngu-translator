import { Action } from '@ngrx/store';
import { TranslationsFile } from './reducer';
import { TranslationProject } from '@shared/services';

export enum ActionTypes {
  LOAD_TRANSLATIONS = '[Counter Component] Load Translations',
  ADD_TRANSLATIONS = '[Counter Component] Add Translations',
  UPDATE_TRANSLATIONS = '[Counter Component] Update Translations',
  DELETE_TRANSLATIONS = '[Counter Component] Delete Translations'
}

export class LoadTranslations implements Action {
  readonly type = ActionTypes.LOAD_TRANSLATIONS;
  constructor(public payload: TranslationsFile[]) {}
}

export class AddTranslations implements Action {
  readonly type = ActionTypes.ADD_TRANSLATIONS;
  constructor(public payload: TranslationProject) {}
}

export class UpdateTranslations implements Action {
  readonly type = ActionTypes.UPDATE_TRANSLATIONS;
  constructor(public payload: TranslationsFile) {}
}

export class DeleteTranslations implements Action {
  readonly type = ActionTypes.DELETE_TRANSLATIONS;
  constructor(public payload: string) {}
}

export type Union = LoadTranslations | AddTranslations | UpdateTranslations | DeleteTranslations;
