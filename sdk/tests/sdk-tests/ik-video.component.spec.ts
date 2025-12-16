import { ElementRef } from "@angular/core";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IkVideoComponent } from "../../src/lib/ik-video/ik-video.component";
import { ImagekitService } from "../../src/lib/imagekit-angular.service";
import { IkVideoComponentOptions } from '../../src/lib/utility/ik-type-def-collection'

describe("IkVideoComponent", () => {
  let component: IkVideoComponent;
  let imageKitService: ImagekitService;
  let fixture: ComponentFixture<IkVideoComponent>;

  beforeEach(() => {
    imageKitService = new ImagekitService({
      urlEndpoint: "https://ik.imagekit.io/company/"
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
      src: "def"
    };
    component.setUrl(options);
    expect(component.url).toBe(`https://example.com/def`);
  });

  it("Presence and absence of leading slash in src parameter should not result in double slash (//) in the returned url", () => {
    let comp: IkVideoComponent;
    let iKService: ImagekitService;
    iKService = new ImagekitService({
      urlEndpoint: "https://ik.imagekit.io/company/"
    });
    let elRef: ElementRef;
    comp = new IkVideoComponent(elRef, iKService);
    let options: IkVideoComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      src: "/sample-video.mp4"
    };
    comp.setUrl(options);
    expect(comp.url).toContain(
      `https://ik.imagekit.io/company/sample-video.mp4`
    );
    options.src = "sample-video-2.mp4";
    comp.setUrl(options);
    expect(comp.url).toContain(
      `https://ik.imagekit.io/company/sample-video-2.mp4`
    );
  });

  it("new unsupported transformation parameter is passed then it should come in URL as it is", () => {
    const transformation = [{ foo: "200", bar: "200" }] as any;
    let options: IkVideoComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      src: "https://abc.com/def",
      transformation: transformation
    };
    component.setUrl(options);
    expect(component.url).toContain('foo-200');
    expect(component.url).toContain('bar-200');
  });

  it("supported transformation parameter is passed then it should come in query parameters after transformation", () => {
    const transformation = [{ height: "200", width: "200" }, { rotation: "90"}];
    let options: IkVideoComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      src: "https://abc.com/def",
      transformation: transformation
    };
    component.setUrl(options);
    expect(component.url).toContain('h-200');
    expect(component.url).toContain('w-200');
    expect(component.url).toContain('rt-90');
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
      src: "/default.png",
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

  it("setUrl should create correct URL when src is provided", () => {
    let options: IkVideoComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      src: "def"
    };
    component.setUrl(options);
    expect(component.url).toContain(`https://ik.imagekit.io/company/def`);
  });

  it("if urlEndpoint not set, expect console warning", () => {
    const transformation = [{ height: "200", width: "200" }, { rotation: "90"}];
    let options: IkVideoComponentOptions = {
      src: "test.mp4",
      transformation: transformation,
      transformationPosition: "query"
    };
    spyOn(console, 'warn');
    component.setUrl(options);
    expect(console.warn).toHaveBeenCalledWith('urlEndpoint is neither provided in this component nor in any parent ImagekitService.');
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