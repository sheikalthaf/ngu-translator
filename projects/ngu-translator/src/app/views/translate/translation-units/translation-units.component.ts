import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TinyTranslatorService } from '../../../shared/services/translation';
import { TranslationFileView } from '../../../shared/services/translation-file-view';
import { TranslationUnit } from '../../../shared/services/translation-unit';
import { SelectTransUnit } from '../../../store/translation.actions';
import * as fromRoot from '../../../store/translation.selectors';

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
  currentProject$: Observable<TranslationUnit>;

  constructor(private translation: TinyTranslatorService, private store: Store<fromRoot.AppState>) {
    this.count$ = store.pipe(select(fromRoot.scrollabeTransUnits));
    this.currentProject$ = store.pipe(select(fromRoot.selectTransUnit));
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
    this.store.dispatch(new SelectTransUnit(tu));
  }
}
