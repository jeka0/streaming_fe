import { Component, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../services/user.service';
import { IUser } from '../../interfaces/user.interface';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css']
})
export class SearchInputComponent {
  @ViewChild('menuB') manuButton!: ElementRef<HTMLButtonElement>;
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  searchValue: string ="";
  searchList: IUser[] = [];

  constructor(
    private userService: UserService
  ){}

  closeMenu() {
    this.trigger.closeMenu();
  }

  search(){
    if(this.searchValue !="")this.userService.search({name: this.searchValue}).subscribe({
      next:users=>{
        this.searchList = users;
        this.manuButton.nativeElement.click();
       },
      error:err=>console.log(err)
    })
  }
}
