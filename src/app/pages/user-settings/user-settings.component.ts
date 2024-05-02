import { Component } from '@angular/core';
import { IUser } from 'src/app/shared/interfaces/user.interface';
import { UserService } from 'src/app/shared/services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { mergeMap, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { RoutesService } from 'src/app/shared/services/routes.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent {
  profile?: IUser;
  formGroup?: FormGroup;
  image: BehaviorSubject<string | undefined>;

  constructor(
    private userService: UserService,
    private readonly fb: FormBuilder,
    private router: Router,
    private routeService: RoutesService
  ){
    this.image = new BehaviorSubject<string | undefined>(undefined);
  }

  ngOnInit(){
    this.routeService.route.next(this.router.url);
    this.userService.profile.subscribe({
      next: profile=>{
        this.profile=profile;
        if(this.profile?.image)this.image.next(this.profile.image);
        this.formGroup = this.fb.group({
          login: this.fb.control<string | undefined>(
            profile?.login,
            Validators.required
          ),
          password: this.fb.control<string | undefined>(
            ""
          ),
          avatar: this.fb.control<string>(String(profile?.image || '')),
        });
      },
      error: err=>console.log(err)
    })
  }

  updateUser() {
    const data = this.formGroup!.value;
    delete data.avatar;
    data.password = data.password.trim()
    if(!data.password) delete data.password;
    this.userService.updateCurrent(data).pipe(
      mergeMap(()=>this.userService.getCurrent())
    ).subscribe({
      next: () => {},
      error: (err) => {this.formGroup!.controls['login'].setErrors({'login': true})},
    });
  }

  onLoadImage(event: Event) {
    const formdata = new FormData();
    const target = <HTMLInputElement>event.target;
    if (target.files) {
      formdata.append('image', target.files[0]);
      this.userService.updateCurrent(formdata)
      .pipe(
        mergeMap(()=>this.userService.getCurrent())
      )
      .subscribe({
        next:(user)=>{},
        error:err=>console.log(err)
      })
    }
  }

}
