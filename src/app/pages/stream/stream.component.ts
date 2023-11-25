import { Component } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { StreamService } from 'src/app/shared/services/stream.service';
import { mergeMap, of, Subject, BehaviorSubject } from 'rxjs';
import { IStream } from 'src/app/shared/interfaces/stream.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.css']
})
export class StreamComponent {
  stream!: IStream;
  streamKey: Subject<string> = new Subject<string>();
  chatId: Subject<Number>= new Subject<Number>();
  subscribed: Boolean = false;
  image: BehaviorSubject<string | undefined>;

  constructor(
    private userService: UserService,
    private streamService: StreamService,
    private route: ActivatedRoute
  ){
    this.image = new BehaviorSubject<string | undefined>(undefined);
  }

  ngOnInit(){
    this.route.params.pipe(
      mergeMap((params)=>{
        return this.userService.getByLogin(params['name']);
      }),
      mergeMap((user)=>{
        this.streamKey.next(user.streamKey);
        this.chatId.next(user.chat.id);
        return this.streamService.getLiveStream(user.streamKey);
      }),
      mergeMap((stream)=>{ 
        this.stream = stream;
        this.image.next(this.stream.user.image)
        return this.userService.profile;
      })
    ).subscribe({
      next:(profileUser)=>{
        this.subscribed = profileUser?.subscription.some((user)=>user.id === this.stream.user.id) || false
      },
      error: (err)=>console.log(err)
    })
  }

  subscribe(){
    this.userService.follow(this.stream.user.id).subscribe({
      next:(user)=>{},
      error:(err)=>console.log(err)
    });
  }

  unsubscribe(){
    this.userService.unfollow(this.stream.user.id).subscribe({
      next:(user)=>{},
      error:(err)=>console.log(err)
    });
  }
}
