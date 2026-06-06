<div class="typing-row">
  <div class="avatar">
    🤖
  </div>

  <div class="bubble">
    <span></span>
    <span></span>
    <span></span>
  </div>
</div>

<style>
  .typing-row {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .avatar {
    width: 36px;
    height: 36px;

    border-radius: 50%;

    background: #e1f5ee;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .bubble {
    display: flex;
    gap: 6px;

    padding: 12px 16px;

    border-radius: 14px;

    background: #f8fafc;

    border: 1px solid #e5e7eb;
  }

  .bubble span {
    width: 8px;
    height: 8px;

    border-radius: 50%;

    background: #1d9e75;

    animation: bounce 1.4s infinite;
  }

  .bubble span:nth-child(2) {
    animation-delay: 0.2s;
  }

  .bubble span:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes bounce {
    0%,
    80%,
    100% {
      transform: scale(0.7);
      opacity: 0.5;
    }

    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
</style>