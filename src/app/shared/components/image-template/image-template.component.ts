import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs'

@Component({
  selector: 'app-image-template',
  templateUrl: './image-template.component.html',
  styleUrls: ['./image-template.component.css']
})
export class ImageTemplateComponent {
  @Input() name!: BehaviorSubject<string | undefined>;
  avatar: String = 'assets/Img/avatar.jpg';
  url: String = `${environment.apiURL}/image/`;

  ngOnInit(){
    this.name.subscribe({
      next:(name)=>{
        if(name)this.avatar= this.url + name;
        else this.avatar = 'assets/Img/avatar.jpg';
      },
      error:err=>console.log(err)
    })
    
  }

}
