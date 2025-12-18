import { Component, OnInit, ElementRef, Input, OnChanges, AfterViewInit } from '@angular/core';
import { ImagekitService } from '../imagekit-angular.service';
import { IkVideoComponentOptions, QueryParameters, Dict } from '../utility/ik-type-def-collection';
import { buildSrc, SrcOptions } from '@imagekit/javascript';
import type { Transformation } from '@imagekit/javascript'
import { namedNodeMapToObject, setElementAttributes } from '../utility/utils';


@Component({
  selector: 'ik-video',
  template: `<video></video>`,
})

export class IkVideoComponent implements OnInit, OnChanges, AfterViewInit {
  @Input('urlEndpoint') urlEndpoint: string;
  @Input('src') src: string = "";
  @Input('transformation') transformation: Array<Transformation> = [];
  @Input('transformationPosition') transformationPosition: "path" | "query";
  @Input('queryParameters') queryParameters: QueryParameters;
  url = '';
  selector = 'ik-video';

  constructor(private el: ElementRef, private imagekit: ImagekitService) { }

  ngOnInit(): void {
    this.buildOptionsAndSetUrl();
  }

  ngOnChanges(): void {
    this.buildOptionsAndSetUrl();
    this.loadVideo(this.url);
  }

  ngAfterViewInit(): void {
    this.loadVideo(this.url);
  }


  buildOptionsAndSetUrl(): void {
    const options: IkVideoComponentOptions =  {
      src: this.src,
      urlEndpoint: this.urlEndpoint ? this.urlEndpoint : this.imagekit.ikInstance.options.urlEndpoint,
      transformation: this.transformation,
      transformationPosition: this.transformationPosition,
      queryParameters: this.queryParameters,
    };
    this.setUrl(options);
  }

  setUrl(options: IkVideoComponentOptions): void {
    if (!options.urlEndpoint || options.urlEndpoint.trim() === "") {
      console.warn("urlEndpoint is neither provided in this component nor in any parent ImagekitService.");
      return null;
    }
    const strictOptions = options as SrcOptions
    try {
      this.url = buildSrc(strictOptions);
    } catch (error) {
      console.error("Error generating src: ", error);
      this.url = '';
    }
  }
 
  loadVideo(url:string): void {
    if (!url) {
      return;
    }
    const nativeElement = this.el.nativeElement;
    const attributes = nativeElement.attributes;
    const attrsToSet = namedNodeMapToObject(attributes);
    attrsToSet['src'] = url;
    const video = nativeElement.children[0];
    setElementAttributes(video, attrsToSet, this.selector);
  }
}