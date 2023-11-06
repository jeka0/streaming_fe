import { IUser } from "./user.interface";

export interface IMessage {
    id: Number,
    chat: any,
    datetime: Date,
    message: String,
    user: IUser
  }