import { ICategory } from "./category";

export interface ISettings{
    id: Number;
    stream_title?: string; 
    category: ICategory;
}