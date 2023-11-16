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

  getLiveStream(streamKey: String): Observable<IStream>{
    return this.http.post<IStream>(`${environment.apiURL}/stream/live/key`, {streamKey});
  }

  getLiveStreams():Observable<any>{
    return this.http.get<any>('http://localhost:8888/api/streams');
  }
}
