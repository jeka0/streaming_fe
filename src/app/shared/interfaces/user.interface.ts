export interface IUser {
    id: Number;
    login: string;
    password?: string;
    image?: string;
    streamKey: string;
}