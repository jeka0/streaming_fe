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

  getLiveStream(name: String): Observable<IStream>{
    return this.http.post<IStream>(`${environment.apiURL}/stream/live/name`, {name});
  }

  getLiveStreams():Observable<any>{
    return this.http.get<any>('http://localhost:8888/api/streams');
  }

  getUserStreams(id: Number): Observable<IStream[]>{
    return this.http.get<IStream[]>(`${environment.apiURL}/stream/user/${id}`);
  }

  getStreamByRecording(name: string): Observable<IStream>{
    return this.http.get<IStream>(`${environment.apiURL}/stream/recording/${name}`);
  }
}
