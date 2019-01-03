import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateShellComponent } from './translate-shell/translate-shell.component';
import { TranslationUnitsComponent } from './translation-units/translation-units.component';
import { TranslationFormComponent } from './translation-form/translation-form.component';
import { TranslateRoutingModule } from './translate.routing';

@NgModule({
  declarations: [
    TranslateShellComponent,
    TranslationUnitsComponent,
    TranslationFormComponent
  ],
  imports: [CommonModule, TranslateRoutingModule]
})
export class TranslateModule {}
