import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageKitConfiguration, ImagekitService } from "../../lib/src/imagekitio-angular/imagekit.service";
import { IkUploadComponent } from "../../lib/src/imagekitio-angular/ik-upload/ik-upload.component";
import { IkUploadComponentOptions } from '../../lib/src/imagekitio-angular/utility/ik-type-def-collection';

describe("IkUploadComponent", () => {
  let component: IkUploadComponent;
  let imageKitService: ImagekitService;
  let imageKitConfiguration: ImageKitConfiguration;
  let fixture: ComponentFixture<IkUploadComponent>;

  beforeEach(async() => {
    imageKitConfiguration = {
      urlEndpoint: "url",
      publicKey: "pub",
      authenticationEndpoint: "auth"
    };
    TestBed.configureTestingModule({
      declarations: [IkUploadComponent],
      providers: [ 
        {provide: ImagekitService, useValue: imageKitService},
        {provide: ImageKitConfiguration, useValue: imageKitConfiguration}
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(IkUploadComponent);
  });
  
  beforeEach(() => {
    imageKitConfiguration = {
      urlEndpoint: "url",
      publicKey: "pub",
      authenticationEndpoint: "auth"
    };
    imageKitService = new ImagekitService(imageKitConfiguration);
    component = new IkUploadComponent(imageKitService);
  });

  afterEach(() => {
    document.body.removeChild(fixture.nativeElement);
  });

  it("getUploadParams returns only defined keys with mandatory params passed", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName
    }
    const actual = component.getUploadParams(options);
    const expected = { file: dummyFile, fileName: newFileName };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams removes useUniqueFileName if not defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: undefined
    }
    const actual = component.getUploadParams(options);
    const expected = { file: dummyFile, fileName: newFileName };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams adds useUniqueFileName if defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: true
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: true
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams removes tags if not defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: true,
      tags: undefined
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: true
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams adds tags if defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: false,
      tags: ["tag"]
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: false,
      tags: ["tag"]
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams removes folder if not defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: false,
      tags: ["tag"],
      folder: undefined
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: false,
      tags: ["tag"]
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams adds folder if defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: false,
      tags: ["tag"],
      folder: 'folder'
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: false,
      tags: ["tag"],
      folder: "folder"
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams removes isPrivateFile if not defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: false,
      tags: ["tag"],
      folder: 'folder',
      isPrivateFile: undefined
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: false,
      tags: ["tag"],
      folder: "folder"
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams adds isPrivateFile if defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: true,
      tags: ["tag"],
      folder: 'folder',
      isPrivateFile: true
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: true,
      tags: ["tag"],
      folder: "folder",
      isPrivateFile: true
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams removes customCoordinates if not defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: true,
      tags: ["tag"],
      folder: 'folder',
      isPrivateFile: false,
      customCoordinates: undefined
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: true,
      tags: ["tag"],
      folder: "folder",
      isPrivateFile: false
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams adds customCoordinates if defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: true,
      tags: ["tag"],
      folder: 'folder',
      isPrivateFile: false,
      customCoordinates: "10, 10, 100, 100"
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: true,
      tags: ["tag"],
      folder: "folder",
      isPrivateFile: false,
      customCoordinates: "10, 10, 100, 100"
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams removes responseFields if not defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: true,
      tags: ["tag"],
      folder: 'folder',
      isPrivateFile: false,
      customCoordinates: "10, 10, 100, 100",
      responseFields: undefined
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: true,
      tags: ["tag"],
      folder: "folder",
      isPrivateFile: false,
      customCoordinates: "10, 10, 100, 100"
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams adds responseFields if defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: true,
      tags: ["tag"],
      folder: 'folder',
      isPrivateFile: false,
      customCoordinates: "10, 10, 100, 100",
      responseFields: ["metadata"]
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: true,
      tags: ["tag"],
      folder: "folder",
      isPrivateFile: false,
      customCoordinates: "10, 10, 100, 100",
      responseFields: "metadata"
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams removes extensions if not defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: true,
      tags: ["tag"],
      folder: 'folder',
      isPrivateFile: false,
      customCoordinates: "10, 10, 100, 100",
      extensions: undefined
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: true,
      tags: ["tag"],
      folder: "folder",
      isPrivateFile: false,
      customCoordinates: "10, 10, 100, 100"
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams adds extensions if defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: true,
      tags: ["tag"],
      folder: 'folder',
      isPrivateFile: false,
      customCoordinates: "10, 10, 100, 100",
      responseFields: ["metadata"],
      extensions: [{"name": "remove-bg","options": {"add_shadow": true}}]
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: true,
      tags: ["tag"],
      folder: "folder",
      isPrivateFile: false,
      customCoordinates: "10, 10, 100, 100",
      responseFields: "metadata",
      extensions: [{"name": "remove-bg","options": {"add_shadow": true}}]
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams removes webhookUrl if not defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: true,
      tags: ["tag"],
      folder: 'folder',
      isPrivateFile: false,
      customCoordinates: "10, 10, 100, 100",
      webhookUrl: undefined
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: true,
      tags: ["tag"],
      folder: "folder",
      isPrivateFile: false,
      customCoordinates: "10, 10, 100, 100"
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams adds webhookUrl if defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: true,
      tags: ["tag"],
      folder: 'folder',
      isPrivateFile: false,
      customCoordinates: "10, 10, 100, 100",
      responseFields: ["metadata"],
      webhookUrl: 'mywebhookurl'
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: true,
      tags: ["tag"],
      folder: "folder",
      isPrivateFile: false,
      customCoordinates: "10, 10, 100, 100",
      responseFields: "metadata",
      webhookUrl: 'mywebhookurl'
    };
    expect(actual).toEqual(expected);
  });

  it("upload file should not commence if validate file fails", () => {
    // Failed validation
    const comp = fixture.componentInstance;
    comp.validateFile = () => {
      return false;
    };
    const startIkUploadFunction = spyOn(comp, 'startIkUpload');
    const input = fixture.nativeElement.children[0];
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(startIkUploadFunction).not.toHaveBeenCalled();

    // Passing validation
    comp.validateFile = () => {
      return true;
    };
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(startIkUploadFunction).toHaveBeenCalled();

    // No validation passed
    comp.validateFile = undefined;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(startIkUploadFunction).toHaveBeenCalled();
  });

  it("onError event emitter called when upload fails", () => {
    const comp = fixture.componentInstance;
    const onErrorEventEmitter = spyOn(comp.onError, 'emit');
    const input = fixture.nativeElement.children[0];
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(onErrorEventEmitter).toHaveBeenCalled();
  });

  it("onSuccess event emitter called when when upload succeeds", () => {
    const comp = fixture.componentInstance;
    let dummyFile: File = new File([""], "dummy-file-name");
    const onSuccessEventEmitter = spyOn(comp.onSuccess, 'emit');
    const xhr = new XMLHttpRequest();
    const progressCb = comp.createUploadProgressMonitor(xhr);
    const options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: 'dummyFile',
      onSuccess: comp.onSuccess
    }
    comp.handleUploadResponse(undefined, 'success', options, xhr, progressCb);
    expect(onSuccessEventEmitter).toHaveBeenCalled();
  });

  it("onUploadStart function called when when upload commences", () => {
    const comp = fixture.componentInstance;
    let hasUploadStarted = false;
    comp.onUploadStart = () => { hasUploadStarted = true; }
    const input = fixture.nativeElement.children[0];
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(hasUploadStarted).toBeTruthy();
  });

  it("onUploadProgress callback should be called if is define", () => {
    const comp = fixture.componentInstance;
    let dummyFile: File = new File([""], "dummy-file-name");
    let hasTrackedProgress = false;
    comp.onUploadProgress = () => {
      hasTrackedProgress = true;
    }
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener = jasmine.createSpy('addEventListener').and.callFake((e, callback)=>{
      callback();
    });

    const progressCb = comp.createUploadProgressMonitor(xhr);
    const options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: 'dummyFile',
      onSuccess: comp.onSuccess
    }
    comp.handleUploadResponse(undefined, 'success', options, xhr, progressCb);
    expect(hasTrackedProgress).toBeTruthy();
  });
});
