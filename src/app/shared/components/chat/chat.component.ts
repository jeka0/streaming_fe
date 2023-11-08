import { Component, Input } from '@angular/core';
import { SocketService } from 'src/app/shared/services/socket.service';
import { IMessage } from '../../interfaces/message.interface';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
    @Input() id!: Number;
    messageList: IMessage[] = [];
    message: String = "";

    constructor(
      private socketService: SocketService,
      private messageService: MessageService,
    ){
      socketService.socket.on("message", (message)=>{
        this.messageList.push(message);
      })
    }

    ngOnChanges(){
      if(this.id){
        this.socketService.joinToChat(this.id);
        this.messageService.getAllByChat(this.id).subscribe({
          next: (messages)=> this.messageList.push(...messages.reverse()),
          error: (err)=>console.log(err)
        })
      }
    }

    sendMessage(){
      this.socketService.sendMessage(this.id, this.message);
      this.message = "";
    }

    ngOnDestroy(){
      this.socketService.leaveChat(this.id);
    }
}
