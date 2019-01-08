import { createFeatureSelector } from '@ngrx/store';
import { TranslationProject } from '@shared/services';

export const getProjectState = createFeatureSelector<TranslationProject>('currentTranslation');
