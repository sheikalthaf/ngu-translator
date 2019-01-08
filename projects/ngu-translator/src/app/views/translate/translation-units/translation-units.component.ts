import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TinyTranslatorService } from '@shared/services/translation';
import { TranslationUnit } from '@shared/services/translation-unit';
import * as tfile from '@ngrxstore/translationFiles';
import * as fromRoot from '@ngrxstore/translation.selectors';
import { TranslationProject } from '@shared/services';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-translation-units',
  templateUrl: './translation-units.component.html',
  styleUrls: ['./translation-units.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TranslationUnitsComponent implements OnInit {
  // translationFileView: TranslationFileView;
  // transUnits: TranslationUnit[];
  count$: Observable<TranslationUnit[]>;
  currentProject$: Observable<TranslationUnit[]>;

  constructor(private translation: TinyTranslatorService, private store: Store<fromRoot.AppState>) {
    // this.count$ = store.pipe(select(fromRoot.scrollabeTransUnits));
    this.count$ = store.pipe(select(tfile.scrollabeTransUnits));
    // const project = this.translation.currentProject();
    // this.translationFileView = project
    //   ? project.translationFileView
    //   : new TranslationFileView(null);
    // this.transUnits = this.translationFileView.scrollabeTransUnits();
  }

  ngOnInit() {}
  // public transUnits(): TranslationUnit[] {
  //   return this.translationFileView.scrollabeTransUnits();
  // }

  // isSelected(tu: TranslationUnit): boolean {
  //   return tu && tu === this.translationFileView.currentTransUnit();
  // }

  public selectTransUnit(tu: TranslationUnit) {
    // this.store.dispatch(new SelectTransUnit(tu));
  }
}
