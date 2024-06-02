import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IStatus } from '../interfaces/status.interface';

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  constructor(private http: HttpClient) { }

  getAllStatuses(): Observable<Array<IStatus>> {
    return this.http.get<Array<IStatus>>(`${environment.apiURL}/status/all`);
  }
}
