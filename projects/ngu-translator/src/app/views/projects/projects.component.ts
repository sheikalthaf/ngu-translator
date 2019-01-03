import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TinyTranslatorService, TranslationProject } from '../../shared/services';
import { ProjectService } from './projects.service';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromRoot from '../../store/translation.selectors';
import { tap } from 'rxjs/operators';

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
    private translatorService: TinyTranslatorService,
    private proj: ProjectService,
    private router: Router,
    private store: Store<fromRoot.AppState>
  ) {
    this.count$ = store.pipe(select(fromRoot.allProjects));
  }

  ngOnInit() {}

  openProject(project: TranslationProject) {
    this.translatorService.setCurrentProject(project);
    this.router.navigate(['/translate']);
  }

  addProjects() {
    this.proj.openDialog().subscribe(e => e);
  }
}
