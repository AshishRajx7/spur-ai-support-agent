<script lang="ts">
  import { onMount } from 'svelte';

  import ChatWindow from '$lib/components/ChatWindow.svelte';

  import {
    messages,
    isLoading,
    error,
  } from '$lib/stores/chat.store';

  import {
    sessionStore,
  } from '$lib/stores/session.store';

  import {
    sendMessage,
    getHistory,
  } from '$lib/api/chat';

  let input = $state('');

  async function handleSend() {
    const text = input.trim();

    if (!text) return;

    messages.update(current => [
      ...current,
      {
        sender: 'USER',
        text,
      },
    ]);

    input = '';

    isLoading.set(true);
    error.set(null);

    try {
      let sessionId: string | null = null;

      const unsubscribe =
        sessionStore.subscribe(value => {
          sessionId = value;
        });

      unsubscribe();

      const response =
        await sendMessage({
          message: text,
          sessionId:
            sessionId ?? undefined,
        });

      sessionStore.setSessionId(
        response.sessionId,
      );

      messages.update(current => [
        ...current,
        {
          sender: 'AI',
          text: response.reply,
        },
      ]);
    } catch {
      error.set(
        'Unable to send message.',
      );
    } finally {
      isLoading.set(false);
    }
  }

  onMount(async () => {
    let sessionId: string | null = null;

    const unsubscribe =
      sessionStore.subscribe(value => {
        sessionId = value;
      });

    unsubscribe();

    if (!sessionId) {
      return;
    }

    try {
      const history =
        await getHistory(sessionId);

      messages.set(history);
    } catch {
      console.error(
        'Failed to load history',
      );
    }
  });
</script>

<div class="page">
  <div class="chat-card">
    <h1>ShopSpur Support</h1>

    <ChatWindow />

    <div class="input-row">
      <input
        bind:value={input}
        placeholder="Ask a question..."
        onkeydown={(e) => {
          if (
            e.key === 'Enter' &&
            !$isLoading
          ) {
            handleSend();
          }
        }}
      />

      <button
        onclick={handleSend}
        disabled={$isLoading}
      >
        Send
      </button>
    </div>
  </div>
</div>

<style>
  .page {
  height: 100vh;
  overflow: hidden;

  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: #f9fafb;
}

  .chat-card {
  width: min(900px, 95vw);
  height: 90vh;

  background: white;
  border-radius: 12px;

  display: flex;
  flex-direction: column;

  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  overflow: hidden;
}

  h1 {
    padding: 16px;
    margin: 0;
    border-bottom: 1px solid #e5e7eb;
  }

  .input-row {
    display: flex;
    flex-shrink: 0;
    gap: 12px;
    padding: 16px;
    border-top: 1px solid #e5e7eb;
  }

  input {
    flex: 1;
    padding: 12px;
  }

  button {
    padding: 12px 20px;
  }
</style>