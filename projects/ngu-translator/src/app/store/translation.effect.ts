import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { map, tap, withLatestFrom, switchMap } from 'rxjs/operators';
import { TinyTranslatorService } from '../shared/services/translation';
import { ActionsUnion, ActionTypes, LoadProject, SetCurrentProject } from './translation.actions';
import { BackendServiceAPI } from '../shared/services/backend-service-api';
import { Store, select } from '@ngrx/store';
import { AppState } from './translation.selectors';
import * as fromStore from './translation.selectors';

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
      this.backendService.storeCurrentProjectId(action.payload.id);
      return null;
    })
  );

  /**
   * store the selected project id to the `localstorage`
   */
  @Effect()
  deleteProject$: Observable<ActionsUnion> = this.actions$.pipe(
    ofType(ActionTypes.DeleteProject),
    withLatestFrom(this.store$.pipe(select(fromStore.selectedProject))),
    map(([action, project]) => {
      this.backendService.deleteProject(action.payload);
      if (action.payload.id === project.id) {
        return new SetCurrentProject(null);
      }
      return null;
    })
  );
}
