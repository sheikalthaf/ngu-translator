import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddProjectComponent } from './add-project/add-project.component';
import { ViewTranslationsComponent } from './view-translations/view-translations.component';

@Injectable()
export class ProjectService {
  constructor(public dialog: MatDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(AddProjectComponent, {
      width: '550px',
      data: {}
    });

    return dialogRef.afterClosed();
  }

  viewDialog() {
    const dialogRef = this.dialog.open(ViewTranslationsComponent, {
      width: '550px',
      data: {}
    });

    return dialogRef.afterClosed();
  }
}
