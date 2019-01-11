import { Directive, OnInit, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { ThemeService } from './theme.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Theme } from './symbols';
import cssVars from 'css-vars-ponyfill';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[theme]'
})
export class ThemeDirective implements OnInit, OnDestroy {
  private _destroy$ = new Subject();

  constructor(
    private _elementRef: ElementRef,
    private _themeService: ThemeService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    // const active = this._themeService.getActiveTheme();
    // if (active) {
    //   this.updateTheme(active);
    // }
    // this._themeService.themeChange
    //   .pipe(takeUntil(this._destroy$))
    //   .subscribe(theme => this.updateTheme(theme));
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  updateTheme(theme: Theme) {
    cssVars({
      rootElement: this._elementRef.nativeElement,
      onlyLegacy: false,
      variables: theme.properties,
      onComplete: (a, b, variables) => {}
    });
    // project properties onto the element
    // tslint:disable-next-line:forin
    for (const key in theme.properties) {
      // this._elementRef.nativeElement.style.setProperty(key, theme.properties[key]);
    }

    // remove old theme
    this.renderer.removeClass(this._elementRef.nativeElement, `${this._themeService.theme}-theme`);

    // alias element with theme name
    this.renderer.addClass(this._elementRef.nativeElement, `${theme.name}-theme`);
  }
}
