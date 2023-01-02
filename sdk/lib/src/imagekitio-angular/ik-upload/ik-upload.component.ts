import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImagekitService } from '../imagekit.service';
import { IkUploadComponentOptions, Dict, HTMLInputEvent } from '../utility/ik-type-def-collection';

@Component({
  selector: 'ik-upload',
  template: `<input type="file" (change)="handleFileInput($event)" />`,
  providers: [ImagekitService]
})
export class IkUploadComponent implements OnInit {
  @Input('fileName') fileName: string; //optional
  @Input('useUniqueFileName') useUniqueFileName: boolean; //optional
  @Input('tags') tags: Array<string>; //optional
  @Input('folder') folder: string; //optional
  @Input('publicKey') publicKey: string; //optional
  @Input('isPrivateFile') isPrivateFile: boolean; //optional
  @Input('overwriteFile') overwriteFile: boolean; //optional
  @Input('overwriteAITags') overwriteAITags: boolean; //optional
  @Input('overwriteTags') overwriteTags: boolean; //optional
  @Input('overwriteCustomMetadata') overwriteCustomMetadata: boolean; //optional
  @Input('customCoordinates') customCoordinates: string; //optional
  @Input('webhookUrl') webhookUrl: string; //optional
  @Input('responseFields') responseFields: Array<string>; //optional
  @Input('extensions') extensions: Array<Object>; //optional
  @Input('customMetadata') customMetadata: Object; //optional
  @Output() onError: EventEmitter<any> = new EventEmitter();
  @Output() onSuccess: EventEmitter<any> = new EventEmitter();
  @Input('validateFile') validateFile: (file: File) => boolean;
  @Input('onUploadStart') onUploadStart: (e: HTMLInputEvent) => void;
  @Input('onUploadProgress') onUploadProgress: (e: ProgressEvent) => void;
  fileToUpload: File = null;

  constructor(private imagekit: ImagekitService) { }

  ngOnInit(): void {
  }

  handleFileInput(e: HTMLInputEvent): void {
    // Using IK-upload
    const files = e.target.files;
    this.fileToUpload = files.item(0);
    const options: IkUploadComponentOptions = {
      file: this.fileToUpload,
      fileName: this.fileName || this.fileToUpload.name,
      useUniqueFileName: this.useUniqueFileName,
      tags: this.tags,
      folder: this.folder,
      publicKey: this.publicKey,
      customMetadata: this.customMetadata,
      isPrivateFile: this.isPrivateFile,
      overwriteFile: this.overwriteFile,
      overwriteAITags: this.overwriteAITags,
      overwriteTags: this.overwriteTags,
      overwriteCustomMetadata: this.overwriteCustomMetadata,
      customCoordinates: this.customCoordinates,
      responseFields: this.responseFields,
      extensions: this.extensions,
      webhookUrl: this.webhookUrl,
      onError: this.onError,
      onSuccess: this.onSuccess
    }

    // Custom validation
    if (!this.checkCustomFileValidation(options.file)) {
      return;
    }
    
    this.startIkUpload(e, options);
  }
  
  checkCustomFileValidation(file: File): boolean {
    if (this.validateFile && typeof this.validateFile === 'function') {
     return this.validateFile(file);
    }
    return true;
  }

  startIkUpload(e: HTMLInputEvent, options: IkUploadComponentOptions): void {
    // Custom upload-start tracker
    if (this.onUploadStart && typeof this.onUploadStart === 'function') {
      this.onUploadStart(e);
    }

    // Custom upload-progress tracker
    options.xhr = new XMLHttpRequest();
    const params = this.getUploadParams(options);
    const progressCb = this.createUploadProgressMonitor(options.xhr);
    const ik = this.imagekit.ikInstance;
    ik.upload(params, (err, result) => {
      this.handleUploadResponse(err, result, options, options.xhr, progressCb)
    });
  }

  handleUploadResponse(err, result, options, xhr, progressCb): void {
    if (err) {
      if(options.onError instanceof EventEmitter) {
        options.onError.emit(err);
      }
    } else {
      if(options.onSuccess instanceof EventEmitter) {
        options.onSuccess.emit(result);
      }
      xhr.upload.removeEventListener('progress', progressCb);
    }
  }

  createUploadProgressMonitor(xhr: XMLHttpRequest): any {
    const progressCb = (e: ProgressEvent) => {
      if (this.onUploadProgress && typeof this.onUploadProgress === 'function') {
        // Custom upload-progress tracker
        this.onUploadProgress(e);
      }
    };
    xhr.upload.addEventListener('progress', progressCb);
    return progressCb;
  }

  getUploadParams(options: IkUploadComponentOptions): Dict {
    const params: Dict = {
      file: options.file,
      fileName: options.fileName
    }

    if (options.useUniqueFileName !== undefined) {
      Object.assign(params, { useUniqueFileName: options.useUniqueFileName });
    }

    if (options.folder !== undefined) {
      Object.assign(params, { folder: options.folder });
    }

    if (options.customMetadata !== undefined) {
      Object.assign(params, { customMetadata: options.customMetadata });
    }

    if (options.webhookUrl !== undefined) {
      Object.assign(params, { webhookUrl: options.webhookUrl });
    }

    if (options.isPrivateFile !== undefined) {
      Object.assign(params, { isPrivateFile: options.isPrivateFile });
    }

    if (options.overwriteFile !== undefined) {
      Object.assign(params, { overwriteFile: options.overwriteFile });
    }

    if (options.overwriteAITags !== undefined) {
      Object.assign(params, { overwriteAITags: options.overwriteAITags });
    }

    if (options.overwriteTags !== undefined) {
      Object.assign(params, { overwriteTags: options.overwriteTags });
    }

    if (options.overwriteCustomMetadata !== undefined) {
      Object.assign(params, { overwriteCustomMetadata: options.overwriteCustomMetadata });
    }

    if (options.publicKey !== undefined) {
      Object.assign(params, { publicKey: options.publicKey });
    }

    if (options.tags !== undefined) {
      Object.assign(params, { tags: options.tags });
    }

    if (options.customCoordinates !== undefined) {
      Object.assign(params, { customCoordinates: options.customCoordinates });
    }

    if (options.responseFields !== undefined) {
      Object.assign(params, { responseFields: options.responseFields });
    }

    if (options.extensions !== undefined) {
      Object.assign(params, { extensions: options.extensions });
    }

    if (options.xhr !== undefined) {
      Object.assign(params, { xhr: options.xhr });
    }
    return params;
  }
}
