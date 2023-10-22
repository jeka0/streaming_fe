import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Router } from '@angular/router';
import { IUser } from 'src/app/shared/interfaces/user.interface';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.css']
})
export class WrapperComponent {
  profile?: IUser;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private router: Router,
    ){
      this.userService.getCurrent().subscribe({
        next: user=>{this.profile = user},
        error: (err) => console.error(err),
      });
    }

  logout(){
    this.authService.logout();
    this.router.navigateByUrl('login')
  }
}
