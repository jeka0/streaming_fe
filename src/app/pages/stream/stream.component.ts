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
  streamKey: Subject<string> = new Subject<string>();
  chatId: Subject<Number>= new Subject<Number>();
  user: BehaviorSubject<IUser  | undefined> = new BehaviorSubject<IUser | undefined>(undefined);
  image: BehaviorSubject<string | undefined>;
  videoName?: string;
  videoUrl?: string;
  key?: string;
  viewer_count: Number = 0;


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
      if(this.stream.id == id){
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
        this.user.next(user);
        this.streamKey.next(user.streamKey);
        this.key = user.streamKey;
        this.chatId.next(user.chat.id);
        if(this.videoName)return this.streamService.getStreamByRecording(this.videoName || "");
        console.log(`${this.streamKey}/live`)
        this.socketService.joinTo(`${user.streamKey}/live`);
        return this.streamService.getLiveStream(user.streamKey);
      }),
    ).subscribe({
      next:(stream)=>{ 
        this.stream = stream;
        this.image.next(this.stream.user.image)
      },
      error: (err)=>console.log(err)
    })
  }

  ngOnDestroy(){
    if(this.key && !this.videoName){
      this.socketService.leaveFrom(`${this.key}/live`);
  }
  }
}
