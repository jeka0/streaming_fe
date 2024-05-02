import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {
  route: BehaviorSubject<string | undefined>;

  constructor() {
    this.route = new BehaviorSubject<string | undefined>(undefined); 
  }
}
