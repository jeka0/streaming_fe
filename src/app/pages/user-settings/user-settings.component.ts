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
  errMessage?: string;

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
            [Validators.required, Validators.maxLength(15)]
          ),
          password: this.fb.control<string | undefined>(
            "",
            Validators.minLength(5)
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
      error: (err) => {
        this.errMessage = err.error;
        this.formGroup!.controls['login'].setErrors({'login': true});
      },
    });
  }

  change(){
    if(this.formGroup){
      const login = this.formGroup.controls['login'];
      const password = this.formGroup.controls['password'];
      login.patchValue(login.value.trim());
      password.patchValue(password.value.trim());
    }
  }


  onLoadImage(event: Event) {
    const formdata = new FormData();
    const target = <HTMLInputElement>event.target;
    if (target.files && target.files[0].type.match(/image\//)) {
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

  ngOnDestroy(){
    this.routeService.route.next(undefined);
  }
}
