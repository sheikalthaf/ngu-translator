import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { SetCurrentProject } from '@ngrxstore/translation.actions';
import * as fromRoot from '@ngrxstore/translations';
import { DeleteTranslations, DownloadTranslations } from '@ngrxstore/translations';
import { TranslationProject } from '@shared/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectService } from '../../projects/projects.service';

@Component({
  selector: 'app-translation-list',
  templateUrl: './translation-list.component.html',
  styleUrls: ['./translation-list.component.scss']
})
export class TranslationListComponent implements OnInit {
  projects$: Observable<TranslationProject[]>;
  currentProjectId$: Observable<string>;

  constructor(
    private proj: ProjectService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private store: Store<any>
  ) {
    this.projects$ = store.pipe(
      select(fromRoot.selectAll),
      map(e => e.map(s => TranslationProject.deserialize(s)))
    );
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

  deleteTranslation(project: TranslationProject) {
    this.store.dispatch(new DeleteTranslations(project.id));
  }

  downloadTranslation(project: TranslationProject) {
    this.store.dispatch(new DownloadTranslations(project));
  }
}
