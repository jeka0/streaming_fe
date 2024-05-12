import { Injectable } from '@angular/core';
import { ICategory } from '../interfaces/category.interface';
import { Observable } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getAllCategorys(): Observable<Array<ICategory>> {
    return this.http.get<Array<ICategory>>(`${environment.apiURL}/category/all`);
  }
}
