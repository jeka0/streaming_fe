import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapperAdminComponent } from './wrapper-admin.component';

describe('WrapperAdminComponent', () => {
  let component: WrapperAdminComponent;
  let fixture: ComponentFixture<WrapperAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WrapperAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WrapperAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
