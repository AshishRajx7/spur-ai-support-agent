<script lang="ts">
  import { tick } from 'svelte';

  import MessageBubble from './MessageBubble.svelte';
  import TypingIndicator from './TypingIndicator.svelte';
  import WelcomeMessage from './WelcomeMessage.svelte';
  import {
    messages,
    isLoading,
    error,
  } from '$lib/stores/chat.store';

  // Define Svelte 5 component props
  const {
    onSuggestion = () => {},
  }: {
    onSuggestion?: (text: string) => void;
  } = $props();

  let messagesContainer: HTMLDivElement | undefined;

  async function scrollToBottom() {
    await tick();

    messagesContainer?.scrollTo({
      top: messagesContainer.scrollHeight,
      behavior: 'smooth',
    });
  }

  $effect(() => {
    // Keep track of messages length to trigger scroll on change
    $messages.length;
    scrollToBottom();
  });
</script>

<div class="chat-container">
  <div
    class="messages"
    bind:this={messagesContainer}
  >
    {#if $messages.length === 0}
      <WelcomeMessage {onSuggestion} />
    {/if}

    {#each $messages as message}
      <MessageBubble {message} />
    {/each}

    {#if $isLoading}
      <TypingIndicator />
    {/if}
  </div>

  {#if $error}
    <div class="error">
      {$error}
    </div>
  {/if}
</div>

<style>
  .chat-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
  }

  .messages {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    min-height: 0;
    scroll-behavior: smooth;
  }

  .error {
    padding: 12px 16px;
    color: #dc2626;
    background: #fef2f2;
    border-top: 1px solid #fecaca;
  }
</style>