import { Component } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { StreamService } from 'src/app/shared/services/stream.service';
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
        this.videoName = params['video'];
        if(this.videoName)this.videoUrl = `${this.videoName}.mp4`
        return this.userService.getByLogin(params['name']);
      }),
      mergeMap((user)=>{
        this.user.next(user);
        this.streamKey.next(user.streamKey);
        this.chatId.next(user.chat.id);
        if(this.videoName)return this.streamService.getStreamByRecording(this.videoName || "");else
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
}
