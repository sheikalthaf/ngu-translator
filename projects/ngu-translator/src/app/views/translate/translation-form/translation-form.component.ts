import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  SimpleChange,
  OnChanges
} from '@angular/core';
import { TranslationFileView } from '@shared/services/translation-file-view';
import { TranslationUnit } from '@shared/services/translation-unit';
import { WorkflowType, UserRole } from '@shared/services/translation-project';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NormalizedMessage } from '@shared/services/normalized-message';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AutoTranslateServiceAPI } from '@shared/services/auto-translate-service-api';
import { isNullOrUndefined } from 'util';
import { STATE_FINAL, STATE_TRANSLATED } from 'ngx-i18nsupport-lib';
import { Observable, of } from 'rxjs';
import { TranslateUnitWarningConfirmDialogComponent } from '../translate-unit-warning-confirm-dialog/translate-unit-warning-confirm-dialog.component';
import { map, shareReplay } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import * as fromRoot from '@ngrxstore/translation.selectors';
import { AppState } from '@ngrxstore/reducers';

export enum NavigationDirection {
  NEXT,
  PREV,
  STAY
}

export interface TranslateUnitChange {
  changedUnit?: TranslationUnit;
  navigationDirection: NavigationDirection;
}

@Component({
  selector: 'app-translation-form',
  templateUrl: './translation-form.component.html',
  styleUrls: ['./translation-form.component.scss']
})
export class TranslationFormComponent implements OnInit, OnChanges {
  @Input() translationFileView: TranslationFileView;

  @Input() translationUnitClone: TranslationUnit;

  altertranslationUnit: Observable<TranslationUnit>;

  @Input() workflowType: WorkflowType;

  @Input() showNormalized = true;

  @Input() reviewMode = false;

  /**
   * Emitted, when translation is changed and/or the user wants to navigate to next/prev unit.
   * If changedUnit is null, there is no change, but only navigation.
   * @type {EventEmitter<TranslateUnitChange>}
   */
  @Output() changed: EventEmitter<TranslateUnitChange> = new EventEmitter();

  form: FormGroup;

  private _editedTargetMessage: NormalizedMessage;
  private _editableTargetMessage: NormalizedMessage;
  private isMarkedAsTranslated = false;
  private isMarkedAsReviewed = false;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private _snackbar: MatSnackBar,
    private autoTranslateService: AutoTranslateServiceAPI,
    private store: Store<AppState>
  ) {
    this.altertranslationUnit = this.store.pipe(
      select(fromRoot.testSelectedTransUnit),
      map(e => {
        this.translationUnitClone = e.unit;
        // this.translationFileView = e.project;
        // userRole === UserRole.REVIEWER;
        // console.log(this.translationUnit12);
        return this.translationUnitClone;
      })
    );
  }

  ngOnInit() {
    this.initForm();
    this.form.valueChanges.subscribe(formValue => {
      this.valueChanged(formValue);
    });
  }

  private valueChanged(v: any) {
    this._editedTargetMessage = v._editedTargetMessage;
    this.showNormalized = v.showNormalized;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.initForm();
    const changedTranslationUnit: SimpleChange = changes['translationUnit'];
    if (changedTranslationUnit) {
      if (changedTranslationUnit.currentValue) {
        this._editedTargetMessage = changedTranslationUnit.currentValue.targetContentNormalized();
      } else {
        this._editedTargetMessage = null;
      }
      this._editableTargetMessage = null;
    }
  }

  private initForm() {
    if (!this.form) {
      this.form = this.formBuilder.group({
        _editedTargetMessage: [this.editedTargetContentNormalized()],
        showNormalized: [this.showNormalized]
      });
    }
  }

  public transUnitID(): string {
    return this.translationUnitClone.id() || '';
  }

  public targetState(): string {
    return this.translationUnitClone.targetState() || '';
  }

  public targetLanguage(): string {
    return this.translationUnitClone.translationFile().targetLanguage() || '';
  }

  public sourceContent(): string {
    return this.translationUnitClone.sourceContent() || '';
  }

  public sourceContentNormalized(): NormalizedMessage {
    return this.translationUnitClone.sourceContentNormalized() || null;
  }

  public editedTargetContentNormalized(): NormalizedMessage {
    if (isNullOrUndefined(this._editableTargetMessage)) {
      if (this.translationUnitClone) {
        this._editableTargetMessage = this.translationUnitClone.targetContentNormalized();
      }
    }
    return this._editableTargetMessage;
  }

  public sourceLanguage(): string {
    return this.translationUnitClone.translationFile().sourceLanguage() || '';
  }

  public sourceDescription(): string {
    return this.translationUnitClone.description() || '';
  }

  public sourceMeaning(): string {
    return this.translationUnitClone.meaning() || '';
  }

  public sourceRef(): string {
    if (this.translationUnitClone) {
      const refs = this.translationUnitClone.sourceReferences();
      if (refs.length > 0) {
        return refs[0].sourcefile + ':' + refs[0].linenumber;
      }
    } else {
      return null;
    }
  }

  /**
   * Open a snackbar to show source ref
   */
  public showSourceRefInfo() {
    const sourceRefMessage = 'Original message position: ' + this.sourceRef(); // TODO i18n it
    this._snackbar.open(sourceRefMessage, 'OK', { duration: 5000 }); // TODO i18n it
  }

  /**
   * Open a snackbar to show units ID
   */
  public showTransUnitID() {
    const message = 'ID: ' + this.transUnitID();
    this._snackbar.open(message, 'OK', { duration: 5000 });
  }

  errors(): any[] {
    if (!this._editedTargetMessage) return [];

    const errors = this._editedTargetMessage.validate(this.showNormalized);

    return errors ? Object.keys(errors).map(key => errors[key]) : [];
  }

  warnings(): any[] {
    if (!this._editedTargetMessage) return [];

    const errors = this._editedTargetMessage.validateWarnings(this.showNormalized);

    return errors ? Object.keys(errors).map(key => errors[key]) : [];
  }

  commitChanges(navigationDirection: NavigationDirection) {
    if (this.translationUnitClone) {
      if (this.isTranslationChanged() || this.isMarkedAsTranslated || this.isMarkedAsReviewed) {
        this.translationUnitClone.translate(this._editedTargetMessage);
        switch (this.workflowType) {
          case WorkflowType.SINGLE_USER:
            this.translationUnitClone.setTargetState(STATE_FINAL);
            break;
          case WorkflowType.WITH_REVIEW:
            if (this.isMarkedAsReviewed) {
              this.translationUnitClone.setTargetState(STATE_FINAL);
            } else {
              this.translationUnitClone.setTargetState(STATE_TRANSLATED);
            }
            break;
        }
        // this.changed.emit({
        //   changedUnit: this.translationUnitClone,
        //   navigationDirection: navigationDirection
        // });
        this.isMarkedAsTranslated = false;
        this.isMarkedAsReviewed = false;
      } else {
        this.changed.emit({ navigationDirection: navigationDirection });
      }
    }
  }

  public isTranslationChanged(): boolean {
    const original = this.translationUnitClone.targetContent();
    if (isNullOrUndefined(this._editedTargetMessage)) {
      return false;
    }
    return original !== this._editedTargetMessage.nativeString();
  }

  markTranslated() {
    this.openConfirmWarningsDialog().subscribe(result => {
      switch (result) {
        case 'cancel':
          break;
        case 'discard':
          break;
        case 'accept':
          this.isMarkedAsTranslated = true;
          this.commitChanges(NavigationDirection.STAY);
          break;
      }
    });
  }

  undo() {
    this._editableTargetMessage = this.translationUnitClone.targetContentNormalized().copy();
    this._editedTargetMessage = this._editableTargetMessage;
    this.changed.emit({
      changedUnit: this.translationUnitClone,
      navigationDirection: NavigationDirection.STAY
    });
  }

  markReviewed() {
    this.isMarkedAsReviewed = true;
    this.commitChanges(NavigationDirection.STAY);
  }

  /**
   * If there are errors or warnings, open a dialog to conform what to do.
   * There are 3 possible results:
   * 'cancel': do not do anything, stay on this trans unit.
   * 'discard': do not translate, leave transunit unchanged, but go to the next/prev unit.
   * 'accept': translate tu as given, ignoring warnings (errors cannot be ignored).
   * @return {any}
   */
  openConfirmWarningsDialog(): Observable<any> {
    const warnings = this.warnings();
    const errors = this.errors();
    if (warnings.length === 0 && errors.length === 0) {
      // everything good, we don´t need a dialog then.
      return of('accept');
    } else if (!this.isTranslationChanged()) {
      return of('accept');
    } else {
      const dialogRef = this.dialog.open(TranslateUnitWarningConfirmDialogComponent, {
        data: { errors: errors, warnings: warnings },
        disableClose: true
      });
      return dialogRef.afterClosed();
    }
  }

  /**
   * Go to the next trans unit.
   */
  public next() {
    if (this.translationUnitClone) {
      this.openConfirmWarningsDialog().subscribe(result => {
        switch (result) {
          case 'cancel':
            break;
          case 'discard':
            if (this.translationFileView.hasNext()) {
              this.changed.emit({ navigationDirection: NavigationDirection.NEXT });
            }
            break;
          case 'accept':
            const direction = this.translationFileView.hasNext()
              ? NavigationDirection.NEXT
              : NavigationDirection.STAY;
            this.commitChanges(direction);
            break;
        }
      });
    }
  }

  /**
   * Check, wether there is a next trans unit.
   * @return {boolean}
   */
  public hasNext(): boolean {
    if (this.translationUnitClone) {
      return this.translationFileView.hasNext();
    } else {
      return false;
    }
  }

  public prev() {
    if (this.translationUnitClone) {
      this.openConfirmWarningsDialog().subscribe(result => {
        switch (result) {
          case 'cancel':
            break;
          case 'discard':
            if (this.translationFileView.hasPrev()) {
              this.changed.emit({ navigationDirection: NavigationDirection.PREV });
            }
            break;
          case 'accept':
            const direction = this.translationFileView.hasPrev()
              ? NavigationDirection.PREV
              : NavigationDirection.STAY;
            this.commitChanges(direction);
            break;
        }
      });
    }
  }

  public hasPrev(): boolean {
    if (this.translationUnitClone) {
      return this.translationFileView.hasPrev();
    } else {
      return false;
    }
  }

  /**
   * Auto translate this unit using Google Translate.
   */
  autoTranslate() {
    this.sourceContentNormalized()
      .autoTranslateUsingService(
        this.autoTranslateService,
        this.sourceLanguage(),
        this.targetLanguage()
      )
      .subscribe((translatedMessage: NormalizedMessage) => {
        this._editableTargetMessage = translatedMessage;
        this._editedTargetMessage = translatedMessage;
        this.changed.emit({
          changedUnit: this.translationUnitClone,
          navigationDirection: NavigationDirection.STAY
        });
      });
  }

  autoTranslateDisabled(): Observable<boolean> {
    if (!this.translationUnitClone) {
      return of(true);
    }
    return this.autoTranslateService
      .canAutoTranslate(
        this.translationUnitClone.translationFile().sourceLanguage(),
        this.translationUnitClone.translationFile().targetLanguage()
      )
      .pipe(map(val => !val));
  }
}
