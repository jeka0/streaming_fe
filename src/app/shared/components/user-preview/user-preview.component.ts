import { Component, Input } from '@angular/core';
import { IUser } from '../../interfaces/user.interface';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-user-preview',
  templateUrl: './user-preview.component.html',
  styleUrls: ['./user-preview.component.css']
})
export class UserPreviewComponent {
  @Input() user!: IUser;
  status: String = "Не в сети";
  image: BehaviorSubject<string | undefined>;

  constructor(){
    this.image = new BehaviorSubject<string | undefined>(undefined);
  }

  ngOnInit(){
    if(this.user.status) this.status = "В сети";
    if(this.user.image)this.image.next(this.user.image)
  }

}
