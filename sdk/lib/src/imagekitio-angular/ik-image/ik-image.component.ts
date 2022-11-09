import { Component, AfterViewInit, OnInit, ElementRef, Input, OnChanges } from '@angular/core';
import { ImagekitService } from '../imagekit.service';
import { Dict, QueryParameters } from '../utility/ik-type-def-collection'
import { UrlOptions } from "imagekit-javascript/dist/src/interfaces";
import { Transformation, TransformationPosition } from 'imagekit-javascript/dist/src/interfaces/Transformation';

@Component({
  selector: 'ik-image',
  template: `<img src={{src}}>`,
})
export class IkImageComponent implements AfterViewInit, OnInit, OnChanges {
  @Input('src') src: string;
  @Input('path') path: string;
  @Input('urlEndpoint') urlEndpoint: string;
  @Input('transformation') transformation: Array<Transformation> = [];
  @Input('transformationPosition') transformationPosition: TransformationPosition;
  @Input('queryParameters') queryParameters: QueryParameters;
  @Input('lqip') lqip:{active?: boolean, quality?: number};
  url = '';
  lqipUrl = '';
  
  observer: MutationObserver;

  constructor(private el: ElementRef, private imagekit: ImagekitService) {
  }

  ngOnInit(): void {
    const urlOptions: UrlOptions =  this.src ? {src: this.src} : {path: this.path};
    urlOptions.transformation = this.transformation;
    urlOptions.transformationPosition = this.transformationPosition;
    urlOptions.urlEndpoint = this.urlEndpoint;
    urlOptions.queryParameters = this.queryParameters;
    this.setUrl(urlOptions, this.lqip);
  }

  ngOnChanges(): void {
    this.ngOnInit();
  }

  ngAfterViewInit(): void {
    if(this.el.nativeElement.attributes.loading &&
      this.el.nativeElement.attributes.loading.nodeValue == 'lazy'){
      const that = this;
      const imageObserver = new IntersectionObserver(function (entry:any, observer) {
        if (entry[0] && entry[0].isIntersecting) {
          let image = entry[0].target;
          that.loadImage(that.lqip && that.lqip.active ? that.lqipUrl : that.url);
          observer.unobserve(image);
        }
      });
      imageObserver.observe(this.el.nativeElement);
    } else {
      this.loadImage(this.lqip && this.lqip.active ? this.lqipUrl : this.url);
    }
  }

  setUrl(urlOptions: UrlOptions, lqip?:{active?:boolean, quality?:number}): void {
    const config = this.getConfigObject(urlOptions);
    this.url = this.imagekit.getUrl(config);
    if (lqip && lqip.active === true) {
      this.lqipUrl = this.lqipload(lqip.quality, this.url, this.path);
    }
  }

  getConfigObject(urlOptions: UrlOptions): Dict {
    const config: Dict  = {
      transformation : urlOptions.transformation
    };
    
    if (urlOptions.urlEndpoint) {
      config['urlEndpoint'] = urlOptions.urlEndpoint;
    }
    if (urlOptions.queryParameters) {
      config['queryParameters'] = urlOptions.queryParameters;
    }
    if (urlOptions.src) {
      config['src'] = urlOptions.src;
      config['transformationPosition'] = 'query';
    } else if (urlOptions.path) {
      config['path'] = urlOptions.path;
      if (urlOptions.transformationPosition) {
        config['transformationPosition'] = urlOptions.transformationPosition;
      }
    } else {
      throw new Error('Missing src / path during initialization!');
    }
    return config;
  }

  loadImage(url:string): void {
    const nativeElement = this.el.nativeElement;
    const attributes = nativeElement.attributes;
    const attrsToSet = this.namedNodeMapToObject(attributes);
    attrsToSet['src'] = url;
    const image = nativeElement.children[0];
    this.setElementAttributes(image, attrsToSet);
  }

  namedNodeMapToObject(source: NamedNodeMap): Dict {
    let target = {};
    Object.keys(source).forEach(index => {
      const name = source[index].name;
      const value = source[index].value;
      target[name] = value;
    });
    return target;
  };

  lqipload(quality:number, url:string, path:string): string {
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

  setElementAttributes(element:any, attributesLiteral:Dict): void {
    Object.keys(attributesLiteral).forEach(attrName => {
        element.setAttribute(attrName, attributesLiteral[attrName]);
    });
  }
}
