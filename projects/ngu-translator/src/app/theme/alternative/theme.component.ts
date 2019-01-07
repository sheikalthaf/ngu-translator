import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ThemingService } from './theming.service';

@Component({
  selector: 'theme',
  templateUrl: './theme.component.html'
})
export class ThemeComponent implements OnInit {
  // Defines all possible changeable theming options
  themables = ['--backgroundColor', '--textColor'];

  currentTheme: {};

  constructor(private themingService: ThemingService, private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    // Get current theme colors to initialize the color-picker values a nd update view
    this.themingService.getCssVariables(variables => this.setCurrentTheme(variables));
  }

  updateTheme(themeOption: string, value: any) {
    // Update a single theme color and update view when color was applied
    this.themingService.updateTheme({ [themeOption]: value }, theme => this.setCurrentTheme(theme));
  }

  private setCurrentTheme(theme: {}) {
    this.currentTheme = theme;
    this.changeDetector.markForCheck();
  }
}
