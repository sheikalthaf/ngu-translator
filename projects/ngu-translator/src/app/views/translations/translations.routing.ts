import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TranslationListComponent } from './translation-list/translation-list.component';

const routes: Routes = [
  {
    path: '',
    component: TranslationListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: []
})
export class TranslationsRoutingModule {}
