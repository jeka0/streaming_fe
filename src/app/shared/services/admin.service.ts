import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from '../interfaces/user.interface';
import { IPenalty } from '../interfaces/penalty.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  getAdminRange(page: Number, limit: Number): Observable<{data:IUser[], total:number}>{
    let url = `${environment.apiURL}/admin/all?page=${page}&limit=${limit}`;

    return this.http.get<{data:IUser[], total:number}>(url);
  }

  getBanRange(page: Number, limit: Number, status?: string): Observable<{data:IPenalty[], total:number}>{
    let url = `${environment.apiURL}/admin/ban/all?page=${page}&limit=${limit}`;

    if(status)url = `${url}&status=${status}`;

    return this.http.get<{data:IPenalty[], total:number}>(url);
  }

  addAdmin(id: Number): Observable<{message: string}>{
    return this.http.get<{message: string}>(`${environment.apiURL}/admin/${id}`);
  }

  removeAdmin(id: Number): Observable<{message: string}>{
    return this.http.delete<{message: string}>(`${environment.apiURL}/admin/${id}`);
  }

  banUser(id: Number): Observable<{message: string}>{
    return this.http.get<{message: string}>(`${environment.apiURL}/admin/ban/${id}`);
  }

  unbanUser(id: Number): Observable<{message: string}>{
    return this.http.get<{message: string}>(`${environment.apiURL}/admin/unban/${id}`);
  }
}
