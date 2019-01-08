import { ActionTypes, ActionUnion } from './actions';
import { TranslationProject } from '@shared/services';

const initialState: TranslationProject = null;

export function translationFileReducer(state = initialState, action: ActionUnion) {
  switch (action.type) {
    case ActionTypes.LOAD_TRANSLATION_FILES:
      return action.payload;

    case ActionTypes.ADD_TRANSLATION_FILE: {
      return action.payload;
    }

    case ActionTypes.DELETE_TRANSLATION_FILE: {
      return action.payload;
    }

    case ActionTypes.UPDATE_TRANSLATION_FILE: {
      return action.payload;
    }

    default:
      return state;
  }
}
