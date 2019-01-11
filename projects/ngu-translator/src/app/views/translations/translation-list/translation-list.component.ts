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
import { trigger, transition, style, stagger, animate, query } from '@angular/animations';

@Component({
  selector: 'app-translation-list',
  templateUrl: './translation-list.component.html',
  styleUrls: ['./translation-list.component.scss'],
  animations: [
    trigger('listStagger', [
      transition('* <=> *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(-15px)' }),
            stagger(
              '50ms',
              animate('550ms ease-out', style({ opacity: 1, transform: 'translateY(0px)' }))
            )
          ],
          { optional: true }
        ),
        query(':leave', animate('50ms', style({ opacity: 0 })), {
          optional: true
        })
      ])
    ])
  ]
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
      select(fromRoot.selectAll)
      // map(e => e.map(s => TranslationProject.deserialize(s)))
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
