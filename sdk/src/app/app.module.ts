import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { ImagekitioAngularModule } from "../../lib/src/imagekitio-angular/imagekitio-angular.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ImagekitioAngularModule.forRoot({
      urlEndpoint: "https://ik.imagekit.io/yzyzyz/",
      publicKey: "public_H43AdNoK+ogownwdrsurNbpJcWA=",
      authenticationEndpoint: "http://localhost:3000/auth"
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
