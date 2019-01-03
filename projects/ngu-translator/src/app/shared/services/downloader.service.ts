import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';

@Injectable({ providedIn: 'root' })
export class DownloaderService {
  constructor() {}

  downloadFile(filename: string, content: string, filetype: string) {
    const blob = new Blob([content], { type: filetype });
    FileSaver.saveAs(blob, filename);
  }

  downloadXliffFile(filename: string, content: string) {
    this.downloadFile(filename, content, 'application/xml');
  }
}
