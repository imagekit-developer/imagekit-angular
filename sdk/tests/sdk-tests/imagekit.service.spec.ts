import { ImagekitService } from "../../src/lib/imagekit-angular.service";

describe("ImagekitService", () => {
  let imagekitService: ImagekitService;
  beforeEach(() => {
    imagekitService = new ImagekitService({
      urlEndpoint: "url"
    });
  })

  it("url should be returning correctly if src is provided", () => {
    expect(imagekitService.getUrl({ src: 'https://example.com/abc', urlEndpoint: 'url' })).toContain(`abc`)
  });
});
