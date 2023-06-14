// IMPORTS

import { ButtonHTMLAttributes } from "vue";

// USER

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
    pic       : string | null;
    bio       : string;
}

// TAB

export interface ITab {
    name   : string;
    path   : string;
    svg    : string;
    custom?: boolean;
}

// REGISTER

export interface IRegistration {
    next    : () => void;
    previous: () => void;
}

// PARTICIPANTS

export interface IParticipant {
    id     : number;
    idEvent: number;
    idUser : number;
    user   : IUser;
}

// NOTIFICATIONS

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

// INTERESTS

export interface IInterest {
    idUser    : string;
    idInterest: string;
    id        : string;
    name      : string;
    emoji     : string;
    color?    : string;
}

// FOYER

export interface IFoyer {
    id     : number;
    siret  : string;
    city   : string;
    zip    : string;
    address: string;
}

// EVENTS

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
    name?        : string;
    emoji?       : string;
}

// CONVERSATIONS

export interface IConversationCard {
    userFullName    : string;
    lastMessage     : string;
    lastMessageTime : string;
    nbUnreadMessages: number;
    userAvatar?     : string;
}

// CODES

export interface ICode {
    id       : number;
    code     : string;
    idFoyer  : number;
    expire   : string;
    used     : boolean;
    createdBy: number;
    idRole   : number;
    valid    : boolean;
}

// BUTTONS

export interface IButton {
    apparence: {
        type: "PRIMARY" | "SECONDARY";
        color: "BLUE" | "GREEN" | "RED" | "WHITE" | "GRAY";
        size: "BASE" | "XS";
        rounded?: "BASE" | "FULL";
        custom?: {
            height: string;
            padding: string;
        }
    };
    icon?: {
        side: "LEFT" | "RIGHT";
        name: "ARROW_LEFT" | "ARROW_RIGHT" | "USERS" | "LOCATION" | "SUCCESS";
    };
    type?: ButtonHTMLAttributes["type"];
    text?: any;
    disabled?: boolean;
};

export const ICONS: { [key: string]: string } = {
    ARROW_LEFT : "bi-arrow-left-short",
    ARROW_RIGHT: "bi-arrow-right-short",
    USERS      : "bi-people-fill",
    LOCATION   : "bi-geo-alt-fill",
    SUCCESS    : "bi bi-check-circle-fill"
};

export const getIconByName = (name: string): string => {
    return ICONS[name];
}

// APP

export interface IApp {
    setFixed   : () => void;
    removeFixed: () => void;
}

// BLOCKED

export interface IBlocked {
    id       : number;
    idBlocked: number;
    idUser   : number;
    since    : string;
}

// FRIENDS

export interface IPending {
    pending        : boolean;
    value          : {
        id         : number;
        idRequester: number;
        idRequested: number;
    } | null;
}