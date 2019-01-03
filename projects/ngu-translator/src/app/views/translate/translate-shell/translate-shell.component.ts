import { Component, OnInit } from '@angular/core';
import { TinyTranslatorService } from '../../../shared/services';

@Component({
  selector: 'app-translate-shell',
  templateUrl: './translate-shell.component.html',
  styleUrls: ['./translate-shell.component.scss']
})
export class TranslateShellComponent implements OnInit {
  constructor(private translate: TinyTranslatorService) {}

  ngOnInit() {
    console.log(this.translate.currentProject());
  }
}
