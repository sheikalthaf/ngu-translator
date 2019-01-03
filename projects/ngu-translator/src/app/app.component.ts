import { Component } from '@angular/core';
import { AppUpdateService } from './pwa';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ngu-translator';

  constructor(pwa: AppUpdateService) {
    pwa.activate();
  }
}
