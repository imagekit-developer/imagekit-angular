import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { IkImageComponent } from './ik-image/ik-image.component';
import { ImageKitConfiguration } from './imagekit.service';


@NgModule({
  declarations: [IkImageComponent],
  imports: [
  ],
  exports: [IkImageComponent]
})
export class ImagekitioAngularModule {
  constructor (@Optional() @SkipSelf() parentModule: ImagekitioAngularModule) {
    if (parentModule) {
      throw new Error(
        'ImagekitioAngularModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(config: ImageKitConfiguration): ModuleWithProviders {
    return {
      ngModule: ImagekitioAngularModule,
      providers: [
        {provide: ImageKitConfiguration, useValue: config }
      ]
    };
  }
}
