import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslationProject } from '@shared/services';
import { combineLatest, merge, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { LoadCurrentProject } from './currentProject/actions';
import { IdbService } from './idb.service';
import { Projectss } from './reducers/interface';
import { Load } from './reducers/projects.actions';
import { uuid } from './guuid';
import { TinyTranslatorService } from '@shared/services/translation';

export class Transla {
  projectIds: string[] = [];
  currentProject: string = null;
}

@Injectable({
  providedIn: 'root'
})
export class LocalService {
  private APP = 'appstate';

  constructor(
    private idb: IdbService,
    private store$: Store<any>,
    private tiny: TinyTranslatorService
  ) {
    if (!localStorage) {
      throw new Error('oops, local storage not supported');
    }
    combineLatest(this.getProjects(), this.getApp()).subscribe(([e, d]) => {
      e[0] && this.store$.dispatch(new Load(e));
      // const proj = e.find(s => s.id === d.currentProject);
      d.currentProject && this.store$.dispatch(new LoadCurrentProject(d.currentProject));
    });
  }

  app(val = new Transla()) {
    return this.idb.set(this.APP, val);
  }

  getApp() {
    return this.idb
      .get<Transla>(this.APP)
      .pipe(switchMap(e => (e ? of(e) : this.app().pipe(map(() => new Transla())))));
  }

  setCurrentProject(data: Projectss) {
    return this.getApp().pipe(
      switchMap(e => {
        e.currentProject = data.id;
        return this.app(e);
      })
    );
  }

  /**
   * Store a project.
   */
  addProject(project: Projectss) {
    project.id = project.id || uuid();

    return this.getApp().pipe(
      switchMap(e => {
        e.projectIds.push(project.id);
        return merge(this.set(project), this.app(e));
      })
    );
  }

  updateProject(project: Projectss) {
    return this.idb.set(project.id, project);
  }

  private set<T = any>(project: any) {
    return this.idb.set(project.id, project);
  }

  getTranslations(keys: string[]) {
    const obser = keys.map(key => this.idb.get<TranslationProject>(key));
    return obser.length ? combineLatest(...obser) : of([] as TranslationProject[]);
  }

  /**
   * Store a project.
   */
  getProjects(): Observable<Projectss[]> {
    return this.getApp().pipe(
      switchMap(keys => {
        return keys
          ? combineLatest(...keys.projectIds.map(key => this.idb.get<Projectss>(key)))
          : of([]);
      }),
      map(e => e.sort((p1, p2) => p1.name.localeCompare(p2.name)))
    );
  }

  /**
   * Store a project.
   */
  store(project: TranslationProject) {
    project.id = project.id || uuid();

    return this.idb.set(project.id, project.serialize());
  }

  addTranslation(d: Projectss, project: TranslationProject) {
    project.id = project.id || uuid();
    d.translationIds.push(project.id);
    return combineLatest(this.set(d), this.store(project));
  }

  deleteTranslation(d: Projectss, id: string) {
    d.translationIds.splice(d.translationIds.findIndex(e => e === id), 1);
    return combineLatest(this.set(d), this.idb.delete(id));
  }

  downloadTranslation(d: TranslationProject) {
    this.tiny.saveProject(d);
    return null;
  }
}
