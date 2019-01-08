import { Action } from '@ngrx/store';
import { TranslationUnit } from '@shared/services';

export enum ActionTypes {
  LOAD_TRANSLATION_UNIT = '[Counter Component] Load Translations unit',
  ADD_TRANSLATION_UNIT = '[Counter Component] Add Translations unit',
  UPDATE_TRANSLATION_UNIT = '[Counter Component] Update Translations unit',
  DELETE_TRANSLATION_UNIT = '[Counter Component] Delete Translations unit'
}

export class LoadTranslationUnit implements Action {
  readonly type = ActionTypes.LOAD_TRANSLATION_UNIT;
  constructor(public payload: TranslationUnit) {}
}

export class AddTranslationUnit implements Action {
  readonly type = ActionTypes.ADD_TRANSLATION_UNIT;
  constructor(public payload: TranslationUnit) {}
}

export class UpdateTranslationUnit implements Action {
  readonly type = ActionTypes.UPDATE_TRANSLATION_UNIT;
  constructor(public payload: TranslationUnit) {}
}

export class DeleteTranslationUnit implements Action {
  readonly type = ActionTypes.DELETE_TRANSLATION_UNIT;
  constructor(public payload: TranslationUnit) {}
}

export type ActionUnion =
  | LoadTranslationUnit
  | AddTranslationUnit
  | UpdateTranslationUnit
  | DeleteTranslationUnit;
