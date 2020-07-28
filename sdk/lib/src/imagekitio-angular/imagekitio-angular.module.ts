import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { IkImageComponent } from './ik-image/ik-image.component';
import { IkUploadComponent } from './ik-upload/ik-upload.component';
import { ImageKitConfiguration, ImagekitService } from './imagekit.service';


@NgModule({
  declarations: [IkUploadComponent, IkImageComponent],
  imports: [
  ],
  exports: [IkUploadComponent, IkImageComponent],
  providers: [ ImagekitService ]
})
export class ImagekitioAngularModule {

  static forRoot(config: ImageKitConfiguration): ModuleWithProviders {
    return {
      ngModule: ImagekitioAngularModule,
      providers: [
        {provide: ImageKitConfiguration, useValue: config }
      ]
    };
  }
}
