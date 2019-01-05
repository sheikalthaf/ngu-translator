import { createSelector } from '@ngrx/store';
import { TranslationProject, TranslationFileView, TranslationUnit } from '../shared/services';
import { AppState } from './reducers';
export { AppState } from './reducers';
// export { AppStates } from './reducers/projects';
import * as fromRoot from './reducers/projects.selectors';

// export class AppState {
//   currentId: string = null;
//   projects: TranslationProject[] = [];
//   selectTransUnit?: TranslationUnit;
//   currentProject?: TranslationProject;
// }

// export class AppState {
//   constructor(public translation: Translationss) {}
// }

export const currentProject = (state: AppState) => state.translation.currentId;
export const projects = (state: AppState) => state.translation.projects;
export const selectTransUnit = (state: AppState) => state.translation.selectTransUnit;
// export const selectedProject = (state: AppState) => state.translation.currentProject;
export const translationObjs = (state: AppState) => state.translation;

export const translationView = createSelector(
  fromRoot.selectAll,
  projec => projec
);

export const selectTransUnits = createSelector(
  selectTransUnit,
  project => project
);

export const allProjects = createSelector(
  fromRoot.selectAll,
  project => project
);

export const translationObj = createSelector(
  translationObjs,
  project => project
);

export const scrollabeTransUnits = createSelector(
  fromRoot.selectAll,
  project => project
);

export const testSelectedTransUnit = createSelector(
  translationView,
  selectTransUnit,
  (view, unit) => ({ project: view, unit })
);
