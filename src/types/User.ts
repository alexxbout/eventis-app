export interface IUser {
    id        : number;
    firstname : string;
    lastname  : string;
    login     : string;
    emoji     : string | null;
    pseudo    : string;
    showPseudo: string;
    password  : string;
    idRole    : number;
    idFoyer   : number;
    active    : string;
    pic       : string;
    bio       : string;
}