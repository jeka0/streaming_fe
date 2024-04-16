import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { io, Socket } from 'socket.io-client';
import { IUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket!: Socket;
  intervalID?: NodeJS.Timeout;

  constructor(private auth: AuthService) { 

  }
  init(){
    this.socket = io("http://localhost:3021", {
      auth: {
        token: `Bearer ${this.auth.token}`
      },
      autoConnect: false
    });
    this.socket.on('connect', ()=>{
      console.log("User connected");
      if(this.intervalID) clearInterval(this.intervalID);
    });

    this.socket.on('error', err=>{
      console.log(err);
    });

    this.socket.on('disconnect',()=>{
    if(this.auth.isAuth()) this.connect();
    })
  }

  sendMessage(chatId: Number, message: String){
    this.socket.emit("message", {chatId, message});
  }

  updateMessage(chatId: Number, message: String){
    this.socket.emit("update", {chatId, message});
  }

  deleteMessage(chatId: Number, id: Number){
    this.socket.emit("delete", {chatId, id});
  }
      
  joinTo(chatId: Number | string){
    this.socket.emit("join", chatId);
  }

  leaveFrom(chatId: Number | string){
    this.socket.emit("leave", chatId);
  }

  joinRange(range: IUser[]){
    this.socket.emit("joinRange", range);
  }

  leaveRange(range: IUser[]){
    this.socket.emit("leaveRange", range);
  }

  connect(){
    this.intervalID = setInterval(()=>this.socket.connect(), 2000);
  }

  disconnect(){
    this.socket.disconnect();
  }

}
