import { NgModule } from '@angular/core';
import { TranslateShellComponent } from './translate-shell/translate-shell.component';
import { TranslationUnitsComponent } from './translation-units/translation-units.component';
import { TranslationFormComponent } from './translation-form/translation-form.component';
import { TranslateRoutingModule } from './translate.routing';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [TranslateShellComponent, TranslationUnitsComponent, TranslationFormComponent],
  imports: [SharedModule, TranslateRoutingModule]
})
export class TranslateModule {}
