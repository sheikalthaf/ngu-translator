import { NgModule } from '@angular/core';

import { AddProjectComponent } from './add-project/add-project.component';
import { SharedModule } from '../../shared/shared.module';
import { TranslationFileStatusComponent } from './translation-file-status/translation-file-status.component';
import { ProjectsComponent } from './projects.component';
import { ProjectsRoutingModule } from './projects.routing';
import { LanguageComponent } from './language/language.component';
import { ProjectService } from './projects.service';
import { StoreModule } from '@ngrx/store';

@NgModule({
  imports: [SharedModule, ProjectsRoutingModule, StoreModule],
  exports: [],
  declarations: [
    ProjectsComponent,
    AddProjectComponent,
    TranslationFileStatusComponent,
    LanguageComponent
  ],
  providers: [ProjectService],
  entryComponents: [AddProjectComponent]
})
export class ProjectsModule {}
