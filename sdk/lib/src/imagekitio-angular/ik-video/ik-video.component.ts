import { Component, AfterViewInit, OnInit, ElementRef, Input, OnChanges } from '@angular/core';
import { ImagekitService } from '../imagekit.service';

@Component({
  selector: 'ik-video',
  template: `<video controls><source src={{src}}>`,
})

export class IkVideoComponent implements OnInit {
    @Input('urlEndpoint') urlEndpoint:string;
    @Input('path') path:string; //required
    @Input('src') src:string; //required
    @Input('transformation') transformation:Array<Object> = [];
    @Input('transformationPosition') transformationPosition:string;
    @Input('queryParameters') queryParameters:Object;
    url = '';

    constructor(private el: ElementRef, private imagekit: ImagekitService) { }
  
    ngOnInit(): void {
        this.setUrl(this.src, this.path, this.transformation, this.urlEndpoint, this.transformationPosition, this.queryParameters);
    }

    ngAfterViewInit() {
        this.loadVideo(this.url);
    }

    loadVideo(url:string) {
        const nativeElement = this.el.nativeElement;
        const attributes = nativeElement.attributes;
        const attrsToSet = this.namedNodeMapToObject(attributes);
        attrsToSet['src'] = url;
        const video = nativeElement.children[0];
        this.setElementAttributes(video, attrsToSet);
    }

    namedNodeMapToObject(source: NamedNodeMap): any {
        let target = {};
        Object.keys(source).forEach(index => {
          const name = source[index].name;
          const value = source[index].value;
          target[name] = value;
        });
        return target;
    };

    setUrl(src?, path?, transformation?, urlEndpoint?, transformationPosition?, queryParameters?) {
        const config = this.getConfigObject(src, path, transformation, transformationPosition, urlEndpoint, queryParameters)
        this.url = this.imagekit.getUrl(config);
    }

    getConfigObject(src?, path?, transformation?, transformationPosition?, urlEndpoint?, queryParameters?) {
        const config = {
          transformation: transformation,
        };
        if (urlEndpoint) {
          config['urlEndpoint'] = urlEndpoint;
        }
        if (queryParameters) {
          config['queryParameters'] = queryParameters;
        }
        if (src) {
          config['src'] = src;
          config['transformationPosition'] = 'query';
        } else if (path) {
          config['path'] = path;
          if (transformationPosition) {
            config['transformationPosition'] = transformationPosition;
          }
        } else {
          throw new Error('Missing src / path during initialization!');
        }
        return config;
      }

      setElementAttributes(element, attributesLiteral) {
        Object.keys(attributesLiteral).forEach(attrName => {
            element.setAttribute(attrName, attributesLiteral[attrName]);
        });
      }
}