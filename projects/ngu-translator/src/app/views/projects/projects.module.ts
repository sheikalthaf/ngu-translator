import { NgModule } from '@angular/core';

import { AddProjectComponent } from './add-project/add-project.component';
import { SharedModule } from '../../shared/shared.module';
import { TranslationFileStatusComponent } from './translation-file-status/translation-file-status.component';
import { ProjectsComponent } from './projects.component';
import { ProjectsRoutingModule } from './projects.routing';
import { ProjectService } from './projects.service';
import { StoreModule } from '@ngrx/store';
import { SharedCommonModule } from '../shared-common.module';

@NgModule({
  imports: [SharedModule, ProjectsRoutingModule, StoreModule, SharedCommonModule],
  exports: [],
  declarations: [ProjectsComponent, AddProjectComponent, TranslationFileStatusComponent],
  providers: [ProjectService],
  entryComponents: [AddProjectComponent]
})
export class ProjectsModule {}
