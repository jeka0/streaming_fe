import { Component } from '@angular/core';
import { RoutesService } from 'src/app/shared/services/routes.service';
import { ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

interface Navigation {
  title:string,
  link:string,
  class:string
}

@Component({
  selector: 'app-wrapper-settings',
  templateUrl: './wrapper-settings.component.html',
  styleUrls: ['./wrapper-settings.component.css']
})
export class WrapperSettingsComponent {
  navList!: Array<Navigation>;
  subscription!: Subscription;

  constructor(
    private routeService: RoutesService,
    private ref: ChangeDetectorRef
  ){
    this.navList = [
      {title: "Настройки аккаунта", link:"./", class:"no-selected"},
      {title: "Настройки трансляции", link:"./stream", class:"no-selected"},
      {title: "Список модераторов", link:"./moders", class:"no-selected"}
    ]
  }

  ngOnInit(){
    this.subscription = this.routeService.route.subscribe({
      next: routValue => {
        if(routValue){
          const routeNames = routValue.split("/");
          const routeName = routeNames[routeNames.length-1] === "settings"?
            "" : routeNames[routeNames.length-1];
            this.navList.forEach(nav=>{
              if(nav.link === `./${routeName}`){
                nav.class = "selected";
              }else {
                nav.class = "no-selected";
              }
              this.ref.detectChanges();
            });
        }
      },
      error: err => console.error(err)
    })
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
