import { Component } from '@angular/core';
import { upload, UploadResponse } from '@imagekit/angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ImageKit.io Angular SDK Demo';
  uploadStatus: string | null = null;
  uploadProgress: number | null = null;
  uploadedImageUrl: string | null = null;
  selectedFile: File | null = null;
  isUploading: boolean = false;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadStatus = `Selected: ${file.name}`;
      this.uploadProgress = null;
      this.uploadedImageUrl = null;
    }
  }

  async uploadFile() {
    if (!this.selectedFile) {
      return;
    }

    this.isUploading = true;
    this.uploadStatus = 'Starting upload...';
    this.uploadProgress = 0;

    try {
      // Get authentication parameters from backend
      const authResponse = await fetch('http://localhost:3000/auth');
      if (!authResponse.ok) {
        throw new Error(`Authentication failed: ${authResponse.statusText}`);
      }
      const authData = await authResponse.json();

      const result = await upload({
        file: this.selectedFile,
        fileName: this.selectedFile.name,
        publicKey: authData.publicKey,
        signature: authData.signature,
        expire: authData.expire,
        token: authData.token,
        useUniqueFileName: true,
        tags: ['angular-demo'],
        folder: '/angular-uploads',
        onProgress: (event: ProgressEvent) => {
          if (event.lengthComputable) {
            this.uploadProgress = Math.round((event.loaded / event.total) * 100);
            this.uploadStatus = `Uploading... ${this.uploadProgress}%`;
          }
        }
      }) as UploadResponse;

      this.uploadStatus = 'Upload completed successfully!';
      this.uploadProgress = 100;
      this.uploadedImageUrl = result.url || null;
      console.log('Upload success:', result);
    } catch (error: any) {
      console.error('Upload error:', error);
      this.uploadStatus = `Upload failed: ${error.message || 'Unknown error'}`;
      this.uploadProgress = null;
    } finally {
      this.isUploading = false;
    }
  }
}
