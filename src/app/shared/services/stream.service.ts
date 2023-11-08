import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StreamService {

  constructor(private http: HttpClient) { }

  getUserLiveStream(id: Number): Observable<any>{
    return this.http.get<any>(`${environment.apiURL}/stream/live/user/${id}`);
  }
}
