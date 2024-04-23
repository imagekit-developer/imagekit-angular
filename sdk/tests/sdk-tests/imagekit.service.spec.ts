import { ImagekitService } from "../../projects/imagekitio-angular/src/lib/imagekitio-angular.service";

describe("ImagekitService", () => {
  let imagekitService: ImagekitService;
  beforeEach(() => {
    imagekitService = new ImagekitService({
      urlEndpoint: "url",
      publicKey: "pub",
    });
  })

  it("url should be returning correctly if src is provided", () => {
    expect(imagekitService.getUrl({ src: 'https://example.com/abc' })).toContain(`abc`)
  });
});
