import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';
import { SettingsService } from 'src/app/shared/services/settings.service';
import { mergeMap, Subject } from 'rxjs';
import { ISettings } from 'src/app/shared/interfaces/settings.interface';
import { IUser } from 'src/app/shared/interfaces/user.interface';
import { Router } from '@angular/router';
import { RoutesService } from 'src/app/shared/services/routes.service';

@Component({
  selector: 'app-stream-settings',
  templateUrl: './stream-settings.component.html',
  styleUrls: ['./stream-settings.component.css']
})
export class StreamSettingsComponent {
  profile?: IUser;
  formGroup?: FormGroup;
  streamKey?: String;
  settings: Subject<ISettings>

  constructor(
    private userService: UserService,
    private settingsService: SettingsService,
    private readonly fb: FormBuilder,
    private router: Router,
    private routeService: RoutesService
  ){
    this.settings = new Subject<ISettings>;
  }

  ngOnInit(){
    this.routeService.route.next(this.router.url);
    this.userService.profile.subscribe({
      next: profile=>{
        this.profile=profile;
        if(this.profile?.streamKey){
          this.streamKey = `${this.profile.login}?secret=${this.profile.streamKey}`;
        }
      },
      error: err=>console.log(err)
    })
    this.settings.subscribe({
      next:(settings)=>{
        this.formGroup = this.fb.group({
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

  updateSettings(){
    this.settingsService.updateSettings(this.formGroup!.value).pipe(
      mergeMap(()=>this.settingsService.getSettings())
    ).subscribe({
      next:(settings)=>this.settings.next(settings),
      error:err=>console.log(err)
    });
  }

  ngOnDestroy(){
    this.routeService.route.next(undefined);
  }
}
