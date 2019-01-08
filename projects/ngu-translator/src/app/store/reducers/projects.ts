import { ActionReducerMap } from '@ngrx/store';
import { projectsReducer, State } from './projects.reducer';
import { TranslationProject, TranslationUnit } from '@shared/services';
import { counterReducer } from '@ngrxstore/currentProject';
import { translationFilesReducer, TranslationsFiles } from '@ngrxstore/translations';
import { translationFileReducer } from '@ngrxstore/translationFiles';
import { translationUnitReducer } from '@ngrxstore/current-trans-unit';

export interface AppState {
  projects: State;
  currentId: string;
  currentProject: TranslationsFiles;
  currentTranslation: TranslationProject;
  currentTransUnit: TranslationUnit;
}

export const reducerss: ActionReducerMap<AppState> = {
  projects: projectsReducer,
  currentId: counterReducer,
  currentProject: translationFilesReducer,
  currentTranslation: translationFileReducer,
  currentTransUnit: translationUnitReducer
};
