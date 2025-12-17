import { ImagekitService } from "../../src/lib/imagekit-angular.service";

describe("ImagekitService", () => {
  let imagekitService: ImagekitService;
  beforeEach(() => {
    imagekitService = new ImagekitService({
      urlEndpoint: "url"
    });
  })

  it("should set urlEndpoint correctly", () => {
    expect(imagekitService._ikInstance.options.urlEndpoint).toContain(`url`)
  });

  it("getUrlEndpoint should return passed urlEndpoint when provided", () => {
    const passedUrlEndpoint = "https://example.com/";
    const result = imagekitService.getUrlEndpoint(passedUrlEndpoint);
    expect(result).toBe(passedUrlEndpoint);
  });

  it("getUrlEndpoint should return initialized urlEndpoint when passed urlEndpoint is null", () => {
    const result = imagekitService.getUrlEndpoint(null);
    expect(result).toBe("url");
  });

  it("getUrlEndpoint should return initialized urlEndpoint when passed urlEndpoint is undefined", () => {
    const result = imagekitService.getUrlEndpoint(undefined);
    expect(result).toBe("url");
  });
});
