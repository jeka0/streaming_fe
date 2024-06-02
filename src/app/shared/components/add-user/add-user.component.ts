import { Component, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { UserService } from '../../services/user.service';
import { IUser } from '../../interfaces/user.interface';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  @ViewChild('menuB') manuButton!: ElementRef<HTMLButtonElement>;
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  @Output() onAdd = new EventEmitter<IUser>();
  profile?: IUser;
  searchValue: string ="";
  searchList: IUser[] = [];//
  newUser?: IUser;
  @Input() errorMessage?: string;

  constructor(
    private userService: UserService
  ){}

  ngOnInit(){
    this.userService.profile.
    subscribe({
      next: profile=>this.profile=profile,
      error: err=>console.log(err)
    })
  }

  add(){
    if(this.newUser){
      this.onAdd.emit(this.newUser);
      this.clean();
    }
  }

  clean(){
    this.searchValue = "";
    this.newUser = undefined;
    this.cleanError();
  }

  cleanError(){
    this.errorMessage = undefined;
  }
  
  closeMenu() {
    this.trigger.closeMenu();
    this.cleanError()
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

  select(user: IUser){
    this.newUser = user;
    this.searchValue = user.login;
  }
}
