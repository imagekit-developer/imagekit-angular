import { Component, AfterViewInit, OnInit, OnDestroy, ElementRef, Input } from '@angular/core';
import { ImagekitService } from '../imagekit.service';

@Component({
  selector: 'ik-image',
  template: `<img src={{src}}>`,
  providers: [ImagekitService]
})
export class IkImageComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input('src') src:string;
  @Input('path') path:string;
  @Input('transformation') transformation:Array<Object> = [];
  @Input('lqip') lqip:any;
  url = '';

  observer: MutationObserver;

  constructor(private el: ElementRef, private imagekit: ImagekitService) {
  }

  ngOnInit(): void {
    // Create an observer instance
    this.observer = new MutationObserver(() => {
        this.loadImage();
    });
    // Observe changes to attributes or child transformations to re-render the image
    const config = {attributes: true, childList: true};

    // pass in the target node, as well as the observer options
    this.observer.observe(this.el.nativeElement, config);
}

  ngOnDestroy(): void {
    this.observer.disconnect();
  }

  ngAfterViewInit() {
    this.loadImage();
  }

  loadImage() {
    const nativeElement = this.el.nativeElement;
    const image = nativeElement.children[0];
    if (this.src) {
      this.url = this.imagekit.ikInstance.url({ src: this.src, transformation: this.transformation, transformationPosition: "query" });
    } else if (this.path) {
      this.url = this.imagekit.ikInstance.url({ path: this.path, transformation: this.transformation });
    } else {
      throw new Error('Missing src / path during initialization!');
    }
    this.setElementAttributes(image, {"src": this.url});
  }

  setElementAttributes(element, attributesLiteral) {
    Object.keys(attributesLiteral).forEach(attrName => {
        element.setAttribute(attrName, attributesLiteral[attrName]);
    });
  }
}
