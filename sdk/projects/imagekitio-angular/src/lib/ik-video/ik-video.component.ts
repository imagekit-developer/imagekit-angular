import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { ImagekitService } from '../imagekitio-angular.service';
import { IkVideoComponentOptions, QueryParameters, Dict } from '../utility/ik-type-def-collection'
import { Transformation } from 'imagekit-javascript/dist/src/interfaces/Transformation';


@Component({
  selector: 'ik-video',
  template: `<video controls><source src={{src}}>`,
})

export class IkVideoComponent implements OnInit {
  @Input('urlEndpoint') urlEndpoint: string;
  @Input('path') path: string; //required
  @Input('src') src: string; //required
  @Input('transformation') transformation: Array<Transformation> = [];
  @Input('transformationPosition') transformationPosition: "path" | "query";
  @Input('queryParameters') queryParameters: QueryParameters;
  url = '';

  constructor(private el: ElementRef, private imagekit: ImagekitService) { }

  ngOnInit(): void {
    const options: IkVideoComponentOptions =  this.src ? {src: this.src} : {path: this.path};
    options.transformation = this.transformation;
    options.transformationPosition = this.transformationPosition;
    options.urlEndpoint = this.urlEndpoint;
    options.queryParameters = this.queryParameters;
    this.setUrl(options);
  }

  ngAfterViewInit(): void {
      this.loadVideo(this.url);
  }

  loadVideo(url:string): void {
      const nativeElement = this.el.nativeElement;
      const attributes = nativeElement.attributes;
      const attrsToSet = this.namedNodeMapToObject(attributes);
      attrsToSet['src'] = url;
      const video = nativeElement.children[0];
      this.setElementAttributes(video, attrsToSet);
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

  setUrl(options: IkVideoComponentOptions): void {
      const config = this.getConfigObject(options);
      this.url = this.imagekit.getUrl(config);
  }

  getConfigObject(options: IkVideoComponentOptions): any {
    const config = {
      transformation: options.transformation,
    };
    if (options.urlEndpoint) {
      config['urlEndpoint'] = options.urlEndpoint;
    } else{
      throw new Error('Missing urlEndpoint initialization!');
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

  setElementAttributes(element: any, attributesLiteral: Dict): void {
    Object.keys(attributesLiteral).forEach(attrName => {
        element.setAttribute(attrName, attributesLiteral[attrName]);
    });
  }
}