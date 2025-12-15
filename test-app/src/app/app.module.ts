import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ImagekitioAngularModule } from '@imagekit/angular';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ImagekitioAngularModule.forRoot({
      urlEndpoint: 'https://ik.imagekit.io/demo/',
      transformationPosition: 'query'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
