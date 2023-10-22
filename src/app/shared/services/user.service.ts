import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/user.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  profile?: IUser;

  constructor(private http: HttpClient) { }

  getById(id: number): Observable<IUser> {
    return this.http.get<IUser>(`${environment.apiURL}/user/${id}`);
  }

  getCurrent(): Observable<IUser> {
    return this.http
      .get<IUser>(`${environment.apiURL}/user`)
      .pipe(
        tap((user) => {
          this.profile = user;
        }),
      );
  }

  getAll(): Observable<Array<IUser>> {
    return this.http
      .get<Array<IUser>>(`${environment.apiURL}/user/all`);
  }

  search(body: {
    name: string;
  }): Observable<Array<IUser>> {
    return this.http
      .post<Array<IUser>>(`${environment.apiURL}/user/search`, body);
  }

  updateCurrent(body: {
    password?: string;
    login?: string;
    image?: any
  }): Observable<{message: string}> {
    return this.http.put<{message: string}>(`${environment.apiURL}/user`, body);
  }

  deleteCurrent(): Observable<{message: string}>{
    return this.http.delete<{message: string}>(`${environment.apiURL}/user`);
  }
}
