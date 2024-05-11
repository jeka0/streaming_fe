import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { StreamService } from 'src/app/shared/services/stream.service';
import { switchMap, BehaviorSubject, mergeMap} from 'rxjs'
import { IUser } from 'src/app/shared/interfaces/user.interface';
import { IStream } from 'src/app/shared/interfaces/stream.interface';
import { PageEvent } from '@angular/material/paginator';

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
        this.getStreams(1, this.pages[0]);
      },
      error:err=>console.log(err)
    })
  }

  getStreams(page:Number, limit:Number){
    if(this.user){
      this.streamService.getUserStreamsRange(this.user.id, page, limit)
      .subscribe({
        next:(result)=>{
          this.length = result.total;
          this.streams = result.data;
        },
        error:err=> console.log(err)
      })
    }
  }
  
  onPage(event: PageEvent){
    this.getStreams(event.pageIndex + 1, event.pageSize);
  }
}
