import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { TranslationProject } from '../../shared/services';
import { ProjectService } from './projects.service';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromRoot from '../../store/translation.selectors';
import { SetCurrentProject } from '../../store/translation.actions';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsComponent implements OnInit {
  // projects: TranslationProject[];
  count$: Observable<TranslationProject[]>;

  constructor(
    private proj: ProjectService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private store: Store<fromRoot.AppState>
  ) {
    this.count$ = store.pipe(select(fromRoot.allProjects));
  }

  ngOnInit() {}

  openProject(project: TranslationProject) {
    this.store.dispatch(new SetCurrentProject(project));
    this.router.navigate(['/translate']);
  }

  addProjects() {
    this.proj.openDialog().subscribe(e => this.cdr.detectChanges());
  }
}
