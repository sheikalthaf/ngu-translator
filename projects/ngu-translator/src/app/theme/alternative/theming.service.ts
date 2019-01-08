import { Injectable } from '@angular/core';
import cssVars from 'css-vars-ponyfill';

/**
 * Service that handles dynamic theming throughout the application.
 * Uses cssVars to polyfill IE11 as it does not support plain CSS variables
 */
@Injectable({ providedIn: 'root' })
export class ThemingService {
  /**
   * Initialize CSS Variables and apply default styles if they were set by any stylesheet already
   * @param completeCallback Callback when variables were successfully applied
   */
  initTheme(completeCallback?: (variables: {}) => void) {
    cssVars({
      onlyLegacy: false,
      updateDOM: true,
      onComplete: (a, b, variables) => completeCallback && completeCallback(variables)
    });
  }

  /**
   * Change single or multiple css variabels
   * @param changedTheme Object where each key is the theming option name (e.g. --background)
   * and it will get assigned it's value
   * @param completeCallback Callback when variables were successfully updated
   */
  updateTheme(
    changedTheme: { [themeOption: string]: any },
    completeCallback?: (variables: {}) => void
  ) {
    this.setCssVariables(
      changedTheme,
      variables => completeCallback && completeCallback(variables)
    );
  }

  /**
   * Get all current active CSS variables without affecting the DOM
   * @param completeCallback Callback with the variables as parameter (eg. { --background: '#fff' }
   */
  getCssVariables(completeCallback?: (variables: {}) => void) {
    cssVars({
      onlyLegacy: false,
      updateDOM: false,
      onComplete: (a, b, variables) => completeCallback && completeCallback(variables)
    });
  }

  /**
   * Apply all CSS variables. Old variables are either overwritten or removed
   * @param variables All CSS variables that should be applied
   * @param completeCallback Callback with all applied variables
   */
  private setCssVariables(variables: {}, completeCallback?: (variables: {}) => void) {
    cssVars({
      onlyLegacy: false,
      variables: variables,
      onComplete: (a, b, variabls) => completeCallback && completeCallback(variabls)
    });
  }
}
