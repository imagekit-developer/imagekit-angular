import { Component, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { ImagekitService } from '../imagekit.service';
@Component({
  selector: 'ik-upload',
  template: `<input type="file" (change)="handleFileInput($event)" />`,
})
export class IkUploadComponent implements OnInit {
  @Input('fileName') fileName:string;
  @Input('useUniqueFileName') useUniqueFileName:boolean = true;
  @Input('tags') tags:Array<string>;
  @Input('folder') folder:string;
  @Input('isPrivateFile') isPrivateFile:boolean = false;
  @Input('customCoordinates') customCoordinates:string; //check type
  @Input('responseFields') responseFields:string;
  @Output() onError: EventEmitter<any> = new EventEmitter();
  @Output() onSuccess: EventEmitter<any> = new EventEmitter();
  @Input() onFileInput: Function;
  fileToUpload: File = null;

  constructor(private el: ElementRef, private imagekit: ImagekitService) { }

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
    const params = {
      file: file,
      fileName: fileName,
      useUniqueFileName: useUniqueFileName,
      isPrivateFile: isPrivateFile,
      folder: folder,
    }
    if (tags) {
      Object.assign(params, { tags: tags });
    }

    if (customCoordinates) {
      Object.assign(params, { customCoordinates: customCoordinates });
    }

    if (responseFields) {
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
