import { Component } from '@angular/core';
import { AppUpdateService } from './pwa';
import { Store, select } from '@ngrx/store';
import { selectAll } from './store/reducers/projects.selectors';
import { Observable } from 'rxjs';
import { TranslationProject } from '@shared/services';
import { Projectss } from '@ngrxstore/reducers/interface';
import { IdbService } from '@ngrxstore/idb.service';
import { SetCurrentProject } from '@ngrxstore/currentProject/actions';
import { currentProjectId } from '@ngrxstore/currentProject';
import { tap, shareReplay } from 'rxjs/operators';
import { ThemeService } from './theme';
import { ThemingService } from './theme/alternative/theming.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ngu-translator';
  projects$: Observable<Projectss[]>;
  currentProjectId$: Observable<string>;

  constructor(
    pwa: AppUpdateService,
    private store: Store<any>,
    private Idb: IdbService,
    private themeService: ThemeService,
    private themingService: ThemingService
  ) {
    pwa.activate();
    this.projects$ = this.store.pipe(select(selectAll));
    this.currentProjectId$ = this.store.pipe(
      select(currentProjectId),
      tap(e => console.log(e)),
      shareReplay()
    );
    this.themingService.initTheme();
  }

  toggle() {
    const active = this.themeService.getActiveTheme();
    if (active.name === 'light') {
      this.themeService.setTheme('dark');
    } else {
      this.themeService.setTheme('light');
    }
  }

  setCurrentProject(data: Projectss) {
    this.store.dispatch(new SetCurrentProject(data));
  }
}
