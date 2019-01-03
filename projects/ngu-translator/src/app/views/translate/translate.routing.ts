import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TranslateShellComponent } from './translate-shell/translate-shell.component';

const routes: Routes = [
  {
    path: '',
    component: TranslateShellComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: []
})
export class TranslateRoutingModule {}
