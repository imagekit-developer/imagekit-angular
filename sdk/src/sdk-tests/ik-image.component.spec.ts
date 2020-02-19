import { ElementRef } from "@angular/core";
import { IkImageComponent } from "../../lib/src/imagekitio-angular/ik-image/ik-image.component";
import { ImagekitService } from "../../lib/src/imagekitio-angular/imagekit.service";

describe("IkImageComponent", () => {
  let component: IkImageComponent;
  let imageKitService: ImagekitService;

  beforeEach(() => {
    imageKitService = new ImagekitService({
      urlEndpoint: "url",
      publicKey: "pub",
      authenticationEndpoint: "auth"
    });
    let elRef: ElementRef;
    component = new IkImageComponent(elRef, imageKitService);
  });

  it("setUrl should create correct URL when src is provided", () => {
    component.setUrl("abc");
    expect(component.url).toContain("/abc?ik-sdk-version=angular-");
  });

  it("setUrl should create correct URL when path is provided", () => {
    component.setUrl(null, "def");
    expect(component.url).toContain("/url/def?ik-sdk-version=angular-");
  });

  it("setUrl should create correct lqipURL in addition to URL when lqip is provided", () => {
    component.setUrl("abc", null, null, { active: true, quality: 1 });
    expect(component.url).toContain("/abc?ik-sdk-version=angular-");
    expect(component.lqipUrl).toContain("tr=q-1");
  });

  it("lqipload should create correct query parameters if path is provided", () => {
    const lqipURl = component.lqipload(
      10,
      "/abc?ik-sdk-version=angular-0.0.0",
      "/xyz"
    );
    expect(lqipURl).toContain("tr:q-10");
  });

  it("lqipload should create correct query parameters if path is not provided", () => {
    const lqipURl = component.lqipload(
      10,
      "/abc?ik-sdk-version=angular-0.0.0",
      null
    );
    expect(lqipURl).toContain("tr=q-10");
  });

  it("setUrl should add transformations in query parameters", () => {
    const transformation = [
      { height: "200", width: "200" },
      {
        rotation: "90"
      }
    ];
    component.setUrl("abc", null, transformation);
    expect(component.url).toContain("&tr=h-200%2Cw-200%3Art-90");
  });

  it("setUrl should handle the presence and absence of leading slash in path parameters", () => {
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
    expect(comp.url).toContain("https://ik.imagekit.io/company/abc.png?ik-sdk-version=angular-");
    comp.setUrl(null, "abc.png");
    expect(comp.url).toContain("https://ik.imagekit.io/company/abc.png?ik-sdk-version=angular-");
  });

  it("setUrl should handle the presence and absence of leading slash in urlEndpoint parameters", () => {
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
    expect(comp.url).toContain("https://ik.imagekit.io/company/abc.png?ik-sdk-version=angular-");
    iKService = new ImagekitService({
      urlEndpoint: "https://ik.imagekit.io/company/",
      publicKey: "abc",
      authenticationEndpoint: "http://example.com/auth"
    });
    comp.setUrl(null, "/def.png");
    expect(comp.url).toContain("https://ik.imagekit.io/company/def.png?ik-sdk-version=angular-");
  });

});
