export type Sender = "USER" | "AI";

export interface Message {
  sender: 'USER' | 'AI';
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
