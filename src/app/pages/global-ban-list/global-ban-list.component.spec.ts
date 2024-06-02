import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalBanListComponent } from './global-ban-list.component';

describe('GlobalBanListComponent', () => {
  let component: GlobalBanListComponent;
  let fixture: ComponentFixture<GlobalBanListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalBanListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalBanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
