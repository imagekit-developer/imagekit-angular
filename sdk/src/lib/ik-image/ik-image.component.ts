import { Component, AfterViewInit, OnInit, ElementRef, Input, OnChanges } from '@angular/core';
import { ImagekitService } from '../imagekit-angular.service';
import { Dict, QueryParameters, IkImageComponentOptions } from '../utility/ik-type-def-collection';
import { getInt, namedNodeMapToObject, setElementAttributes } from '../utility/utils';
import { buildSrc, getResponsiveImageAttributes, SrcOptions } from '@imagekit/javascript';
import type { Transformation } from '@imagekit/javascript'

@Component({
  selector: 'ik-image',
  template: `<img src=''>`,
})
export class IkImageComponent implements AfterViewInit, OnInit, OnChanges {
  @Input('src') src: string = "";
  @Input('urlEndpoint') urlEndpoint: string;
  @Input('transformation') transformation: Array<Transformation> = [];
  @Input('transformationPosition') transformationPosition: "path" | "query";
  @Input('queryParameters') queryParameters: QueryParameters;
  @Input('loading') loading: string = "lazy";
  @Input('width') width: number | string;
  @Input('height') height: number | string;
  @Input('responsive') responsive: boolean = true;
  @Input('deviceBreakpoints') deviceBreakpoints: number[];
  @Input('imageBreakpoints') imageBreakpoints: number[];
  @Input('sizes') sizes: string;
  url = '';
  srcset = '';
  selector = 'ik-image';

  constructor(private el: ElementRef, private imagekit: ImagekitService) { }

  ngOnInit(): void {
    this.setSrcParams();
  }

  ngOnChanges(): void {
    this.setSrcParams();
    this.loadImage(this, this.url, this.srcset);
  }

  ngAfterViewInit(): void {
    this.loadImage(this, this.url, this.srcset);
  }

  setSrcParams(): void {
    const options: IkImageComponentOptions = {
      src: this.src,
      urlEndpoint: this.urlEndpoint ? this.urlEndpoint : this.imagekit.ikInstance.options.urlEndpoint,
      transformation: this.transformation,
      transformationPosition: this.transformationPosition,
      queryParameters: this.queryParameters,
    };
    this.setUrl(options);
  }
 
  setUrl(options: IkImageComponentOptions): void {
    const widthInt = getInt(this.width);

    if (!options.urlEndpoint || options.urlEndpoint.trim() === "") {
      console.warn("urlEndpoint is neither provided in this component nor in any parent ImagekitService.");
      return;
    }

    const strictOptions = options as SrcOptions;

    try {
      if (!this.responsive) {
        this.url = buildSrc(strictOptions);
        this.srcset = '';
      } else {
        const { src: newSrc, srcSet } = getResponsiveImageAttributes({
          ...strictOptions,
          width: isNaN(widthInt) ? undefined : widthInt,
          sizes: this.sizes,
          deviceBreakpoints: this.deviceBreakpoints,
          imageBreakpoints: this.imageBreakpoints,
        })
        this.url = newSrc;
        this.srcset = srcSet;
      }
    } catch (error) {
      console.error("Error generating src params: ", error);
      this.url = '';
      this.srcset = '';
    }
  }

  loadImage(context: IkImageComponent, url: string, srcset: string): void {
    if (!url) {
      return;
    }
    const nativeElement = context.el.nativeElement;
    const attributes = nativeElement.attributes;
    const attrsToSet = namedNodeMapToObject(attributes);
    attrsToSet['src'] = url;
    
    if (srcset) {
      attrsToSet['srcset'] = srcset;
    }
    if (context.sizes) {
      attrsToSet['sizes'] = context.sizes;
    }
    if (context.loading) {
      attrsToSet['loading'] = context.loading;
    }
    const image = nativeElement.children[0];
    setElementAttributes(image, attrsToSet, context.selector);
  }
}
