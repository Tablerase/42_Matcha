import { QueryResult } from "pg";
import { pool } from "../settings";
import { Chat } from "@interfaces/chatInterface";

interface DbChat {
  id: number;
  user1_id: number;
  user2_id: number;
  created_at: Date;
  deleted_by: number[] | null;
  messages: DbMessage[];
}

interface DbMessage {
  id: number;
  content: string;
  from_user_id: number;
  created_at: Date;
}

class ChatModel {
  async getChatMessages(userId: number): Promise<Chat[]> {
    try {
      const getChatQuery = {
        text: "SELECT * FROM chats WHERE user1_id = $1 OR user2_id = $1",
        values: [userId],
      };
      const resultChats: QueryResult<DbChat> = await pool.query(getChatQuery);
      // Parse the messages from the database
      const chats: DbChat[] = resultChats.rows;
      for (const chat of chats) {
        const getMessagesQuery = {
          text: "SELECT * FROM messages WHERE chat_id = $1",
          values: [chat.id],
        };
        const resultMessages: QueryResult<DbMessage> = await pool.query(
          getMessagesQuery
        );
        chat.messages = resultMessages.rows;
      }
      const parsedChats = chats.map((chat) => {
        return {
          id: chat.id,
          user1Id: chat.user1_id,
          user2Id: chat.user2_id,
          createdAt: chat.created_at,
          messages: chat.messages.map((message: DbMessage) => {
            return {
              id: message.id,
              content: message.content,
              fromUserId: message.from_user_id,
              createdAt: message.created_at,
            };
          }),
          deletedBy: chat.deleted_by,
        } as Chat;
      });
      console.log("[ChatModel] Fetched chat messages:", parsedChats);
      return parsedChats;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}

export const chatModel = new ChatModel();
