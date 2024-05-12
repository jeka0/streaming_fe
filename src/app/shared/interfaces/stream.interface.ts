import { IUser } from "./user.interface";
import { ICategory } from "./category.interface"; 

export interface IStream{
    id: Number;
    stream_title?: string; 
    category: ICategory;
    start_time: Date;
    end_time?: Date;
    viewer_count: Number;
    user: IUser;
    recording_file: String;
}