import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { io, Socket } from 'socket.io-client';

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

    this.socket.connect();
  }

  sendMessage(chatId: Number, message: String){
    this.socket.emit("message", {chatId, message});
  }

  updateMessage = (chatId: Number, message: String)=>{
    this.socket.emit("update", {chatId, message});
  }

  deleteMessage = (chatId: Number, id: Number)=>{
    this.socket.emit("delete", {chatId, id});
  }
      
  joinToChat = (chatId: Number)=>{
    this.socket.emit("join", chatId);
  }

  leaveChat = (chatId: Number)=>{
    this.socket.emit("leave", chatId);
  }
}
