import { createSelector } from '@ngrx/store';
import { TranslationProject } from '../shared/services';

export class Translationss {
  currentId: string = null;
  projects: TranslationProject[] = [];
}

export class AppState {
  constructor(public translation: Translationss) {}
}

export const currentProject = (state: AppState) => state.translation.currentId;
export const projects = (state: AppState) => state.translation.projects;

export const selectedProject = createSelector(
  currentProject,
  projects,
  (selectedId: string, project: TranslationProject[]) => {
    if (selectedId && project) {
      return project.find((book: TranslationProject) => book.id === selectedId);
    } else {
      return project[0];
    }
  }
);

export const allProjects = createSelector(
  projects,
  project => project
);

export const scrollabeTransUnits = createSelector(
  selectedProject,
  project => project.translationFileView.scrollabeTransUnits()
);
