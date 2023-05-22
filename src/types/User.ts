export default interface IUser {
    firstname  : string;
    lastname   : string;
    password?  : string;
    login?     : string;
    id         : number;
    idFoyer?   : number;
    idRole?    : number;
    active?    : boolean;
    pic?       : string;
    lastLogin? : string;
    lastLogout?: string;
}