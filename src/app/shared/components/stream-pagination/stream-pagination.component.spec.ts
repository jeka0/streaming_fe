import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamPaginationComponent } from './stream-pagination.component';

describe('StreamPaginationComponent', () => {
  let component: StreamPaginationComponent;
  let fixture: ComponentFixture<StreamPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StreamPaginationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StreamPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
