import { ActionReducerMap } from '@ngrx/store';
import { projectsReducer, State } from './projects.reducer';
import { TranslationProject, TranslationUnit } from '@shared/services';
import { counterReducer } from '@ngrxstore/currentProject';
import { translationsFileReducer, TranslationsFiles } from '@ngrxstore/translations/reducer';

export interface AppState {
  projects: State;
  currentId: string;
  selectTransUnit: TranslationUnit;
  currentProject: TranslationsFiles;
}

export const reducerss: ActionReducerMap<AppState> = {
  projects: projectsReducer,
  currentId: counterReducer,
  currentProject: translationsFileReducer,
  selectTransUnit: null
};
