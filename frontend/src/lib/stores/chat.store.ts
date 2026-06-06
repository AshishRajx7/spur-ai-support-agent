import { writable } from "svelte/store";

import type { Message } from "$lib/types";

export const messages = writable<Message[]>([]);

export const isLoading = writable(false);

export const error = writable<string | null>(null);
