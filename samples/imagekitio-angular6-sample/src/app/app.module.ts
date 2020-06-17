import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { ImagekitioAngularModule } from 'imagekitio-angular';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ImagekitioAngularModule.forRoot({
      urlEndpoint: "<YOUR_URL_ENDPOINT>",
      publicKey: "<YOUR_PUBLIC_KEY>",
      authenticationEndpoint: "<YOUR_AUTH_ENDPOINT e.g http://localhost:3000/auth>"
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
