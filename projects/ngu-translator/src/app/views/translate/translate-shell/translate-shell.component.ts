import { Component, OnInit } from '@angular/core';
import { TinyTranslatorService } from '../../../shared/services';
import { Store, select } from '@ngrx/store';
import { TranslationStore } from '../../../store/translation.interface';
import * as fromRoot from '../../../store/translation.selectors';

@Component({
  selector: 'app-translate-shell',
  templateUrl: './translate-shell.component.html',
  styleUrls: ['./translate-shell.component.scss']
})
export class TranslateShellComponent implements OnInit {
  count$: any;
  constructor(private translate: TinyTranslatorService, private store: Store<fromRoot.AppState>) {
    this.count$ = store.pipe(select(fromRoot.currentProject));
  }

  ngOnInit() {
    console.log(this.translate.currentProject());
  }
}
