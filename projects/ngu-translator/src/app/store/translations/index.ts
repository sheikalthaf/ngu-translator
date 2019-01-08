import { Projectss } from '@ngrxstore/reducers/interface';
import { TranslationProject } from '@shared/services';
export { TranslationsFiles } from './reducer';

export { translationFilesReducer } from './reducer';
export * from './selectors';
export * from './actions';

export interface AdTranss {
  id: string;
  current: Projectss;
  payload: TranslationProject;
}
