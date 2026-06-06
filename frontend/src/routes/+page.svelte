<script lang="ts">
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
  } from '$lib/api/chat';

  function startNewChat() {
    sessionStore.clear();
    messages.set([]);
    error.set(null);
  }

  let input = $state('');

  async function sendText(text: string) {
    if (!text.trim()) return;

    messages.update(current => [
      ...current,
      {
        sender: 'USER',
        text,
        createdAt: new Date().toISOString(),
      },
    ]);

    isLoading.set(true);
    error.set(null);

    try {
      let sessionId: string | null = null;

      const unsubscribe = sessionStore.subscribe(value => {
        sessionId = value;
      });
      unsubscribe();

      const response = await sendMessage({
        message: text,
        sessionId: sessionId ?? undefined,
      });

      sessionStore.setSessionId(response.sessionId);

      messages.update(current => [
        ...current,
        {
          sender: 'AI',
          text: response.reply,
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch {
      error.set('Unable to send message. Please try again.');
    } finally {
      isLoading.set(false);
    }
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || $isLoading) return;
    input = '';
    await sendText(text);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey && !$isLoading) {
      e.preventDefault();
      handleSend();
    }
  }
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
  />
</svelte:head>

<div class="page">
  <div class="chat-card">

    <!-- Header -->
    <div class="header">
      <div class="header-left">
        <div class="bot-avatar" aria-hidden="true">
          <i class="ti ti-headset"></i>
        </div>
        <div class="header-info">
          <h1>ShopSpur Support</h1>
          <p class="status">
            <span class="online-dot" aria-hidden="true"></span>
            Online · typically replies instantly
          </p>
        </div>
      </div>

      <button class="new-chat-btn" onclick={startNewChat} aria-label="Start a new chat">
        <i class="ti ti-refresh" aria-hidden="true"></i>
        New chat
      </button>
    </div>

    <!-- Messages -->
    <ChatWindow onSuggestion={sendText} />

    <!-- Error banner -->
    {#if $error}
      <div class="error-banner" role="alert">
        <i class="ti ti-alert-circle" aria-hidden="true"></i>
        {$error}
      </div>
    {/if}

    <!-- Input area -->
    <div class="input-area">
      <div class="input-row" class:focused={false}>
        <input
          bind:value={input}
          maxlength="2000"
          placeholder="Ask a question…"
          aria-label="Type your message"
          onkeydown={handleKeydown}
          disabled={$isLoading}
        />
        <span class="counter" aria-live="polite">{input.length}/2000</span>
        <button
          class="send-btn"
          onclick={handleSend}
          disabled={$isLoading || !input.trim()}
          aria-label="Send message"
        >
          {#if $isLoading}
            <i class="ti ti-loader-2 spinning" aria-hidden="true"></i>
          {:else}
            <i class="ti ti-send" aria-hidden="true"></i>
          {/if}
        </button>
      </div>
      <p class="input-hint">Press Enter to send &middot; Shift+Enter for new line</p>
    </div>

  </div>
</div>

<style>
  /* ── Page ── */
  .page {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f0f4f8;
    padding: 1.5rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
  }

  /* ── Card ── */
  .chat-card {
    width: min(760px, 100%);
    height: 90vh;
    max-height: 820px;
    background: #ffffff;
    border-radius: 20px;
    border: 0.5px solid rgba(0, 0, 0, 0.07);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* ── Header ── */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 20px;
    border-bottom: 0.5px solid #f0f0f0;
    flex-shrink: 0;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 11px;
  }

  .bot-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: linear-gradient(135deg, #d4f0e4, #a8e0c4);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .bot-avatar i {
    font-size: 18px;
    color: #0a7c57;
  }

  .header-info h1 {
    font-size: 14px;
    font-weight: 600;
    color: #0f172a;
    letter-spacing: -0.01em;
    margin: 0;
  }

  .status {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11.5px;
    color: #94a3b8;
    margin: 2px 0 0;
  }

  .online-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #22c55e;
    flex-shrink: 0;
  }

  .new-chat-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    color: #64748b;
    border: 0.5px solid #e2e8f0;
    border-radius: 8px;
    padding: 6px 12px;
    background: transparent;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    line-height: 1;
  }

  .new-chat-btn i {
    font-size: 13px;
  }

  .new-chat-btn:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }

  /* ── Error banner ── */
  .error-banner {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 20px 4px;
    padding: 10px 14px;
    background: #fef2f2;
    border: 0.5px solid #fecaca;
    border-radius: 10px;
    font-size: 12.5px;
    color: #b91c1c;
    flex-shrink: 0;
  }

  .error-banner i {
    font-size: 15px;
    flex-shrink: 0;
  }

  /* ── Input area ── */
  .input-area {
    padding: 12px 20px 16px;
    border-top: 0.5px solid #f0f0f0;
    flex-shrink: 0;
    background: #ffffff;
  }

  .input-row {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #f8fafc;
    border: 0.5px solid #e2e8f0;
    border-radius: 14px;
    padding: 6px 6px 6px 16px;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }

  .input-row:focus-within {
    border-color: #0a7c57;
    box-shadow: 0 0 0 3px rgba(10, 124, 87, 0.08);
    background: #ffffff;
  }

  .input-row input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 13.5px;
    background: transparent;
    color: #0f172a;
    padding: 7px 0;
    min-width: 0;
  }

  .input-row input::placeholder {
    color: #c0ccd8;
  }

  .input-row input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .counter {
    font-size: 11px;
    color: #c0ccd8;
    flex-shrink: 0;
    padding: 0 4px;
    user-select: none;
  }

  .send-btn {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: #0a7c57;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.15s, transform 0.15s, opacity 0.15s;
  }

  .send-btn i {
    font-size: 17px;
    color: #ffffff;
  }

  .send-btn:hover:not(:disabled) {
    background: #0b8f63;
    transform: translateY(-1px);
  }

  .send-btn:active:not(:disabled) {
    transform: scale(0.95);
  }

  .send-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }

  /* ── Spinner animation ── */
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  :global(.spinning) {
    animation: spin 0.75s linear infinite;
  }

  /* ── Hint ── */
  .input-hint {
    font-size: 11px;
    color: #8d98a3;
    text-align: center;
    margin-top: 8px;
    user-select: none;
  }
</style>