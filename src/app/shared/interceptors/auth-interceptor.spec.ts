import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthInterceptor } from './auth-interceptor';
import { randomString } from '@unit-tests';
import { AuthService } from '../services/auth.service';

describe('AuthInterceptor', () => {
  let http: HttpClient;
  let httpController: HttpTestingController;
  let authServiceMock = {
    access_token: '',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should insert JWT token in Authorization header for each request', function () {
    const token = randomString(24);
    authServiceMock.access_token = token;

    // simply send request, we don't care about the response
    http.get('/secure').subscribe();

    const req = httpController.expectOne('/secure');
    const headers = req.request.headers;

    expect(headers.get('Authorization')).toEqual(`Bearer ${token}`);
  });
});
