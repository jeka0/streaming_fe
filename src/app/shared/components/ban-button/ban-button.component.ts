import { Component, Input } from '@angular/core';
import { UserService } from '../../services/user.service';
import { PenaltyService } from '../../services/penalty.service';
import { AdminService } from '../../services/admin.service';
import { BehaviorSubject, switchMap, of } from 'rxjs'
import { IUser } from '../../interfaces/user.interface';

@Component({
  selector: 'app-ban-button',
  templateUrl: './ban-button.component.html',
  styleUrls: ['./ban-button.component.css']
})
export class BanButtonComponent {
  @Input() user!: BehaviorSubject<IUser | undefined>;
  banned: Boolean = false;
  show: Boolean = true;
  userInfo?: IUser;

  constructor(
    private userService: UserService,
    private penaltyService: PenaltyService,
    private adminService: AdminService
  ){}

  ngOnInit(){
    this.user.pipe(
      switchMap(user=>{
        this.userInfo = user;
        return  this.userService.profile;
      }),
      switchMap(profile=>{
        this.show = profile?.role.name === "Admin" && profile?.id !== this.userInfo?.id;
        return this.userInfo?.id? this.penaltyService.checkUserBan(this.userInfo.id): of(false);
      })
    ).subscribe({
      next:(result)=>{
        this.banned = !!result;
      },
      error: (err)=>console.log(err)
    })
  }

  ban(){
    this.userInfo && this.adminService.banUser(this.userInfo.id).subscribe({
      next:()=>{this.banned = true},
      error:(err)=>console.log(err)
    });
  }

  unban(){
    this.userInfo && this.adminService.unbanUser(this.userInfo.id).subscribe({
      next:()=>{this.banned = false},
      error:(err)=>console.log(err)
    });
  }

}
