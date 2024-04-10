import { ImagekitioAngularService } from "../../projects/imagekitio-angular/src/lib/imagekitio-angular.service";

describe("ImagekitService", () => {
  let imagekitService: ImagekitioAngularService;
  beforeEach(() => {
    imagekitService = new ImagekitioAngularService({
      urlEndpoint: "url",
      publicKey: "pub",
    });
  })

  it("url should be returning correctly if src is provided", () => {
    expect(imagekitService.getUrl({ src: 'https://example.com/abc' })).toContain(`abc`)
  });
});
