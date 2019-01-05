import {
  TranslationMessagesFileFactory,
  ITranslationMessagesFile,
  ITransUnit
} from 'ngx-i18nsupport-lib';
import { isNullOrUndefined } from 'util';
import { TranslationUnit } from './translation-unit';
import { Observable, forkJoin, of, combineLatest } from 'rxjs';
import { AsynchronousFileReaderResult } from './asynchronous-file-reader.service';
import {
  FILETYPE_XTB,
  FORMAT_XMB,
  IICUMessage,
  IICUMessageTranslation,
  INormalizedMessage
} from 'ngx-i18nsupport-lib/dist';
import { AutoTranslateServiceAPI } from './auto-translate-service-api';
// import { NormalizedMessage } from './normalized-message';
import { AutoTranslateSummaryReport } from './auto-translate-summary-report';
import { AutoTranslateResult } from './auto-translate-result';
import { map, catchError } from 'rxjs/operators';

/**
 * A single xlf or xmb file ready for work.
 * This is a wrapper around ITranslationMessagesFile.
 * It can read from uploaded files and adds errorhandling.
 * Created by roobm on 22.03.2017.
 */

// internal representation of serialized form.
interface ISerializedTranslationFile {
  name: string;
  size: number;
  fileContent: string;
  editedContent: string;
  masterContent: string;
  masterName: string;
  explicitSourceLanguage: string;
}

export class TranslationFile {
  private _name: string;

  private _size: number;

  private _error: string = null;

  private fileContent: string;

  private masterContent: string;

  private _masterName: string;

  private _translationFile: ITranslationMessagesFile;

  private _explicitSourceLanguage: string;

  /**
   * all TransUnits read from file.
   */
  private _allTransUnits: TranslationUnit[];

  static fromUploadedFile(
    readingUploadedFile: Observable<AsynchronousFileReaderResult>,
    readingMasterXmbFile?: Observable<AsynchronousFileReaderResult>
  ): Observable<TranslationFile> {
    return combineLatest(readingUploadedFile, readingMasterXmbFile).pipe(
      map(contentArray => {
        const fileContent: AsynchronousFileReaderResult = contentArray[0];
        const newInstance = new TranslationFile();
        newInstance._name = fileContent.name;
        newInstance._size = fileContent.size;
        if (fileContent.content) {
          const masterXmbContent: AsynchronousFileReaderResult = contentArray[1];
          try {
            newInstance.fileContent = fileContent.content;
            let optionalMaster: any = null;
            if (masterXmbContent && masterXmbContent.content) {
              optionalMaster = {
                path: masterXmbContent.name,
                xmlContent: masterXmbContent.content,
                encoding: null
              };
              newInstance.masterContent = masterXmbContent.content;
              newInstance._masterName = masterXmbContent.name;
            }
            newInstance._translationFile = TranslationMessagesFileFactory.fromUnknownFormatFileContent(
              fileContent.content,
              fileContent.name,
              null,
              optionalMaster
            );
            if (newInstance._translationFile.i18nFormat() === FORMAT_XMB) {
              newInstance._error = 'xmb files cannot be translated, use xtb instead'; // TODO i18n
            }
            newInstance.readTransUnits();
          } catch (err) {
            newInstance._error = err.toString();
          }
        }
        return newInstance;
      })
    );
  }

  /**
   * Create a translation file from the serialization.
   * @param serializationString
   * @return {TranslationFile}
   */
  static deserialize(serializationString: string): TranslationFile {
    const deserializedObject: ISerializedTranslationFile = <ISerializedTranslationFile>(
      JSON.parse(serializationString)
    );
    return TranslationFile.fromDeserializedObject(deserializedObject);
  }

  static fromDeserializedObject(deserializedObject: ISerializedTranslationFile): TranslationFile {
    const newInstance = new TranslationFile();
    newInstance._name = deserializedObject.name;
    newInstance._size = deserializedObject.size;
    newInstance.fileContent = deserializedObject.fileContent;
    newInstance._explicitSourceLanguage = deserializedObject.explicitSourceLanguage;
    try {
      const encoding = null; // unknown, lib can find it
      let optionalMaster: { xmlContent: string; path: string; encoding: string } = null;
      if (deserializedObject.masterContent) {
        optionalMaster = {
          xmlContent: deserializedObject.masterContent,
          path: deserializedObject.masterName,
          encoding: encoding
        };
        newInstance._masterName = deserializedObject.masterName;
      }
      newInstance._translationFile = TranslationMessagesFileFactory.fromUnknownFormatFileContent(
        deserializedObject.editedContent,
        deserializedObject.name,
        encoding,
        optionalMaster
      );
      newInstance.readTransUnits();
    } catch (err) {
      newInstance._error = err.toString();
    }
    return newInstance;
  }

  constructor() {
    this._allTransUnits = [];
  }

  private readTransUnits() {
    this._allTransUnits = [];
    if (this._translationFile) {
      this._translationFile.forEachTransUnit((tu: ITransUnit) => {
        this._allTransUnits.push(new TranslationUnit(this, tu));
      });
    }
  }

  get name(): string {
    return this._name;
  }

  /**
   * In case of xmb/xtb the name of the master xmb file.
   * @return {string}
   */
  get masterName(): string {
    return this._masterName;
  }

  get size(): number {
    return this._size;
  }

  get numberOfTransUnits(): number {
    return this._allTransUnits.length;
  }

  get numberOfUntranslatedTransUnits(): number {
    return this._translationFile ? this._translationFile.numberOfUntranslatedTransUnits() : 0;
  }

  /**
   * Type of file.
   * Currently 'xlf', 'xlf2', 'xmb' or or 'xtb'
   * @return {null}
   */
  public fileType(): string {
    if (this._translationFile) {
      return this._translationFile.fileType();
    } else {
      // try to get it by name
      if (this._name && this._name.endsWith('xtb')) {
        return FILETYPE_XTB;
      } else {
        return null;
      }
    }
  }

  /**
   * Source language as stored in translation file.
   * @return {string}
   */
  public sourceLanguageFromFile(): string {
    return this._translationFile ? this._translationFile.sourceLanguage() : 'unknown';
  }

  /**
   * Source language from file or explicitly set.
   * @return {any}
   */
  public sourceLanguage(): string {
    if (this._translationFile) {
      const srcLang = this._translationFile.sourceLanguage();
      if (isNullOrUndefined(srcLang)) {
        return this._explicitSourceLanguage ? this._explicitSourceLanguage : '';
      } else {
        return srcLang;
      }
    } else {
      return '';
    }
  }

  /**
   * Explicitly set source language.
   * Only used, when file format does not store this (xmb case).
   * @param srcLang
   */
  public setSourceLanguage(srcLang: string) {
    this._explicitSourceLanguage = srcLang;
  }

  public targetLanguage(): string {
    return this._translationFile ? this._translationFile.targetLanguage() : '';
  }

  public percentageUntranslated(): number {
    if (this.numberOfTransUnits === 0) {
      return 0;
    }
    return (100 * this.numberOfUntranslatedTransUnits) / this.numberOfTransUnits;
  }

  public percentageTranslated(): number {
    return 100 - this.percentageUntranslated();
  }

  public hasErrors(): boolean {
    return !isNullOrUndefined(this._error);
  }

  public canTranslate(): boolean {
    return !this.hasErrors() && this.numberOfTransUnits > 0;
  }

  get error(): string {
    return this._error;
  }

  /**
   * Show warnings detected in file.
   * @return {string[]|Array}
   */
  public warnings(): string[] {
    return this._translationFile ? this._translationFile.warnings() : [];
  }

  /**
   * Check, wether file is changed.
   * @return {boolean}
   */
  public isDirty(): boolean {
    return this._translationFile && this.fileContent !== this.editedContent();
  }

  /**
   * return content with all changes.
   */
  public editedContent(): string {
    if (this._translationFile) {
      return this._translationFile.editedContent();
    } else {
      this._error = 'cannot save, no valid file';
    }
  }

  /**
   * Mark file as "exported".
   * This means, that the file was downloaded.
   * So the new fileConted is the edited one.
   */
  public markExported() {
    this.fileContent = this.editedContent();
  }

  /**
   * Return all trans units found in file.
   * @return {TranslationUnit[]}
   */
  public allTransUnits(): TranslationUnit[] {
    return this._allTransUnits;
  }

  /**
   * Return a string represenation of translation file content.
   * This will be stored in BackendService.
   */
  public serialize(): string {
    const serializedObject: ISerializedTranslationFile = {
      name: this.name,
      size: this.size,
      fileContent: this.fileContent,
      editedContent: this.editedContent(),
      masterContent: this.masterContent,
      masterName: this._masterName,
      explicitSourceLanguage: this._explicitSourceLanguage
    };
    return JSON.stringify(serializedObject);
  }

  public serializeTest(): any {
    const serializedObject: ISerializedTranslationFile = {
      name: this.name,
      size: this.size,
      fileContent: this.fileContent,
      editedContent: this.editedContent(),
      masterContent: this.masterContent,
      masterName: this._masterName,
      explicitSourceLanguage: this._explicitSourceLanguage
    };
    return serializedObject;
  }

  /**
   * Auto translate this file via Google Translate.
   * Translates all untranslated units.
   * @param autoTranslateService the service for the raw text translation via Google Translate
   * @return a summary of the run (how many units are handled, how many sucessful, errors, ..)
   */
  public autoTranslateUsingService(
    autoTranslateService: AutoTranslateServiceAPI
  ): Observable<AutoTranslateSummaryReport> {
    return forkJoin([
      this.doAutoTranslateNonICUMessages(autoTranslateService),
      ...this.doAutoTranslateICUMessages(autoTranslateService)
    ]).pipe(
      map((summaries: AutoTranslateSummaryReport[]) => {
        const summary = summaries[0];
        for (let i = 1; i < summaries.length; i++) {
          summary.merge(summaries[i]);
        }
        return summary;
      })
    );
  }

  /**
   * Auto translate this file via Google Translate.
   * Translates all untranslated units.
   * @param autoTranslateService the service for the raw text translation via Google Translate
   * @return a summary of the run (how many units are handled, how many sucessful, errors, ..)
   */
  private doAutoTranslateNonICUMessages(
    autoTranslateService: AutoTranslateServiceAPI
  ): Observable<AutoTranslateSummaryReport> {
    // collect all units, that should be auto translated
    const allUntranslated: TranslationUnit[] = this.allTransUnits().filter(
      tu => !tu.isTranslated()
    );
    const allTranslatable = allUntranslated.filter(
      tu => !tu.sourceContentNormalized().isICUMessage()
    );
    const allMessages: string[] = allTranslatable.map(tu => {
      return tu.sourceContentNormalized().dislayText(true);
    });
    return autoTranslateService
      .translateMultipleStrings(allMessages, this.sourceLanguage(), this.targetLanguage())
      .pipe(
        map((translations: string[]) => {
          const summary = new AutoTranslateSummaryReport();
          for (let i = 0; i < translations.length; i++) {
            const tu = allTranslatable[i];
            const translationText = translations[i];
            const result = tu.autoTranslateNonICUUnit(translationText);
            summary.addSingleResult(result);
          }
          return summary;
        })
      );
  }

  private doAutoTranslateICUMessages(
    autoTranslateService: AutoTranslateServiceAPI
  ): Observable<AutoTranslateSummaryReport>[] {
    // collect all units, that should be auto translated
    const allUntranslated: TranslationUnit[] = this.allTransUnits().filter(
      tu => !tu.isTranslated()
    );
    const allTranslatableICU = allUntranslated.filter(
      tu => !isNullOrUndefined(tu.sourceContentNormalized().getICUMessage())
    );
    return allTranslatableICU.map(tu => {
      return this.doAutoTranslateICUMessage(autoTranslateService, tu);
    });
  }

  /**
   * Translate single ICU Messages.
   * @param autoTranslateService
   * @param tu transunit to translate (must contain ICU Message)
   * @return {Observable<AutoTranslateSummaryReport>}
   */
  private doAutoTranslateICUMessage(
    autoTranslateService: AutoTranslateServiceAPI,
    tu: TranslationUnit
  ): Observable<AutoTranslateSummaryReport> {
    const icuMessage: IICUMessage = tu.sourceContentNormalized().getICUMessage();
    const categories = icuMessage.getCategories();
    // check for nested ICUs, we do not support that
    if (
      categories.find(
        category => !isNullOrUndefined(category.getMessageNormalized().getICUMessage())
      )
    ) {
      const summary = new AutoTranslateSummaryReport();
      summary.addSingleResult(AutoTranslateResult.Ignored(tu, 'nested icu message'));
      return of(summary);
    }
    const allMessages: string[] = categories.map(category =>
      category.getMessageNormalized().asDisplayString()
    );
    return autoTranslateService
      .translateMultipleStrings(allMessages, this.sourceLanguage(), this.targetLanguage())
      .pipe(
        map((translations: string[]) => {
          const summary = new AutoTranslateSummaryReport();
          const icuTranslation: IICUMessageTranslation = {};
          for (let i = 0; i < translations.length; i++) {
            const translationText = translations[i];
            icuTranslation[categories[i].getCategory()] = translationText;
          }
          const result = tu.autoTranslateICUUnit(icuTranslation);
          summary.addSingleResult(result);
          return summary;
        }),
        catchError(err => {
          const failSummary = new AutoTranslateSummaryReport();
          failSummary.addSingleResult(AutoTranslateResult.Failed(tu, err.message));
          return of(failSummary);
        })
      );
  }
}
