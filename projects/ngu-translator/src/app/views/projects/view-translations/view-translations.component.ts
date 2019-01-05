import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Create } from '@ngrxstore/reducers/projects.actions';
import { Store } from '@ngrx/store';
import { MatDialogRef } from '@angular/material';
import { BackendServiceAPI } from '@shared/services/backend-service-api';

@Component({
  selector: 'app-view-translations',
  templateUrl: './view-translations.component.html',
  styleUrls: ['./view-translations.component.scss']
})
export class ViewTranslationsComponent implements OnInit {
  name = new FormControl('');
  constructor(
    private dialogRef: MatDialogRef<ViewTranslationsComponent>,
    private fb: FormBuilder,
    private store: Store<any>,
    private ser: BackendServiceAPI
  ) {}

  ngOnInit() {}

  public addProject(newProject = this.name.value) {
    this.store.dispatch(new Create({ name: newProject, translationIds: [] }));
    // this.translatorService.addProject(newProject);
    // this.translatorService.setCurrentProject(newProject);
    this.dialogRef.close(true);
  }
}
