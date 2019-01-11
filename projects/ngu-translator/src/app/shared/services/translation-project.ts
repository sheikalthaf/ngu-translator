import { TranslationFile } from './translation-file';
import { TranslationFileView } from './translation-file-view';
import { isNullOrUndefined } from 'util';
import { AutoTranslateSummaryReport } from './auto-translate-summary-report';

/**
 * Workflow type determines, how you work with the tool.
 * There are 2 modes:
 * SINGLE_USER: You are developer and translator in one person.
 * You just translate the messages and, when done, reimport it into your application.
 * All translations are marked as state "final" directly after input.
 * WITH_REVIEW: Developer and translator are distinct people.
 * All translation are first marked as "translated".
 * When done, the translator gives it back to the developer, who reviews all marked as "translated".
 * He then can mark them all as "final" or give them back to the translator.
 */
export enum WorkflowType {
  SINGLE_USER,
  WITH_REVIEW
}

/**
 * The role the user has, when working with the tool.
 * As a reviewer you can check the translations and mark them as "final" at the end.
 * As a translator you can translate and give it back to the reviever.
 */
export enum UserRole {
  REVIEWER,
  TRANSLATOR
}

/**
 * A Translation Project.
 * A name and a translation file.
 */
export class TranslationProject {
  id: string;

  translationFileView: TranslationFileView;

  userRole: UserRole;

  autoTranslateSummaryReport: AutoTranslateSummaryReport;

  isReviewModeActive: boolean;

  workflowType: WorkflowType;

  percentageCompleted: number;

  sourceLanguages: string;

  targetLanguages: string;

  translationLength: number;

  /**
   * Create a project from the serialization.
   * @param serializationString
   * @return {TranslationProject}
   */
  static deserializeTest(serializationString: string): TranslationProject {
    const deserializedObject: any = JSON.parse(serializationString);
    const project = new TranslationProject(
      deserializedObject.name,
      TranslationFile.deserialize(deserializedObject.translationFile),
      deserializedObject.workflowType
    );
    project.id = deserializedObject.id;
    project.setUserRole(deserializedObject.userRole);
    return project;
  }

  static deserialize(serializationString: TranslationProject): TranslationProject {
    const deserializedObject: any = serializationString;
    const project = new TranslationProject(
      deserializedObject.name,
      TranslationFile.deserialize(deserializedObject.translationFile),
      deserializedObject.workflowType
    );
    project.id = deserializedObject.id;
    project.setUserRole(deserializedObject.userRole);
    return project;
  }

  constructor(
    public name: string,
    public translationFile: TranslationFile,
    private _workflowType?: WorkflowType
  ) {
    this.setWorkflowType(this._workflowType);
    this.translationFileView = new TranslationFileView(translationFile);
  }

  /**
   * Return a string represenation of project state.
   * This will be stored in BackendService.
   */
  public serializeTest(): string {
    const serializedObject = {
      id: this.id,
      name: this.name,
      selectedFormat: '',
      sourceLanguages: '',
      targetLanguages: '',
      translationLength: 0,
      translationFile: this.translationFile.serialize(),
      workflowType: this.workflowType,
      userRole: this.userRole
    };
    return JSON.stringify(serializedObject);
  }

  public serialize(): any {
    return {
      id: this.id,
      name: this.name,
      percentageCompleted: this.translationFile.percentageTranslated(),
      // selectedFormat: this.selectedFilesFormatted(),
      sourceLanguages: this.translationFile.sourceLanguage(),
      targetLanguages: this.translationFile.targetLanguage(),
      translationLength: this.translationFile.allTransUnits.length,
      translationFile: this.translationFile.serializeTest(),
      workflowType: this.workflowType,
      userRole: this.userRole
    };
  }

  public setWorkflowType(type: WorkflowType) {
    this.workflowType = isNullOrUndefined(type) ? WorkflowType.SINGLE_USER : type;
  }

  public setUserRole(role: UserRole) {
    this.userRole = isNullOrUndefined(role) ? UserRole.TRANSLATOR : role;
    this.isReviewModeActive = this.userRole === UserRole.REVIEWER;
  }

  public hasErrors(): boolean {
    return this.translationFile && this.translationFile.hasErrors();
  }

  public canTranslate(): boolean {
    return this.translationFile && this.translationFile.canTranslate();
  }
}
