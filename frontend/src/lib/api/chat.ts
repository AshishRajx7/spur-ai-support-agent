import type {
  SendMessageRequest,
  SendMessageResponse,
  Message,
} from "$lib/types";

import { PUBLIC_API_URL } from '$env/static/public';

const API_URL = PUBLIC_API_URL;

export async function sendMessage(
  payload: SendMessageRequest,
): Promise<SendMessageResponse> {
  const response = await fetch(`${API_URL}/chat/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return response.json();
}

export async function getHistory(sessionId: string): Promise<Message[]> {
  const response = await fetch(`${API_URL}/chat/history/${sessionId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch history");
  }

  return response.json();
}
