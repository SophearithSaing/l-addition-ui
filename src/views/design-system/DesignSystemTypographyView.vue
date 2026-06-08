<template>
  <article class="design-system-page section-stack">
    <section class="design-system-hero stack-md">
      <h1 class="type-headline-lg text-primary">Typography</h1>
      <p class="type-body-lg text-muted">
        Our type system balances editorial elegance with functional clarity. Use Playfair Display
        for emphasis and Inter for readable interface text and aligned numerical data.
      </p>
      <div class="divider"></div>
    </section>

    <section class="design-system-section design-system-section--typography">
      <div class="stack-sm">
        <h2 class="type-headline-md text-primary">Display</h2>
        <p class="type-body-md text-muted">
          Playfair Display is used for headlines, summary statements, and brand moments.
        </p>
      </div>

      <div class="stack-lg">
        <div class="stack-xs">
          <p class="type-headline-lg text-primary">Headline Large (40px)</p>
          <p class="type-body-sm text-muted">Playfair Display Semibold / -0.02em</p>
          <div class="divider"></div>
        </div>
        <div class="stack-xs">
          <p class="type-headline-md text-primary">Headline Medium (24px)</p>
          <p class="type-body-sm text-muted">Playfair Display Medium</p>
          <div class="divider"></div>
        </div>
        <div class="stack-xs">
          <p class="type-headline-sm text-primary">Headline Small (20px)</p>
          <p class="type-body-sm text-muted">Playfair Display Medium</p>
        </div>
      </div>
    </section>

    <section class="design-system-section design-system-section--typography">
      <div class="stack-sm">
        <h2 class="type-headline-md text-primary">Body</h2>
        <p class="type-body-md text-muted">
          Inter is optimized for functional text, instructions, labels, and readable data-heavy
          interfaces.
        </p>
      </div>

      <div class="stack-lg">
        <div class="stack-xs">
          <p class="type-body-lg text-primary">Body Large (18px)</p>
          <p class="type-body-sm text-muted">Inter Regular / 28px Line Height</p>
          <div class="divider"></div>
        </div>
        <div class="stack-xs">
          <p class="type-body-md text-primary">Body Medium (16px)</p>
          <p class="type-body-sm text-muted">Inter Regular / 24px Line Height</p>
          <div class="divider"></div>
        </div>
        <div class="stack-xs">
          <p class="type-body-sm text-primary">Body Small (14px)</p>
          <p class="type-body-sm text-muted">Inter Regular / 20px Line Height</p>
        </div>
        <div class="cluster">
          <div class="stack-xs">
            <strong class="type-body-md text-primary">Bold</strong>
            <span class="type-body-sm text-muted">700</span>
          </div>
          <div class="stack-xs">
            <strong class="type-body-md text-primary">Medium</strong>
            <span class="type-body-sm text-muted">500</span>
          </div>
          <div class="stack-xs">
            <span class="type-body-md text-primary">Regular</span>
            <span class="type-body-sm text-muted">400</span>
          </div>
        </div>
      </div>
    </section>

    <section class="design-system-section design-system-section--typography">
      <div class="stack-sm">
        <h2 class="type-headline-md text-primary">Numerals</h2>
        <p class="type-body-md text-muted">
          Currency and bill calculations use tabular lining figures to align decimal values in
          vertical lists.
        </p>
      </div>

      <div class="stack-lg">
        <div class="stack-xs">
          <p class="type-number-xl text-primary">$1,248.75</p>
          <p class="type-body-sm text-muted">Number XL / Inter Light</p>
          <div class="divider"></div>
        </div>
        <div class="stack-xs">
          <p class="type-number-md text-primary">$450.00</p>
          <p class="type-body-sm text-muted">Number MD / Inter Medium</p>
        </div>
      </div>
    </section>

    <section class="design-system-section design-system-section--typography">
      <div class="stack-sm">
        <h2 class="type-headline-md text-primary">Monospace</h2>
        <p class="type-body-md text-muted">
          A clean monospace stack is reserved for technical snippets and token references.
        </p>
      </div>

      <pre class="card card--muted type-code text-primary"><code>const typography = {
  family: 'Inter',
  display: 'Playfair Display',
  size: '16px'
};</code></pre>
    </section>
  </article>
</template>
