import { ElementRef } from "@angular/core";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IkVideoComponent } from "../../lib/src/imagekitio-angular/ik-video/ik-video.component";
import { ImagekitService } from "../../lib/src/imagekitio-angular/imagekit.service";
import { IkVideoComponentOptions } from '../../lib/src/imagekitio-angular/utility/ik-type-def-collection'

describe("IkVideoComponent", () => {
  let component: IkVideoComponent;
  let imageKitService: ImagekitService;
  let fixture: ComponentFixture<IkVideoComponent>;

  beforeEach(() => {
    imageKitService = new ImagekitService({
      urlEndpoint: "https://ik.imagekit.io/company/",
      publicKey: "abc",
      // authenticationEndpoint: "https://example.com/auth"
    });
    TestBed.configureTestingModule({
      declarations: [IkVideoComponent],
      providers: [ {
        provide: ImagekitService, useValue: imageKitService
      }]
    }).compileComponents();
    fixture = TestBed.createComponent(IkVideoComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    document.body.removeChild(fixture.nativeElement);
  });

  it("urlEndpoint passed to component should be used over initialized value", () => {
    let options: IkVideoComponentOptions = {
      urlEndpoint: "https://example.com",
      path: "def"
    };
    component.setUrl(options);
    expect(component.url).toBe(`https://example.com/def`);
  });

  it("Presence and absence of leading slash in path parameter should not result in double slash (//) in the returned url", () => {
    let comp: IkVideoComponent;
    let iKService: ImagekitService;
    iKService = new ImagekitService({
      urlEndpoint: "https://ik.imagekit.io/company/",
      publicKey: "abc",
      // authenticationEndpoint: "http://example.com/auth"
    });
    let elRef: ElementRef;
    comp = new IkVideoComponent(elRef, iKService);
    let options: IkVideoComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      path: "/sample-video.mp4"
    };
    comp.setUrl(options);
    expect(comp.url).toContain(
      `https://ik.imagekit.io/company/sample-video.mp4`
    );
    options.path = "sample-video-2.mp4";
    comp.setUrl(options);
    expect(comp.url).toContain(
      `https://ik.imagekit.io/company/sample-video-2.mp4`
    );
  });

  it("new unsupported transformation parameter is passed then it should come in URL as it is", () => {
    const transformation = [{ foo: "200", bar: "200" }];
    let options: IkVideoComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      src: "https://abc.com/def",
      transformation: transformation
    };
    component.setUrl(options);
    expect(component.url).toBe(`https://abc.com/def?tr=foo-200%2Cbar-200`);
  });

  it("supported transformation parameter is passed then it should come in query parameters after transformation", () => {
    const transformation = [{ height: "200", width: "200" }, { rotation: "90"}];
    let options: IkVideoComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      src: "https://abc.com/def",
      transformation: transformation
    };
    component.setUrl(options);
    expect(component.url).toBe(`https://abc.com/def?tr=h-200%2Cw-200%3Art-90`);
  });

  it("if SRC is used to create URL, transformartioPosition should be query", () => {
    const transformation = [{ height: "200", width: "200" }, { rotation: "90"}];
    let options: IkVideoComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      src: "https://abc.com/def",
      transformation: transformation
    };
    component.setUrl(options);
    expect(component.url).toContain('?tr=');
  });

  it("if SRC is used to create URL, transformationPosition should be query even if anything else is passed", () => {
    const transformation = [{ height: "200", width: "200" }, { rotation: "90"}];
    let options: IkVideoComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      src: "https://example.com/sample-video.mp4",
      transformation: transformation,
      transformationPosition: "path"
    };
    component.setUrl(options);
    const config = component.getConfigObject(options);
    expect(config['transformationPosition']).toBe('query');
    component.setUrl(options);
    expect(component.url).toContain('?tr=');
  });

  it("if PATH is used to create URL, transformartionPosition should be kept as is", () => {
    const transformation = [{ height: "200", width: "200" }, { rotation: "90"}];
    let options: IkVideoComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      path: "sample-video.mp4",
      transformation: transformation,
      transformationPosition: "query"
    };
    component.setUrl(options);
    const config = component.getConfigObject(options);
    expect(config['transformationPosition']).toBe('query');
    component.setUrl(options);
    expect(component.url).toContain('?tr=');
  });

  it("Parameters passed to queryParameters should be present in URL if src is used", () => {
    let options: IkVideoComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      src: "https://example.com/sample-video.mp4",
      queryParameters: {version:5, name: 'check'}
    };
    component.setUrl(options);
    expect(component.url).toContain('?version=5&name=check');
  });

  it("Parameters passed to queryParameters should be present in URL if src with existing query is used", () => {
    let options: IkVideoComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      src: "https://example.com/sample-video.mp4?foo=bar&baz=nax",
      queryParameters: {version:5, name: 'check'}
    };
    component.setUrl(options);
    expect(component.url).toContain('&version=5&name=check');
    expect(component.url).toBe(`https://example.com/sample-video.mp4?foo=bar&baz=nax&version=5&name=check`);
  });

  it("Parameters passed to queryParameters should be present in URL if path is used", () => {
    let options: IkVideoComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      path: "/default.png",
      queryParameters: {version:6, name: 'bar'}
    };
    component.setUrl(options);
    expect(component.url).toContain('?version=6&name=bar');
  });

  it("setUrl should create correct URL when src is provided", () => {
    let options: IkVideoComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      src: "https://test-absolute-path.com/sample-video.mp4"
    };
    component.setUrl(options);
    expect(component.url).toContain(`https://test-absolute-path.com/sample-video.mp4`);
  });

  it("setUrl should create correct URL when path is provided", () => {
    let options: IkVideoComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      path: "def"
    };
    component.setUrl(options);
    expect(component.url).toContain(`https://ik.imagekit.io/company/def`);
  });

  it("if urlEndpoint not set, expect errors to be thrown", () => {
    const transformation = [{ height: "200", width: "200" }, { rotation: "90"}];
    let options: IkVideoComponentOptions = {
      transformation: transformation,
      transformationPosition: "query"
    };
    expect(()=>component.getConfigObject(options)).toThrow(new Error('Missing urlEndpoint initialization!'));
  });

  it("if SRC and PATH not set, expect errors to be thrown", () => {
    const transformation = [{ height: "200", width: "200" }, { rotation: "90"}];
    let options: IkVideoComponentOptions = {
      urlEndpoint: 'https://ik.imagekit.io/example',
      transformation: transformation,
      transformationPosition: "query"
    };
    expect(()=>component.getConfigObject(options)).toThrow(new Error('Missing src / path during initialization!'));
  });
  
  it("video DOM src should be set initially", () => {
    component.urlEndpoint = "https://ik.imagekit.io/example";
    component.src = "https://ik.imagekit.io/demo/sample-video.mp4";
    fixture.detectChanges();
    const ikImageElement: HTMLElement = fixture.nativeElement;
    expect(ikImageElement.firstElementChild.attributes["src"]).not.toBeUndefined();
    expect(ikImageElement.firstElementChild.attributes["src"].value).toEqual(component.src);
  });
});