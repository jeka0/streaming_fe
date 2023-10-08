import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token: string | null = null;
  refToken: string | null = null;
  userLogin: string | null = null;
  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('accessToken');
    this.refToken = localStorage.getItem('refreshToken');
    this.userLogin = localStorage.getItem('login');
  }

  logout() {
    localStorage.removeItem('login');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.token = null;
    this.userLogin = null;
  }

  login(body: {
    password: string;
    login: string;
  }): Observable<{ accessToken: string }> {
    return this.http
      .post<{ accessToken: string, refreshToken: string }>(`${environment.apiURL}/auth/login`, body)
      .pipe(
        tap((payload) => {
          console.log(payload)
          this.token = payload.accessToken;
          this.refToken = payload.refreshToken;
          this.userLogin = body.login;
          localStorage.setItem('refreshToken', this.refToken);
          localStorage.setItem('accessToken', this.token);
          localStorage.setItem('login', this.userLogin);
        }),
      );
  }
  register(body: {
    password: string;
    login: string;
  }): Observable<{message: string}>{
    return this.http.post<{message: string}>(`${environment.apiURL}/auth/register`, body)
  }
}
