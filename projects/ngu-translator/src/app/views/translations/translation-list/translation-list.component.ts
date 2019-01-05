import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Projectss } from '@ngrxstore/reducers/interface';
import { ProjectService } from '../../projects/projects.service';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { TranslationProject } from '@shared/services';
import { SetCurrentProject } from '@ngrxstore/translation.actions';
import { DeleteProject } from '@ngrxstore/translation.actions';
import * as fromRoot from '@ngrxstore/translations';
import { TranslationsFile } from '@ngrxstore/translations/reducer';

@Component({
  selector: 'app-translation-list',
  templateUrl: './translation-list.component.html',
  styleUrls: ['./translation-list.component.scss']
})
export class TranslationListComponent implements OnInit {
  projects$: Observable<TranslationsFile[]>;
  currentProjectId$: Observable<string>;

  constructor(
    private proj: ProjectService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private store: Store<any>
  ) {
    this.projects$ = store.pipe(select(fromRoot.selectAll));
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
