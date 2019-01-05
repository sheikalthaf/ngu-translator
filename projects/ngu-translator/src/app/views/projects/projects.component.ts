import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ProjectService } from './projects.service';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromRoot from '@ngrxstore/reducers/projects.selectors';
import * as currr from '@ngrxstore/currentProject/actions';
import { TranslationProject } from '@shared/services';
import { Projectss } from '@ngrxstore/reducers/interface';
import { currentProjectId } from '@ngrxstore/currentProject';
import { tap, shareReplay } from 'rxjs/operators';
import { DeleteProject, SetCurrentProject } from '@ngrxstore/translation.actions';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsComponent implements OnInit {
  projects$: Observable<Projectss[]>;
  currentProjectId$: Observable<string>;

  constructor(
    private proj: ProjectService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private store: Store<any>
  ) {
    this.projects$ = store.pipe(select(fromRoot.selectAll));
    this.currentProjectId$ = this.store.pipe(
      select(currentProjectId),
      shareReplay()
    );
  }

  setCurrentProject(data: Projectss) {
    this.store.dispatch(new currr.SetCurrentProject(data));
  }

  ngOnInit() {}

  openProject(project: TranslationProject) {
    this.store.dispatch(new SetCurrentProject(project));
    this.router.navigate(['/translate']);
  }

  addProjects() {
    this.proj.openDialog().subscribe(e => this.cdr.detectChanges());
  }

  viewProjects() {
    this.proj.viewDialog().subscribe(e => this.cdr.detectChanges());
  }

  deleteProject(project: TranslationProject) {
    this.store.dispatch(new DeleteProject(project));
  }
}
