import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { IkImageComponent } from '../../lib/src/imagekitio-angular/ik-image/ik-image.component';
import { ImagekitService } from '../../lib/src/imagekitio-angular/imagekit.service';

describe('IkImageComponent', () => {
  let component: IkImageComponent;
  let imageKitService: ImagekitService;

  beforeEach(() => {
    imageKitService = new ImagekitService({
      urlEndpoint: "url",
      publicKey: "pub",
      authenticationEndpoint: "auth"
    });
    let elRef: ElementRef;
    component = new IkImageComponent(elRef, imageKitService);
  });

  it('setUrl should create correct URL when src is provided', () => {
    component.setUrl('abc');
    expect(component.url).toContain('/abc?ik-sdk-version=angular-');
  });

  it('setUrl should create correct URL when path is provided', () => {
    component.setUrl(null, 'def');
    expect(component.url).toContain('/url/def?ik-sdk-version=angular-');
  });

  it('setUrl should create correct lqipURL in addition to URL when lqip is provided', () => {
    component.setUrl('abc', null, null, { active: true, quality: 1 });
    expect(component.url).toContain('/abc?ik-sdk-version=angular-');
    expect(component.lqipUrl).toContain('tr=q-1');
    console.log(component.lqipUrl)
  });

  it('lqipload should create correct url format if path is provided', () => {
    const lqipURl = component.lqipload(10, '/abc?ik-sdk-version=angular-0.0.0', '/xyz');
    expect(lqipURl).toContain('tr:q-10');
  });

  it('lqipload should create corrext url format if path is not provided', () => {
    const lqipURl = component.lqipload(10, '/abc?ik-sdk-version=angular-0.0.0', null);
    expect(lqipURl).toContain('tr=q-10');
  });
});
