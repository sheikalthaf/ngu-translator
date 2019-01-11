import { DOCUMENT } from '@angular/common';
import { EventEmitter, Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import cssVars from 'css-vars-ponyfill';
import { ACTIVE_THEME, Theme, THEMES } from './symbols';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  themeChange = new EventEmitter<Theme>();
  renderer: Renderer2;

  constructor(
    @Inject(THEMES) public themes: Theme[],
    @Inject(ACTIVE_THEME) public theme: string,
    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private _document: Document
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    const active = this.getActiveTheme();
    if (active) {
      this.updateTheme1(active);
    }
  }

  getTheme(name: string) {
    const theme = this.themes.find(t => t.name === name);
    if (!theme) {
      throw new Error(`Theme not found: '${name}'`);
    }
    return theme;
  }

  getActiveTheme() {
    return this.getTheme(this.theme);
  }

  getProperty(propName: string) {
    return this.getActiveTheme().properties[propName];
  }

  setTheme(name: string) {
    this.theme = name;
    this.themeChange.emit(this.getActiveTheme());
  }

  registerTheme(theme: Theme) {
    this.themes.push(theme);
  }

  updateTheme(name: string, properties: { [key: string]: string }) {
    const theme = this.getTheme(name);
    theme.properties = {
      ...theme.properties,
      ...properties
    };

    if (name === this.theme) {
      this.themeChange.emit(theme);
    }
  }

  updateTheme1(theme: Theme, element = this._document.body) {
    cssVars({
      rootElement: element,
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
    this.renderer.removeClass(element, `${this.theme}-theme`);

    // alias element with theme name
    this.renderer.addClass(element, `${theme.name}-theme`);
  }
}
