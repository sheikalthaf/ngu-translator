import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectEntities } from '../reducers/projects.selectors';

export const currentProjectId = createFeatureSelector<string>('currentId');

export const currentProject = createSelector(
  currentProjectId,
  selectEntities,
  (pr, se) => se[pr]
);
