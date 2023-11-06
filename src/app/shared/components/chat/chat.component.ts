import { Component } from '@angular/core';
import { SocketService } from 'src/app/shared/services/socket.service';
import { IMessage } from '../../interfaces/message.interface';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
    messageList: IMessage[] = [];
    message: String = "";

    constructor(
      private socketService: SocketService,
      private messageService: MessageService,
    ){
      socketService.socket.on("message", (message)=>{
        this.messageList.push(message);
      })
      socketService.joinToChat(1);
      messageService.getAllByChat(1).subscribe({
        next: (messages)=> this.messageList.push(...messages.reverse()),
        error: (err)=>console.log(err)
      })
    }

    sendMessage(){
      this.socketService.sendMessage(1, this.message);
      this.message = "";
    }

    ngOnDestroy(){
      this.socketService.leaveChat(1);
      console.log("+")
    }
}
