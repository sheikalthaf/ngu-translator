import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TranslationUnit } from '@shared/services';

export const getCurrentTransUnit = createFeatureSelector<TranslationUnit>('currentTransUnit');

// export const testSelectedTransUnit = createSelector(
//   translationView,
//   selectTransUnit,
//   (view, unit) => ({ project: view, unit })
// );
