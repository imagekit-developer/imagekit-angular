import { ModuleWithProviders, NgModule } from '@angular/core';
import { ImagekitioAngularComponent } from './imagekitio-angular.component';
import { ImageKitConfiguration } from './imagekitio-angular.service';
import { IkImageComponent } from './ik-image/ik-image.component';
import { IkVideoComponent } from './ik-video/ik-video.component';
import { IkUploadComponent } from './ik-upload/ik-upload.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    ImagekitioAngularComponent,
    IkImageComponent,
    IkVideoComponent,
    IkUploadComponent
  ],
  imports: [CommonModule],
  exports: [
    ImagekitioAngularComponent,
    IkImageComponent,
    IkVideoComponent,
    IkUploadComponent
  ]
})
export class ImagekitioAngularModule { 
  static forRoot(config: ImageKitConfiguration): ModuleWithProviders<ImagekitioAngularModule> {
    return {
      ngModule: ImagekitioAngularModule,
      providers: [
        {provide: ImageKitConfiguration, useValue: config }
      ]
    };
  }
}
