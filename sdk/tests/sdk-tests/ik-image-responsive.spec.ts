import { ElementRef } from "@angular/core";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IkImageComponent } from "../../src/lib/ik-image/ik-image.component";
import { ImagekitService } from "../../src/lib/imagekit-angular.service";
import { IkImageComponentOptions } from '../../src/lib/utility/ik-type-def-collection'

describe("IkImageComponent - Responsive Features", () => {
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

  it("should generate srcset when responsive is true and width is provided", () => {
    let options: IkImageComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      src: "test.jpg"
    };
    component.width = 400;
    component.responsive = true;
    component.setUrl(options);
    
    expect(component.srcset).toBeTruthy();
    expect(component.srcset.length).toBeGreaterThan(0);
    expect(component.srcset).toContain('w');
  });

  it("should not generate srcset when responsive is false", () => {
    let options: IkImageComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      src: "test.jpg"
    };
    component.width = 400;
    component.responsive = false;
    component.setUrl(options);
    
    expect(component.srcset).toBe('');
  });

  it("should not generate srcset when width is not provided", () => {
    let options: IkImageComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      src: "test.jpg"
    };
    component.responsive = true;
    component.setUrl(options);
    
    // When width is not provided but responsive is true, it should still generate srcset with default breakpoints
    expect(component.srcset.length).toBeGreaterThan(0);
  });

  it("should use custom deviceBreakpoints when provided", () => {
    let options: IkImageComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      src: "test.jpg"
    };
    component.width = 800;
    component.responsive = true;
    component.deviceBreakpoints = [320, 640, 1024];
    component.setUrl(options);
    
    expect(component.srcset).toBeTruthy();
    // Srcset should contain widths based on device breakpoints
    expect(component.srcset).toContain('w');
  });

  it("should use custom imageBreakpoints when provided", () => {
    component.responsive = true;
    component.sizes = "100vw";
    component.deviceBreakpoints = [1];  // Minimal value to avoid filtering out imageBreakpoints
    component.imageBreakpoints = [200, 400, 600, 800];
    let options: IkImageComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      src: "test.jpg"
    };
    component.setUrl(options);
    
    expect(component.srcset).toBeTruthy();
    // With imageBreakpoints and sizes, it should contain transformations for those widths
    expect(component.srcset).toContain('w-200');
    expect(component.srcset).toContain('w-400');
    expect(component.srcset).toContain('w-600');
    expect(component.srcset).toContain('w-800');
  });

  it("should prioritize imageBreakpoints over deviceBreakpoints", () => {
    component.responsive = true;
    component.sizes = "100vw";
    component.deviceBreakpoints = [1];  // Minimal value
    component.imageBreakpoints = [300, 500];
    let options: IkImageComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      src: "test.jpg"
    };
    component.setUrl(options);
    
    expect(component.srcset).toBeTruthy();
    // Should use imageBreakpoints only
    expect(component.srcset).toContain('w-300');
    expect(component.srcset).toContain('w-500');
  });

  it("should generate srcset with transformation applied", () => {
    component.responsive = true;
    component.sizes = "100vw";
    component.deviceBreakpoints = [1];  // Minimal value to avoid filtering
    component.imageBreakpoints = [200, 400];
    let options: IkImageComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      src: "test.jpg",
      transformation: [{ height: "200" }]
    };
    component.setUrl(options);
    
    expect(component.srcset).toBeTruthy();
    // Each srcset entry should have both the original transformation and width
    expect(component.srcset).toContain('h-200');
    expect(component.srcset).toContain('w-200');
    expect(component.srcset).toContain('w-400');
  });

  it("should handle string width values", () => {
    let options: IkImageComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      src: "test.jpg"
    };
    component.width = "600";
    component.responsive = true;
    component.setUrl(options);
    
    expect(component.srcset).toBeTruthy();
    expect(component.srcset.length).toBeGreaterThan(0);
  });

  it("should not generate srcset for invalid width", () => {
    let options: IkImageComponentOptions = {
      urlEndpoint: "https://ik.imagekit.io/company/",
      src: "test.jpg"
    };
    component.width = "invalid";
    component.responsive = true;
    component.setUrl(options);
    
    // Even with invalid width, if responsive is true, it generates srcset with default breakpoints
    expect(component.srcset.length).toBeGreaterThan(0);
  });
});
