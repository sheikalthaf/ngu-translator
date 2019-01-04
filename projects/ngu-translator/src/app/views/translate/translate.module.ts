import { NgModule } from '@angular/core';
import { TranslateShellComponent } from './translate-shell/translate-shell.component';
import { TranslationUnitsComponent } from './translation-units/translation-units.component';
import { TranslationFormComponent } from './translation-form/translation-form.component';
import { TranslateRoutingModule } from './translate.routing';
import { SharedModule } from '../../shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { NormalizedMessageInputComponent } from './normalized-message-input/normalized-message-input.component';
import { TranslateUnitWarningConfirmDialogComponent } from './translate-unit-warning-confirm-dialog/translate-unit-warning-confirm-dialog.component';
import { SharedCommonModule } from '../shared-common.module';

@NgModule({
  imports: [SharedModule, TranslateRoutingModule, StoreModule, SharedCommonModule],
  declarations: [
    TranslateShellComponent,
    TranslationUnitsComponent,
    TranslationFormComponent,

    NormalizedMessageInputComponent,
    TranslateUnitWarningConfirmDialogComponent
  ],
  entryComponents: [TranslateUnitWarningConfirmDialogComponent]
})
export class TranslateModule {}
