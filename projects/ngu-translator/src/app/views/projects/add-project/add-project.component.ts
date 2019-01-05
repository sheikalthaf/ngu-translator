import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserRole, WorkflowType, TranslationProject } from '@shared/services/translation-project';
import { FILETYPE_XTB } from 'ngx-i18nsupport-lib';
import { isNullOrUndefined } from 'util';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { TinyTranslatorService } from '@shared/services/translation';
import { AppState } from '@ngrxstore/reducers';
import { Create } from '@ngrxstore/reducers/projects.actions';
import { AddTranslations } from '@ngrxstore/translations/actions';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit {
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onAddProject = new EventEmitter<TranslationProject>();

  createdProject: TranslationProject;

  form: FormGroup;
  private selectedFiles: FileList;
  private selectedMasterXmbFiles: FileList;

  constructor(
    public dialogRef: MatDialogRef<AddProjectComponent>,
    private formBuilder: FormBuilder,
    private translatorService: TinyTranslatorService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.initForm();
    this.form.valueChanges.subscribe(formValue => {
      this.valueChanged(formValue);
    });
  }

  private initForm() {
    if (!this.form) {
      this.form = this.formBuilder.group({
        projectName: [''],
        workflowType: ['singleuser'],
        userRole: ['translator'],
        selectedFiles: [''],
        selectedMasterXmbFiles: [''],
        sourceLanguage: ['']
      });
    }
  }

  fileSelectionChange(input: HTMLInputElement) {
    this.selectedFiles = input.files;
    this.valueChanged(this.form.value);
  }

  masterXmlFileSelectionChange(input: HTMLInputElement) {
    this.selectedMasterXmbFiles = input.files;
    this.valueChanged(this.form.value);
  }

  valueChanged(formValue) {
    const translationFile = this.selectedFiles ? this.selectedFiles.item(0) : null;
    const masterXmbFile = this.selectedMasterXmbFiles ? this.selectedMasterXmbFiles.item(0) : null;
    this.translatorService
      .createProject(
        formValue.projectName,
        translationFile,
        masterXmbFile,
        this.toWorkflowType(formValue.workflowType)
      )
      .subscribe(newProject => {
        this.createdProject = newProject;
        if (this.createdProject) {
          this.createdProject.setUserRole(this.toUserRole(formValue.userRole));
          if (this.createdProject.translationFile) {
            this.createdProject.translationFile.setSourceLanguage(formValue.sourceLanguage);
          }
        }
      });
  }

  /**
   * Convert string type from form to enum.
   * @param type
   * @return {any}
   */
  toWorkflowType(type: string): WorkflowType {
    switch (type) {
      case 'singleuser':
        return WorkflowType.SINGLE_USER;
      case 'withReview':
        return WorkflowType.WITH_REVIEW;
      default:
        return null;
    }
  }

  /**
   * Convert string type from form to enum.
   * @param type
   * @return {any}
   */
  toUserRole(role: string): UserRole {
    switch (role) {
      case 'translator':
        return UserRole.TRANSLATOR;
      case 'reviewer':
        return UserRole.REVIEWER;
      default:
        return null;
    }
  }

  public addProject(newProject = this.createdProject) {
    this.store.dispatch(new AddTranslations(newProject));
    // this.translatorService.addProject(newProject);
    // this.translatorService.setCurrentProject(newProject);
    this.dialogRef.close(true);
  }

  selectedFilesFormatted(): string {
    return this.fileListFormatted(this.selectedFiles);
  }

  selectedMasterFilesFormatted(): string {
    return this.fileListFormatted(this.selectedMasterXmbFiles);
  }

  private fileListFormatted(fileList: FileList): string {
    if (fileList) {
      let result = '';
      for (let i = 0; i < fileList.length; i++) {
        if (i > 0) {
          result = result + ', ';
        }
        result = result + fileList.item(i).name;
      }
      return result;
    } else {
      return '';
    }
  }

  /**
   * If the first file was a xmb file, master is needed.
   * Enables the input for a second file, the master xmb.
   */
  isMasterXmbFileNeeded(): boolean {
    return (
      this.isFileSelected() &&
      this.createdProject &&
      this.createdProject.translationFile &&
      this.createdProject.translationFile.fileType() === FILETYPE_XTB
    );
  }

  /**
   * Check, wether all needed is typed in.
   * Enables the add button.
   */
  isInputComplete(): boolean {
    return (
      this.createdProject &&
      this.createdProject.name &&
      !this.createdProject.hasErrors() &&
      this.isFileSelected()
    );
  }

  isFileSelected(): boolean {
    return this.selectedFiles && this.selectedFiles.length > 0 && !!this.createdProject;
  }

  needsExplicitSourceLanguage(): boolean {
    return (
      this.createdProject &&
      this.createdProject.translationFile &&
      !this.createdProject.translationFile.hasErrors() &&
      isNullOrUndefined(this.createdProject.translationFile.sourceLanguageFromFile())
    );
  }

  isWorkflowWithReview(): boolean {
    return this.createdProject && this.createdProject.workflowType === WorkflowType.WITH_REVIEW;
  }
}
