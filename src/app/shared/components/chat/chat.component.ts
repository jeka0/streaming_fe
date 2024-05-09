import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { SocketService } from 'src/app/shared/services/socket.service';
import { IMessage } from '../../interfaces/message.interface';
import { MessageService } from '../../services/message.service';
import { UserService } from '../../services/user.service';
import { IUser } from '../../interfaces/user.interface';
import { IChat } from '../../interfaces/chat.interface';
import { BehaviorSubject, Subject, mergeMap } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
    @Input() obsId!: Subject<Number>;
    @ViewChild('targetElement') targetElement!: ElementRef;
    chat: BehaviorSubject<IChat|undefined> = new BehaviorSubject<IChat|undefined>(undefined);
    nowChat?:IChat;
    id!: Number;
    messageList: IMessage[] = [];
    message: String = "";
    info?: { type: string, message: string };
    time: number = 5000;
    timeout?: NodeJS.Timeout;
    interval?: NodeJS.Timeout;
    profile?: IUser
    banned: boolean = false;
    isTimeout: { active:boolean, time: number | undefined, message: string } = {active: false, time: undefined, message: ""}


    constructor(
      private socketService: SocketService,
      private messageService: MessageService,
      private userService: UserService,
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
      socketService.socket.on("info", ({chatId, message})=>{
        if(this.id === chatId){
          this.info = {type:"info",message};
          if(this.timeout) clearTimeout(this.timeout);
          this.timeout = setTimeout(()=>this.closeInfo(), this.time);
        }
      })
      socketService.socket.on("fail", ({chatId, message})=>{
        if(this.id === chatId){
          this.info = {type:"fail",message};
          if(this.timeout) clearTimeout(this.timeout);
          this.timeout = setTimeout(()=>this.closeInfo(), this.time);
        }
      })
      socketService.socket.on("ban", ({chatId, userId})=>{
        if(this.id === chatId && this.profile?.id === userId){
          this.banned = true;
        }
      })
      socketService.socket.on("unban", ({chatId, userId})=>{
        if(this.id === chatId && this.profile?.id === userId){
          this.banned = false;
        }
      })
      socketService.socket.on("timeout", ({chatId, userId, time}:{chatId:number, userId:number, time:Date})=>{
        if(this.id === chatId && this.profile?.id === userId){
          this.isTimeout.active = true;
          this.isTimeout.time = new Date(time).getTime() - new Date().getTime();
          this.getRemainingTime();
          this.interval = setInterval(()=>this.getRemainingTime(), 1000);
        }
      })
      socketService.socket.on("untimeout", ({chatId, userId})=>{
        if(this.id === chatId && this.profile?.id === userId){
          this.untimeout()
        }
      })
      socketService.socket.on("mod", ({chatId, userId})=>{
        if(this.id === chatId && this.profile?.id === userId && this.nowChat && this.profile){
          this.nowChat.users.push(this.profile)
          this.chat.next(this.nowChat);
        }
      })
      socketService.socket.on("unmod", ({chatId, userId})=>{
        if(this.id === chatId && this.profile?.id === userId && this.nowChat && this.profile){
          this.nowChat.users = this.nowChat.users.filter(mod=>mod.id!==userId);
          this.chat.next(this.nowChat);
        }
      })
    }

    untimeout(){
      this.isTimeout.active = false;
      this.isTimeout.time = undefined;
      this.isTimeout.message = "";
      if(this.interval){
        clearInterval(this.interval);
        this.interval = undefined;
      } 
    }

    getRemainingTime() {
      if(this.isTimeout?.time){
        const seconds = Math.floor((this.isTimeout.time / 1000) % 60);
        const minutes = Math.floor((this.isTimeout.time  / (1000 * 60)) % 60);
        const hours = Math.floor((this.isTimeout.time  / (1000 * 60 * 60)) % 24);
        const days = Math.floor(this.isTimeout.time  / (1000 * 60 * 60 * 24));
      
        if (days > 0) {
          this.isTimeout.message = `${days} дней ${hours} часов ${minutes} минут ${seconds} секунд`;
        } else if (hours > 0) {
          this.isTimeout.message = `${hours} часов ${minutes} минут ${seconds} секунд`;
        } else if (minutes > 0) {
          this.isTimeout.message = `${minutes} минут ${seconds} секунд`;
        } else {
          this.isTimeout.message = `${seconds} секунд`;
          if(seconds<0){
            this.untimeout()
          }
        }
        this.isTimeout.time -= 1000;
      }
    }

    ngOnInit(){
      this.chat.subscribe({
        next: (ch)=> {
          this.nowChat = ch;
        },
        error: (err)=>console.log(err)
      });
      this.userService.profile.subscribe({
        next: (profile)=> {
          this.profile = profile;
        },
        error: (err)=>console.log(err)
      })
      this.obsId.pipe(
        mergeMap((id)=>{
          this.id = id;
          this.socketService.joinTo(id);
          return this.messageService.getAllByChat(id);
        })
      ).subscribe({
        next: (messages)=> {
          this.messageList = messages;
        },
        error: (err)=>console.log(err)
      })
    }

    closeInfo(){
      this.info = undefined;
      this.timeout= undefined;
    }

    sendMessage(){
      if(this.message.trim() !='')this.socketService.sendMessage(this.id, this.message);
      this.message = "";
    }

    ngOnDestroy(){
      this.socketService.leaveFrom(this.id);
    }
}
