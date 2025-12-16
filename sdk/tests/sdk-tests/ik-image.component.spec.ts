import { ElementRef } from "@angular/core";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IkImageComponent } from "../../src/lib/ik-image/ik-image.component";
import { ImagekitService } from "../../src/lib/imagekit-angular.service";
import { IkImageComponentOptions } from '../../src/lib/utility/ik-type-def-collection'

describe("IkImageComponent", () => {
  let component: IkImageComponent;
  let imageKitService: ImagekitService;
  let fixture: ComponentFixture<IkImageComponent>;

  beforeEach(() => {
    imageKitService = new ImagekitService({
      urlEndpoint: "https://ik.imagekit.io/company/"
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

  afterEach(() => {
    document.body.removeChild(fixture.nativeElement);
  });

  it("urlEndpoint passed to component should be used over initialized value", () => {
    component.src = 'def';
    component.urlEndpoint = 'https://example.com';
    component.responsive = false;
    component.ngOnChanges();
    expect(component.url).toBe(`https://example.com/def`);
  });

  it("Presence and absence of trailing slash in urlEndpoint should not result in double slash (//) in the returned url", () => {
    let comp: IkImageComponent;
    let iKService: ImagekitService;
    iKService = new ImagekitService({
      urlEndpoint: "https://ik.imagekit.io/company"
    });
    let elRef: ElementRef;
    comp = new IkImageComponent(elRef, iKService);
    comp.responsive = false;
    let options: IkImageComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company",
      src: "/abc.png",
      responsive: false
    };
    comp.setUrl(options);
    expect(comp.url).toBe(
      `https://ik.imagekit.io/company/abc.png`
    );
    options.src = "/def.png";
    comp.setUrl(options);
    expect(comp.url).toBe(
      `https://ik.imagekit.io/company/def.png`
    );
  });

  it("Presence and absence of leading slash in src parameter should not result in double slash (//) in the returned url", () => {
    let comp: IkImageComponent;
    let iKService: ImagekitService;
    iKService = new ImagekitService({
      urlEndpoint: "https://ik.imagekit.io/company/"
    });
    let elRef: ElementRef;
    comp = new IkImageComponent(elRef, iKService);
    let options: IkImageComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      src: "/abc.png"
    };
    comp.setUrl(options);
    expect(comp.url).toContain(
      `https://ik.imagekit.io/company/abc.png`
    );
    options.src = "abc.png";
    expect(comp.url).toContain(
      `https://ik.imagekit.io/company/abc.png`
    );
  });

  it("new unsupported transformation parameter is passed then it should come in URL as it is", () => {
    const transformation = [{ foo: "200", bar: "200" }] as any;
    let options: IkImageComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      src: "https://abc.com/def",
      transformation: transformation,
      responsive: false
    };
    component.setUrl(options);
    expect(component.url).toContain('foo-200');
    expect(component.url).toContain('bar-200');
  });

  it("supported transformation parameter is passed then it should come in query parameters after transformation", () => {
    const transformation = [{ height: "200", width: "200" }, { rotation: "90"}];
    let options: IkImageComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      src: "https://abc.com/def",
      transformation: transformation,
      responsive: false
    }
    component.setUrl(options);
    expect(component.url).toContain('h-200');
    expect(component.url).toContain('w-200');
    expect(component.url).toContain('rt-90');
  });

  it("if SRC is used to create URL, transformationPosition should be query", () => {
    const transformation = [{ height: "200", width: "200" }, { rotation: "90"}];
    let options: IkImageComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      src: "https://abc.com/def",
      transformation: transformation
    };
    component.setUrl(options);
    expect(component.url).toContain('?tr=');
  });

  it("Parameters passed to queryParameters should be present in URL if src is used", () => {
    let options: IkImageComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      src: "https://example.com/ab.png",
      queryParameters: {version:5, name: "check"}
    };
    component.setUrl(options);
    expect(component.url).toContain('?version=5&name=check');
  });

  it("Parameters passed to queryParameters should be present in URL if src with existing query is used", () => {
    component.responsive = false;
    let options: IkImageComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      src: "https://example.com/ab.png?foo=bar&baz=nax",
      queryParameters: {version:5, name: "check"}
    };
    component.setUrl(options);
    expect(component.url).toContain('&version=5&name=check');
    expect(component.url).toContain('foo=bar&baz=nax');
  });

  it("setUrl should create correct URL when src is provided", () => {
    let options: IkImageComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      src: "https://test-absolute-path.com/image.jpg"
    };
    component.setUrl(options);
    expect(component.url).toContain(`https://test-absolute-path.com/image.jpg`);
  });
});
