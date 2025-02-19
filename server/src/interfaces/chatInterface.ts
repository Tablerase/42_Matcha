export interface Message {
  id: number;
  content: string;
  fromUserId: number;
  createdAt: Date;
}

export interface Chat {
  id: number;
  messages: Message[];
  user1Id: number;
  user2Id: number;
  createdAt: Date;
  deletedBy: number[];
}
