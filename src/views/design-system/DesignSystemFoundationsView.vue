<template>
  <article class="design-system-page section-stack">
    <section class="design-system-hero stack-md">
      <h1 class="type-display-lg text-primary">Foundations</h1>
      <p class="type-body-lg text-muted">
        The core structural elements that define the physical presence and spatial logic of the
        L'Addition interface.
      </p>
      <div class="divider"></div>
    </section>

    <section class="design-system-section design-system-section--foundation">
      <div class="stack-sm">
        <h2 class="type-headline-md text-primary">Spacing System</h2>
        <p class="type-body-md text-muted">
          Built on an 8px base unit to ensure mathematical harmony across all layouts.
        </p>
      </div>

      <div class="stack-md">
        <div class="cluster">
          <span class="design-system-space-sample design-system-space-sample--unit"></span>
          <span class="type-code text-primary">8px (Base Unit)</span>
        </div>
        <div class="cluster">
          <span class="design-system-space-sample design-system-space-sample--sm"></span>
          <span class="type-code text-primary">16px (Small Gap)</span>
        </div>
        <div class="cluster">
          <span class="design-system-space-sample design-system-space-sample--md"></span>
          <span class="type-code text-primary">24px (Gutter)</span>
        </div>
        <div class="cluster">
          <span class="design-system-space-sample design-system-space-sample--xl"></span>
          <span class="type-code text-primary">48px (Section Gap)</span>
        </div>
        <div class="cluster">
          <span class="design-system-space-sample design-system-space-sample--2xl"></span>
          <span class="type-code text-primary">64px (Container Padding)</span>
        </div>
      </div>
    </section>

    <section class="design-system-section design-system-section--foundation">
      <div class="stack-sm">
        <h2 class="type-headline-md text-primary">Grid &amp; Containers</h2>
        <p class="type-body-md text-muted">
          Standardized widths preserve content density, rhythm, and readability.
        </p>
      </div>

      <div class="stack-lg">
        <div class="design-system-container-sample">
          <div class="design-system-container-sample__fill foundation-container-label">
            1140px (Desktop Max)
          </div>
        </div>
        <div class="design-system-container-sample design-system-container-sample--reading">
          <div class="design-system-container-sample__fill foundation-container-label">
            800px (Reading Max)
          </div>
        </div>
      </div>
    </section>

    <section class="design-system-section design-system-section--foundation">
      <div class="stack-sm">
        <h2 class="type-headline-md text-primary">Shadow System</h2>
        <p class="type-body-md text-muted">
          Soft, layered elevations create depth without visual noise.
        </p>
      </div>

      <div class="foundation-sample-group">
        <div class="foundation-sample-item">
          <div class="design-system-shadow-sample surface-ambient"></div>
          <span class="showcase-label text-primary">Ambient</span>
        </div>
        <div class="foundation-sample-item">
          <div class="design-system-shadow-sample surface-elevated"></div>
          <span class="showcase-label text-primary">Elevated</span>
        </div>
        <div class="foundation-sample-item">
          <div class="design-system-shadow-sample surface-pressed"></div>
          <span class="showcase-label text-primary">Pressed</span>
        </div>
      </div>
    </section>

    <section class="design-system-section design-system-section--foundation">
      <div class="stack-sm">
        <h2 class="type-headline-md text-primary">Border Radii</h2>
        <p class="type-body-md text-muted">
          Consistent corner treatment creates a refined, modern feel.
        </p>
      </div>

      <div class="foundation-sample-group">
        <div class="foundation-sample-item">
          <div class="design-system-radius-sample design-system-radius-sample--default"></div>
          <span class="showcase-label text-primary">2px (Default)</span>
        </div>
        <div class="foundation-sample-item">
          <div class="design-system-radius-sample design-system-radius-sample--large"></div>
          <span class="showcase-label text-primary">4px (Large)</span>
        </div>
        <div class="foundation-sample-item">
          <div class="design-system-radius-sample design-system-radius-sample--xl"></div>
          <span class="showcase-label text-primary">8px (Extra Large)</span>
        </div>
      </div>
    </section>
  </article>
</template>
