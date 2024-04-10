import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagekitioAngularComponent } from './imagekitio-angular.component';

describe('ImagekitioAngularComponent', () => {
  let component: ImagekitioAngularComponent;
  let fixture: ComponentFixture<ImagekitioAngularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImagekitioAngularComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagekitioAngularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
