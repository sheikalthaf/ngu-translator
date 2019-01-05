import { createFeatureSelector } from '@ngrx/store';
import { translationAdapter } from './reducer';

export const getProjectState = createFeatureSelector<any>('currentProject');

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = translationAdapter.getSelectors(getProjectState);
