import { TestBed } from '@angular/core/testing';

import { LiveGuard } from './live.guard';

describe('LiveGuard', () => {
  let guard: LiveGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LiveGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
