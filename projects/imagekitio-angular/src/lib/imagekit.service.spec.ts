import { TestBed } from '@angular/core/testing';

import { ImagekitService } from './imagekit.service';

describe('ImagekitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImagekitService = TestBed.get(ImagekitService);
    expect(service).toBeTruthy();
  });
});
