<template>
  <main
    class="app-loading-screen surface-page"
    role="status"
    aria-live="polite"
    aria-label="Loading L'Addition"
  >
    <h1 class="app-loading-screen__brand type-headline-lg">L'Addition</h1>
    <div class="app-loading-screen__progress" aria-hidden="true">
      <div class="app-loading-screen__bar"></div>
    </div>
  </main>
</template>

<style scoped>
@keyframes app-loading-fade-in {
  from {
    opacity: 0;
    transform: translateY(var(--space-xs));
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes app-loading-expand-line {
  0% {
    width: 0;
    opacity: 0;
  }

  20% {
    opacity: 1;
  }

  100% {
    width: 100%;
    opacity: 1;
  }
}

.app-loading-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding-inline: var(--space-container-mobile);
}

.app-loading-screen__brand {
  margin-bottom: var(--space-lg);
  color: var(--color-secondary);
  font-style: italic;
  font-weight: var(--type-headline-md-weight);
  animation: app-loading-fade-in 500ms ease-out forwards;
}

.app-loading-screen__progress {
  width: calc((var(--space-2xl) * 3) + var(--space-xl));
  height: 1px;
}

.app-loading-screen__bar {
  width: 0;
  height: 100%;
  margin-inline: auto;
  background: var(--color-secondary);
  opacity: 0;
  animation: app-loading-expand-line 3000ms cubic-bezier(0.65, 0, 0.35, 1) 500ms infinite;
}

@media (min-width: 768px) {
  .app-loading-screen {
    padding-inline: var(--space-container-desktop);
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-loading-screen__brand,
  .app-loading-screen__bar {
    animation-duration: 1ms;
    animation-delay: 0ms;
  }
}
</style>
