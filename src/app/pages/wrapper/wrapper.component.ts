import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Router } from '@angular/router';
import { IUser } from 'src/app/shared/interfaces/user.interface';
import { SocketService } from 'src/app/shared/services/socket.service';
import { switchMap, BehaviorSubject } from 'rxjs'

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.css']
})
export class WrapperComponent {
  profile?: IUser;
  list: IUser[] = [];
  image: BehaviorSubject<string | undefined>;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly socketService: SocketService,
    private router: Router,
    ){
      socketService.init();
      this.image = new BehaviorSubject<string | undefined>(undefined);
      this.userService.getCurrent().pipe(
        switchMap((user)=>{
          return userService.profile;
        })
      ).subscribe({
        next: user=>{
          this.profile = user; 
          if(user){
            this.list = user.subscription;
            if(user.image)this.image.next(user.image);
          }
        },
        error: (err) => console.error(err),
      });
      this.socketService.connect();
      this.socketService.socket.on('startAlert', (user)=>{
        console.log("start")
        if(this.profile){
          const indx = this.profile.subscription.findIndex(u=>u.id === user.id);
          if(indx>-1) {
            this.profile.subscription[indx] = user;
            this.list[indx] = user; 
          }
        }
      })
      this.socketService.socket.on('endAlert', (user)=>{
        console.log("end")
        if(this.profile){
          const indx = this.profile.subscription.findIndex(u=>u.id === user.id);
          if(indx>-1) {
            this.profile.subscription[indx] = user;
            this.list[indx] = user; 
          }
        }
      })
    }

  logout(){
    this.authService.logout();
    this.router.navigateByUrl('login')
  }

  ngOnDestroy(){
    this.socketService.disconnect();
  }
}
