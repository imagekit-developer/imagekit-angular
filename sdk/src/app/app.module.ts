import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { ImagekitioAngularModule } from "../../lib/src/imagekitio-angular/imagekitio-angular.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ImagekitioAngularModule.forRoot({
      urlEndpoint: "your_endpoint",
      publicKey: "your_public_key",
      authenticationEndpoint: "your_authentication_endpoint"
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
