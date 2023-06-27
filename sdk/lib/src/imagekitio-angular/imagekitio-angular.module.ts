import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IkImageComponent } from './ik-image/ik-image.component';
import { IkUploadComponent } from './ik-upload/ik-upload.component';
import { IkVideoComponent } from './ik-video/ik-video.component';
import { ImageKitConfiguration, ImagekitService } from './imagekit.service';


@NgModule({
  declarations: [IkUploadComponent, IkImageComponent, IkVideoComponent],
  imports: [CommonModule],
  exports: [IkUploadComponent, IkImageComponent, IkVideoComponent],
  providers: [ ImagekitService ]
})
export class ImagekitioAngularModule {

  static forRoot(config: ImageKitConfiguration): ModuleWithProviders<any> {
    return {
      ngModule: ImagekitioAngularModule,
      providers: [
        {provide: ImageKitConfiguration, useValue: config }
      ]
    };
  }
}
