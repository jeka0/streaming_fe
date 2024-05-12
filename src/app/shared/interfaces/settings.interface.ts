import { ICategory } from "./category.interface";

export interface ISettings{
    id: Number;
    stream_title?: string; 
    category: ICategory;
}