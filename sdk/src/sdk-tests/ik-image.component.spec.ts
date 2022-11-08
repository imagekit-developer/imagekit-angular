import { ElementRef } from "@angular/core";
import { IkImageComponent } from "../../lib/src/imagekitio-angular/ik-image/ik-image.component";
import { ImagekitService } from "../../lib/src/imagekitio-angular/imagekit.service";

describe("IkImageComponent", () => {
  let component: IkImageComponent;
  let imageKitService: ImagekitService;

  beforeEach(() => {
    imageKitService = new ImagekitService({
      urlEndpoint: "https://ik.imagekit.io/company/",
      publicKey: "abc",
      authenticationEndpoint: "http://example.com/auth"
    });
    let elRef: ElementRef;
    component = new IkImageComponent(elRef, imageKitService);
  });

  it("urlEndpoint passed to component should be used over initialized value", () => {
    component.setUrl(null, "def", null, null, 'https://example.com');
    expect(component.url).toBe(`https://example.com/def`);
  });

  it("Presence and absence of trailing slash in urlEndpoint should not result in double slash (//) in the returned url", () => {
    let comp: IkImageComponent;
    let iKService: ImagekitService;
    iKService = new ImagekitService({
      urlEndpoint: "https://ik.imagekit.io/company",
      publicKey: "abc",
      authenticationEndpoint: "http://example.com/auth"
    });
    let elRef: ElementRef;
    comp = new IkImageComponent(elRef, iKService);

    comp.setUrl(null, "/abc.png");
    expect(comp.url).toBe(
      `https://ik.imagekit.io/company/abc.png`
    );
    iKService = new ImagekitService({
      urlEndpoint: "https://ik.imagekit.io/company/",
      publicKey: "abc",
      authenticationEndpoint: "http://example.com/auth"
    });
    comp.setUrl(null, "/def.png");
    expect(comp.url).toBe(
      `https://ik.imagekit.io/company/def.png`
    );
  });

  it("Presence and absence of leading slash in path parameter should not result in double slash (//) in the returned url", () => {
    let comp: IkImageComponent;
    let iKService: ImagekitService;
    iKService = new ImagekitService({
      urlEndpoint: "https://ik.imagekit.io/company/",
      publicKey: "abc",
      authenticationEndpoint: "http://example.com/auth"
    });
    let elRef: ElementRef;
    comp = new IkImageComponent(elRef, iKService);
    comp.setUrl(null, "/abc.png");
    expect(comp.url).toContain(
      `https://ik.imagekit.io/company/abc.png`
    );
    comp.setUrl(null, "abc.png");
    expect(comp.url).toContain(
      `https://ik.imagekit.io/company/abc.png`
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
    const config = component.getConfigObject('https://example.com/ab.png', null, transformation, 'path', null);
    expect(config['transformationPosition']).toBe('query')
    component.setUrl('https://example.com/ab.png', null, transformation, 'path', null)
    expect(component.url).toContain('?tr=');
  });

  it("Parameters passed to queryParameters should be present in URL if src is used", () => {
    component.setUrl('https://example.com/ab.png', null, null, null, null, null, {version:5, name: 'check'});
    expect(component.url).toContain('?version=5&name=check');
  });

  it("Parameters passed to queryParameters should be present in URL if src with existing query is used", () => {
    component.setUrl('https://example.com/ab.png?foo=bar&baz=nax', null, null, null, null, null, {version:5, name: 'check'});
    expect(component.url).toContain('&version=5&name=check');
    expect(component.url).toBe(`https://example.com/ab.png?foo=bar&baz=nax&version=5&name=check`);
  });

  it("Parameters passed to queryParameters should be present in URL if path is used", () => {
    component.setUrl(null, '/default.png', null, null, null, null, {version:6, name: 'bar'});
    expect(component.url).toContain('?version=6&name=bar');
  });

  it("setUrl should create correct URL when src is provided", () => {
    component.setUrl("https://test-absolute-path.com/image.jpg");
    expect(component.url).toContain(`https://test-absolute-path.com/image.jpg`);
  });

  it("setUrl should create correct URL when path is provided", () => {
    component.setUrl(null, "def", null, null);
    expect(component.url).toContain(`https://ik.imagekit.io/company/def`);
  });

  it("setUrl should create correct lqipURL in addition to URL when lqip is provided", () => {
    component.setUrl("https://example.com/abc", null, null, { active: true, quality: 1 });
    expect(component.url).toContain(`/abc`);
    expect(component.lqipUrl).toContain("tr=q-1");
  });

  it("lqipload should create correct query parameters if path is provided", () => {
    const lqipURl = component.lqipload(
      10,
      "/abc",
      "/xyz"
    );
    expect(lqipURl).toContain("tr:q-10");
  });

  it("lqipload should create correct query parameters if path is not provided", () => {
    const lqipURl = component.lqipload(
      10,
      "/abc",
      null
    );
    expect(lqipURl).toContain("tr=q-10");
  });
});
