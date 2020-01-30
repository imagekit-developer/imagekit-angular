import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IkUploadComponent } from './ik-upload.component';

describe('IkUploadComponent', () => {
  let component: IkUploadComponent;
  let fixture: ComponentFixture<IkUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IkUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
