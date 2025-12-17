import { Component, AfterViewInit, OnInit, ElementRef, Input, OnChanges } from '@angular/core';
import { ImagekitService } from '../imagekit-angular.service';
import { Dict, QueryParameters, IkImageComponentOptions } from '../utility/ik-type-def-collection';
import { getInt } from '../utility/utils';
import { buildSrc, getResponsiveImageAttributes, SrcOptions } from '@imagekit/javascript';
import type { Transformation } from '@imagekit/javascript'

@Component({
  selector: 'ik-image',
  template: `<img src='' (load)="onImageLoaded($event)">`,
})
export class IkImageComponent implements AfterViewInit, OnInit, OnChanges {
  @Input('src') src: string = "";
  @Input('urlEndpoint') urlEndpoint: string;
  @Input('transformation') transformation: Array<Transformation> = [];
  @Input('transformationPosition') transformationPosition: "path" | "query";
  @Input('queryParameters') queryParameters: QueryParameters;
  @Input('loading') loading: string = "lazy";
  @Input('width') width: number | string;
  @Input('height') height: string;
  @Input('responsive') responsive: boolean = true;
  @Input('deviceBreakpoints') deviceBreakpoints: number[];
  @Input('imageBreakpoints') imageBreakpoints: number[];
  @Input('sizes') sizes: string;
  url = '';
  srcset = '';

  constructor(private el: ElementRef, private imagekit: ImagekitService) {
  }

  ngOnInit(): void {
    const options: IkImageComponentOptions = {
      src: this.src,
      urlEndpoint: this.urlEndpoint ? this.urlEndpoint : this.imagekit._ikInstance.options.urlEndpoint,
      transformation: this.transformation,
      transformationPosition: this.transformationPosition,
      queryParameters: this.queryParameters,
    };
    this.setUrl(options);
  }

  ngOnChanges(): void {
    this.ngOnInit();
    this.ngAfterViewInit();
  }

  ngAfterViewInit(): void {
    if (!this.url) {
      return;
    }
    this.loadImage(this, this.url, this.srcset);
  }

  onImageLoaded = (event: { srcElement: { src: string; } | any }) => {
    // Image loaded
  };

  setUrl(options: IkImageComponentOptions): void {
    const widthInt = getInt(this.width);

    if (!options.urlEndpoint || options.urlEndpoint.trim() === "") {
      console.warn("urlEndpoint is neither provided in this component nor in any parent ImagekitService.");
      return null;
    }

    const strictOptions = options as SrcOptions;

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
  }

  loadImage(context: IkImageComponent, url: string, srcset: string): void {
    const nativeElement = context.el.nativeElement;
    const attributes = nativeElement.attributes;
    const attrsToSet = context.namedNodeMapToObject(attributes);
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
    context.setElementAttributes(image, attrsToSet);
  }

  namedNodeMapToObject(source: NamedNodeMap): Dict {
    let target: Dict = {};
    Object.keys(source).forEach(index => {
      const name = source[index].name;
      const value = source[index].value;
      target[name] = value;
    });
    return target;
  };

  setElementAttributes(element: any, attributesLiteral: Dict): void {
    Object.keys(attributesLiteral).forEach(attrName => {
      if (attrName.startsWith('ng-') || attrName.startsWith('_ng')) {
        element.removeAttribute(attrName);
        return;
      }
        element.setAttribute(attrName, attributesLiteral[attrName]);
    });
  }
}
