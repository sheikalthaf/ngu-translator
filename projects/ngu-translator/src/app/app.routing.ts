import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsModule } from './views/projects/projects.module';

// const test = () => ProjectsModule;

const routes: Routes = [
  {
    path: '',
    loadChildren: './views/projects/projects.module#ProjectsModule'
  },
  {
    path: 'translate',
    loadChildren: './views/translate/translate.module#TranslateModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {}
