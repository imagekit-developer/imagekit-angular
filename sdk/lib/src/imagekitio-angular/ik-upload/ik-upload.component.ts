import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImagekitService } from '../imagekit.service';
import { Dict, HTMLInputEvent } from '../utility/ik-type-def-collection';

@Component({
  selector: 'ik-upload',
  template: `<input type="file" (change)="handleFileInput($event)" />`,
  providers: [ImagekitService]
})
export class IkUploadComponent implements OnInit {
  @Input('fileName') fileName:string; //required
  @Input('useUniqueFileName') useUniqueFileName:boolean; //optional
  @Input('tags') tags:string; //optional
  @Input('folder') folder:string; //optional
  @Input('isPrivateFile') isPrivateFile:boolean; //optional
  @Input('customCoordinates') customCoordinates:string; //optional
  @Input('responseFields') responseFields:string; //optional
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
    const params = this.getUploadParams(this.fileToUpload, this.fileName, this.useUniqueFileName, this.tags, this.folder, this.isPrivateFile, this.customCoordinates, this.responseFields)
    const ik = this.imagekit.ikInstance;
    ik.upload(params, function (err, result) {
      if (err) {
        onError.emit(err);
      } else {
        onSuccess.emit(result);
      }
    });
  }

  getUploadParams(file, fileName: string, useUniqueFileName?: boolean, tags?: string, 
    folder?: string, isPrivateFile?: boolean, customCoordinates?: string, responseFields?: string)
    : Dict {
    const params: Dict = {
      file: file,
      fileName: fileName,
    }
    if (useUniqueFileName !== undefined) {
      Object.assign(params, { useUniqueFileName: useUniqueFileName });
    }

    if (folder !== undefined) {
      Object.assign(params, { folder: folder });
    }

    if (isPrivateFile !== undefined) {
      Object.assign(params, { isPrivateFile: isPrivateFile });
    }

    if (tags !== undefined) {
      Object.assign(params, { tags: tags });
    }

    if (customCoordinates !== undefined) {
      Object.assign(params, { customCoordinates: customCoordinates });
    }

    if (responseFields !== undefined) {
      Object.assign(params, { responseFields: responseFields });
    }
    return params;
  }
}
