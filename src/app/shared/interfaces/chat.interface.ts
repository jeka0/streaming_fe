import { IUser } from "./user.interface";

export interface IChat {
    id: Number;
    name: string;
    type: string;
    users: IUser[];
    streamer: IUser;
}