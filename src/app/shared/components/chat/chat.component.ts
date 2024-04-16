import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { SocketService } from 'src/app/shared/services/socket.service';
import { IMessage } from '../../interfaces/message.interface';
import { MessageService } from '../../services/message.service';
import { Subject, mergeMap } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
    @Input() obsId!: Subject<Number>;
    @ViewChild('targetElement') targetElement!: ElementRef;
    id!: Number;
    messageList: IMessage[] = [];
    message: String = "";

    constructor(
      private socketService: SocketService,
      private messageService: MessageService,
    ){
      socketService.socket.on("message", (message)=>{
        if(this.id == message.chat.id){
          this.messageList = [message, ...this.messageList];
          this.targetElement.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      })
      socketService.socket.on("delete", ({chatId, id})=>{
        if(this.id === chatId){
          const index = this.messageList.findIndex(message=>message.id===id);
          if (index > -1) {
            this.messageList.splice(index, 1);
          }
        }
      })
    }

    ngOnInit(){
      this.obsId.pipe(
        mergeMap((id)=>{
          this.id = id;
          this.socketService.joinTo(id);
          return this.messageService.getAllByChat(id);
        })
      ).subscribe({
        next: (messages)=> {
          this.messageList.push(...messages);
        },
        error: (err)=>console.log(err)
      })
    }

    sendMessage(){
      if(this.message.trim() !='')this.socketService.sendMessage(this.id, this.message);
      this.message = "";
    }

    ngOnDestroy(){
      this.socketService.leaveFrom(this.id);
    }
}
