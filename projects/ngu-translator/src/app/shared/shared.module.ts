import { NgModule } from '@angular/core';
import { MaterialModule } from './material';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbbreviatePipe } from './pipes';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule, AbbreviatePipe],
  declarations: [AbbreviatePipe],
  providers: []
})
export class SharedModule {}
