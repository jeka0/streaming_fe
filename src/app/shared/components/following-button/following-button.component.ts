import { Component, Input } from '@angular/core';
import { UserService } from '../../services/user.service';
import { BehaviorSubject, switchMap } from 'rxjs'
import { IUser } from '../../interfaces/user.interface';

@Component({
  selector: 'app-following-button',
  templateUrl: './following-button.component.html',
  styleUrls: ['./following-button.component.css']
})
export class FollowingButtonComponent {
  @Input() user!: BehaviorSubject<IUser | undefined>;
  subscribed: Boolean = false;
  show: Boolean = true;
  userInfo?: IUser;

  constructor(
    private userService: UserService
  ){}

  ngOnInit(){
    this.user.pipe(
      switchMap(user=>{
        this.userInfo = user;
        return this.userService.profile
      })
    ).subscribe({
      next:(profileUser)=>{
        this.subscribed = profileUser?.subscription.some((user)=>user.id === this.userInfo!.id) || false
        this.show = profileUser?.id != this.userInfo?.id 
      },
      error: (err)=>console.log(err)
    })
  }

  subscribe(){
    this.userInfo && this.userService.follow(this.userInfo.id).subscribe({
      next:(user)=>{},
      error:(err)=>console.log(err)
    });
  }

  unsubscribe(){
    this.userInfo && this.userService.unfollow(this.userInfo.id).subscribe({
      next:(user)=>{},
      error:(err)=>console.log(err)
    });
  }
}
