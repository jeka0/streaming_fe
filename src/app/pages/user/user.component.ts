import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { StreamService } from 'src/app/shared/services/stream.service';
import { switchMap, BehaviorSubject} from 'rxjs'
import { IUser } from 'src/app/shared/interfaces/user.interface';
import { IStream } from 'src/app/shared/interfaces/stream.interface';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  user?:IUser;
  image!: BehaviorSubject<string | undefined>;
  bUser: BehaviorSubject<IUser | undefined> = new BehaviorSubject<IUser| undefined>(undefined);
  streams: IStream[] = [];

  constructor(
    private userService: UserService,
    private streamService: StreamService,
    private route: ActivatedRoute,
  ){
    this.image = new BehaviorSubject<string | undefined>(undefined);
  }

  ngOnInit(){
    this.route.params.pipe(
      switchMap((params)=>this.userService.getByLogin(params['name'])),
      switchMap((user)=>{
        this.user = user;
        this.bUser.next(user);
        this.image.next(user.image);
        return this.streamService.getUserStreams(user.id);
      })
    ).subscribe({
      next:(streams)=>{this.streams = streams;},
      error:err=>console.log(err)
    })
  }
  
}
