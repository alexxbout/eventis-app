export interface IConversationCard {
  userFullName    : string;
  lastMessage     : string;
  lastMessageTime : string;
  nbUnreadMessages: number;
  userAvatar?     : string;
}