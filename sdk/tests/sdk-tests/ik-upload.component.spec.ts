import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageKitConfiguration, ImagekitService } from "../../lib/src/imagekitio-angular/imagekit.service";
import { IkUploadComponent } from "../../lib/src/imagekitio-angular/ik-upload/ik-upload.component";
import { IkUploadComponentOptions } from '../../lib/src/imagekitio-angular/utility/ik-type-def-collection';
import { EventEmitter } from '@angular/core';

describe("IkUploadComponent", () => {
  let component: IkUploadComponent;
  let imageKitService: ImagekitService;
  let imageKitConfiguration: ImageKitConfiguration;
  let fixture: ComponentFixture<IkUploadComponent>;

  const authenticator = async () => {
    try {
      // You can pass headers as well and later validate the request source in the backend, or you can use headers for any other use case.
      const response = await fetch('http://localhost:3000/auth');

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const { signature, expire, token } = data;
      return { signature, expire, token };
    } catch (error) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  beforeEach(async() => {
    imageKitConfiguration = {
      urlEndpoint: "url",
      publicKey: "pub",
    };
    TestBed.configureTestingModule({
      declarations: [IkUploadComponent],
      providers: [ 
        {provide: ImagekitService, useValue: imageKitService},
        {provide: ImageKitConfiguration, useValue: imageKitConfiguration}
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(IkUploadComponent);
    component = fixture.componentInstance;
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
      tags: ["tag"]
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
      tags: ["tag"]
    };
    
    expect(JSON.stringify(actual['tags'])).toEqual(JSON.stringify(expected.tags));
  });

  it("getUploadParams removes folder if not defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      folder: undefined
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams adds folder if defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      folder: 'folder'
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
      folder: 'folder'
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams removes isPrivateFile if not defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      isPrivateFile: undefined
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams adds isPrivateFile if defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      isPrivateFile: true
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
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
      customCoordinates: undefined
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams adds customCoordinates if defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      customCoordinates: "10, 10, 100, 100"
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
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
      responseFields: undefined
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams adds responseFields if defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      responseFields: ["metadata"]
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
      responseFields: ["metadata"]
    };
    expect(JSON.stringify(actual['responseFields'])).toEqual(JSON.stringify(expected.responseFields));
  });

  it("getUploadParams removes customMetadata if not defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      customMetadata: undefined
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams adds customMetadata if defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      customMetadata: {"name": "remove-bg","options": {"add_shadow": true}}
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
      customMetadata: {"name": "remove-bg","options": {"add_shadow": true}}
    };
    expect(JSON.stringify(actual['customMetadata'])).toEqual(JSON.stringify(expected.customMetadata));
  });

  it("getUploadParams removes extensions if not defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      extensions: undefined
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams adds extensions if defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      extensions: [{"name": "remove-bg","options": {"add_shadow": true}}]
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
      extensions: [{"name": "remove-bg","options": {"add_shadow": true}}]
    };
    expect(JSON.stringify(actual['extensions'])).toEqual(JSON.stringify(expected.extensions));
  });

  it("getUploadParams removes webhookUrl if not defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      webhookUrl: undefined
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams adds webhookUrl if defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      webhookUrl: 'mywebhookurl'
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
      webhookUrl: 'mywebhookurl'
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams removes overwriteFile if not defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      overwriteFile: undefined
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams adds overwriteFile if defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      overwriteFile: false
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
      overwriteFile: false
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams removes overwriteAITags if not defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      overwriteAITags: undefined
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams adds overwriteAITags if defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      overwriteAITags: false
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
      overwriteAITags: false
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams removes overwriteTags if not defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      overwriteTags: undefined
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams adds overwriteTags if defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      overwriteTags: false
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
      overwriteTags: false
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams removes overwriteCustomMetadata if not defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      overwriteCustomMetadata: undefined
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams adds overwriteCustomMetadata if defined", () => {
    let newFileName: string = "new-file-name";
    let dummyFile: File = new File([""], "dummy-file-name");
    let options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: newFileName,
      overwriteCustomMetadata: false
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
      overwriteCustomMetadata: false
    };
    expect(actual).toEqual(expected);
  });

  it("upload file should not commence if validate file fails", () => {
    component.fileName = 'dummy-file-name';
    component.authenticator = authenticator;
    // Failed validation
    component.validateFile = () => {
      return false;
    };
    fixture.detectChanges();
    const startIkUploadFunction = spyOn(component, 'startIkUpload');
    const input = fixture.nativeElement.children[0];
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(startIkUploadFunction).not.toHaveBeenCalled();
    // Passing validation
    component.validateFile = () => {
      return true;
    };
    
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(startIkUploadFunction).toHaveBeenCalled();

    // No validation passed
    component.validateFile = undefined;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(startIkUploadFunction).toHaveBeenCalled();
  });

  it("upload file should not commence if authenticator function not passed", () => {
    const startIkUploadFunction = spyOn(component, 'startIkUpload');
    component.authenticator = undefined;
    fixture.detectChanges();
    expect(startIkUploadFunction).not.toHaveBeenCalled();
  });

  it("upload file should not commence if authenicator function doesn't return a promise",()=>{
    const startIkUploadFunction = spyOn(component, 'startIkUpload'); 
    component.authenticator = () => undefined
    fixture.detectChanges();
    expect(startIkUploadFunction).not.toHaveBeenCalled();
  })

  it('should authenticate successfully', async () => {
    const expectedAuthData = {
      signature: 'mockSignature',
      expire: 1234567890,
      token: 'mockToken',
    };

    // Create a spy on the fetch function to mock the network request
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(expectedAuthData),
      } as Response)
    );

    // Set up the authenticator function with the spy
    component.authenticator = authenticator;

    fixture.detectChanges();

    // Call the authenticator function
    const authResult = await component.authenticator();

    // Assert that the authenticator function returned the expected data
    expect(authResult).toEqual(expectedAuthData);
  });

  it("onError event emitter called when upload fails", async () => {
    component.fileName = 'dummy-file-name';
    component.authenticator = authenticator;
    fixture.detectChanges();
    const onErrorEventEmitter = spyOn(component.onError, 'emit').and.callThrough();
    const input = fixture.nativeElement.children[0];
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(onErrorEventEmitter).toHaveBeenCalled();
  });

  it("onSuccess event emitter called when when upload succeeds", () => {
    let dummyFile: File = new File([""], "dummy-file-name");
    component.fileName = dummyFile.name;
    component.authenticator = authenticator;
    fixture.detectChanges();
    const onSuccessEventEmitter = spyOn(component.onSuccess, 'emit');
    const xhr = new XMLHttpRequest();
    const progressCb = component.createUploadProgressMonitor(xhr);
    const options: IkUploadComponentOptions = {
      file: dummyFile,
      fileName: 'dummyFile',
      onSuccess: component.onSuccess
    }
    component.handleUploadResponse(undefined, 'success', options, xhr, progressCb);
    expect(onSuccessEventEmitter).toHaveBeenCalled();
  });

  it("onUploadStart function called when when upload commences", () => {
    component.fileName = 'dummy-file-name';
    component.authenticator = authenticator;
    let hasUploadStarted = false;
    component.onUploadStart = () => { hasUploadStarted = true; }
    fixture.detectChanges();
    const input = fixture.nativeElement.children[0];
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(hasUploadStarted).toBeTruthy();
  });

  it("onUploadProgress callback should be called if is define", () => {
    const comp = fixture.componentInstance;
    component.authenticator = authenticator;
    let dummyFile: File = new File([""], "dummy-file-name");
    comp.fileName = dummyFile.name;
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


  it("abort should have been called when when upload.abort is invoked", () => {
    component.fileName = 'dummy-file-name';
    fixture.detectChanges();
    const input = fixture.nativeElement.children[0];
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    component.xhr = new XMLHttpRequest();
    const abortFunction = spyOn(component.xhr,'abort');
    component.abort();
    expect(abortFunction).toHaveBeenCalled();
   });

   it("should handle promise rejection with an array of errors", async () => {
    // Set up the component and data
    const component = fixture.componentInstance;
    const dummyFile: File = new File([""], "dummy-file-name");
    component.fileName = dummyFile.name;
  
    // Mock the authenticator function to reject the promise with an array of errors
    component.authenticator = () => {
      return Promise.reject(['Error 1', 'Error 2']);
    };
  
    fixture.detectChanges();
  
    // Call the authenticator function
    const onErrorEventEmitter = spyOn(component.onError, 'emit').and.callThrough();
    const input = fixture.nativeElement.children[0];
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  
    // Wait for the promise to be rejected
    await fixture.whenStable();

    expect(onErrorEventEmitter).toHaveBeenCalled();
  });

  it("should handle promise resolution", async () => {
    // Set up the component and data
    const component = fixture.componentInstance;
    const dummyFile: File = new File([""], "dummy-file-name");
    component.fileName = dummyFile.name;
  
    // Mock the authenticator function to resolve the promise with an object
    component.authenticator = () => {
      return Promise.resolve({
        signature: 'signature',
        token: 'token',
        expire: 123123
      });
    };
  
    fixture.detectChanges();
  
    const promiseResolveHandler = spyOn(component, 'handleAuthResponse').and.callThrough();
    const handleUploadResponse = spyOn(component, 'handleUploadResponse');
  
    // Call the public method to get _ikInstance
    const ikInstance = component.getIkInstance();
  
    // You can now use ikInstance in your test
    // For example, if _ikInstance has a method called 'upload', you can spy on it
    const ikUploadSpy = spyOn(ikInstance, 'upload').and.callFake((params, callback) => {
      // Simulate a successful upload by invoking the callback
      callback(null, 'upload successful');
    });
  
    const input = fixture.nativeElement.children[0];
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  
    // Wait for the promise to be resolved
    await fixture.whenStable();
  
    expect(promiseResolveHandler).toHaveBeenCalled();
    expect(handleUploadResponse).toHaveBeenCalled(); // Ensure that handleUploadResponse is called
    expect(ikUploadSpy).toHaveBeenCalled();
  });
  
  

  it('handleUploadResponse should handle an error', () => {
    const options = {
      onError: new EventEmitter<any>(),
      onSuccess: new EventEmitter<any>(),
    };

    // Mock the throwError method
    spyOn(component, 'throwError');

    // Call handleUploadResponse with an error
    component.handleUploadResponse('error message', null, options, null, null);

    // Expect that the throwError method was called with the error message and options
    expect(component.throwError).toHaveBeenCalledWith('error message', options);

    // Expect that onSuccess EventEmitter was not emitted
    expect(options.onSuccess.observers.length).toBe(0);
  });
});
