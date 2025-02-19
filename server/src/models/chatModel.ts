import { QueryResult } from "pg";
import { pool } from "../settings";
import { Chat } from "@interfaces/chatInterface";

class ChatModel {
  async getChatMessages(userId: number): Promise<Chat[]> {
    try {
      const getChatQuery = {
        text: "SELECT * FROM chats WHERE user1_id = $1 OR user2_id = $1",
        values: [userId],
      };
      const resultChats: QueryResult<Chat> = await pool.query(getChatQuery);
      // Parse the messages from the database
      const chats = resultChats.rows;
      for (const chat of chats) {
        const getMessagesQuery = {
          text: "SELECT * FROM messages WHERE chat_id = $1",
          values: [chat.id],
        };
        const resultMessages: QueryResult<any> = await pool.query(
          getMessagesQuery
        );
        chat.messages = resultMessages.rows;
      }
      console.log("[ChatModel] Fetched chat messages:", chats);
      return chats;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}

export const chatModel = new ChatModel();
