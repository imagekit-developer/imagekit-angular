import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImagekitService } from '../imagekit.service';
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

  ngOnInit() {
  }

  handleFileInput(e) {
    const files = e.target.files;
    this.fileToUpload = files.item(0);
    if (this.onFileInput) {
      this.onFileInput(e);
      return;
    }
    this.upload(this.fileToUpload, this.fileName, this.useUniqueFileName, this.tags, this.folder, this.isPrivateFile, this.customCoordinates, this.responseFields)
  }

  upload(file, fileName, useUniqueFileName, tags, folder, isPrivateFile, customCoordinates, responseFields) {
    let ik = this.imagekit.ikInstance;
    const onError = this.onError;
    const onSuccess = this.onSuccess;
    const params:object = {
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

    ik.upload(params, function (err, result) {
      if (err) {
        onError.emit(err);
      } else {
        onSuccess.emit(result);
      }
    });
  }

}
