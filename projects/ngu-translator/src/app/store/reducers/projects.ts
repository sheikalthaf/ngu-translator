import { ActionReducerMap } from '@ngrx/store';
import { projectsReducer, State } from './projects.reducer';
import { TranslationProject, TranslationUnit } from '@shared/services';
import { counterReducer } from '@ngrxstore/currentProject';
import { translationFilesReducer, TranslationsFiles } from '@ngrxstore/translations';
import { translationFileReducer } from '@ngrxstore/translationFiles';

export interface AppState {
  projects: State;
  currentId: string;
  selectTransUnit: TranslationUnit;
  currentTranslation: TranslationProject;
  currentProject: TranslationsFiles;
}

export const reducerss: ActionReducerMap<AppState> = {
  projects: projectsReducer,
  currentId: counterReducer,
  currentProject: translationFilesReducer,
  currentTranslation: translationFileReducer,
  selectTransUnit: null
};
