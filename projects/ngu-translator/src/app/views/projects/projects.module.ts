import { NgModule } from '@angular/core';

import { AddProjectComponent } from './add-project/add-project.component';
import { SharedModule } from '../../shared/shared.module';
import { ProjectsComponent } from './projects.component';
import { ProjectsRoutingModule } from './projects.routing';
import { ProjectService } from './projects.service';
import { StoreModule } from '@ngrx/store';
import { SharedCommonModule } from '../shared-common.module';
import { ViewTranslationsComponent } from './view-translations/view-translations.component';

@NgModule({
  imports: [SharedModule, StoreModule, SharedCommonModule],
  exports: [ProjectsComponent],
  declarations: [ProjectsComponent, AddProjectComponent, ViewTranslationsComponent],
  providers: [ProjectService],
  entryComponents: [AddProjectComponent, ViewTranslationsComponent]
})
export class ProjectsModule {}
