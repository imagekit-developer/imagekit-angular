import { ElementRef } from "@angular/core";
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IkImageComponent } from "../../lib/src/imagekitio-angular/ik-image/ik-image.component";
import { ImagekitService } from "../../lib/src/imagekitio-angular/imagekit.service";
import { IkImageComponentOptions } from '../../lib/src/imagekitio-angular/utility/ik-type-def-collection'

describe("IkImageComponent", () => {
  let component: IkImageComponent;
  let imageKitService: ImagekitService;
  let fixture: ComponentFixture<IkImageComponent>;

  beforeEach(() => {
    imageKitService = new ImagekitService({
      urlEndpoint: "https://ik.imagekit.io/company/",
      publicKey: "abc",
      authenticationEndpoint: "http://example.com/auth"
    });
    TestBed.configureTestingModule({
      declarations: [IkImageComponent],
      providers: [ {
        provide: ImagekitService, useValue: imageKitService
      }]
    }).compileComponents();
    fixture = TestBed.createComponent(IkImageComponent);
    component = fixture.componentInstance;
  });

  it("urlEndpoint passed to component should be used over initialized value", () => {
    let options: IkImageComponentOptions = {
      path: "def",
      urlEndpoint: "https://example.com"
    };
    component.setUrl(options);
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
    let options: IkImageComponentOptions = {
      path: "/abc.png"
    };
    comp.setUrl(options);
    expect(comp.url).toBe(
      `https://ik.imagekit.io/company/abc.png`
    );
    iKService = new ImagekitService({
      urlEndpoint: "https://ik.imagekit.io/company/",
      publicKey: "abc",
      authenticationEndpoint: "http://example.com/auth"
    });
    options.path = "/def.png";
    comp.setUrl(options);
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
    let options: IkImageComponentOptions = {
      path: "/abc.png"
    };
    comp.setUrl(options);
    expect(comp.url).toContain(
      `https://ik.imagekit.io/company/abc.png`
    );
    options.path = "abc.png";
    expect(comp.url).toContain(
      `https://ik.imagekit.io/company/abc.png`
    );
  });

  it("new unsupported transformation parameter is passed then it should come in URL as it is", () => {
    const transformation = [{ foo: "200", bar: "200" }];
    let options: IkImageComponentOptions = {
      src: "https://abc.com/def",
      transformation: transformation
    };
    component.setUrl(options);
    expect(component.url).toBe(`https://abc.com/def?tr=foo-200%2Cbar-200`);
  });

  it("supported transformation parameter is passed then it should come in query parameters after transformation", () => {
    const transformation = [{ height: "200", width: "200" }, { rotation: "90"}];
    let options: IkImageComponentOptions = {
      src: "https://abc.com/def",
      transformation: transformation
    }
    component.setUrl(options);
    expect(component.url).toBe(`https://abc.com/def?tr=h-200%2Cw-200%3Art-90`);
  });

  it("if SRC is used to create URL, transformartioPosition should be query", () => {
    const transformation = [{ height: "200", width: "200" }, { rotation: "90"}];
    let options: IkImageComponentOptions = {
      src: "https://abc.com/def",
      transformation: transformation
    };
    component.setUrl(options);
    expect(component.url).toContain('?tr=');
  });

  it("if SRC is used to create URL, transformartioPosition should be query even if anything else is passed", () => {
    const transformation = [{ height: "200", width: "200" }, { rotation: "90"}];
    let options: IkImageComponentOptions = {
      src: "https://example.com/ab.png",
      transformation: transformation,
      transformationPosition: "path"
    };
    const config = component.getConfigObject(options);
    expect(config['transformationPosition']).toBe('query');
    component.setUrl(options);
    expect(component.url).toContain('?tr=');
  });

  it("Parameters passed to queryParameters should be present in URL if src is used", () => {
    let options: IkImageComponentOptions = {
      src: "https://example.com/ab.png",
      queryParameters: {version:5, name: "check"}
    };
    component.setUrl(options);
    expect(component.url).toContain('?version=5&name=check');
  });

  it("Parameters passed to queryParameters should be present in URL if src with existing query is used", () => {
    let options: IkImageComponentOptions = {
      src: "https://example.com/ab.png?foo=bar&baz=nax",
      queryParameters: {version:5, name: "check"}
    };
    component.setUrl(options);
    expect(component.url).toContain('&version=5&name=check');
    expect(component.url).toBe(`https://example.com/ab.png?foo=bar&baz=nax&version=5&name=check`);
  });

  it("Parameters passed to queryParameters should be present in URL if path is used", () => {
    let options: IkImageComponentOptions = {
      path: "/default.png",
      queryParameters: {version:6, name: "bar"}
    };
    component.setUrl(options);
    expect(component.url).toContain('?version=6&name=bar');
  });

  it("setUrl should create correct URL when src is provided", () => {
    let options: IkImageComponentOptions = {
      src: "https://test-absolute-path.com/image.jpg"
    };
    component.setUrl(options);
    expect(component.url).toContain(`https://test-absolute-path.com/image.jpg`);
  });

  it("setUrl should create correct URL when path is provided", () => {
    let options: IkImageComponentOptions = {
      path: "def"
    };
    component.setUrl(options);
    expect(component.url).toContain(`https://ik.imagekit.io/company/def`);
  });

  it("setUrl should create correct lqipURL in addition to URL when lqip is provided", () => {
    let options: IkImageComponentOptions = {
      src: "https://example.com/abc",
      lqip: { active: true, quality: 1 }
    };
    component.setUrl(options);
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

  it("if lazy loading, img DOM src should be empty initially", () => {
    component.src = "https://ik.imagekit.io/18ykd9wzp/default-image.jpg";
    component.loading = "lazy";
    fixture.detectChanges();
    const ikImageElement: HTMLElement = fixture.nativeElement;
    expect(ikImageElement.firstElementChild.attributes["src"]).toBeUndefined();
  });

  it("if not lazy loading, img DOM src should be set initially", () => {
    component.src = "https://ik.imagekit.io/18ykd9wzp/default-image.jpg";
    fixture.detectChanges();
    const ikImageElement: HTMLElement = fixture.nativeElement;
    expect(ikImageElement.firstElementChild.attributes["src"]).not.toBeUndefined();
    expect(ikImageElement.firstElementChild.attributes["src"].value).toEqual(component.src);
  });
});
