import { ActionTypes, Union } from './actions';

export const initialState = null;

export function counterReducer(state = initialState, action: Union) {
  switch (action.type) {
    case ActionTypes.SetCurrentProject:
      return action.payload.id;

    case ActionTypes.LoadCurrentProject:
      return action.payload;

    default:
      return state;
  }
}
