import { Component } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { StreamService } from 'src/app/shared/services/stream.service';
import { mergeMap, of, Subject } from 'rxjs';
import { IStream } from 'src/app/shared/interfaces/stream.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.css']
})
export class StreamComponent {
  url: String ='http://localhost:3020/api/image/';
  avatar: String = 'assets/Img/avatar.jpg';
  stream!: IStream;
  streamKey: Subject<string> = new Subject<string>();
  chatId: Subject<Number>= new Subject<Number>();

  constructor(
    private userService: UserService,
    private streamService: StreamService,
    private route: ActivatedRoute
  ){}

  ngOnInit(){
    this.route.params.pipe(
      mergeMap((params)=>{
        return this.userService.getByLogin(params['name']);
      }),
      mergeMap((user)=>{
        this.streamKey.next(user.streamKey);
        this.chatId.next(user.chat.id);
        return this.streamService.getUserLiveStream(user.id);
      })
    ).subscribe({
      next:(stream)=>{ 
        this.stream = stream;
        if(stream.user.image)this.avatar = this.url + stream.user.image;
      },
      error: (err)=>console.log(err)
    })
  }
}
