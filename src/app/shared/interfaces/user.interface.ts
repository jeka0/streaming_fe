import { IChat } from "./chat.interface";
import { ITag } from "./tag";

export interface IUser {
    id: Number;
    login: string;
    password?: string;
    image?: string;
    streamKey: string;
    chat: IChat;
    status: Boolean;
    subscription: IUser[];
    tags: ITag[];
}