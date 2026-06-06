<script lang="ts">
  import { marked } from 'marked';
  import type { Message } from '$lib/types';

  const { message } = $props<{
    message: Message;
  }>();
</script>

<div
  class:user={message.sender === 'USER'}
  class:ai={message.sender === 'AI'}
  class="message"
>
  {@html marked(message.text)}
</div>

<style>
  .message {
  max-width: 75%;
  width: fit-content;

  padding: 12px 16px;
  border-radius: 12px;

  overflow-wrap: break-word;
  word-break: break-word;
}

  .user {
    align-self: flex-end;
    background: #2563eb;
    color: white;
  }

  .ai {
    align-self: flex-start;
    background: #f3f4f6;
    color: #111827;
  }
</style>