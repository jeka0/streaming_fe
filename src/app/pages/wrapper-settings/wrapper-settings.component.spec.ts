import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapperSettingsComponent } from './wrapper-settings.component';

describe('WrapperSettingsComponent', () => {
  let component: WrapperSettingsComponent;
  let fixture: ComponentFixture<WrapperSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WrapperSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WrapperSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
