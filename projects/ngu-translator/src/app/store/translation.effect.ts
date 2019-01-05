import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { TinyTranslatorService } from '../shared/services/translation';
import {
  ActionsUnion,
  ActionTypes,
  SetCurrentProject,
  SelectTransUnit
} from './translation.actions';
import { BackendServiceAPI } from '../shared/services/backend-service-api';
import { Store, select } from '@ngrx/store';
import * as fromStore from './translation.selectors';
import { WorkflowType } from '@shared/services';
import { STATE_FINAL, STATE_TRANSLATED } from 'ngx-i18nsupport-lib';
import { AppState } from './reducers';

@Injectable()
export class TranslationEffect {
  constructor(
    private trans: TinyTranslatorService,
    private actions$: Actions<ActionsUnion>,
    private backendService: BackendServiceAPI,
    private store$: Store<AppState>
  ) {}

  @Effect({ dispatch: false })
  SelectTransUnit$: Observable<ActionsUnion> = this.actions$.pipe(
    ofType(ActionTypes.SelectTransUnit),
    map(action => {
      this.trans.selectTransUnit(action.payload);
      return null;
    })
  );

  @Effect()
  addProject$: Observable<ActionsUnion> = this.actions$.pipe(
    ofType(ActionTypes.AddProject),
    tap(action => this.backendService.store(action.payload)),
    map(e => new SetCurrentProject(e.payload))
  );

  /**
   * store the selected project id to the `localstorage`
   */
  @Effect({ dispatch: false })
  selectProject$: Observable<ActionsUnion> = this.actions$.pipe(
    ofType(ActionTypes.SetCurrentProject),
    map(action => {
      if (action.payload) this.backendService.storeCurrentProjectId(action.payload.id);
      return null;
    })
  );

  /**
   * store the selected project id to the `localstorage`
   */
  @Effect({ dispatch: false })
  commitsTransUnit$: Observable<ActionsUnion> = this.actions$.pipe(
    ofType(ActionTypes.CommitTransUnit),
    withLatestFrom(this.store$.pipe(select(fromStore.translationObj))),
    map(([action, state]) => {
      state.selectTransUnit.translate(action.payload.message);
      switch (state.currentProject.workflowType) {
        case WorkflowType.SINGLE_USER:
          state.selectTransUnit.setTargetState(STATE_FINAL);
          break;
        case WorkflowType.WITH_REVIEW:
          if (action.payload.isMarkedAsReviewed) {
            state.selectTransUnit.setTargetState(STATE_FINAL);
          } else {
            state.selectTransUnit.setTargetState(STATE_TRANSLATED);
          }
          break;
      }
      const unit = this.trans.nextTransUnit();
      return new SelectTransUnit(unit);
    })
  );

  /**
   * store the selected project id to the `localstorage`
   */
  // @Effect()
  // deleteProject$: Observable<ActionsUnion> = this.actions$.pipe(
  //   ofType(ActionTypes.DeleteProject),
  //   withLatestFrom(this.store$.pipe(select(fromStore.selectedProject))),
  //   map(([action, project]) => {
  //     this.backendService.deleteProject(action.payload);
  //     return action.payload.id === project.id ? new SetCurrentProject(null) : null;
  //   })
  // );
}
