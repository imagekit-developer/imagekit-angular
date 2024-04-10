import { ImagekitioAngularService } from "../../projects/imagekitio-angular/src/lib/imagekitio-angular.service";
const pjson = require("../../lib/package.json");

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
