export type Sender = "USER" | "AI";

export interface Message {
  id?: string;
  sender: Sender;
  text: string;
  createdAt?: string;
}

export interface SendMessageRequest {
  message: string;
  sessionId?: string;
}

export interface SendMessageResponse {
  reply: string;
  sessionId: string;
}
