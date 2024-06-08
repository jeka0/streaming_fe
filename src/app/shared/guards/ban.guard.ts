import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, map, of, switchMap } from 'rxjs';
import { UserService } from '../services/user.service';
import { PenaltyService } from '../services/penalty.service';
import { IUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class BanGuard implements CanActivate {
  flag: boolean = true;

  constructor(
    private userService: UserService,
    private penaltyService: PenaltyService,
    private router: Router
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
      return this.userService.getByLogin(route.params['name']).pipe(
        switchMap(user=>{
          return this.penaltyService.checkUserBan(user.id);
        }),
        switchMap(result=>{
          return result? this.userService.getCurr(): of(false);
        }),
        switchMap(result=>{
          if(!result) {
            return of(true);
          }
          
          const flag = (result as IUser).role.name === "Admin";
          if(!flag) this.router.navigateByUrl('error404');
          return of(flag);
        })
      )
  }
}
