import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ImagekitioAngularModule } from "imagekitio-angular";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ImagekitioAngularModule.forRoot({
      urlEndpoint: "",
      publicKey: "",
      authenticationEndpoint: ""
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
