import { Component, AfterViewInit, OnInit, ElementRef, Input, OnChanges } from '@angular/core';
import { ImagekitService } from '../imagekit.service';
import { Dict, QueryParameters, IkImageComponentOptions, LqipOptions } from '../utility/ik-type-def-collection'
import { Transformation } from 'imagekit-javascript/dist/src/interfaces/Transformation';

@Component({
  selector: 'ik-image',
  template: `<img src='' (load)="onImageLoaded($event)">`,
})
export class IkImageComponent implements AfterViewInit, OnInit, OnChanges {
  @Input('src') src: string;
  @Input('path') path: string;
  @Input('urlEndpoint') urlEndpoint: string;
  @Input('transformation') transformation: Array<Transformation> = [];
  @Input('transformationPosition') transformationPosition: "path" | "query";
  @Input('queryParameters') queryParameters: QueryParameters;
  @Input('lqip') lqip: LqipOptions;
  @Input('loading') loading: string;
  url = '';
  lqipUrl = '';
  
  observer: MutationObserver;

  constructor(private el: ElementRef, private imagekit: ImagekitService) {
  }

  ngOnInit(): void {
    const options: IkImageComponentOptions =  this.src ? {src: this.src} : {path: this.path};
    options.urlEndpoint = this.urlEndpoint ? this.urlEndpoint : this.imagekit._ikInstance.options.urlEndpoint;
    options.transformation = this.transformation;
    options.transformationPosition = this.transformationPosition;
    options.queryParameters = this.queryParameters;
    options.lqip = this.lqip;
    this.setUrl(options);
  }

  ngOnChanges(): void {
    this.ngOnInit();
    this.ngAfterViewInit();
  }

  ngAfterViewInit(): void {
    if(this.loading == 'lazy'){
      const that = this;
      if(this.lqipUrl){
        // If given LQIP, use that first
        this.loadImage(this, this.lqipUrl);
      }
      const imageObserver = new IntersectionObserver(
        (entry: any, observer: IntersectionObserver)=>{
          // Always load the original image when intersecting
          that.handleIntersectionObserver(entry, observer, that.loadImage, that, that.url);
        }
      );
      imageObserver.observe(this.el.nativeElement);
    } else {
      // If given LQIP, use that first
      this.loadImage(this, this.lqipUrl ? this.lqipUrl : this.url);
    }
  }

  onImageLoaded = (event) => {
    if(this.loading != 'lazy' && event.srcElement.src === this.lqipUrl){
      this.loadImage(this, this.url);
    }
  };

  handleIntersectionObserver (entry: any, observer: IntersectionObserver, 
    loadImageFunc: Function, context: IkImageComponent, url: string): void {
    if (entry[0] && entry[0].isIntersecting) {
      let image = entry[0].target;
      loadImageFunc(context, url);
      observer.unobserve(image);
    }
  }

  setUrl(options: IkImageComponentOptions): void {
    const config = this.getConfigObject(options);
    this.url = this.imagekit.getUrl(config);
    if (options.lqip && options.lqip.active === true) {
      this.lqipUrl = this.constructLqipUrl(options, options.lqip);
    }
  }

  constructLqipUrl(options:IkImageComponentOptions, lqip: LqipOptions): any {
    if (lqip && lqip.active) {
      var quality = Math.round(lqip.quality || lqip.threshold || 20);
      var blur = Math.round(lqip.blur || 6);
      var newTransformation = options.transformation ? [...options.transformation] : [];
      if (lqip.raw && typeof lqip.raw === "string" && lqip.raw.trim() != "") {
        newTransformation.push({
          raw: lqip.raw.trim()
        });
      } else {
        newTransformation.push({
          quality: String(quality),
          blur: String(blur),
        })
      }
      return this.imagekit.ikInstance.url({
        ...options,
        transformation: newTransformation
      });
    }
  }

  getConfigObject(options: IkImageComponentOptions): any {
    const config  = {
      transformation : options.transformation
    };
    
    if (options.urlEndpoint) {
      config['urlEndpoint'] = options.urlEndpoint;
    }
    if (options.queryParameters) {
      config['queryParameters'] = options.queryParameters;
    }
    if (options.src) {
      config['src'] = options.src;
      config['transformationPosition'] = 'query';
    } else if (options.path) {
      config['path'] = options.path;
      if (options.transformationPosition) {
        config['transformationPosition'] = options.transformationPosition;
      }
    } else {
      throw new Error('Missing src / path during initialization!');
    }
    return config;
  }

  loadImage(context: IkImageComponent, url: string): void {
    const nativeElement = context.el.nativeElement;
    const attributes = nativeElement.attributes;
    const attrsToSet = context.namedNodeMapToObject(attributes);
    attrsToSet['src'] = url;
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
        element.setAttribute(attrName, attributesLiteral[attrName]);
    });
  }
}
