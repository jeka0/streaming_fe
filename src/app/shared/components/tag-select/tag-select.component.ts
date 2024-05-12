import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { UserService } from '../../services/user.service';
import { TagService } from '../../services/tag.service';
import { IUser } from '../../interfaces/user.interface';
import { ITag } from '../../interfaces/tag.interface';

@Component({
  selector: 'app-tag-select',
  templateUrl: './tag-select.component.html',
  styleUrls: ['./tag-select.component.css']
})
export class TagSelectComponent {
  @ViewChild('menuB') manuButton!: ElementRef<HTMLButtonElement>;
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  profile?: IUser;
  searchValue: string ="";
  searchList: ITag[] = [];
  errorMessage?: string;

  constructor(
    private userService: UserService,
    private tagService: TagService
  ){}

  ngOnInit(){
    this.userService.profile.
    subscribe({
      next: profile=>this.profile=profile,
      error: err=>console.log(err)
    })
  }

  addTag(){
    if(this.searchValue){
      this.userService.addTag(this.searchValue)
      .subscribe({
        next:(result)=>{
          if(result){
            this.userService.profile.next(result);
            this.clean();
          }
        },
        error: (err)=>this.errorMessage = err.error
      })
    }
  }

  clean(){
    this.searchValue = "";
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
    if(this.searchValue !=="")this.tagService.searchTag(this.searchValue).subscribe({
      next:tags=>{
        this.searchList = tags;
        if(tags.length !== 0)this.manuButton.nativeElement.click();
       },
      error:err=>console.log(err)
    })
  }

  select(tag: ITag){
    this.searchValue = tag.name;
  }

  setUser(user: IUser){
    this.userService.profile.next(user)
  }
}
