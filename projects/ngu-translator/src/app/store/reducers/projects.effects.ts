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
import * as fromTransSele from '../translations/selectors';
import * as fromCurr from '../currentProject/selectors';

@Injectable()
export class ProjectEffect {
  constructor(
    private actions$: Actions<actions.projectActions>,
    private backendService: LocalService,
    private store$: Store<any>
  ) {}

  @Effect()
  SelectTransUnit$ = this.actions$.pipe(
    ofType(actions.CREATE),
    switchMap(action =>
      this.backendService
        .addProject(action.pizza)
        .pipe(map(() => new curr.SetCurrentProject(action.pizza)))
    )
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
      const translationIds =
        action instanceof curr.SetCurrentProject
          ? (<any>action.payload).translationIds
          : projects.find(e => e.id === action.payload).translationIds;

      return this.backendService
        .getTranslations(translationIds)
        .pipe(map(e => new fromTrans.LoadTranslations(e)));
    })
  );

  @Effect({ dispatch: false })
  seeTransUnit$ = this.actions$.pipe(
    ofType<fromTrans.AddTranslations>(fromTrans.ActionTypes.ADD_TRANSLATIONS),
    withLatestFrom(this.store$.pipe(select(fromCurr.currentProject))),
    switchMap(([action, data]) => this.backendService.addTranslation(data, action.payload))
  );

  @Effect({ dispatch: false })
  deleteTrans$ = this.actions$.pipe(
    ofType<fromTrans.DeleteTranslations>(fromTrans.ActionTypes.DELETE_TRANSLATIONS),
    withLatestFrom(this.store$.pipe(select(fromCurr.currentProject))),
    switchMap(([action, data]) => this.backendService.deleteTranslation(data, action.payload))
  );

  @Effect({ dispatch: false })
  downloadTrans$ = this.actions$.pipe(
    ofType<fromTrans.DownloadTranslations>(fromTrans.ActionTypes.DOWNLOAD_TRANSLATIONS),
    withLatestFrom(this.store$.pipe(select(fromTransSele.selectEntities))),
    map(([action, data]) => this.backendService.downloadTranslation(action.payload))
  );
}
