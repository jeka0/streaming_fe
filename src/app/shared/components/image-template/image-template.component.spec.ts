import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageTemplateComponent } from './image-template.component';

describe('ImageTemplateComponent', () => {
  let component: ImageTemplateComponent;
  let fixture: ComponentFixture<ImageTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
