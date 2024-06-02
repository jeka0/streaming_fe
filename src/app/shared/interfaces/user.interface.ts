import { IChat } from "./chat.interface";
import { ITag } from "./tag.interface";
import { IRole } from "./role.interface" 

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
    role: IRole
}