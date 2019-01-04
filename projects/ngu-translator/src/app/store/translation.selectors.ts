import { createSelector } from '@ngrx/store';
import { TranslationProject, TranslationFileView, TranslationUnit } from '../shared/services';

export class Translationss {
  currentId: string = null;
  projects: TranslationProject[] = [];
  selectTransUnit?: TranslationUnit;
  currentProject?: TranslationProject;
}

export class AppState {
  constructor(public translation: Translationss) {}
}

export const currentProject = (state: AppState) => state.translation.currentId;
export const projects = (state: AppState) => state.translation.projects;
export const selectTransUnit = (state: AppState) => state.translation.selectTransUnit;
export const selectedProject = (state: AppState) => state.translation.currentProject;

export const translationView = createSelector(
  selectedProject,
  projec => projec.translationFileView || new TranslationFileView(null)
);

export const allProjects = createSelector(
  projects,
  project => project
);

export const scrollabeTransUnits = createSelector(
  selectedProject,
  project => project.translationFileView.scrollabeTransUnits()
);

export const testSelectedTransUnit = createSelector(
  translationView,
  selectTransUnit,
  (view, unit) => ({ project: view, unit })
);
