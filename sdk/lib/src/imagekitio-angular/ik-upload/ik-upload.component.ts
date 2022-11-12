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
  @Input() onFileInput: Function;
  fileToUpload: File = null;

  constructor(private imagekit: ImagekitService) { }

  ngOnInit(): void {
  }

  handleFileInput(e: HTMLInputEvent): void {
    const onError = this.onError;
    const onSuccess = this.onSuccess;
    const files = e.target.files;
    this.fileToUpload = files.item(0);
    if (this.onFileInput) {
      this.onFileInput(e);
      return;
    }
    const options: IkUploadComponentOptions = {
      file: this.fileToUpload,
      fileName: this.fileName,
      useUniqueFileName: this.useUniqueFileName,
      tags: this.tags,
      folder: this.folder,
      isPrivateFile: this.isPrivateFile,
      customCoordinates: this.customCoordinates,
      responseFields: this.responseFields,
      onError: onError,
      onSuccess: onSuccess
    }
    const params = this.getUploadParams(options);
    const ik = this.imagekit.ikInstance;
    ik.upload(params, function (err, result) {
      if (err) {
        onError.emit(err);
      } else {
        onSuccess.emit(result);
      }
    });
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
