import { ImagekitService } from "../../lib/src/imagekitio-angular/imagekit.service";
import { IkUploadComponent } from "../../lib/src/imagekitio-angular/ik-upload/ik-upload.component";
import { IkUploadComponentOptions } from '../../lib/src/imagekitio-angular/utility/ik-type-def-collection'

describe("IkUploadComponent", () => {
  let component: IkUploadComponent;
  let imageKitService: ImagekitService;

  beforeEach(() => {
    imageKitService = new ImagekitService({
      urlEndpoint: "url",
      publicKey: "pub",
      authenticationEndpoint: "auth"
    });
    component = new IkUploadComponent(imageKitService);
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
      tags: '["tag"]'
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: false,
      tags: '["tag"]'
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
      tags: '["tag"]',
      folder: undefined
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: false,
      tags: '["tag"]'
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
      tags: '["tag"]',
      folder: 'folder'
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: false,
      tags: '["tag"]',
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
      tags: '["tag"]',
      folder: 'folder',
      isPrivateFile: undefined
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: false,
      tags: '["tag"]',
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
      tags: '["tag"]',
      folder: 'folder',
      isPrivateFile: true
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: true,
      tags: '["tag"]',
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
      tags: '["tag"]',
      folder: 'folder',
      isPrivateFile: false,
      customCoordinates: undefined
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: true,
      tags: '["tag"]',
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
      tags: '["tag"]',
      folder: 'folder',
      isPrivateFile: false,
      customCoordinates: "10, 10, 100, 100"
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: true,
      tags: '["tag"]',
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
      tags: '["tag"]',
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
      tags: '["tag"]',
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
      tags: '["tag"]',
      folder: 'folder',
      isPrivateFile: false,
      customCoordinates: "10, 10, 100, 100",
      responseFields: "metadata"
    }
    const actual = component.getUploadParams(options);
    const expected = {
      file: dummyFile,
      fileName: newFileName,
      useUniqueFileName: true,
      tags: '["tag"]',
      folder: "folder",
      isPrivateFile: false,
      customCoordinates: "10, 10, 100, 100",
      responseFields: "metadata"
    };
    expect(actual).toEqual(expected);
  });
});
