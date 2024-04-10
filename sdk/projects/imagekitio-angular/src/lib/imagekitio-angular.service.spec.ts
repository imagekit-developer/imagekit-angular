import { TestBed } from '@angular/core/testing';

import { ImagekitioAngularService } from './imagekitio-angular.service';

describe('ImagekitioAngularService', () => {
  let service: ImagekitioAngularService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImagekitioAngularService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
