import { ElementRef } from "@angular/core";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IkImageComponent } from "../../lib/src/imagekitio-angular/ik-image/ik-image.component";
import { ImagekitService } from "../../lib/src/imagekitio-angular/imagekit.service";
import { IkImageComponentOptions, LqipOptions } from '../../lib/src/imagekitio-angular/utility/ik-type-def-collection'

describe("IkImageComponent", () => {
  let component: IkImageComponent;
  let imageKitService: ImagekitService;
  let fixture: ComponentFixture<IkImageComponent>;

  beforeEach(() => {
    imageKitService = new ImagekitService({
      urlEndpoint: "https://ik.imagekit.io/company/",
      publicKey: "abc",
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
    component.path = 'def';
    component.urlEndpoint = 'https://example.com';
    component.ngOnChanges();
    expect(component.url).toBe(`https://example.com/def`);
  });

  it("Presence and absence of trailing slash in urlEndpoint should not result in double slash (//) in the returned url", () => {
    let comp: IkImageComponent;
    let iKService: ImagekitService;
    iKService = new ImagekitService({
      urlEndpoint: "https://ik.imagekit.io/company",
      publicKey: "abc",
    });
    let elRef: ElementRef;
    comp = new IkImageComponent(elRef, iKService);
    let options: IkImageComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company",
      path: "/abc.png"
    };
    comp.setUrl(options);
    expect(comp.url).toBe(
      `https://ik.imagekit.io/company/abc.png`
    );
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
    });
    let elRef: ElementRef;
    comp = new IkImageComponent(elRef, iKService);
    let options: IkImageComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
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
      urlEndpoint: "https://ik.imagekit.io/company/",
      src: "https://abc.com/def",
      transformation: transformation
    };
    component.setUrl(options);
    expect(component.url).toBe(`https://abc.com/def?tr=foo-200%2Cbar-200`);
  });

  it("supported transformation parameter is passed then it should come in query parameters after transformation", () => {
    const transformation = [{ height: "200", width: "200" }, { rotation: "90"}];
    let options: IkImageComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      src: "https://abc.com/def",
      transformation: transformation
    }
    component.setUrl(options);
    expect(component.url).toBe(`https://abc.com/def?tr=h-200%2Cw-200%3Art-90`);
  });

  it("if SRC is used to create URL, transformartionPosition should be query", () => {
    const transformation = [{ height: "200", width: "200" }, { rotation: "90"}];
    let options: IkImageComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      src: "https://abc.com/def",
      transformation: transformation
    };
    component.setUrl(options);
    expect(component.url).toContain('?tr=');
  });

  it("if SRC is used to create URL, transformartionPosition should be query even if anything else is passed", () => {
    const transformation = [{ height: "200", width: "200" }, { rotation: "90"}];
    let options: IkImageComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      src: "https://example.com/ab.png",
      transformation: transformation,
      transformationPosition: "path"
    };
    const config = component.getConfigObject(options);
    expect(config['transformationPosition']).toBe('query');
    component.setUrl(options);
    expect(component.url).toContain('?tr=');
  });

  it("if PATH is used to create URL, transformartionPosition should be kept as is", () => {
    const transformation = [{ height: "200", width: "200" }, { rotation: "90"}];
    let options: IkImageComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      path: "ab.png",
      transformation: transformation,
      transformationPosition: "query"
    };
    const config = component.getConfigObject(options);
    expect(config['transformationPosition']).toBe('query');
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
    let options: IkImageComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      src: "https://example.com/ab.png?foo=bar&baz=nax",
      queryParameters: {version:5, name: "check"}
    };
    component.setUrl(options);
    expect(component.url).toContain('&version=5&name=check');
    expect(component.url).toBe(`https://example.com/ab.png?foo=bar&baz=nax&version=5&name=check`);
  });

  it("Parameters passed to queryParameters should be present in URL if path is used", () => {
    let options: IkImageComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      path: "/default.png",
      queryParameters: {version:6, name: "bar"}
    };
    component.setUrl(options);
    expect(component.url).toContain('?version=6&name=bar');
  });

  it("setUrl should create correct URL when src is provided", () => {
    let options: IkImageComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      src: "https://test-absolute-path.com/image.jpg"
    };
    component.setUrl(options);
    expect(component.url).toContain(`https://test-absolute-path.com/image.jpg`);
  });

  it("setUrl should create correct URL when path is provided", () => {
    let options: IkImageComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      path: "def"
    };
    component.setUrl(options);
    expect(component.url).toContain(`https://ik.imagekit.io/company/def`);
  });

  it("setUrl should create correct lqipURL in addition to URL when lqip is provided", () => {
    let options: IkImageComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      src: "https://example.com/abc",
      lqip: { active: true, quality: 1 }
    };
    component.setUrl(options);
    expect(component.url).toContain(`/abc`);
    expect(component.lqipUrl).toContain("tr=q-1");
  });

  it("constructLqipUrl should create correct query parameters if path is provided", () => {
    let lqipOptions: LqipOptions = {
      active: true,
      quality: 10
    }
    let options: IkImageComponentOptions = {
      path: 'xyz'
    }
    const lqipURl = component.constructLqipUrl(
      options,
      lqipOptions
    );
    expect(lqipURl).toContain("tr:q-10,bl-6");
    
    lqipOptions = {
      active: true,
      quality: 20,
      blur: 9
    }
    options = {
      path: '/abc/def'
    }
    const lqipURl2 = component.constructLqipUrl(
      options,
      lqipOptions
    );
    expect(lqipURl2).toContain("tr:q-20,bl-9/abc/def");
  });

  it("constructLqipUrl should create correct query parameters if path is not provided", () => {
    let lqipOptions: LqipOptions = {
      active: true,
      quality: 10
    }
    let options: IkImageComponentOptions = {
      src: 'https://example.com'
    }
    const lqipURl = component.constructLqipUrl(
      options,
      lqipOptions
    );
    expect(lqipURl).toContain("tr=q-10%2Cbl-6");

    lqipOptions = {
      active: true,
      quality: 10,
      raw: 'n-lqip'
    }
    const lqipURl2 = component.constructLqipUrl(
      options,
      lqipOptions
    );
    expect(lqipURl2).toContain("tr=n-lqip");
  });
  
  it("if urlEndpoint not set, expect errors to be thrown", () => {
    const transformation = [{ height: "200", width: "200" }, { rotation: "90"}];
    let options: IkImageComponentOptions = {
      transformation: transformation,
      transformationPosition: "query"
    };
    expect(()=>component.getConfigObject(options)).toThrow(new Error('Missing urlEndpoint initialization!'));
  });

  it("if SRC and PATH not set, expect errors to be thrown", () => {
    const transformation = [{ height: "200", width: "200" }, { rotation: "90"}];
    let options: IkImageComponentOptions = {
      urlEndpoint: 'https://ik.imagekit.io/example',
      transformation: transformation,
      transformationPosition: "query"
    };
    expect(()=>component.getConfigObject(options)).toThrow(new Error('Missing src / path during initialization!'));
  });

  it("if lazy loading, img DOM src should be empty initially", () => {
    component.src = "https://ik.imagekit.io/18ykd9wzp/default-image.jpg";
    component.loading = "lazy";
    fixture.detectChanges();
    const ikImageElement: HTMLElement = fixture.nativeElement;
    expect(ikImageElement.firstElementChild.attributes["src"].value).toBe('');
  });

  it("if lazy loading and LQIP active, img DOM src should be set to LQIP URL initially", () => {
    component.src = "https://ik.imagekit.io/18ykd9wzp/default-image.jpg";
    component.lqip = {active: true, quality: 10};
    component.loading = "lazy";
    fixture.detectChanges();
    const ikImageElement: HTMLElement = fixture.nativeElement;
    expect(ikImageElement.firstElementChild.attributes["src"].value).not.toBe('');
    expect(ikImageElement.firstElementChild.attributes["src"].value).toContain('tr=q-10');
  });

  it("if not lazy loading, img DOM src should be set initially", () => {
    component.src = "https://ik.imagekit.io/18ykd9wzp/default-image.jpg";
    fixture.detectChanges();
    const ikImageElement: HTMLElement = fixture.nativeElement;
    expect(ikImageElement.firstElementChild.attributes["src"]).not.toBeUndefined();
    expect(ikImageElement.firstElementChild.attributes["src"].value).toEqual(component.src);
  });

  it("handling of intersection observer must invoke the necessary calls", () => {
    const entry = [{
      target: fixture.nativeElement,
      isIntersecting: true
    }];
    let isObserving = true;
    const mockObserver = jasmine.createSpyObj('IntersectionObserver', ['unobserve']);
    mockObserver.unobserve.and.callFake(function() {
      isObserving = false;
    });
    let isImageLoaded = false;
    const mockIkImageComponent = jasmine.createSpyObj('IkImageComponent', ['loadImage']);
    mockIkImageComponent.loadImage.and.callFake(function() {
      isImageLoaded = true;
    });
    component.handleIntersectionObserver(entry, mockObserver, mockIkImageComponent.loadImage, component, '');
    expect(isObserving).toBeFalsy();
    expect(isImageLoaded).toBeTruthy();
  });

  it("onImageLoaded should load the image when not lazy loading and the event source matches lqipUrl", () => {
    // const fixture = TestBed.createComponent(IkImageComponent);
    const component = fixture.componentInstance;
    component.loading = "eager"; // Set to eager (not lazy) loading
    component.lqipUrl = "lqip-url"; // Set a sample lqip URL
    component.url = "original-url"; // Set a sample original URL
  
    const event = {
      srcElement: {
        src: "lqip-url", // Simulate an event with lqip URL as src
      },
    };
  
    const loadImageSpy = spyOn(component, "loadImage"); // Spy on loadImage function
  
    component.onImageLoaded(event);
  
    // Expect loadImage function to be called with the component and original URL
    expect(loadImageSpy).toHaveBeenCalledWith(component, "original-url");
  });
});
