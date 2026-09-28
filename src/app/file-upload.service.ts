import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/files';

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiUrl + '/upload', formData);
  }

  downloadFile(fileName: string): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/download/${fileName}`,
      { responseType: 'blob' }
    );
  }
}


// File Upload
// “In Angular, I handle file uploads using an HTML file input and the File API. 
// I store the selected File object, create a FormData object, append the file to it, and send it to the backend using HttpClient. 
// The backend typically receives it as multipart/form-data.”


// File downloads
// File downloads in Angular are handled by calling the API using HttpClient with responseType: 'blob'. Once the Blob is received, a temporary object URL is created using URL.createObjectURL(), an anchor element is created with the download filename, the click is triggered programmatically, and then the object URL is revoked to release browser resources.

// “For file downloads in Angular, I call the API using HttpClient with responseType: 'blob'. 
// Once I receive the Blob, I create a temporary object URL using URL.createObjectURL(), 
// create an anchor element with the download filename, trigger the click programmatically,
// and then revoke the object URL to release browser resources.”


// | File Upload           | File Download             |
// | --------------------- | ------------------------- |
// | `FormData`            | `Blob`                    |
// | `POST`                | Usually `GET`             |
// | `formData.append()`   | `responseType: 'blob'`    |
// | Sends file to server  | Receives file from server |
// | `multipart/form-data` | Binary response           |


// Upload: File → FormData → POST
// Download: GET → Blob → Object URL → Download