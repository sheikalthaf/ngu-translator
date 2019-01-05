import { Injectable } from '@angular/core';
import { BackendServiceAPI } from './backend-service-api';
import { TranslationProject } from './translation-project';
import { Projectss } from '@ngrxstore/reducers/interface';

@Injectable()
export class BackendLocalStorageService extends BackendServiceAPI {
  private PRAEFIX = 'tinytranslator.';
  private PRAEFIX_PROJECT = this.PRAEFIX + 'project.';
  private PRAEFIX_PROJECTS = this.PRAEFIX + 'projects.';
  private KEY_CURRENT_PROJECT_ID = this.PRAEFIX + 'currentproject.id';
  private KEY_CURRENT_TRANSUNIT_ID = this.PRAEFIX + 'currenttransunit.id';
  private KEY_APIKEY = this.PRAEFIX + 'googletranslate.apikey';

  constructor() {
    super();
    if (!localStorage) {
      throw new Error('oops, local storage not supported');
    }
  }

  /**
   * Store a project.
   */
  addProject(project: Projectss) {
    if (!project.id) {
      project.id = BackendServiceAPI.generateUUID();
    }
    localStorage.setItem(this.keyForProjects(project), JSON.stringify(project));
  }

  /**
   * Store a project.
   */
  getProjects(): Projectss[] {
    const projectKeys = this.getProjectKeys(this.PRAEFIX_PROJECTS);
    return projectKeys
      .map(key => JSON.parse(localStorage.getItem(key)))
      .sort((p1, p2) => p1.name.localeCompare(p2.name));
  }

  /**
   * Store a project.
   */
  store(project: TranslationProject) {
    if (!project.id) {
      project.id = BackendServiceAPI.generateUUID();
    }
    localStorage.setItem(this.keyForProject(project), project.serialize());
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
      localStorage.removeItem(this.KEY_CURRENT_PROJECT_ID);
    } else {
      localStorage.setItem(this.KEY_CURRENT_PROJECT_ID, id);
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
}
