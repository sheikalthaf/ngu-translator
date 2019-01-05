import { ActionTypes, ActionsUnion } from '../translation.actions';
import { createEntityAdapter, EntityState, EntityAdapter } from '@ngrx/entity';
import { TranslationProject, TranslationUnit } from '@shared/services';

export class I18nTranslation {
  currentId: string = null;
  projects: TranslationProject[] = [];
  selectTransUnit?: TranslationUnit;
  currentProject?: TranslationProject;
}

export interface AppState {
  translation: I18nTranslation;
}

export interface State extends EntityState<AppState> {}

export const i18nInitialState = new I18nTranslation();

export const initialState: AppState = {
  translation: i18nInitialState
};

export const todoAdapter: EntityAdapter<TranslationProject[]> = createEntityAdapter<
  TranslationProject[]
>();

// export const initialStates: State = todoAdapter.getInitialState();

export function translationReducer(state = new I18nTranslation(), action: ActionsUnion) {
  switch (action.type) {
    case ActionTypes.LoadProject: {
      console.log(state);
      return {
        ...state,
        projects: action.payload.projects,
        currentId: action.payload.currentId,
        currentProject: action.payload.currentProject,
        selectTransUnit: action.payload.selectTransUnit
      };
    }

    case ActionTypes.AddProject: {
      console.log(state);
      // return todoAdapter.addOne(action.payload, state)
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

    case ActionTypes.CommitTransUnit:
      return { ...state };

    case ActionTypes.SelectTransUnit:
      return { ...state, selectTransUnit: action.payload };

    case ActionTypes.SaveTransUnit:
      return { ...state, selectTransUnit: action.payload };

    case ActionTypes.SetCurrentProject:
      return { ...state, currentProject: action.payload };

    case ActionTypes.Reset:
      return initialState;

    default:
      return state;
  }
}
