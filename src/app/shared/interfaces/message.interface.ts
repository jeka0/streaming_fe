import { IUser } from "./user.interface";
import { IChat } from "./chat.interface";

export interface IMessage {
    id: Number,
    chat: IChat,
    datetime: Date,
    message: String,
    user: IUser
  }