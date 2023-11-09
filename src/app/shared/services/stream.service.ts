import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IStream } from '../interfaces/stream.interface';

@Injectable({
  providedIn: 'root'
})
export class StreamService {

  constructor(private http: HttpClient) { }

  getUserLiveStream(id: Number): Observable<IStream>{
    return this.http.get<any>(`${environment.apiURL}/stream/live/user/${id}`);
  }
}
