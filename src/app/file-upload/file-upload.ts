import { Component, inject } from '@angular/core';
import { FileUploadService } from '../file-upload.service';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  templateUrl: './file-upload.html'
})
export class FileUploadComponent {
  private fileUploadService = inject(FileUploadService);

  selectedFile: File | null = null;
  uploadMessage = '';

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadMessage = '';
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      this.uploadMessage = 'Please select a file';
      return;
    }

    this.fileUploadService.uploadFile(this.selectedFile).subscribe({
      next: () => {
        this.uploadMessage = 'File uploaded successfully';
        this.selectedFile = null;
      },
      error: () => {
        this.uploadMessage = 'File upload failed';
      }
    });
  }

  fileName = 'employee-report.pdf';
  downloading = false;

  downloadFile(): void {
    this.downloading = true;

    this.fileUploadService.downloadFile(this.fileName).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);

        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = this.fileName;
        anchor.click();

        window.URL.revokeObjectURL(url);
        this.downloading = false;
      },
      error: (error) => {
        console.error('File download failed', error);
        this.downloading = false;
      }
    });
  }
}