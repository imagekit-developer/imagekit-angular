import { Component, AfterViewInit, OnInit, ElementRef, Input, OnChanges } from '@angular/core';
import { ImagekitService } from '../imagekit.service';
import { Dict, QueryParameters, IkImageComponentOptions, LqipOptions } from '../utility/ik-type-def-collection'
import { Transformation } from 'imagekit-javascript/dist/src/interfaces/Transformation';

@Component({
  selector: 'ik-image',
  template: `<img>`,
})
export class IkImageComponent implements AfterViewInit, OnInit, OnChanges {
  @Input('src') src: string;
  @Input('path') path: string;
  @Input('urlEndpoint') urlEndpoint: string;
  @Input('transformation') transformation: Array<Transformation> = [];
  @Input('transformationPosition') transformationPosition: "path" | "query";
  @Input('queryParameters') queryParameters: QueryParameters;
  @Input('lqip') lqip: LqipOptions;
  @Input('loading') loading: "lazy";
  url = '';
  lqipUrl = '';
  
  observer: MutationObserver;

  constructor(private el: ElementRef, private imagekit: ImagekitService) {
  }

  ngOnInit(): void {
    const options: IkImageComponentOptions =  this.src ? {src: this.src} : {path: this.path};
    options.transformation = this.transformation;
    options.transformationPosition = this.transformationPosition;
    options.urlEndpoint = this.urlEndpoint;
    options.queryParameters = this.queryParameters;
    options.lqip = this.lqip;
    this.setUrl(options);
  }

  ngOnChanges(): void {
    this.ngOnInit();
  }

  ngAfterViewInit(): void {
    if(this.loading == 'lazy'){
      const that = this;
      const imageObserver = new IntersectionObserver(
        (entry: any, observer: IntersectionObserver)=>{
          that.handleIntersectionObserver(entry, observer, that.loadImage, that.lqip, that.lqipUrl, that.url);
        }
      );
      imageObserver.observe(this.el.nativeElement);
    } else {
      this.loadImage(this.lqip && this.lqip.active ? this.lqipUrl : this.url);
    }
  }

  handleIntersectionObserver (entry: any, observer: IntersectionObserver, 
    loadImageFunc: Function, lqip: LqipOptions, lqipUrl: string, url: string): void {
    if (entry[0] && entry[0].isIntersecting) {
      let image = entry[0].target;
      loadImageFunc(lqip && lqip.active ? lqipUrl : url);
      observer.unobserve(image);
    }
  }

  setUrl(options: IkImageComponentOptions): void {
    const config = this.getConfigObject(options);
    this.url = this.imagekit.getUrl(config);
    if (options.lqip && options.lqip.active === true) {
      this.lqipUrl = this.lqipload(options.lqip.quality, this.url, this.path);
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

  loadImage(url: string): void {
    const nativeElement = this.el.nativeElement;
    const attributes = nativeElement.attributes;
    const attrsToSet = this.namedNodeMapToObject(attributes);
    attrsToSet['src'] = url;
    const image = nativeElement.children[0];
    this.setElementAttributes(image, attrsToSet);
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

  lqipload(quality: number, url: string, path: string): string {
    let lqip = "";
    if (path) {
      let newUrl = url.split("tr:");
      if (newUrl[0] === url) {
        let temp = url.split("/");
        lqip = `${temp[0]}//${temp[2]}/${temp[3]}/tr:q-${quality}/${temp[4]}`;
      } else {
        lqip = `${newUrl[0]}tr:q-${quality}${newUrl[1]}`;
      }
    } else {
      lqip = `${url}?tr=q-${quality}`;
    }
    return lqip;
  }

  setElementAttributes(element: any, attributesLiteral: Dict): void {
    Object.keys(attributesLiteral).forEach(attrName => {
        element.setAttribute(attrName, attributesLiteral[attrName]);
    });
  }
}
