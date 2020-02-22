import { ImagekitService } from "../../lib/src/imagekitio-angular/imagekit.service";
const pjson = require("../../lib/package.json");
const version = `angular-${pjson.version}`;

describe("ImagekitService", () => {
  let imagekitService: ImagekitService;
  beforeEach(() => {
    imagekitService = new ImagekitService({
      urlEndpoint: "url",
      publicKey: "pub",
      authenticationEndpoint: "auth"
    });
  })

  it("The url returned should have parameter with the value", () => {
    expect(imagekitService.getUrl({src: 'abc'})).toContain(`ik-sdk-version=${version}`)
  });
});
