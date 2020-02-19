import { ImagekitService } from "../../lib/src/imagekitio-angular/imagekit.service";

describe("ImagekitService", () => {
  let imagekitService: ImagekitService;
  beforeEach(() => {
    imagekitService = new ImagekitService({
      urlEndpoint: "url",
      publicKey: "pub",
      authenticationEndpoint: "auth"
    });
  })

  it("getUrl should return correct url with correct SDK name", () => {
    expect(imagekitService.getUrl({src: 'abc'})).toContain('ik-sdk-version=angular-')
  });
});
