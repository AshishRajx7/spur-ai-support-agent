<script lang="ts">
  import { onMount } from 'svelte';

  import { messages } from '$lib/stores/chat.store';
  import { sessionStore } from '$lib/stores/session.store';
  import { getHistory } from '$lib/api/chat';

  import favicon from '$lib/assets/favicon.svg';

  let { children } = $props();

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
    } catch (error) {
      console.error(
        'Failed to restore chat history',
        error,
      );
    }
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

{@render children()}