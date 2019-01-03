import { Injectable, Inject, ApplicationRef } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval, concat } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter, first } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AppUpdateService {
  isUpdateAvailable = false;

  constructor(
    private updates: SwUpdate,
    private router: Router,
    private appRef: ApplicationRef,
    @Inject(DOCUMENT) private _document: Document
  ) {}

  activate() {
    console.log('service worker is', this.updates.isEnabled ? 'Enabled' : 'disabled');
    if (!this.updates.isEnabled) return false;

    this.updates.available.subscribe(event => {
      console.log('current version is', event.current);
      console.log('available version is', event.available);
      this.isUpdateAvailable = true;
    });
    this.updates.activated.subscribe(event => {
      console.log('old version was', event.previous);
      console.log('new version is', event.current);
    });
    this.updates.checkForUpdate();
    const appIsStable$ = this.appRef.isStable.pipe(first(x => x));
    const everySixHours$ = interval(6 * 60 * 60 * 1000);
    const everySixHoursAfterAppIsStable$ = concat(appIsStable$, everySixHours$);

    everySixHoursAfterAppIsStable$.subscribe(() => this.updates.checkForUpdate());
    this.update();
  }

  private update() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd && this.isUpdateAvailable))
      .subscribe(() => {
        this.updates.activateUpdate().then(() => this._document.location.reload());
      });
  }
}
