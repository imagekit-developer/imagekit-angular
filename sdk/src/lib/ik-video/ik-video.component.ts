import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { ImagekitService } from '../imagekitio-angular.service';
import { IkVideoComponentOptions, QueryParameters, Dict } from '../utility/ik-type-def-collection';
import { buildSrc, SrcOptions } from '@imagekit/javascript';
import type { Transformation } from '@imagekit/javascript'


@Component({
  selector: 'ik-video',
  template: `<video></video>`,
})

export class IkVideoComponent implements OnInit {
  @Input('urlEndpoint') urlEndpoint: string;
  @Input('src') src: string = "";
  @Input('transformation') transformation: Array<Transformation> = [];
  @Input('transformationPosition') transformationPosition: "path" | "query";
  @Input('queryParameters') queryParameters: QueryParameters;
  url = '';

  constructor(private el: ElementRef, private imagekit: ImagekitService) { }

  ngOnInit(): void {
    const options: IkVideoComponentOptions =  {
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
    if (this.url) {
      this.ngAfterViewInit();
    }
  }

  ngAfterViewInit(): void {
    if (!this.url) {
      return;
    }
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
    if (!options.urlEndpoint || options.urlEndpoint.trim() === "") {
      console.warn("urlEndpoint is neither provided in this component nor in any parent ImagekitService.");
      return null;
    }
    const strictOptions = options as SrcOptions
    this.url = buildSrc(strictOptions);
  }

  setElementAttributes(element: any, attributesLiteral: Dict): void {
    Object.keys(attributesLiteral).forEach(attrName => {
      if (attrName.startsWith('ng-') || attrName.startsWith('_ng')) {
        element.removeAttribute(attrName);
        return;
      }
      // This is required otherwise video attributes like muted, controls, autoplay do not work as expected.
      const videoPlaybackAttributes = ['autoplay', 'muted', 'controls', 'loop'];
      if (videoPlaybackAttributes.includes(attrName)) {
        element[attrName] = true;
      }
      element.setAttribute(attrName, attributesLiteral[attrName]);
    });
  }
}