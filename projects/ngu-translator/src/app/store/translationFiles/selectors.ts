import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TranslationProject } from '@shared/services';

export const getTranslationState = createFeatureSelector<TranslationProject>('currentTranslation');

export const scrollabeTransUnits = createSelector(
  getTranslationState,
  e => e.translationFileView.scrollabeTransUnits()
);
// export const testSelectedTransUnit = createSelector(
//   translationView,
//   selectTransUnit,
//   (view, unit) => ({ project: view, unit })
// );
