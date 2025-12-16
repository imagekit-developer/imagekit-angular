import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { IkImageComponent } from './ik-image/ik-image.component';
import { IkVideoComponent } from './ik-video/ik-video.component';
import { ImagekitService } from './imagekit-angular.service';
import { ImageKitConfiguration } from './utility/ik-type-def-collection';
import { provideImageKit } from './imagekit-angular.tokens';

@NgModule({
  declarations: [
    IkImageComponent,
    IkVideoComponent
  ],
  imports: [CommonModule],
  exports: [
    IkImageComponent,
    IkVideoComponent
  ],
  providers: [ ImagekitService ]
})
export class ImagekitAngularModule { 
  static forRoot(config: ImageKitConfiguration): ModuleWithProviders<ImagekitAngularModule> {
    return {
      ngModule: ImagekitAngularModule,
      providers: [provideImageKit(config)]
    };
  }
}
