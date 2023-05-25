// TO BE DELETED

export interface IApp {
  setFixed   : () => void;
  removeFixed: () => void;
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

export interface IRegistration {
  next    : () => void;
  previous: () => void;
}