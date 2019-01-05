import { NgModule } from '@angular/core';
import { TranslationListComponent } from './translation-list/translation-list.component';
import { SharedModule } from '@shared/shared.module';
import { TranslationFileStatusComponent } from './translation-file-status/translation-file-status.component';
import { TranslationsRoutingModule } from './translations.routing';
import { SharedCommonModule } from '../shared-common.module';

@NgModule({
  imports: [SharedModule, TranslationsRoutingModule, SharedCommonModule],
  declarations: [TranslationListComponent, TranslationFileStatusComponent]
})
export class TranslationsModule {}
