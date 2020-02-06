import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IkImageComponent } from './ik-image.component';

describe('IkImageComponent', () => {
  let component: IkImageComponent;
  let fixture: ComponentFixture<IkImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IkImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IkImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
