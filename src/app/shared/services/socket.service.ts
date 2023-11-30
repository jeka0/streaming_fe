import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { io, Socket } from 'socket.io-client';
import { IUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: Socket;

  constructor(private auth: AuthService) { 
    this.socket = io("http://localhost:3021", {
            auth: {
              token: `Bearer ${auth.token}`
            },
            autoConnect: false
    });
    this.socket.on('connect', ()=>{
        console.log("User connected");
    });

    this.socket.on('error', err=>{
        console.log(err);
    });
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
    this.socket.connect();
  }

  disconnect(){
    this.socket.disconnect();
  }

}
