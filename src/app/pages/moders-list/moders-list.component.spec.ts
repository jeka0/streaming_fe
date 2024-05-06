import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModersListComponent } from './moders-list.component';

describe('ModersListComponent', () => {
  let component: ModersListComponent;
  let fixture: ComponentFixture<ModersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModersListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
