import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectionStrategy
} from '@angular/core';
import { TranslationFile } from '@shared/services/translation-file';
import { TranslationFileView } from '@shared/services/translation-file-view';
// import { TranslationFile } from '../model/translation-file';
// import { TranslationFileView } from '../model/translation-file-view';

/**
 * Component to show the current status of a loaded translation file.
 * It shows the size, number of translations, wether it is changed etc.
 */
@Component({
  selector: 'app-translation-file-status',
  templateUrl: './translation-file-status.component.html',
  styleUrls: ['./translation-file-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TranslationFileStatusComponent implements OnInit {
  @Input() translationFile: TranslationFile;
  @Input() translationFileView: TranslationFileView;
  @Input() shortInfo = false;

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onSave = new EventEmitter<TranslationFile>();

  constructor() {}

  ngOnInit() {
    // console.log(this.translationFileView);
  }

  /**
   * percentage translated rounded to 0 digits.
   * @return {any}
   */
  public percentageTranslated(): string {
    console.log('asdfasdfasf');
    const result: number = this.translationFile.percentageTranslated();
    return result.toFixed(0);
  }

  /**
   * Save the changed file.
   */
  public save() {
    if (this.translationFile) {
      this.onSave.emit(this.translationFile);
    }
  }
}
