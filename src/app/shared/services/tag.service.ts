import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITag } from '../interfaces/tag';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(
    private http: HttpClient
  ) { }

  searchTag(name: string): Observable<ITag[]>{
    return this.http.post<ITag[]>(`${environment.apiURL}/tag/search`, {name});
  }
}
