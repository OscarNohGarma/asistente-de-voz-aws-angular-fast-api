import { TestBed } from '@angular/core/testing';

import { AlertSocketService } from './alert-socket.service';

describe('AlertSocketService', () => {
  let service: AlertSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
