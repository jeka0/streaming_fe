import { Component } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { StreamService } from 'src/app/shared/services/stream.service';
import { SocketService } from 'src/app/shared/services/socket.service';
import { mergeMap, of, Subject, BehaviorSubject } from 'rxjs';
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
        this.socketService.joinTo(`${user.login}/live`);
        this.user.next(user);
        this.streamName.next(user.login);
        this.name = user.login;
        this.chatId.next(user.chat.id);
        if(this.videoName)return this.streamService.getStreamByRecording(this.videoName || "");
        return this.streamService.getLiveStream(user.login);
      }),
    ).subscribe({
      next:(stream)=>{ 
        this.stream = stream;
        this.viewer_count = stream.viewer_count as number;
        this.image.next(this.stream.user.image)
      },
      error: (err)=>console.log(err)
    })
  }

  ngOnDestroy(){
    if(this.name && !this.videoName){
      this.socketService.leaveFrom(`${this.name}/live`);
  }
  }
}
