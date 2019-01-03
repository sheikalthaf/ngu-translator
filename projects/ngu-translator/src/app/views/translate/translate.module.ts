import { NgModule } from '@angular/core';
import { TranslateShellComponent } from './translate-shell/translate-shell.component';
import { TranslationUnitsComponent } from './translation-units/translation-units.component';
import { TranslationFormComponent } from './translation-form/translation-form.component';
import { TranslateRoutingModule } from './translate.routing';
import { SharedModule } from '../../shared/shared.module';
import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [TranslateShellComponent, TranslationUnitsComponent, TranslationFormComponent],
  imports: [SharedModule, TranslateRoutingModule, StoreModule]
})
export class TranslateModule {}
