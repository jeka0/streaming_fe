import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ISettings } from '../interfaces/settings.interface';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private http: HttpClient,
  ) { }

  updateSettings(body: FormData): Observable<{message: string}> {
    return this.http.put<{message: string}>(`${environment.apiURL}/settings`, body);
  }

  getSettings(): Observable<ISettings> {
    return this.http.get<ISettings>(`${environment.apiURL}/settings`);
  }
}
