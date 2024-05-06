import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs'

@Component({
  selector: 'app-image-template',
  templateUrl: './image-template.component.html',
  styleUrls: ['./image-template.component.css']
})
export class ImageTemplateComponent {
  @Input() name!: BehaviorSubject<string | undefined> | string | undefined;
  avatar: String = 'assets/Img/avatar.jpg';
  url: String = `${environment.apiURL}/image/`;

  ngOnInit(){
    if(this.name instanceof BehaviorSubject){
      this.name.subscribe({
        next:(name)=>{
          this.setAvatar(name);
        },
        error:err=>console.log(err)
      })
    }else{
      this.setAvatar(this.name);
    }
    
  }

  setAvatar(name: string | undefined){
    if(name)this.avatar= this.url + name;
    else this.avatar = 'assets/Img/avatar.jpg';
  }

}
