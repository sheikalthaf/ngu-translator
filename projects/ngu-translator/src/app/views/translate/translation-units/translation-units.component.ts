import { Component, OnInit, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { TinyTranslatorService } from '../../../shared/services';
import { TranslationUnit } from '../../../shared/services/translation-unit';
import { TranslationFileView } from '../../../shared/services/translation-file-view';

@Component({
  selector: 'app-translation-units',
  templateUrl: './translation-units.component.html',
  styleUrls: ['./translation-units.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TranslationUnitsComponent implements OnInit {
  /**
   * Emitted, when user wants to navigate to another unit.
   * @type {EventEmitter<TranslationUnit>} the wanted trans unit.
   */
  @Output() changeTranslationUnit: EventEmitter<TranslationUnit> = new EventEmitter<
    TranslationUnit
  >();

  translationFileView: TranslationFileView;
  transUnits: TranslationUnit[];

  constructor(private translation: TinyTranslatorService) {
    const project = this.translation.currentProject();
    this.translationFileView = project
      ? project.translationFileView
      : new TranslationFileView(null);
    this.transUnits = this.translationFileView.scrollabeTransUnits();
  }

  ngOnInit() {}
  // public transUnits(): TranslationUnit[] {
  //   return this.translationFileView.scrollabeTransUnits();
  // }

  isSelected(tu: TranslationUnit): boolean {
    return tu && tu === this.translationFileView.currentTransUnit();
  }

  public selectTransUnit(tu: TranslationUnit) {
    this.changeTranslationUnit.emit(tu);
  }
}
