import { IUser } from "./User";

export interface IParticipant {
    id     : number;
    idEvent: number;
    idUser : number;
    user   : IUser;
}