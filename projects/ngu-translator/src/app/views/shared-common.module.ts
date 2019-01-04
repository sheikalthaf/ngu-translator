import { NgModule } from '@angular/core';
import { LanguageComponent } from './language/language.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [SharedModule],
  exports: [LanguageComponent],
  declarations: [LanguageComponent],
  providers: []
})
export class SharedCommonModule {}
