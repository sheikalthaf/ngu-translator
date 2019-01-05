import { createEntityAdapter, EntityState, EntityAdapter } from '@ngrx/entity';
import * as actions from './projects.actions';
import { Projectss } from './interface';

// Entity adapter
export const projectAdapter = createEntityAdapter<Projectss>();
export interface State extends EntityState<Projectss> {}

// Default data / initial state
const defaultProject = {
  ids: [],
  entities: {}
};

export const initialState: State = projectAdapter.getInitialState(defaultProject);

export function projectsReducer(state = initialState, action: actions.projectActions) {
  switch (action.type) {
    case actions.LOAD: {
      return projectAdapter.addAll(action.pizza, state);
    }

    case actions.CREATE: {
      return projectAdapter.addOne(action.pizza, state);
    }

    case actions.DELETE: {
      return projectAdapter.removeOne(action.id, state);
    }

    case actions.UPDATE: {
      return projectAdapter.updateOne(
        {
          id: action.id,
          changes: action.changes
        },
        state
      );
    }

    default:
      return state;
  }
}
