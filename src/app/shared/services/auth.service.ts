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
  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('accessToken');
    this.refToken = localStorage.getItem('refreshToken');
  }

  isAuth(): boolean {
    return !!this.token;
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.token = null;
  }

  login(body: {
    password: string;
    login: string;
  }): Observable<{ accessToken: string }> {
    return this.http
      .post<{ accessToken: string, refreshToken: string }>(`${environment.apiURL}/auth/login`, body)
      .pipe(
        tap((payload) => {
          this.token = payload.accessToken;
          this.refToken = payload.refreshToken;
          localStorage.setItem('refreshToken', this.refToken);
          localStorage.setItem('accessToken', this.token);
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
