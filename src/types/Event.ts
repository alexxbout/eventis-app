import { IParticipant } from "./Participants";

export interface IEvent {
    id           : string;
    idFoyer      : string;
    zip          : string;
    adress       : string;
    city         : string;
    canceled?    : string;
    reason?      : string;
    start        : string;
    title        : string;
    idCategorie  : string;
    description  : string;
    pic?         : string;
    participants?: IParticipant[];
}