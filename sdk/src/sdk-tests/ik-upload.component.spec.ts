import { ImagekitService } from "../../lib/src/imagekitio-angular/imagekit.service";
import { IkUploadComponent } from "../../lib/src/imagekitio-angular/ik-upload/ik-upload.component";

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
    const actual = component.getUploadParams("file", "def");
    const expected = { file: "file", fileName: "def" };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams removes useUniqueFileName if not defined", () => {
    const actual = component.getUploadParams("file", "def", undefined);
    const expected = { file: "file", fileName: "def" };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams adds useUniqueFileName if defined", () => {
    const actual = component.getUploadParams("file", "def", "some");
    const expected = {
      file: "file",
      fileName: "def",
      useUniqueFileName: "some"
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams removes tags if not defined", () => {
    const actual = component.getUploadParams("file", "def", "some", undefined);
    const expected = {
      file: "file",
      fileName: "def",
      useUniqueFileName: "some"
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams adds tags if defined", () => {
    const actual = component.getUploadParams("file", "def", "some", '["tag"]');
    const expected = {
      file: "file",
      fileName: "def",
      useUniqueFileName: "some",
      tags: '["tag"]'
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams removes folder if not defined", () => {
    const actual = component.getUploadParams(
      "file",
      "def",
      "some",
      '["tag"]',
      undefined
    );
    const expected = {
      file: "file",
      fileName: "def",
      useUniqueFileName: "some",
      tags: '["tag"]'
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams adds folder if defined", () => {
    const actual = component.getUploadParams(
      "file",
      "def",
      "some",
      '["tag"]',
      "folder"
    );
    const expected = {
      file: "file",
      fileName: "def",
      useUniqueFileName: "some",
      tags: '["tag"]',
      folder: "folder"
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams removes isPrivateFile if not defined", () => {
    const actual = component.getUploadParams(
      "file",
      "def",
      "some",
      '["tag"]',
      "folder",
      undefined
    );
    const expected = {
      file: "file",
      fileName: "def",
      useUniqueFileName: "some",
      tags: '["tag"]',
      folder: "folder"
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams adds isPrivateFile if defined", () => {
    const actual = component.getUploadParams(
      "file",
      "def",
      "some",
      '["tag"]',
      "folder",
      true
    );
    const expected = {
      file: "file",
      fileName: "def",
      useUniqueFileName: "some",
      tags: '["tag"]',
      folder: "folder",
      isPrivateFile: true
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams removes customCoordinates if not defined", () => {
    const actual = component.getUploadParams(
      "file",
      "def",
      "some",
      '["tag"]',
      "folder",
      false,
      undefined
    );
    const expected = {
      file: "file",
      fileName: "def",
      useUniqueFileName: "some",
      tags: '["tag"]',
      folder: "folder",
      isPrivateFile: false
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams adds customCoordinates if defined", () => {
    const actual = component.getUploadParams(
      "file",
      "def",
      "some",
      '["tag"]',
      "folder",
      false,
      "10, 10, 100, 100"
    );
    const expected = {
      file: "file",
      fileName: "def",
      useUniqueFileName: "some",
      tags: '["tag"]',
      folder: "folder",
      isPrivateFile: false,
      customCoordinates: "10, 10, 100, 100"
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams removes responseFields if not defined", () => {
    const actual = component.getUploadParams(
      "file",
      "def",
      "some",
      '["tag"]',
      "folder",
      false,
      "10, 10, 100, 100",
      undefined
    );
    const expected = {
      file: "file",
      fileName: "def",
      useUniqueFileName: "some",
      tags: '["tag"]',
      folder: "folder",
      isPrivateFile: false,
      customCoordinates: "10, 10, 100, 100"
    };
    expect(actual).toEqual(expected);
  });

  it("getUploadParams adds responseFields if defined", () => {
    const actual = component.getUploadParams(
      "file",
      "def",
      "some",
      '["tag"]',
      "folder",
      false,
      "10, 10, 100, 100",
      "metadata"
    );
    const expected = {
      file: "file",
      fileName: "def",
      useUniqueFileName: "some",
      tags: '["tag"]',
      folder: "folder",
      isPrivateFile: false,
      customCoordinates: "10, 10, 100, 100",
      responseFields: "metadata"
    };
    expect(actual).toEqual(expected);
  });
});
