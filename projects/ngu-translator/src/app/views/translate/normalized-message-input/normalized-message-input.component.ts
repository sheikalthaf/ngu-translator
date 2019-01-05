import { Component, EventEmitter, forwardRef, Input, OnDestroy, Output } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { AppState, selectTransUnits } from '@ngrxstore/translation.selectors';
import { IICUMessageCategory, IICUMessageTranslation } from 'ngx-i18nsupport-lib/dist';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { NormalizedMessage } from '../../../shared/services/normalized-message';

const MY_FIELD = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NormalizedMessageInputComponent),
  multi: true
};

/**
 * A component used as an input field for normalized message.
 */
@Component({
  selector: 'app-normalized-message-input',
  templateUrl: './normalized-message-input.component.html',
  styleUrls: ['./normalized-message-input.component.css'],
  providers: [MY_FIELD]
})
export class NormalizedMessageInputComponent implements OnDestroy, ControlValueAccessor {
  /**
   * The message to be edited or shown.
   */
  message: NormalizedMessage;
  @Input() messageType: 'source' | 'target';

  /**
   * Flag, wether the message should be shown in normalized form.
   */
  @Input() normalized: boolean;

  /**
   * Flag, wether message is read only.
   * Then, there is no input field, but only the text is shown.
   */
  @Input() readonly: boolean;

  /**
   * Emitted when user presses Ctrl+Enter
   */
  @Output() accept = new EventEmitter<void>();

  editedMessage: NormalizedMessage;
  form: FormGroup;
  disabled = false;
  current$: Observable<NormalizedMessage>;

  propagateChange = (_: any) => {};

  constructor(private formBuilder: FormBuilder, private store: Store<AppState>) {
    this.initForm();
    this.store
      .pipe(
        select(selectTransUnits),
        untilDestroyed(this)
      )
      .subscribe(e => {
        this.message =
          this.messageType === 'target' ? e.targetContentNormalized() : e.sourceContentNormalized();
        this.oChanges();
      });
  }

  ngOnDestroy() {}

  oChanges() {
    this.editedMessage = this.message.copy();
    this.form.patchValue({
      displayedText: this.textToDisplay(),
      icuMessages: this.initIcuMessagesFormArray()
    });
  }

  undo() {
    this.oChanges();
  }

  private initForm() {
    this.form = this.formBuilder.group({
      displayedText: [{ value: this.textToDisplay(), disabled: this.disabled }],
      icuMessages: this.formBuilder.array(this.initIcuMessagesFormArray())
    });
    this.form.valueChanges
      .pipe(
        debounceTime(200),
        untilDestroyed(this)
      )
      .subscribe(formValue => {
        this.valueChanged(formValue);
      });
  }

  private initIcuMessagesFormArray() {
    if (!this.isICUMessage()) {
      return [];
    }
    return this.getICUMessageCategories().map(category => {
      return [category.getMessageNormalized().asDisplayString()];
    });
  }

  /**
   * Write a new value to the element.
   */
  writeValue(obj: any): void {}

  /**
   * Set the function to be called when the control receives a change event.
   */
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  /**
   * Set the function to be called when the control receives a touch event.
   */
  registerOnTouched(fn: any): void {}

  /**
   * This function is called when the control status changes to or from "DISABLED".
   * Depending on the value, it will enable or disable the appropriate DOM element.
   *
   * @param isDisabled
   */
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.form = this.formBuilder.group({
      displayedText: [{ value: this.textToDisplay(), disabled: this.disabled }]
    });
  }

  /**
   * The text to be shown in the readonly mode.
   * @return {any}
   */
  textToDisplay(): string {
    if (this.editedMessage) {
      return this.editedMessage.dislayText(this.normalized);
    } else {
      return '';
    }
  }

  /**
   * Test, wether it is an ICU message.
   */
  isICUMessage(): boolean {
    if (this.message) {
      return this.message.isICUMessage();
    } else {
      return false;
    }
  }

  /**
   * Get list of categories if it is an ICU Message.
   * @return categories or empty array.
   */
  getICUMessageCategories(): IICUMessageCategory[] {
    if (isNullOrUndefined(this.message)) {
      return [];
    }
    const icuMessage = this.message.getICUMessage();
    if (isNullOrUndefined(icuMessage)) {
      return [];
    }
    return icuMessage.getCategories();
  }

  private valueChanged(value: any) {
    if (!this.readonly && this.message) {
      if (!this.isICUMessage() || !this.normalized) {
        const textEntered = value.displayedText;
        this.editedMessage = this.message.translate(textEntered, this.normalized);
      } else {
        const categories = this.getICUMessageCategories();
        const valuesEntered = value.icuMessages;
        const translation: IICUMessageTranslation = {};
        for (let i = 0; i < value.icuMessages.length; i++) {
          translation[categories[i].getCategory()] = valuesEntered[i];
        }
        this.editedMessage = this.message.translateICUMessage(translation);
      }
    } else {
    }
    this.propagateChange(this.editedMessage);
  }
}
