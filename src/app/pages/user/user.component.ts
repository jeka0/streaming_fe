import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { StreamService } from 'src/app/shared/services/stream.service';
import { switchMap, BehaviorSubject} from 'rxjs'
import { IUser } from 'src/app/shared/interfaces/user.interface';
import { IStream } from 'src/app/shared/interfaces/stream.interface';
import { IPagination } from 'src/app/shared/interfaces/pagination.interface';

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
  length!: number;
  pages: number[] = [3, 6, 9, 12];

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
    ).subscribe({
      next:(user)=>{
        this.user = user;
        this.bUser.next(user);
        this.image.next(user.image);
        this.getStreams({page: 1, limit: this.pages[0]});
      },
      error:err=>console.log(err)
    })
  }

  getStreams({page, limit, order, category}:IPagination){
    if(this.user){
      this.streamService.getUserStreamsRange(this.user.id, page, limit, order, category)
      .subscribe({
        next:(result)=>{
          this.length = result.total;
          this.streams = result.data;
        },
        error:err=> console.log(err)
      })
    }
  }
}
