import { IChat } from "./chat.interface";
import { IUser } from "./user.interface";
import { IType } from "./type.interface";
import { IStatus } from "./status.interface";

export interface IPenalty {
    id: Number;
    datetime: Date;
    end_time?: Date;
    user: IUser,
    owner: IUser,
    chat?: IChat,
    type: IType,
    status: IStatus
}