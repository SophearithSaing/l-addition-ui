<template>
  <article class="design-system-page section-stack">
    <section class="design-system-hero stack-md">
      <h1 class="type-display-lg text-primary">Color Palette</h1>
      <p class="type-body-lg text-muted">
        The L'Addition color system is built on a foundation of Quiet Luxury, utilizing warm
        neutrals, deep charcoals, and soft metallic accents to create timeless elegance and clarity.
      </p>
      <div class="divider"></div>
    </section>

    <section class="design-system-section">
      <div class="stack-sm">
        <h2 class="type-headline-md text-primary">Primary &amp; Surface</h2>
        <p class="type-body-md text-muted">
          The core contrast of the interface. Deep charcoal provides authority, while off-white
          surfaces create a breathable, premium feel.
        </p>
      </div>

      <div class="design-system-card-grid">
        <article class="card color-card">
          <div class="color-card__content split-row">
            <span class="design-system-swatch design-system-swatch--primary"></span>
            <div class="stack-xs">
              <h3 class="type-card-title text-primary">Primary</h3>
              <p class="type-code text-muted">#000000</p>
            </div>
          </div>
          <p class="color-card__token type-code text-muted">--color-primary</p>
        </article>
        <article class="card color-card">
          <div class="color-card__content split-row">
            <span class="design-system-swatch design-system-swatch--surface"></span>
            <div class="stack-xs">
              <h3 class="type-card-title text-primary">Surface</h3>
              <p class="type-code text-muted">#FCF9F5</p>
            </div>
          </div>
          <p class="color-card__token type-code text-muted">--color-surface</p>
        </article>
      </div>
    </section>

    <section class="design-system-section">
      <div class="stack-sm">
        <h2 class="type-headline-md text-primary">Accents</h2>
        <p class="type-body-md text-muted">
          Soft gold and variant tones are reserved for interactive states, confirmations, and subtle
          highlights.
        </p>
      </div>

      <div class="design-system-card-grid">
        <article class="card color-card">
          <div class="color-card__content split-row">
            <span class="design-system-swatch design-system-swatch--secondary"></span>
            <div class="stack-xs">
              <h3 class="type-card-title text-primary">Gold Accent</h3>
              <p class="type-code text-muted">#775A19</p>
            </div>
          </div>
          <p class="color-card__token type-code text-muted">--color-secondary</p>
        </article>
        <article class="card color-card">
          <div class="color-card__content split-row">
            <span class="design-system-swatch design-system-swatch--secondary-container"></span>
            <div class="stack-xs">
              <h3 class="type-card-title text-primary">Gold Muted</h3>
              <p class="type-code text-muted">#FED488</p>
            </div>
          </div>
          <p class="color-card__token type-code text-muted">--color-secondary-container</p>
        </article>
      </div>
    </section>

    <section class="design-system-section">
      <div class="stack-sm">
        <h2 class="type-headline-md text-primary">Semantic</h2>
        <p class="type-body-md text-muted">
          Functional colors for system feedback, held within the same muted and restrained
          aesthetic.
        </p>
      </div>

      <div class="design-system-card-grid">
        <article class="card color-card">
          <div class="color-card__content split-row">
            <span class="design-system-swatch design-system-swatch--error"></span>
            <div class="stack-xs">
              <h3 class="type-card-title text-primary">Error</h3>
              <p class="type-code text-muted">#BA1A1A</p>
            </div>
          </div>
          <p class="color-card__token type-code text-muted">--color-error</p>
        </article>
        <article class="card color-card">
          <div class="color-card__content split-row">
            <span class="design-system-swatch design-system-swatch--error-container"></span>
            <div class="stack-xs">
              <h3 class="type-card-title text-primary">Error Muted</h3>
              <p class="type-code text-muted">#FFDAD6</p>
            </div>
          </div>
          <p class="color-card__token type-code text-muted">--color-error-container</p>
        </article>
      </div>
    </section>
  </article>
</template>

<style scoped>
.color-card {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: var(--space-sm);
}

.color-card__content {
  min-width: 0;
  justify-content: flex-start;
}

.color-card__content > .stack-xs {
  min-width: 0;
}

.color-card__token {
  border-top: var(--border-subtle);
  padding-top: var(--space-sm);
  overflow-wrap: anywhere;
}
</style>
