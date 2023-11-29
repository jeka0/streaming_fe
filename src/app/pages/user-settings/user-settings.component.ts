import { Component } from '@angular/core';
import { IUser } from 'src/app/shared/interfaces/user.interface';
import { UserService } from 'src/app/shared/services/user.service';
import { SettingsService } from 'src/app/shared/services/settings.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { mergeMap, BehaviorSubject, Subject } from 'rxjs';
import { ISettings } from 'src/app/shared/interfaces/settings.interface';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent {
  profile?: IUser;
  formGroup?: FormGroup;
  formGroup2?: FormGroup;
  image: BehaviorSubject<string | undefined>;
  settings: Subject<ISettings>

  constructor(
    private userService: UserService,
    private settingsService: SettingsService,
    private readonly fb: FormBuilder,
  ){
    this.image = new BehaviorSubject<string | undefined>(undefined);
    this.settings = new Subject<ISettings>;
  }

  ngOnInit(){
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
    this.settings.subscribe({
      next:(settings)=>{
        this.formGroup2 = this.fb.group({
          stream_title: this.fb.control<string | undefined>(
            settings.stream_title
          ),
          category:this.fb.control<string>(
            settings.category,
            Validators.required
          ),
        })
      },
      error:err=>console.log(err)
    })
    this.settingsService.getSettings().subscribe({
      next:(settings)=>this.settings.next(settings),
      error:err=>console.log(err)
    })
  }

  generateNewKey(){
    this.userService.generateNewStreamKey().pipe(
      mergeMap(()=>this.userService.getCurrent())
    ).subscribe({
      next: () => {},
      error: (err) => console.error(err),
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

  updateSettings(){
    this.settingsService.updateSettings(this.formGroup2!.value).pipe(
      mergeMap(()=>this.settingsService.getSettings())
    ).subscribe({
      next:(settings)=>this.settings.next(settings),
      error:err=>console.log(err)
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
