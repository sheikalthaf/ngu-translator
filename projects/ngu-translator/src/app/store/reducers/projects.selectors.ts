import { createFeatureSelector } from '@ngrx/store';
import { State, projectAdapter } from './projects.reducer';

export const getProjectState = createFeatureSelector<State>('projects');

export const { selectIds, selectEntities, selectAll, selectTotal } = projectAdapter.getSelectors(
  getProjectState
);
