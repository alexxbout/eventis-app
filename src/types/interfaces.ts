export interface IUser {
  name    : string;
  lastname: string;
  login   : string;
}

export interface IApp {
  setFixed   : () => void;
  removeFixed: () => void;
}

export interface IEvent {
  title       : string;
  subtitle    : string;
  ended       : boolean;
  image       : string;
  description?: Array<string>;
}

export interface ITab {
  name: string;
  path: string;
  svg : string;
  custom?: boolean;
}

export interface IConversationCard {
  userFullName    : string;
  lastMessage     : string;
  lastMessageTime : string;
  nbUnreadMessages: number;
  userAvatar?     : string;
}