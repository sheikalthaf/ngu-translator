import { ActionTypes, ActionUnion } from './actions';
import { TranslationUnit } from '@shared/services';

const initialState: TranslationUnit = null;

export function translationUnitReducer(state = initialState, action: ActionUnion) {
  switch (action.type) {
    case ActionTypes.LOAD_TRANSLATION_UNIT:
      return action.payload;

    case ActionTypes.ADD_TRANSLATION_UNIT: {
      return action.payload;
    }

    case ActionTypes.DELETE_TRANSLATION_UNIT: {
      return action.payload;
    }

    case ActionTypes.UPDATE_TRANSLATION_UNIT: {
      return action.payload;
    }

    default:
      return state;
  }
}
