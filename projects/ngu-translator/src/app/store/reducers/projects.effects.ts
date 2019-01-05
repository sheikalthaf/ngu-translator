import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import * as actions from './projects.actions';
import * as curr from '../currentProject/actions';
import { LocalService } from '@ngrxstore/localForage.service';
import * as fromStore from './projects.selectors';
import * as fromTrans from '../translations/actions';
import * as fromCurr from '../currentProject/selectors';

@Injectable()
export class ProjectEffect {
  constructor(
    private actions$: Actions<actions.projectActions>,
    private backendService: LocalService,
    private store$: Store<any>
  ) {}

  @Effect({ dispatch: false })
  SelectTransUnit$ = this.actions$.pipe(
    ofType(actions.CREATE),
    switchMap(action => this.backendService.addProject(action.pizza))
  );

  @Effect({ dispatch: false })
  seetTransUnit$ = this.actions$.pipe(
    ofType<curr.SetCurrentProject>(curr.ActionTypes.SetCurrentProject),
    switchMap(action => this.backendService.setCurrentProject(action.payload))
  );

  @Effect()
  LoadTransUnit$ = this.actions$.pipe(
    ofType<curr.LoadCurrentProject>(
      curr.ActionTypes.LoadCurrentProject,
      curr.ActionTypes.SetCurrentProject
    ),
    withLatestFrom(this.store$.pipe(select(fromStore.selectAll))),
    switchMap(([action, projects]) => {
      console.log(action);
      let translationIds;
      if (action instanceof curr.SetCurrentProject) {
        translationIds = (<any>action.payload).translationIds;
      } else {
        translationIds = projects.find(e => e.id === action.payload).translationIds;
      }
      return this.backendService
        .getTranslations(translationIds)
        .pipe(map(e => new fromTrans.LoadTranslations(e)));
    })
  );

  @Effect({ dispatch: false })
  seeTransUnit$ = this.actions$.pipe(
    ofType<fromTrans.AddTranslations>(fromTrans.ActionTypes.ADD_TRANSLATIONS),
    withLatestFrom(this.store$.pipe(select(fromCurr.currentProject))),
    switchMap(([action, data]) => this.backendService.test(data, action.payload))
  );
}
