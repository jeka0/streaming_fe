import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IMessage } from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }

  getAllByChat(id: Number): Observable<Array<IMessage>> {
    return this.http.get<Array<IMessage>>(`${environment.apiURL}/message/chat/${id}`);
  }
}
