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

  getLiveStreams():Observable<IStream[]>{
    return this.http.get<IStream[]>(`${environment.apiURL}/stream/live`);
  }

  getUserStreams(id: Number): Observable<IStream[]>{
    return this.http.get<IStream[]>(`${environment.apiURL}/stream/user/${id}`);
  }

  getStreamByRecording(name: string): Observable<IStream>{
    return this.http.get<IStream>(`${environment.apiURL}/stream/recording/${name}`);
  }

  getStreamsRange(page: Number, limit: Number, order?: String, category?: String): Observable<{data:IStream[], total:number}>{
    let url = `${environment.apiURL}/stream/streams?page=${page}&limit=${limit}`;

    if(order)url = `${url}&order=${order}`;
    if(category)url = `${url}&category=${category}`; 

    return this.http.get<{data:IStream[], total:number}>(url);
  }

  getUserStreamsRange(id: Number, page: Number, limit: Number, order?: String, category?: String): Observable<{data:IStream[], total:number}>{
    let url = `${environment.apiURL}/stream/streams/user/${id}?page=${page}&limit=${limit}`;

    if(order)url = `${url}&order=${order}`;
    if(category)url = `${url}&category=${category}`; 

    return this.http.get<{data:IStream[], total:number}>(url);
  }

  getLiveStreamsRange(page: Number, limit: Number, order?: String, category?: String): Observable<{data:IStream[], total:number}>{
    let url = `${environment.apiURL}/stream/streams/live?page=${page}&limit=${limit}`;

    if(order)url = `${url}&order=${order}`;
    if(category)url = `${url}&category=${category}`; 

    return this.http.get<{data:IStream[], total:number}>(url);
  }

  deleteStream(id: Number): Observable<{message: string}>{
    return this.http.delete<{message: string}>(`${environment.apiURL}/stream/${id}`);
  }
}
