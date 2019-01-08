import { Action } from '@ngrx/store';
import { TranslationProject } from '@shared/services';

export enum ActionTypes {
  LOAD_TRANSLATION_FILES = '[Counter Component] Load Translations Files',
  ADD_TRANSLATION_FILE = '[Counter Component] Add Translations Files',
  UPDATE_TRANSLATION_FILE = '[Counter Component] Update Translations Files',
  DELETE_TRANSLATION_FILE = '[Counter Component] Delete Translations Files'
}

export class LoadTranslationFiles implements Action {
  readonly type = ActionTypes.LOAD_TRANSLATION_FILES;
  constructor(public payload: TranslationProject) {
    console.log(payload);
  }
}

export class AddTranslationFile implements Action {
  readonly type = ActionTypes.ADD_TRANSLATION_FILE;
  constructor(public payload: TranslationProject) {}
}

export class UpdateTranslationFile implements Action {
  readonly type = ActionTypes.UPDATE_TRANSLATION_FILE;
  constructor(public payload: TranslationProject) {}
}

export class DeleteTranslationFile implements Action {
  readonly type = ActionTypes.DELETE_TRANSLATION_FILE;
  constructor(public payload: TranslationProject) {}
}

export type ActionUnion =
  | LoadTranslationFiles
  | AddTranslationFile
  | UpdateTranslationFile
  | DeleteTranslationFile;
