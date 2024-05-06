import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IChat } from '../interfaces/chat.interface';
import { IUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  getChatModers(id: Number): Observable<IUser[]>{
    return this.http.get<IUser[]>(`${environment.apiURL}/chat/moders/${id}`);
  }

  addModerator(chatId: Number, moderId: Number): Observable<IChat>{
    return this.http.post<IChat>(`${environment.apiURL}/chat/join/${chatId}`, { moderId });
  }

  removeModerator(chatId: Number, moderId: Number): Observable<IChat>{
    return this.http.post<IChat>(`${environment.apiURL}/chat/leave/${chatId}`, { moderId });
  }
}
