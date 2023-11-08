import { Component } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { StreamService } from 'src/app/shared/services/stream.service';
import { IUser } from 'src/app/shared/interfaces/user.interface';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.css']
})
export class StreamComponent {
  streamer!: IUser;
  streamKey!: string;
  chatId!: Number;

  constructor(
    private userService: UserService,
    private streamService: StreamService
  ){
      this.userService.getByLogin("stenffi").subscribe({
        next: (user)=>{
          this.streamKey = user.streamKey; this.streamer = user;
          this.streamService.getUserLiveStream(user.id).subscribe({
            next:(stream)=>{this.chatId = stream.chat.id; },
            error: (err)=>console.log(err)
          })
        },
        error: (err)=>console.log(err)
      })

  }
}
