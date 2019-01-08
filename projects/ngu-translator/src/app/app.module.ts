import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material/material.module';
import { HomeComponent } from './views/home/home.component';
import { AppRoutingModule } from './app.routing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BackendServiceAPI } from './shared/services/backend-service-api';
import { BackendLocalStorageService } from './shared/services/backend-local-storage.service';
import { StoreModule } from '@ngrx/store';
import { reducerss } from './store/reducers';
import { EffectsModule } from '@ngrx/effects';
import { TranslationEffect } from './store/translation.effect';
import { ProjectEffect } from '@ngrxstore/reducers/projects.effects';
import { RxiDB } from '@ngrxstore/RxIDB';
import { IdbService } from '@ngrxstore/idb.service';
import { ProjectsModule } from './views/projects/projects.module';
// import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    StoreModule.forRoot(reducerss),
    EffectsModule.forRoot([ProjectEffect, TranslationEffect]),
    // StoreDevtoolsModule.instrument({
    //   maxAge: 2, // Retains last 25 states
    //   logOnly: environment.production // Restrict extension to log-only mode
    // }),
    ProjectsModule
  ],
  providers: [
    { provide: BackendServiceAPI, useClass: BackendLocalStorageService },
    { provide: IdbService, useFactory: () => new RxiDB('ngi18n-store', 1, 'translation') }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
