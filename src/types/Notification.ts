import { IUser } from "./User"

export interface INotification {
    friend_request: INotificationType[],
    event_notif   : INotificationType[]
}

export interface INotificationType {
    id         : string,
    idUser     : string,
    idAlt      : string,
    idNotifType: string,
    created    : string,
    user?      : IUser
}