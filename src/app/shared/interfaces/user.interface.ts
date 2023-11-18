import { IChat } from "./chat.interface";

export interface IUser {
    id: Number;
    login: string;
    password?: string;
    image?: string;
    streamKey: string;
    chat: IChat;
    status: Boolean;
    subscription: IUser[];
}