import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { IkImageComponent } from './ik-image/ik-image.component';
import { IkUploadComponent } from './ik-upload/ik-upload.component';
import { IkVideoComponent } from './ik-video/ik-video.component';
import { ImageKitConfiguration, ImagekitService } from './imagekitio-angular.service';

@NgModule({
  declarations: [
    IkImageComponent,
    IkVideoComponent,
    IkUploadComponent
  ],
  imports: [CommonModule],
  exports: [
    IkImageComponent,
    IkVideoComponent,
    IkUploadComponent
  ],
  providers: [ ImagekitService ]
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
