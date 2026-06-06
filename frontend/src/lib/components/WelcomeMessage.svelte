<script lang="ts">
  const {
    onSuggestion = () => {},
  }: {
    onSuggestion?: (
      text: string,
    ) => void;
  } = $props();
</script>

<div class="welcome">
  <div class="avatar">
    🤖
  </div>

  <h2>ShopSpur Assistant</h2>

  <p>
    Get instant answers about
    shipping, returns, refunds,
    and support policies.
  </p>

  <div class="chips">
    <button
      onclick={() =>
        onSuggestion(
          'What is your return policy?',
        )}
    >
      Return Policy
    </button>

    <button
      onclick={() =>
        onSuggestion(
          'Do you ship internationally?',
        )}
    >
      International Shipping
    </button>

    <button
      onclick={() =>
        onSuggestion(
          'What are your support hours?',
        )}
    >
      Support Hours
    </button>
  </div>
</div>

<style>
  .welcome {
    margin: auto;

    display: flex;
    flex-direction: column;
    align-items: center;

    text-align: center;

    gap: 16px;

    max-width: 600px;
  }

  .avatar {
    width: 72px;
    height: 72px;

    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;

    background: #e1f5ee;

    font-size: 32px;
  }

  h2 {
    margin: 0;

    font-size: 28px;
  }

  p {
    margin: 0;

    color: #6b7280;

    line-height: 1.6;
  }

  .chips {
    display: flex;

    flex-wrap: wrap;

    justify-content: center;

    gap: 12px;

    margin-top: 8px;
  }

  .chips button {
    padding: 10px 16px;

    border-radius: 999px;

    border: 1px solid #d1d5db;

    background: white;

    color: #374151;

    cursor: pointer;

    transition:
      background 0.15s ease,
      border-color 0.15s ease,
      color 0.15s ease,
      transform 0.15s ease;
  }

  .chips button:hover {
    background: #e1f5ee;

    border-color: #1d9e75;

    color: #1d9e75;

    transform: translateY(-1px);
  }
</style>