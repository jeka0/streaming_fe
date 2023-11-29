import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowingButtonComponent } from './following-button.component';

describe('FollowingButtonComponent', () => {
  let component: FollowingButtonComponent;
  let fixture: ComponentFixture<FollowingButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowingButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowingButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
