import { Component, Input } from '@angular/core';
import { IUser } from '../../interfaces/user.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-preview',
  templateUrl: './user-preview.component.html',
  styleUrls: ['./user-preview.component.css']
})
export class UserPreviewComponent {
  @Input() user!: IUser;
  avatar: String = 'assets/Img/avatar.jpg';
  url: String = `${environment.apiURL}/image/`;
  status: String = "Не в сети";

  constructor(){}

  ngOnInit(){
    if(this.user.image)this.avatar= this.url +this.user.image;
    if(this.user.status) this.status = "В сети";
  }

}
