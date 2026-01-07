import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageKitService } from '@imagekit/angular';

interface UploadResult {
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}

@Component({
  selector: 'app-upload-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="upload-container">
      <h2>ImageKit Upload Test</h2>
      
      <div class="credentials-section">
        <h3>SDK Credentials (Component Level)</h3>
        <div class="form-group">
          <label for="urlEndpoint">URL Endpoint:</label>
          <input 
            id="urlEndpoint"
            type="text" 
            [(ngModel)]="credentials.urlEndpoint" 
            placeholder="https://ik.imagekit.io/your_imagekit_id"
            class="input-field"
          />
        </div>
        
        <div class="form-group">
          <label for="publicKey">Public Key:</label>
          <input 
            id="publicKey"
            type="text" 
            [(ngModel)]="credentials.publicKey" 
            placeholder="public_xyz..."
            class="input-field"
          />
        </div>
        
        <input type="radio" name="authentication" value="authenticationServer" [(ngModel)]="authenticationType"> Authentication
        <input type="radio" name="authentication" value="signature" [(ngModel)]="authenticationType"> Signature

        <div class="form-group">
        <div *ngIf="authenticationType === 'authenticationServer'">
          <label for="authEndpoint">Authentication Endpoint:</label>
          <input 
            id="authEndpoint"
            type="text" 
            [(ngModel)]="credentials.authenticationEndpoint" 
            placeholder="https://your-backend.com/auth"
            class="input-field"
          />
</div>
<div *ngIf="authenticationType === 'signature'">
           <label for="signature">Signature:</label>
          <input 
            id="signature"
            type="text" 
            [(ngModel)]="credentials.signature" 
            placeholder="generated_signature"
            class="input-field"
          />


           <label for="token">Token:</label>
          <input 
            id="token"
            type="text" 
            [(ngModel)]="credentials.token" 
            placeholder="generated_token"
            class="input-field"
          />


           <label for="expire">Expire:</label>
          <input 
            id="expire"
            type="text" 
            [(ngModel)]="credentials.expire" 
            placeholder="generated_expiry"
            class="input-field"
          />
          <small class="help-text">Use IK SDK to generate token and expiry</small>
          </div>
        </div>
      </div>

      <div class="upload-section">
        <h3>Upload Settings</h3>
        
        <div class="form-group">
          <label for="fileName">File Name (optional):</label>
          <input 
            id="fileName"
            type="text" 
            [(ngModel)]="uploadSettings.fileName" 
            placeholder="my-image.jpg"
            class="input-field"
          />
          <small class="help-text">Leave empty to use original file name</small>
        </div>
        
        <div class="form-group">
          <label for="folder">Folder (optional):</label>
          <input 
            id="folder"
            type="text" 
            [(ngModel)]="uploadSettings.folder" 
            placeholder="/uploads"
            class="input-field"
          />
        </div>
        
        <div class="form-group">
          <label for="tags">Tags (comma-separated, optional):</label>
          <input 
            id="tags"
            type="text" 
            [(ngModel)]="uploadSettings.tags" 
            placeholder="profile, user, test"
            class="input-field"
          />
        </div>
        
        <div class="form-group">
          <label>
            <input 
              type="checkbox" 
              [(ngModel)]="uploadSettings.useUniqueFileName"
            />
            Use Unique File Name
          </label>
        </div>
        
        <div class="form-group file-input-group">
          <label for="fileInput" class="file-label">Choose File:</label>
          <input 
            id="fileInput"
            type="file" 
            (change)="onFileSelected($event)"
            accept="image/*"
            class="file-input"
          />
          <span class="selected-file" *ngIf="selectedFile">
            {{ selectedFile.name }} ({{ formatFileSize(selectedFile.size) }})
          </span>
        </div>
        
        <button 
          (click)="uploadFile()" 
          [disabled]="!selectedFile || isUploading"
          class="upload-button"
        >
          {{ isUploading ? 'Uploading...' : 'Upload Image' }}
        </button>
      </div>

      <div class="result-section" *ngIf="uploadResult">
        <h3>Upload Result</h3>
        <div [class]="uploadResult.success ? 'result success' : 'result error'">
          <p class="result-message">{{ uploadResult.message }}</p>
          
          <div *ngIf="uploadResult.success && uploadResult.data" class="result-details">
            <h4>Upload Details:</h4>
            <div class="detail-item">
              <strong>File ID:</strong> {{ uploadResult.data.fileId }}
            </div>
            <div class="detail-item">
              <strong>Name:</strong> {{ uploadResult.data.name }}
            </div>
            <div class="detail-item">
              <strong>Size:</strong> {{ formatFileSize(uploadResult.data.size) }}
            </div>
            <div class="detail-item">
              <strong>File Type:</strong> {{ uploadResult.data.fileType }}
            </div>
            <div class="detail-item">
              <strong>URL:</strong> 
              <a [href]="uploadResult.data.url" target="_blank" class="url-link">
                {{ uploadResult.data.url }}
              </a>
            </div>
            <div class="detail-item" *ngIf="uploadResult.data.thumbnailUrl">
              <strong>Thumbnail:</strong>
              <a [href]="uploadResult.data.thumbnailUrl" target="_blank" class="url-link">
                {{ uploadResult.data.thumbnailUrl }}
              </a>
            </div>
            
            <div class="uploaded-image" *ngIf="uploadResult.data.url">
              <h4>Uploaded Image Preview:</h4>
              <img [src]="uploadResult.data.thumbnailUrl" alt="Uploaded image" />
            </div>
            
            <details class="raw-response">
              <summary>Raw Response</summary>
              <pre>{{ uploadResult.data | json }}</pre>
            </details>
          </div>
          
          <div *ngIf="!uploadResult.success && uploadResult.error" class="error-details">
            <h4>Error Details:</h4>
            <pre>{{ uploadResult.error | json }}</pre>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .upload-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    h2 {
      color: #333;
      border-bottom: 2px solid #4CAF50;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }

    h3 {
      color: #555;
      margin-top: 30px;
      margin-bottom: 15px;
    }

    .credentials-section,
    .upload-section {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .form-group {
      margin-bottom: 15px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      color: #555;
      font-weight: 500;
    }

    .input-field {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
    }

    .input-field:focus {
      outline: none;
      border-color: #4CAF50;
    }

    .help-text {
      display: block;
      margin-top: 5px;
      color: #777;
      font-size: 12px;
    }

    .file-input-group {
      margin-top: 20px;
    }

    .file-label {
      display: inline-block;
      margin-right: 10px;
    }

    .file-input {
      display: inline-block;
      padding: 5px;
    }

    .selected-file {
      display: block;
      margin-top: 5px;
      color: #4CAF50;
      font-size: 14px;
    }

    .upload-button {
      background-color: #4CAF50;
      color: white;
      padding: 12px 30px;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      margin-top: 20px;
      transition: background-color 0.3s;
    }

    .upload-button:hover:not(:disabled) {
      background-color: #45a049;
    }

    .upload-button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }

    .result-section {
      margin-top: 30px;
    }

    .result {
      padding: 20px;
      border-radius: 8px;
      margin-top: 10px;
    }

    .result.success {
      background-color: #d4edda;
      border: 1px solid #c3e6cb;
    }

    .result.error {
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
    }

    .result-message {
      font-size: 16px;
      font-weight: 500;
      margin: 0 0 15px 0;
    }

    .result.success .result-message {
      color: #155724;
    }

    .result.error .result-message {
      color: #721c24;
    }

    .result-details,
    .error-details {
      margin-top: 15px;
    }

    h4 {
      color: #333;
      margin-bottom: 10px;
    }

    .detail-item {
      margin-bottom: 8px;
      padding: 8px;
      background: white;
      border-radius: 4px;
    }

    .detail-item strong {
      color: #555;
      margin-right: 8px;
    }

    .url-link {
      color: #007bff;
      text-decoration: none;
      word-break: break-all;
    }

    .url-link:hover {
      text-decoration: underline;
    }

    .uploaded-image {
      margin-top: 20px;
      padding: 15px;
      background: white;
      border-radius: 4px;
    }

    .uploaded-image img {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .raw-response {
      margin-top: 15px;
      background: white;
      padding: 10px;
      border-radius: 4px;
    }

    .raw-response summary {
      cursor: pointer;
      font-weight: 500;
      color: #555;
    }

    .raw-response pre {
      margin-top: 10px;
      padding: 10px;
      background: #f5f5f5;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 12px;
    }

    .error-details pre {
      background: white;
      padding: 10px;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 12px;
      color: #721c24;
    }
  `]
})
export class UploadTestComponent {
    authenticationType: 'authenticationServer' | 'signature' = 'authenticationServer';
  credentials = {
    urlEndpoint: '',
    publicKey: '',
    authenticationEndpoint: '',
    signature: '',
    token: '',
    expire: ''
  };

  uploadSettings = {
    fileName: '',
    folder: '',
    tags: '',
    useUniqueFileName: true
  };

  selectedFile: File | null = null;
  isUploading = false;
  uploadResult: UploadResult | null = null;

  constructor(private imagekitService: ImageKitService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadResult = null;
    }
  }

  async uploadFile(): Promise<void> {
    if (!this.selectedFile) {
      return;
    }

    // Validate credentials
    if (!this.credentials.urlEndpoint || !this.credentials.publicKey) {
      this.uploadResult = {
        success: false,
        message: 'Please provide both URL Endpoint and Public Key',
        error: { message: 'Missing required credentials' }
      };
      return;
    }

    this.isUploading = true;
    this.uploadResult = null;

    try {
      // Prepare upload options with component-level credentials
      const uploadOptions: any = {
        file: this.selectedFile,
        fileName: this.uploadSettings.fileName || this.selectedFile.name,
        publicKey: this.credentials.publicKey,
        useUniqueFileName: this.uploadSettings.useUniqueFileName,
        token: this.credentials.token,
        expire: this.credentials.expire,
        signature: this.credentials.signature
      };

      // Add optional parameters
      if (this.uploadSettings.folder) {
        uploadOptions.folder = this.uploadSettings.folder;
      }

      if (this.uploadSettings.tags) {
        uploadOptions.tags = this.uploadSettings.tags.split(',').map(t => t.trim()).filter(t => t);
      }

      if (this.credentials.authenticationEndpoint) {
        uploadOptions.authenticationEndpoint = this.credentials.authenticationEndpoint;
      }

      // Perform upload using the service
      const response = await this.imagekitService.upload(uploadOptions);

      this.uploadResult = {
        success: true,
        message: 'File uploaded successfully!',
        data: response
      };
    } catch (error: any) {
      this.uploadResult = {
        success: false,
        message: `Upload failed: ${error.message || 'Unknown error'}`,
        error: {
          message: error.message,
          name: error.name,
          details: error
        }
      };
    } finally {
      this.isUploading = false;
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

