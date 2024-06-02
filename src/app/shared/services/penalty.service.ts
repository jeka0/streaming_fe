import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IPenalty } from '../interfaces/penalty.interface';

@Injectable({
  providedIn: 'root'
})
export class PenaltyService {
  constructor(private http: HttpClient) { }

  checkUserBan(id: Number): Observable<IPenalty | boolean> {
    return this.http.get<IPenalty | boolean>(`${environment.apiURL}/penalty/check/${id}`);
  }
}
