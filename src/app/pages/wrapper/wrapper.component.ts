import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Router } from '@angular/router';
import { IUser } from 'src/app/shared/interfaces/user.interface';
import { SocketService } from 'src/app/shared/services/socket.service';
import { switchMap } from 'rxjs'

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.css']
})
export class WrapperComponent {
  profile?: IUser;
  list: IUser[] = [];

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly socketService: SocketService,
    private router: Router,
    ){
      this.userService.getCurrent().pipe(
        switchMap((user)=>{
          return userService.profile;
        })
      ).subscribe({
        next: user=>{this.profile = user; if(user)this.list = user.subscription;},
        error: (err) => console.error(err),
      });
      this.socketService.connect();
    }

  logout(){
    this.authService.logout();
    this.router.navigateByUrl('login')
  }

  ngOnDestroy(){
    this.socketService.disconnect();
  }
}
