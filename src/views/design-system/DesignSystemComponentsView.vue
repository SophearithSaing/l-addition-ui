<script setup lang="ts">
import TotalRow from '@/components/common/TotalRow.vue'
import { TotalRowType } from '@/components/common/types/total-row'
</script>

<template>
  <article class="design-system-page section-stack">
    <section class="design-system-hero stack-md">
      <h1 class="type-display-lg text-primary">
        L'Addition Design System: Components &amp; Layout
      </h1>
      <p class="type-body-lg text-muted">
        This document serves as the technical specification for developers building L'Addition. It
        focuses on component modularity, layout architecture, and responsive behavior to ensure a
        consistent Quiet Luxury experience across all devices.
      </p>
      <div class="divider"></div>
    </section>

    <section class="stack-md">
      <div class="stack-sm">
        <h2 class="type-headline-md text-primary">1. Core Component Library</h2>
        <div class="divider"></div>
        <p class="type-body-md text-muted">
          These components are designed to be highly reusable, with props-driven styling and clear
          state management.
        </p>
      </div>
    </section>

    <section class="design-system-section">
      <div class="stack-sm">
        <h2 class="type-headline-md text-primary">Action: Buttons</h2>
        <p class="type-body-md text-muted">
          Primary actions, secondary outlines, and subtle ghost buttons.
        </p>
        <div class="spec-card type-code">
          .button<br />
          .button--primary<br />
          .button--outline<br />
          .button--ghost<br />
          .button--icon
        </div>
      </div>

      <div class="showcase-panel">
        <div class="showcase-item">
          <button class="button button--primary" type="button">Calculate</button>
          <span class="showcase-label">Primary</span>
        </div>
        <div class="showcase-item">
          <button class="button button--outline" type="button">Cancel</button>
          <span class="showcase-label">Outline</span>
        </div>
        <div class="showcase-item">
          <button class="button button--ghost button--icon" type="button" aria-label="More actions">
            <span class="material-symbols-outlined" aria-hidden="true">more_vert</span>
          </button>
          <span class="showcase-label">Ghost (Icon)</span>
        </div>
      </div>
    </section>

    <section class="design-system-section">
      <div class="stack-sm">
        <h2 class="type-headline-md text-primary">Forms: Inputs &amp; Toggles</h2>
        <p class="type-body-md text-muted">Elements for data entry in Calculator and Settings.</p>
        <div class="spec-card type-code">
          .field<br />
          .field__label<br />
          .field__control<br />
          .field__prefix<br />
          .input<br />
          .input--currency<br />
          .toggle-group<br />
          .toggle-option<br />
          .toggle-option--active<br />
          .stepper
        </div>
      </div>

      <div class="showcase-panel showcase-panel--stack">
        <label class="field">
          <span class="field__label">Tip Amount</span>
          <span class="field__control">
            <span class="field__prefix type-number-md">$</span>
            <input
              class="input input--currency"
              inputmode="decimal"
              min="0"
              step="0.01"
              type="number"
              value="25.00"
            />
          </span>
        </label>

        <div class="split-row">
          <div class="toggle-group" role="group" aria-label="Tip unit">
            <button class="toggle-option toggle-option--active" type="button">%</button>
            <button class="toggle-option" type="button">Fixed</button>
          </div>

          <div class="stepper" aria-label="Diner count">
            <button class="stepper__button" type="button" aria-label="Remove diner">
              <span class="material-symbols-outlined" aria-hidden="true">remove</span>
            </button>
            <span class="stepper__value type-number-md">4</span>
            <button class="stepper__button" type="button" aria-label="Add diner">
              <span class="material-symbols-outlined" aria-hidden="true">add</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="design-system-section">
      <div class="stack-sm">
        <h2 class="type-headline-md text-primary">Forms &amp; Inputs</h2>
        <p class="type-body-md text-muted">
          Minimalist input styles for data entry and item management.
        </p>
        <div class="spec-card type-code">
          .quiet-field<br />
          .quiet-field__label<br />
          .input<br />
          .input--stationery<br />
          .inline-add<br />
          .inline-add__control<br />
          .inline-add__input
        </div>
      </div>

      <div class="showcase-panel showcase-panel--stack">
        <label class="quiet-field">
          <span class="quiet-field__label">Item Name</span>
          <input class="input input--stationery type-body-lg" placeholder="e.g. Vintage Bordeaux" />
        </label>

        <div class="inline-add">
          <label class="inline-add__control">
            <span class="material-symbols-outlined" aria-hidden="true">add</span>
            <input class="inline-add__input type-body-md" placeholder="Add new item..." />
          </label>
          <button class="button button--ghost" type="button">Add</button>
        </div>
      </div>
    </section>

    <section class="design-system-section">
      <div class="stack-sm">
        <h2 class="type-headline-md text-primary">Interactive: DinerAvatar</h2>
        <p class="type-body-md text-muted">
          Used for selection and assignment during the scanning process.
        </p>
        <div class="spec-card type-code">
          .diner-avatar<br />
          .diner-avatar__mark<br />
          .diner-avatar__badge<br />
          .diner-avatar--selected<br />
          .diner-avatar--assigned
        </div>
      </div>

      <div class="showcase-panel">
        <div class="diner-avatar">
          <span class="diner-avatar__mark type-label">JD</span>
          <span class="type-label">Default</span>
        </div>

        <div class="diner-avatar diner-avatar--selected">
          <span class="diner-avatar__mark type-label">JD</span>
          <span class="type-label">Selected</span>
        </div>

        <div class="diner-avatar diner-avatar--assigned">
          <span class="diner-avatar__mark type-label">
            JD
            <span class="diner-avatar__badge">
              <span class="material-symbols-outlined icon-fill" aria-hidden="true">check</span>
            </span>
          </span>
          <span class="type-label">Assigned</span>
        </div>
      </div>
    </section>

    <section class="design-system-section">
      <div class="stack-sm">
        <h2 class="type-headline-md text-primary">Interactive: DinerCard</h2>
        <p class="type-body-md text-muted">
          The primary container for individual diner calculations and item assignments.
        </p>
        <div class="spec-card type-code">
          .diner-card<br />
          .diner-card__items<br />
          .diner-card__item<br />
          .quiet-field<br />
          .input--stationery<br />
          .inline-add
        </div>
      </div>

      <div class="showcase-panel showcase-panel--stack">
        <article class="diner-card">
          <label class="quiet-field">
            <span class="quiet-field__label">Diner Name</span>
            <input class="input input--stationery type-body-lg" placeholder="e.g. Julian" />
          </label>

          <div class="diner-card__items">
            <div class="diner-card__item">
              <span class="type-body-md text-muted">Chateau Margaux 2015</span>
              <span class="type-number-md text-primary">$450.00</span>
            </div>
            <div class="diner-card__item">
              <span class="type-body-md text-muted">Steak Tartare</span>
              <span class="type-number-md text-primary">$42.00</span>
            </div>
          </div>

          <button class="inline-add" type="button">
            <span class="cluster text-muted">
              <span class="material-symbols-outlined" aria-hidden="true">add</span>
              <span class="type-label">Add Item</span>
            </span>
          </button>
        </article>
      </div>
    </section>

    <section class="design-system-section">
      <div class="stack-sm">
        <h2 class="type-headline-md text-primary">Content: ReceiptItemCard</h2>
        <p class="type-body-md text-muted">
          The building block for the Scan &amp; Assign interface.
        </p>
        <div class="spec-card type-code">
          .receipt-item-card<br />
          .receipt-item-card--assigned<br />
          .design-system-item-check<br />
          .design-system-item-check--assigned<br />
          .type-number-md
        </div>
      </div>

      <div class="stack-md">
        <article class="receipt-item-card">
          <div class="cluster">
            <span class="design-system-item-check" aria-hidden="true"></span>
            <div>
              <h3 class="type-headline-sm text-primary">Chateau Margaux 2015</h3>
              <p class="type-body-sm text-muted">Beverage</p>
            </div>
          </div>
          <div class="cluster">
            <span class="type-number-md text-primary">$450.00</span>
            <button class="button button--ghost button--icon" type="button" aria-label="Split item">
              <span class="material-symbols-outlined" aria-hidden="true">call_split</span>
            </button>
          </div>
        </article>

        <article class="receipt-item-card receipt-item-card--assigned">
          <div class="cluster">
            <span
              class="design-system-item-check design-system-item-check--assigned"
              aria-hidden="true"
            >
              <span class="material-symbols-outlined icon-fill">check</span>
            </span>
            <div>
              <h3 class="type-headline-sm text-primary"><s>Steak Tartare</s></h3>
              <p class="type-body-sm text-muted">Appetizer</p>
            </div>
          </div>
          <span class="type-number-md text-muted">$42.00</span>
        </article>
      </div>
    </section>

    <section class="design-system-section">
      <div class="stack-sm">
        <h2 class="type-headline-md text-primary">Status &amp; Badges</h2>
        <p class="type-body-md text-muted">Small indicators to convey state concisely.</p>
        <div class="spec-card type-code">
          .badge<br />
          .badge--split<br />
          .badge--assigned<br />
          .badge--alert<br />
          .icon-fill
        </div>
      </div>

      <div class="showcase-panel">
        <span class="badge badge--split">
          <span class="material-symbols-outlined" aria-hidden="true">call_split</span>
          Splitable
        </span>
        <span class="badge badge--assigned">
          <span class="material-symbols-outlined icon-fill" aria-hidden="true">check_circle</span>
          Assigned
        </span>
        <span class="badge badge--alert">
          <span class="material-symbols-outlined" aria-hidden="true">error</span>
          Unassigned Items
        </span>
      </div>
    </section>

    <section class="design-system-section">
      <div class="stack-sm">
        <h2 class="type-headline-md text-primary">Layout: Adjustments &amp; Totals</h2>
        <p class="type-body-md text-muted">
          The summary panel for final calculations and tax/tip adjustments.
        </p>
        <div class="spec-card type-code">
          TotalRow.vue<br />
          .totals-panel<br />
          .divider
        </div>
      </div>

      <div class="showcase-panel showcase-panel--stack">
        <div class="totals-panel">
          <TotalRow label="Subtotal" value="$492.00" />
          <TotalRow label="Tax (8.875%)" value="$43.66" />
          <TotalRow label="Tip" value="$98.40" />
          <div class="divider"></div>
          <TotalRow label="Total" value="$634.06" :type="TotalRowType.Total" />
        </div>
      </div>
    </section>
  </article>
</template>

<style scoped>
.showcase-panel {
  min-height: 176px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--space-lg);
  border: var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  background: var(--color-surface-container-lowest);
  box-shadow: var(--shadow-ambient);
}

.showcase-panel--stack {
  min-height: 0;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  gap: var(--space-lg);
}

.showcase-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
}

.showcase-label {
  color: var(--color-on-surface-variant);
  font-family: var(--font-body);
  font-size: var(--type-label-sm-size);
  font-weight: var(--type-label-md-weight);
  line-height: var(--type-label-sm-line);
  letter-spacing: var(--type-label-md-tracking);
  text-align: center;
  text-transform: uppercase;
}

.diner-avatar {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  color: var(--color-on-surface-variant);
}

.diner-avatar__mark {
  position: relative;
  width: var(--space-2xl);
  height: var(--space-2xl);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-surface-variant);
  border-radius: var(--radius-pill);
  background: var(--color-surface-container-low);
  transition: all var(--motion-smooth);
}

.diner-avatar--selected {
  color: var(--color-primary);
  transform: scale(1.05);
}

.diner-avatar--selected .diner-avatar__mark {
  background: var(--color-primary);
  color: var(--color-on-primary);
  box-shadow: var(--shadow-ambient);
}

.diner-avatar--assigned .diner-avatar__mark {
  opacity: 0.8;
}

.diner-avatar__badge {
  position: absolute;
  top: calc(var(--space-2xs) * -1);
  right: calc(var(--space-2xs) * -1);
  width: var(--space-md);
  height: var(--space-md);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-pill);
  background: var(--color-secondary);
  color: var(--color-on-secondary);
}

.receipt-item-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  border: 1px solid var(--color-surface-variant);
  border-radius: var(--radius-md);
  padding: var(--space-sm);
  background: var(--color-surface-bright);
  box-shadow: var(--shadow-ambient);
  transition: border-color var(--motion-smooth);
}

.receipt-item-card:hover {
  border-color: var(--color-primary);
}

.receipt-item-card--assigned {
  border-color: var(--color-outline-variant);
  background: var(--color-surface-container-low);
  box-shadow: none;
  opacity: 0.6;
}

.diner-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  border: var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  background: var(--color-surface);
}

.diner-card__items {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.diner-card__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
}
</style>
