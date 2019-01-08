import { createFeatureSelector } from '@ngrx/store';
import { translationAdapter, TranslationsFiles } from './reducer';

export const getProjectState = createFeatureSelector<TranslationsFiles>('currentProject');

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = translationAdapter.getSelectors(getProjectState);
