import { ActionTypes, ActionsUnion } from './translation.actions';
import { Translationss } from './translation.selectors';
// import * as _ from 'lodash';

export const initialState = new Translationss();

export function translationReducer(state = initialState, action: ActionsUnion) {
  switch (action.type) {
    case ActionTypes.LoadProject:
      return {
        ...state,
        projects: action.payload.projects,
        currentId: action.payload.currentId,
        currentProject: action.payload.currentProject
      };

    case ActionTypes.AddProject: {
      const projects = state.projects;
      projects.push(action.payload);
      return { ...state, projects };
    }

    case ActionTypes.DeleteProject: {
      let projects = state.projects;
      const index = state.projects.findIndex(p => p.id === action.payload.id);
      if (index >= 0) {
        projects = projects.slice(0, index).concat(projects.slice(index + 1));
      }
      return { ...state, projects };
    }

    case ActionTypes.SelectTransUnit:
      return { ...state, selectTransUnit: action.payload };

    case ActionTypes.SetCurrentProject:
      return { ...state, currentProject: action.payload };

    case ActionTypes.Reset:
      return initialState;

    default:
      return state;
  }
}
