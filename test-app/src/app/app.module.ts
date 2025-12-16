import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ImagekitAngularModule } from '@imagekit/angular';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ImagekitAngularModule.forRoot({
      urlEndpoint: 'https://ik.imagekit.io/demo/',
      transformationPosition: 'query'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
