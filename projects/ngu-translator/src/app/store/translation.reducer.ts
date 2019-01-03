import { ActionTypes, ActionsUnion } from './translation.actions';
import { Translationss } from './translation.selectors';

export const initialState = new Translationss();

export function translationReducer(state = initialState, action: ActionsUnion) {
  switch (action.type) {
    case ActionTypes.Increment:
      return state;

    case ActionTypes.Add:
      state.projects = action.payload.projects;
      state.currentId = action.payload.currentId;
      return state;

    case ActionTypes.Decrement:
      return state;

    case ActionTypes.Reset:
      return 0;

    default:
      return state;
  }
}
