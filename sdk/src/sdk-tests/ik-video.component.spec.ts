import { ElementRef } from "@angular/core";
import { IkVideoComponent } from "../../lib/src/imagekitio-angular/ik-video/ik-video.component";
import { ImagekitService } from "../../lib/src/imagekitio-angular/imagekit.service";
const pjson = require("../../lib/package.json");
const version = `angular-${pjson.version}`;

describe("IkVideoComponent", () => {
  let component: IkVideoComponent;
  let imageKitService: ImagekitService;

  beforeEach(() => {
    imageKitService = new ImagekitService({
      urlEndpoint: "https://ik.imagekit.io/company/",
      publicKey: "abc",
      authenticationEndpoint: "https://example.com/auth"
    });
    let elRef: ElementRef;
    component = new IkVideoComponent(elRef, imageKitService);
  });

  it("urlEndpoint passed to component should be used over initialized value", () => {
    component.setUrl(null, "def", null, 'https://example.com', null);
    expect(component.url).toBe(`https://example.com/def`);
  });

  it("Presence and absence of leading slash in path parameter should not result in double slash (//) in the returned url", () => {
    let comp: IkVideoComponent;
    let iKService: ImagekitService;
    iKService = new ImagekitService({
      urlEndpoint: "https://ik.imagekit.io/company/",
      publicKey: "abc",
      authenticationEndpoint: "http://example.com/auth"
    });
    let elRef: ElementRef;
    comp = new IkVideoComponent(elRef, iKService);
    comp.setUrl(null, "/sample-video.mp4");
    expect(comp.url).toContain(
      `https://ik.imagekit.io/company/sample-video.mp4`
    );
    comp.setUrl(null, "sample-video.mp4");
    expect(comp.url).toContain(
      `https://ik.imagekit.io/company/sample-video.mp4`
    );
  });

  it("new unsupported transformation parameter is passed then it should come in URL as it is", () => {
    const transformation = [{ foo: "200", bar: "200" }];
    component.setUrl("https://abc.com/def", null, transformation);
    expect(component.url).toBe(`https://abc.com/def?tr=foo-200%2Cbar-200`);
  });

  it("supported transformation parameter is passed then it should come in query parameters after transformation", () => {
    const transformation = [{ height: "200", width: "200" }, { rotation: "90"}];
    component.setUrl("https://abc.com/def", null, transformation);
    expect(component.url).toBe(`https://abc.com/def?tr=h-200%2Cw-200%3Art-90`);
  });

  it("if SRC is used to create URL, transformartioPosition should be query", () => {
    // const config = component.getConfigObject('abc');
    const transformation = [{ height: "200", width: "200" }, { rotation: "90"}];
    component.setUrl("https://abc.com/def", null, transformation);
    // expect(config['transformationPosition']).toBe('query')
    expect(component.url).toContain('?tr=');
  });

  it("if SRC is used to create URL, transformartioPosition should be query even if anything else is passed", () => {
    const transformation = [{ height: "200", width: "200" }, { rotation: "90"}];
    const config = component.getConfigObject('https://example.com/sample-video.mp4', null, transformation, 'path', null);
    expect(config['transformationPosition']).toBe('query')
    component.setUrl('https://example.com/sample-video.mp4', null, transformation, 'path', null)
    expect(component.url).toContain('?tr=');
  });

  it("Parameters passed to queryParameters should be present in URL if src is used", () => {
    component.setUrl('https://example.com/sample-video.mp4', null, null, null, null, {version:5, name: 'check'});
    expect(component.url).toContain('?version=5&name=check');
  });

  it("Parameters passed to queryParameters should be present in URL if src with existing query is used", () => {
    component.setUrl('https://example.com/sample-video.mp4?foo=bar&baz=nax', null, null, null, null, {version:5, name: 'check'});
    expect(component.url).toContain('&version=5&name=check');
    expect(component.url).toBe(`https://example.com/sample-video.mp4?foo=bar&baz=nax&version=5&name=check`);
  });

  it("Parameters passed to queryParameters should be present in URL if path is used", () => {
    component.setUrl(null, '/default.png', null, null, null, {version:6, name: 'bar'});
    expect(component.url).toContain('?version=6&name=bar');
  });

  it("setUrl should create correct URL when src is provided", () => {
    component.setUrl("https://test-absolute-path.com/sample-video.mp4");
    expect(component.url).toContain(`https://test-absolute-path.com/sample-video.mp4`);
  });

  it("setUrl should create correct URL when path is provided", () => {
    component.setUrl(null, "def", null, null);
    expect(component.url).toContain(`https://ik.imagekit.io/company/def`);
  });
});