import { Component, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { UserService } from '../../services/user.service';
import { ChatService } from '../../services/chat.service';
import { IUser } from '../../interfaces/user.interface';

@Component({
  selector: 'app-add-moder',
  templateUrl: './add-moder.component.html',
  styleUrls: ['./add-moder.component.css']
})
export class AddModerComponent {
  @ViewChild('menuB') manuButton!: ElementRef<HTMLButtonElement>;
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  @Output() onAddModer = new EventEmitter();
  profile?: IUser;
  searchValue: string ="";
  searchList: IUser[] = [];
  newModer?: IUser;
  errorMessage?: string;

  constructor(
    private userService: UserService,
    private chatService: ChatService
  ){}

  ngOnInit(){
    this.userService.profile.
    subscribe({
      next: profile=>this.profile=profile,
      error: err=>console.log(err)
    })
  }

  addModer(){
    if(this.profile?.chat && this.newModer){
      this.chatService.addModerator(this.profile.chat.id, this.newModer.id)
      .subscribe({
        next:(result)=>{
          if(result){
            this.onAddModer.emit();
            this.clean();
          }
        },
        error: (err)=>this.errorMessage = err.error
      })
    }
  }

  clean(){
    this.searchValue = "";
    this.newModer = undefined;
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

  select(moder: IUser){
    this.newModer = moder;
    this.searchValue = moder.login;
  }
}
