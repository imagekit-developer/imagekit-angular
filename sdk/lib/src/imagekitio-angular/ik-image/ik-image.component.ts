import { Component, AfterViewInit, OnInit, ElementRef, Input } from '@angular/core';
import { ImagekitService } from '../imagekit.service';

@Component({
  selector: 'ik-image',
  template: `<img src={{src}}>`,
  providers: [ImagekitService]
})
export class IkImageComponent implements AfterViewInit, OnInit {
  @Input('src') src:string;
  @Input('path') path:string;
  @Input('transformation') transformation:Array<Object> = [];
  @Input('lqip') lqip:any;
  url = '';
  lqipUrl = '';

  observer: MutationObserver;

  constructor(private el: ElementRef, private imagekit: ImagekitService) {
  }

  ngOnInit(): void {
    this.setUrl(this.src, this.path, this.transformation, this.lqip);
  }

  ngAfterViewInit() {
    const that = this;
    this.loadImage(this.lqip && this.lqip.active ? this.lqipUrl : this.url);
    const imageObserver = new IntersectionObserver(function (entry:any, observer) {
      if (entry[0] && entry[0].isIntersecting) {
        let image = entry[0].target;
        that.loadImage(that.url);
        imageObserver.unobserve(image);
      }
    });
    imageObserver.observe(this.el.nativeElement);
  }

  setUrl(src, path, transformation, lqip) {
    if (src) {
      this.url = this.imagekit.ikInstance.url({ src: src, transformation: transformation, transformationPosition: "query" });
    } else if (path) {
      this.url = this.imagekit.ikInstance.url({ path: path, transformation: transformation });
    } else {
      throw new Error('Missing src / path during initialization!');
    }

    if (lqip !== undefined && lqip.active === true) {
      this.lqipUrl = this.lqipload(lqip.quality);
    }
  }

  loadImage(url:string) {
    const nativeElement = this.el.nativeElement;
    const attributes = nativeElement.attributes;
    const attrsToSet = this.namedNodeMapToObject(attributes);
    attrsToSet['src'] = url;
    const image = nativeElement.children[0];
    this.setElementAttributes(image, attrsToSet);
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

  lqipload(quality) {
    let url = this.url;
    let lqip = "";
    if (this.path !== undefined) {
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

  setElementAttributes(element, attributesLiteral) {
    Object.keys(attributesLiteral).forEach(attrName => {
        element.setAttribute(attrName, attributesLiteral[attrName]);
    });
  }
}
