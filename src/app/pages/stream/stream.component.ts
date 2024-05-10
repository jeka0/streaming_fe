import { Component } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { StreamService } from 'src/app/shared/services/stream.service';
import { SocketService } from 'src/app/shared/services/socket.service';
import { mergeMap, of, Subject, BehaviorSubject, Observable, Subscription } from 'rxjs';
import { IStream } from 'src/app/shared/interfaces/stream.interface';
import { ActivatedRoute } from '@angular/router';
import { IUser } from 'src/app/shared/interfaces/user.interface';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.css']
})
export class StreamComponent {
  stream!: IStream;
  streamName: Subject<string> = new Subject<string>();
  chatId: Subject<Number>= new Subject<Number>();
  user: BehaviorSubject<IUser  | undefined> = new BehaviorSubject<IUser | undefined>(undefined);
  image: BehaviorSubject<string | undefined>;
  videoName?: string;
  videoUrl?: string;
  name?: string;
  viewer_count: number = 0;
  subscription?: Subscription;


  constructor(
    private userService: UserService,
    private streamService: StreamService,
    private route: ActivatedRoute,
    private socketService: SocketService
  ){
    this.image = new BehaviorSubject<string | undefined>(undefined);
  }

  ngOnInit(){
    this.socketService.socket.on('viewer_count',({id, viewer_count})=>{
      if(this.stream?.id === id){
        console.log("+")
        this.viewer_count = viewer_count;
      }
    })
    this.route.params.pipe(
      mergeMap((params)=>{
        this.videoName = params['video'];
        if(this.videoName)this.videoUrl = `${this.videoName}.mp4`
        return this.userService.getByLogin(params['name']);
      }),
      mergeMap((user)=>{
        this.subscription = this.socketService.reconnect.subscribe({
          next:(res)=>{
            if(res){
              if(this.stream && !this.videoName){
                this.socketService.leaveFrom(`${this.name}/live`);
                this.socketService.joinTo(`${this.name}/live`)
              };
              this.chatId.next(user.chat.id);
            }
          },
          error: err=>console.log(err)
        })
        this.user.next(user);
        this.streamName.next(user.login);
        this.name = user.login;
        if(this.videoName)return this.streamService.getStreamByRecording(this.videoName || "");
        return this.streamService.getLiveStream(user.login);
      }),
    ).subscribe({
      next:(stream)=>{ 
        this.stream = stream;
        this.viewer_count = stream.viewer_count as number;
        if(!this.videoName)this.socketService.joinTo(`${this.name}/live`);
        this.image.next(this.stream.user.image)
      },
      error: (err)=>console.log(err)
    })
  }

  ngOnDestroy(){
    if(this.subscription) this.subscription.unsubscribe();
    if(this.name && !this.videoName){
      this.socketService.leaveFrom(`${this.name}/live`);
  }
  }
}
