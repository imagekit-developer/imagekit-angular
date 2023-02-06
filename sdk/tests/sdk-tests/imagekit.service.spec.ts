import { ImagekitService } from "../../lib/src/imagekitio-angular/imagekit.service";
const pjson = require("../../lib/package.json");

describe("ImagekitService", () => {
  let imagekitService: ImagekitService;
  beforeEach(() => {
    imagekitService = new ImagekitService({
      urlEndpoint: "url",
      publicKey: "pub",
      authenticationEndpoint: "auth"
    });
  })

  it("url should be returning correctly if src is provided", () => {
    expect(imagekitService.getUrl({src: 'https://example.com/abc'})).toContain(`abc`)
  });
});
