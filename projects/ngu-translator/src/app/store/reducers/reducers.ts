import { translationReducer } from './translation.reducer';
import { TranslationProject, TranslationUnit } from '@shared/services';
import { ActionReducerMap } from '@ngrx/store';

export class I18nTranslation {
  currentId: string = null;
  projects: TranslationProject[] = [];
  selectTransUnit?: TranslationUnit;
  currentProject?: TranslationProject;
}

export interface AppState {
  translation: I18nTranslation;
}

// export const reducers: ActionReducerMap<AppState> = {
//   translation: translationReducer
// };

// export const initialState: AppState = {
//   translation: new I18nTranslation()
// };
