import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/user.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  profile: BehaviorSubject<IUser | undefined>;
  private savedRange: IUser[] = []; 

  constructor(
    private http: HttpClient,
    private socketService: SocketService
  ) { 
    this.profile = new BehaviorSubject<IUser | undefined>(undefined); 
    this.profile.subscribe({
      next:(user)=>{
        if(user)this.savedRange=user?.subscription;
      },
      error:err=>console.log(err)
    })
  }

  getById(id: number): Observable<IUser> {
    return this.http.get<IUser>(`${environment.apiURL}/user/${id}`);
  }

  getByLogin(login: String): Observable<IUser> {
    return this.http.post<IUser>(`${environment.apiURL}/user/login`, { login});
  }

  getCurrent(): Observable<IUser> {
    return this.http
      .get<IUser>(`${environment.apiURL}/user`)
      .pipe(
        tap((user) => {
          this.trackingUpdate(user);
          this.profile.next(user);
        }),
      );
  }

  getAll(): Observable<Array<IUser>> {
    return this.http
      .get<Array<IUser>>(`${environment.apiURL}/user/all`);
  }

  generateNewStreamKey(): Observable<{message: string}> {
    return this.http
      .get<{message: string}>(`${environment.apiURL}/user/key`);
  }

  search(body: {
    name: string;
  }): Observable<Array<IUser>> {
    return this.http
      .post<Array<IUser>>(`${environment.apiURL}/user/search`, body);
  }

  updateCurrent(body: FormData): Observable<{message: string}> {
    return this.http.put<{message: string}>(`${environment.apiURL}/user`, body);
  }

  deleteCurrent(): Observable<{message: string}>{
    return this.http.delete<{message: string}>(`${environment.apiURL}/user`);
  }

  follow(id: Number): Observable<IUser>{
    return this.http.get<IUser>(`${environment.apiURL}/user/follow/${id}`)
    .pipe(
      tap((user) => {
        this.trackingUpdate(user);
        this.profile.next(user);
      }),
    );;
  }

  unfollow(id: Number): Observable<IUser>{
    return this.http.get<IUser>(`${environment.apiURL}/user/unfollow/${id}`)
    .pipe(
      tap((user) => {
        this.trackingUpdate(user);
        this.profile.next(user);
      }),
    );;
  }

  trackingUpdate(user: IUser){
      const set1 = new Set(this.savedRange);
      const set2 = new Set(user.subscription);
      this.socketService.joinRange(user.subscription.filter(e => !set1.has(e)));
      this.socketService.leaveRange(this.savedRange.filter(e => !set2.has(e)));
  }
}
