import { writable } from "svelte/store";
import { browser } from "$app/environment";

const STORAGE_KEY = "shopspur-session-id";

function createSessionStore() {
  const initialValue = browser ? localStorage.getItem(STORAGE_KEY) : null;

  const { subscribe, set } = writable<string | null>(initialValue);

  return {
    subscribe,

    setSessionId(sessionId: string) {
      localStorage.setItem(STORAGE_KEY, sessionId);

      set(sessionId);
    },

    clear() {
      localStorage.removeItem(STORAGE_KEY);

      set(null);
    },
  };
}

export const sessionStore = createSessionStore();
