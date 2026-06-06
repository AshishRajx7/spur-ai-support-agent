<script lang="ts">
  import { marked } from 'marked';
  import DOMPurify from 'dompurify';

  import type { Message } from '$lib/types';

  const { message } = $props<{
    message: Message;
  }>();

  const html = DOMPurify.sanitize(
    marked.parse(message.text) as string,
  );
</script>

<div
  class:user-row={message.sender === 'USER'}
  class:ai-row={message.sender !== 'USER'}
  class="row"
>
  {#if message.sender !== 'USER'}
    <div class="avatar">
      🤖
    </div>
  {/if}

  <div class="content">
    <div class="label">
      {message.sender === 'USER'
        ? 'You'
        : 'ShopSpur'}
    </div>

    <div
      class:user={message.sender === 'USER'}
      class:ai={message.sender !== 'USER'}
      class="message"
    >
      {@html html}
    </div>

    <div class="timestamp">
      {#if message.createdAt}
        {new Date(
          message.createdAt,
        ).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      {/if}
    </div>
  </div>
</div>

<style>
  .row {
    display: flex;
    gap: 10px;

    width: 100%;
  }

  .user-row {
    justify-content: flex-end;
  }

  .ai-row {
    justify-content: flex-start;
  }

  .avatar {
    width: 36px;
    height: 36px;

    flex-shrink: 0;

    border-radius: 50%;

    background: #1d9e75;
    color: white;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 14px;
  }

  .content {
    display: flex;
    flex-direction: column;

    max-width: min(75%, 700px);
  }

  .label {
    font-size: 12px;

    color: #6b7280;

    margin-bottom: 4px;
  }

  .message {
    padding: 12px 16px;

    border-radius: 14px;

    overflow-wrap: break-word;
    word-break: break-word;

    line-height: 1.6;

    transition:
      transform 0.15s ease,
      box-shadow 0.15s ease;
  }

  .message:hover {
    box-shadow:
      0 2px 8px
      rgba(0, 0, 0, 0.08);
  }

  .user {
    background: #e1f5ee;

    color: #0f5132;
  }

  .ai {
    background: #f8fafc;

    border: 1px solid #e5e7eb;

    color: #111827;
  }

  .timestamp {
    margin-top: 4px;

    font-size: 11px;

    color: #9ca3af;
  }

  :global(.message p) {
    margin: 0;
  }

  :global(.message ul),
  :global(.message ol) {
    margin: 8px 0;
    padding-left: 20px;
  }

  :global(.message li) {
    margin: 4px 0;
  }

  :global(.message strong) {
    font-weight: 600;
  }

  :global(.message code) {
    padding: 2px 6px;

    border-radius: 4px;

    background: rgba(
      0,
      0,
      0,
      0.05
    );

    font-size: 0.9em;
  }
</style>