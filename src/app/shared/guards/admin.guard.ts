import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanActivateChild {
  constructor(
    private userService: UserService,
    private router: Router
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean>{
      return this.userService.getCurr().pipe(
        map((user)=> {
          const flag = user?.role.name === "Admin";
          if(!flag) this.router.navigateByUrl("/");
          return flag;
        })
      )
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean>{
      return this.userService.getCurr().pipe(
        map((user)=> {
          const flag = user?.role.name === "Admin";
          if(!flag) this.router.navigateByUrl("/");
          return flag;
        })
      )
  }
  
}
