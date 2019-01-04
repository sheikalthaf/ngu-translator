import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../store/translation.selectors';

@Component({
  selector: 'app-translate-shell',
  templateUrl: './translate-shell.component.html',
  styleUrls: ['./translate-shell.component.scss']
})
export class TranslateShellComponent implements OnInit {
  count$: any;
  constructor(store: Store<fromRoot.AppState>) {
    this.count$ = store.pipe(select(fromRoot.currentProject));
  }

  ngOnInit() {}
}
