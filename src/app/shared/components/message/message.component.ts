import { Component, Input } from '@angular/core';
import { IMessage } from '../../interfaces/message.interface';
import { UserService } from '../../services/user.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { IUser } from '../../interfaces/user.interface';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent {
    @Input() message?: IMessage;
    profile?: IUser;
  
    constructor(
      private userService: UserService,
      private dialog:MatDialog,
      private socketService: SocketService
    ){
      this.userService.profile.subscribe((profile)=>{
        this.profile = profile;
      });
    }

    isModer(){
      const isAdmin = this.profile?.id === this.message?.chat?.streamer?.id;
      const isModer = this.message?.chat.users.some((u)=>u.id===this.profile?.id);
      return isAdmin || isModer;
    }

    openDialog(){
      const dialogref = this.dialog.open(ConfirmationDialogComponent,{
        data:{
          message: "Delete a message?",
          buttonName: 'Delete'
        }
      });

      dialogref.afterClosed().subscribe({
        next:(result)=>{
          if(result && this.message){
            this.socketService.deleteMessage(this.message.chat.id, this.message.id);
          }
        },
        error: (err)=>console.log(err)
      })
    }

}
