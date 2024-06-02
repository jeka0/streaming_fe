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
  selector: 'app-wrapper-admin',
  templateUrl: './wrapper-admin.component.html',
  styleUrls: ['./wrapper-admin.component.css']
})
export class WrapperAdminComponent {
  navList!: Array<Navigation>;
  subscription!: Subscription;

  constructor(
    private routeService: RoutesService,
    private ref: ChangeDetectorRef
  ){
    this.navList = [
      {title: "Администраторы", link:"./", class:"no-selected"},
      {title: "Список банов", link:"./banList", class:"no-selected"}
    ]
  }

  ngOnInit(){
    this.subscription = this.routeService.route.subscribe({
      next: routValue => {
        if(routValue){
          const routeNames = routValue.split("/");
          const routeName = routeNames[routeNames.length-1] === "admin"?
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
