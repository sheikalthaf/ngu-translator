import { ActionTypes, ActionUnion } from './actions';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { TranslationProject } from '@shared/services';

// export interface TranslationsFile {
//   id?: string;
//   name?: string;
//   fileId?: string;
// }

// Entity adapter
export const translationAdapter = createEntityAdapter<TranslationProject>();
export interface TranslationsFiles extends EntityState<TranslationProject> {}

// Default data / initial state
const defaultProject = {
  ids: [],
  entities: {}
};

export const initialState: TranslationsFiles = translationAdapter.getInitialState(defaultProject);

export function translationFilesReducer(state = initialState, action: ActionUnion) {
  switch (action.type) {
    case ActionTypes.LOAD_TRANSLATIONS: {
      return translationAdapter.addAll(action.payload, initialState);
    }

    case ActionTypes.ADD_TRANSLATIONS: {
      console.log(action.payload);
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

    case ActionTypes.DOWNLOAD_TRANSLATIONS:
      return state;

    default:
      return state;
  }
}
