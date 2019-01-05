import { Projectss } from '@ngrxstore/reducers/interface';
import { TranslationsFile } from './reducer';

export { translationsFileReducer } from './reducer';
export * from './selectors';
export { Union, ActionTypes } from './actions';

export interface AdTranss {
  id: string;
  current: Projectss;
  payload: TranslationsFile;
}
