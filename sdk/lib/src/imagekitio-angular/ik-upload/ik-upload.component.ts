import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImagekitService } from '../imagekit.service';
import { IkUploadComponentOptions, Dict, HTMLInputEvent } from '../utility/ik-type-def-collection';

@Component({
  selector: 'ik-upload',
  template: `<input type="file" (change)="handleFileInput($event)" />`,
  providers: [ImagekitService]
})
export class IkUploadComponent implements OnInit {
  @Input('fileName') fileName: string; //required
  @Input('useUniqueFileName') useUniqueFileName: boolean; //optional
  @Input('tags') tags: string; //optional
  @Input('folder') folder: string; //optional
  @Input('isPrivateFile') isPrivateFile: boolean; //optional
  @Input('customCoordinates') customCoordinates: string; //optional
  @Input('responseFields') responseFields: string; //optional
  @Output() onError: EventEmitter<any> = new EventEmitter();
  @Output() onSuccess: EventEmitter<any> = new EventEmitter();
  @Input() onFileInput: (e: HTMLInputEvent) => void;
  @Input() validateFile: (file: File) => boolean;
  @Input() onUploadStart: (e: HTMLInputEvent) => void;
  @Input() onUploadProgress: (e: ProgressEvent) => void;
  fileToUpload: File = null;

  constructor(private imagekit: ImagekitService) { }

  ngOnInit(): void {
  }

  handleFileInput(e: HTMLInputEvent): void {
    // Custom file uploader
    if (this.onFileInput) {
      this.onFileInput(e);
      return;
    }

    // Using IK-upload
    const files = e.target.files;
    this.fileToUpload = files.item(0);
    const options: IkUploadComponentOptions = {
      file: this.fileToUpload,
      fileName: this.fileName,
      useUniqueFileName: this.useUniqueFileName,
      tags: this.tags,
      folder: this.folder,
      isPrivateFile: this.isPrivateFile,
      customCoordinates: this.customCoordinates,
      responseFields: this.responseFields,
      onError: this.onError,
      onSuccess: this.onSuccess
    }

    // Custom validation
    if (!this.checkCustomFileValidation(options.file)) {
      return;
    }

    this.startIkUpload(e, options);
  }

  checkCustomFileValidation = (file: File): boolean => {
    if (this.validateFile && typeof this.validateFile === 'function') {
     return this.validateFile(file);
    }
    return true;
  }

  startIkUpload = (e: HTMLInputEvent, options: IkUploadComponentOptions): void => {
    // Custom upload-start tracker
    if (this.onUploadStart && typeof this.onUploadStart === 'function') {
      this.onUploadStart(e);
    }
    const params = this.getUploadParams(options);

    // Custom upload-progress tracker
    const xhr = new XMLHttpRequest();
    const progressCb = this.createUploadProgressMonitor(xhr, options.onUploadProgress);
    const ik = this.imagekit.ikInstance;
    ik.upload(params, function (err, result) {
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
    });
  }

  createUploadProgressMonitor = (xhr: XMLHttpRequest, onUploadProgress: Function): any => {
    const progressCb = (e: ProgressEvent<XMLHttpRequestEventTarget>) => {
      if (onUploadProgress && typeof onUploadProgress === 'function') {
        // Custom upload-progress tracker
        onUploadProgress(e);
      }
    };
    xhr.upload.addEventListener('progress', progressCb);
    return progressCb;
  }

  getUploadParams(options: IkUploadComponentOptions)
    : Dict {
    const params: Dict = {
      file: options.file,
      fileName: options.fileName,
    }
    if (options.useUniqueFileName !== undefined) {
      Object.assign(params, { useUniqueFileName: options.useUniqueFileName });
    }

    if (options.folder !== undefined) {
      Object.assign(params, { folder: options.folder });
    }

    if (options.isPrivateFile !== undefined) {
      Object.assign(params, { isPrivateFile: options.isPrivateFile });
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
    return params;
  }
}
