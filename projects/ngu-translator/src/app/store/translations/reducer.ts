import { ActionTypes, Union } from './actions';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

export interface TranslationsFile {
  id?: string;
  name?: string;
  fileId?: string;
}

// Entity adapter
export const translationAdapter = createEntityAdapter<TranslationsFile>();
export interface TranslationsFiles extends EntityState<TranslationsFile> {}

// Default data / initial state
const defaultProject = {
  ids: [],
  entities: {}
};

export const initialState: TranslationsFiles = translationAdapter.getInitialState(defaultProject);

export function translationsFileReducer(state = initialState, action: Union) {
  switch (action.type) {
    case ActionTypes.LOAD_TRANSLATIONS:
      return translationAdapter.addAll(action.payload, initialState);

    case ActionTypes.ADD_TRANSLATIONS: {
      return state;
      // return translationAdapter.addOne(action.payload, state);
    }

    case ActionTypes.DELETE_TRANSLATIONS: {
      return translationAdapter.removeOne(action.payload, state);
    }

    case ActionTypes.UPDATE_TRANSLATIONS: {
      return translationAdapter.updateOne(
        {
          id: action.payload.id,
          changes: action.payload
        },
        state
      );
    }

    default:
      return state;
  }
}
