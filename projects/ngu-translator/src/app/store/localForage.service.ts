import { Injectable } from '@angular/core';
import { Observable, combineLatest, of, merge } from 'rxjs';
import { IdbService } from './idb.service';
import { Projectss } from './reducers/interface';
import { BackendServiceAPI } from '@shared/services/backend-service-api';
import { TranslationProject } from '@shared/services';
import { map, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Load } from './reducers/projects.actions';
import { SetCurrentProject, LoadCurrentProject } from './currentProject/actions';
import { TranslationsFile } from './translations/reducer';

export class Transla {
  projectIds: string[] = [];
  currentProject: string = null;
}

@Injectable({
  providedIn: 'root'
})
export class LocalService {
  private APP = 'appstate';
  private PRAEFIX_PROJECT = 'project.';
  private PRAEFIX_PROJECTS = 'project.';
  private KEY_CURRENT_PROJECT_ID = 'currentproject.id';
  private KEY_CURRENT_TRANSUNIT_ID = 'currenttransunit.id';
  private KEY_APIKEY = 'googletranslate.apikey';

  constructor(private idb: IdbService, private store$: Store<any>) {
    if (!localStorage) {
      throw new Error('oops, local storage not supported');
    }
    combineLatest(this.getProjects(), this.getApp()).subscribe(([e, d]) => {
      this.store$.dispatch(new Load(e));
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
    project.id = project.id || BackendServiceAPI.generateUUID();

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
    return combineLatest(...keys.map(key => this.idb.get<Projectss>(key)));
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
    //   switchMap(keys => combineLatest(...keys.map(key => this.idb.get<Projectss>(key)))),
    //   map(e => e.sort((p1, p2) => p1.name.localeCompare(p2.name)))
    // );
  }

  /**
   * Store a project.
   */
  store(project: TranslationProject) {
    project.id = project.id || BackendServiceAPI.generateUUID();

    return this.idb.set(project.id, project.serializeTest());
  }

  test(d: Projectss, project: TranslationProject) {
    project.id = project.id || BackendServiceAPI.generateUUID();
    d.translationIds.push(project.id);
    return combineLatest(this.set(d), this.store(project));
  }

  /**
   * Get all stored projects.
   */
  projects(): TranslationProject[] {
    const projectKeys = this.getProjectKeys();
    return projectKeys
      .map(key => {
        return TranslationProject.deserialize(localStorage.getItem(key));
      })
      .sort((p1, p2) => p1.name.localeCompare(p2.name));
  }

  /**
   * Save id of curent project.
   * @param id of project, null to remove.
   */
  storeCurrentProjectId(id: string) {
    if (!id) {
      return this.idb.delete(this.KEY_CURRENT_PROJECT_ID);
    } else {
      return this.idb.set(this.KEY_CURRENT_PROJECT_ID, id);
    }
  }

  /**
   * ID if current project.
   * @return {string} id of current project or null
   */
  currentProjectId(): string {
    return localStorage.getItem(this.KEY_CURRENT_PROJECT_ID);
  }

  /**
   * Save ID of last active TransUnit
   * @param tuId active unit id or null.
   */
  storeCurrentTransUnitId(tuId: string) {
    if (!tuId) {
      localStorage.removeItem(this.KEY_CURRENT_TRANSUNIT_ID);
    } else {
      localStorage.setItem(this.KEY_CURRENT_TRANSUNIT_ID, tuId);
    }
  }

  /**
   * ID of last active TransUnit
   * @return {string} active unit or null.
   */
  currentTransUnitId(): string {
    return localStorage.getItem(this.KEY_CURRENT_TRANSUNIT_ID);
  }

  deleteProject(project: TranslationProject) {
    if (project && project.id) {
      const key = this.keyForProject(project);
      localStorage.removeItem(key);
    }
  }

  /**
   * Save API Key in store.
   * @param key
   */
  storeAutoTranslateApiKey(key: string) {
    if (!key) {
      localStorage.removeItem(this.KEY_APIKEY);
    } else {
      localStorage.setItem(this.KEY_APIKEY, key);
    }
  }

  /**
   * Get API key from store.
   * @return {null}
   */
  autoTranslateApiKey(): string {
    return localStorage.getItem(this.KEY_APIKEY);
  }

  private keyForProject(project: TranslationProject) {
    return this.PRAEFIX_PROJECT + project.id;
  }

  private keyForProjects(project: Projectss) {
    return this.PRAEFIX_PROJECTS + project.id;
  }

  private getProjectKeys(masterKey = this.PRAEFIX_PROJECT): string[] {
    const result = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(masterKey)) {
        result.push(key);
      }
    }
    return result;
  }

  // private getProjectKeys1(masterKey = this.PRAEFIX_PROJECT) {
  //   return this.idb.keys().pipe(map(key => key.filter(e => e.startsWith(masterKey))));
  // }
}
