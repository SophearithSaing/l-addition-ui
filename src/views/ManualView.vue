<script setup lang="ts">
import { computed, ref } from 'vue'
import PublicLayout from '@/components/public/PublicLayout.vue'

interface ManualItem {
  id: number
  name: string
  amount: string
}

interface ManualDiner {
  id: number
  name: string
  items: ManualItem[]
}

interface SharedItem {
  id: number
  name: string
  amount: string
  participantIds: number[]
}

interface ManualAdjustment {
  id: number
  label: string
  amount: string
}

const restaurantName = ref('')
const currency = ref('USD')
const customCurrency = ref('')
const serviceCharge = ref('')
const taxRate = ref('')
const discount = ref('')
const discountUnit = ref<'fixed' | 'percentage'>('fixed')
const diners = ref<ManualDiner[]>([])
const sharedItems = ref<SharedItem[]>([])
const adjustments = ref<ManualAdjustment[]>([])
let nextDinerId = 1
let nextItemId = 1
let nextSharedItemId = 1
let nextAdjustmentId = 1

const subtotal = computed(() => {
  const dinerSubtotal = diners.value.reduce((dinerTotal, diner) => {
    return (
      dinerTotal +
      diner.items.reduce((itemTotal, item) => {
        return itemTotal + parseAmount(item.amount)
      }, 0)
    )
  }, 0)

  return (
    dinerSubtotal +
    sharedItems.value.reduce((sharedTotal, item) => {
      return sharedTotal + parseAmount(item.amount)
    }, 0)
  )
})

const serviceTotal = computed(() => subtotal.value * (parseAmount(serviceCharge.value) / 100))
const taxableTotal = computed(() => subtotal.value + serviceTotal.value)
const taxTotal = computed(() => taxableTotal.value * (parseAmount(taxRate.value) / 100))
const taxAndFees = computed(() => serviceTotal.value + taxTotal.value)
const adjustmentBaseTotal = computed(() => subtotal.value + taxAndFees.value)
const additionalAdjustmentsTotal = computed(() => {
  return adjustments.value.reduce((adjustmentTotal, adjustment) => {
    return adjustmentTotal + parseAmount(adjustment.amount)
  }, 0)
})
const preDiscountTotal = computed(
  () => adjustmentBaseTotal.value + additionalAdjustmentsTotal.value,
)
const discountTotal = computed(() => {
  if (discountUnit.value === 'percentage') {
    return preDiscountTotal.value * (parseAmount(discount.value) / 100)
  }

  return parseAmount(discount.value)
})
const total = computed(() => Math.max(0, preDiscountTotal.value - discountTotal.value))
const hasItems = computed(() => {
  return diners.value.some((diner) => diner.items.length > 0) || sharedItems.value.length > 0
})
const currencySymbol = computed(() => {
  if (currency.value === 'THB') {
    return '฿'
  }

  if (currency.value === 'custom') {
    return customCurrency.value.trim() || '$'
  }

  return '$'
})

/**
 * Parses a numeric text value into a safe amount.
 *
 * @param value Numeric input text.
 * @returns Parsed positive amount, or zero when invalid.
 */
function parseAmount(value: string): number {
  const parsedValue = Number.parseFloat(value)

  if (Number.isNaN(parsedValue)) {
    return 0
  }

  return Math.max(0, parsedValue)
}

/**
 * Formats a numeric amount with the selected currency symbol.
 *
 * @param amount Amount to format.
 * @returns Formatted currency label.
 */
function formatCurrency(amount: number): string {
  return `${currencySymbol.value}${amount.toFixed(2)}`
}

/**
 * Blocks characters that make number inputs accept non-decimal values.
 *
 * @param event Keyboard event from a numeric input.
 */
function blockInvalidNumberKey(event: KeyboardEvent): void {
  if (['e', 'E', '+', '-'].includes(event.key)) {
    event.preventDefault()
  }
}

/**
 * Selects the active discount unit.
 *
 * @param unit Discount unit to use.
 */
function setDiscountUnit(unit: 'fixed' | 'percentage'): void {
  discountUnit.value = unit
}

/**
 * Adds an empty diner card to the bill.
 */
function addDiner(): void {
  const dinerId = nextDinerId

  diners.value.push({
    id: dinerId,
    items: [],
    name: '',
  })
  sharedItems.value.forEach((item) => {
    item.participantIds.push(dinerId)
  })
  nextDinerId += 1
}

/**
 * Removes the most recently added diner.
 */
function removeLastDiner(): void {
  const diner = diners.value.at(-1)

  if (diner) {
    removeDiner(diner.id)
  }
}

/**
 * Removes a diner from the bill.
 *
 * @param dinerId Diner id to remove.
 */
function removeDiner(dinerId: number): void {
  diners.value = diners.value.filter((diner) => diner.id !== dinerId)
  sharedItems.value.forEach((item) => {
    item.participantIds = item.participantIds.filter((id) => id !== dinerId)
  })
}

/**
 * Adds an empty item row for a diner.
 *
 * @param diner Diner receiving the new item row.
 */
function addItem(diner: ManualDiner): void {
  diner.items.push({
    amount: '',
    id: nextItemId,
    name: '',
  })
  nextItemId += 1
}

/**
 * Removes an item row from a diner.
 *
 * @param diner Diner containing the item.
 * @param itemId Item id to remove.
 */
function removeItem(diner: ManualDiner, itemId: number): void {
  diner.items = diner.items.filter((item) => item.id !== itemId)
}

/**
 * Adds an empty shared item with all diners selected.
 */
function addSharedItem(): void {
  sharedItems.value.push({
    amount: '',
    id: nextSharedItemId,
    name: '',
    participantIds: diners.value.map((diner) => diner.id),
  })
  nextSharedItemId += 1
}

/**
 * Removes a shared item from the bill.
 *
 * @param itemId Shared item id to remove.
 */
function removeSharedItem(itemId: number): void {
  sharedItems.value = sharedItems.value.filter((item) => item.id !== itemId)
}

/**
 * Toggles whether a diner participates in a shared item.
 *
 * @param item Shared item to update.
 * @param dinerId Diner id to toggle.
 */
function toggleSharedParticipant(item: SharedItem, dinerId: number): void {
  if (item.participantIds.includes(dinerId)) {
    item.participantIds = item.participantIds.filter((id) => id !== dinerId)
    return
  }

  item.participantIds.push(dinerId)
}

/**
 * Adds an empty additional adjustment row.
 */
function addAdjustment(): void {
  adjustments.value.push({
    amount: '',
    id: nextAdjustmentId,
    label: '',
  })
  nextAdjustmentId += 1
}

/**
 * Removes an additional adjustment row.
 *
 * @param adjustmentId Adjustment id to remove.
 */
function removeAdjustment(adjustmentId: number): void {
  adjustments.value = adjustments.value.filter((adjustment) => adjustment.id !== adjustmentId)
}

/**
 * Gets a diner display label.
 *
 * @param diner Diner to label.
 * @param index Diner index.
 * @returns Diner name, or fallback label.
 */
function getDinerLabel(diner: ManualDiner, index: number): string {
  return diner.name.trim() || `Diner ${index + 1}`
}
</script>

<template>
  <PublicLayout>
    <main class="manual-page app-container">
      <section class="manual-hero stack-sm" aria-labelledby="manual-title">
        <h1 id="manual-title" class="type-display-lg text-primary">The Art of the Split</h1>
      </section>

      <div class="manual-layout">
        <section class="manual-diners stack-lg" aria-labelledby="diners-title">
          <div class="manual-context-row">
            <label class="quiet-field manual-context-row__restaurant">
              <span class="manual-context-label">Restaurant Name</span>
              <input
                v-model="restaurantName"
                class="input input--stationery type-headline-md"
                placeholder="e.g. Le Meurice"
              />
            </label>

            <fieldset class="currency-field">
              <legend class="manual-context-label">Currency</legend>
              <div class="currency-field__controls">
                <button
                  class="currency-choice"
                  :class="{ 'currency-choice--active': currency === 'USD' }"
                  type="button"
                  @click="currency = 'USD'"
                >
                  USD ($)
                </button>
                <button
                  class="currency-choice"
                  :class="{ 'currency-choice--active': currency === 'THB' }"
                  type="button"
                  @click="currency = 'THB'"
                >
                  THB (฿)
                </button>
                <label
                  class="currency-custom"
                  :class="{ 'currency-custom--active': currency === 'custom' }"
                >
                  <input
                    v-model="customCurrency"
                    class="currency-custom__input"
                    placeholder="Custom"
                    maxlength="4"
                    @focus="currency = 'custom'"
                  />
                </label>
              </div>
            </fieldset>
          </div>

          <div class="split-row manual-section-title">
            <h2 id="diners-title" class="type-headline-md text-primary">Diners</h2>
            <div class="cluster">
              <button
                class="button button--outline button--icon"
                type="button"
                aria-label="Remove last diner"
                :disabled="diners.length === 0"
                @click="removeLastDiner"
              >
                <span class="material-symbols-outlined" aria-hidden="true">remove</span>
              </button>
              <button
                class="button button--primary button--icon"
                type="button"
                aria-label="Add diner"
                @click="addDiner"
              >
                <span class="material-symbols-outlined" aria-hidden="true">add</span>
              </button>
            </div>
          </div>

          <article v-if="diners.length === 0" class="manual-empty-state stack-md">
            <span class="manual-empty-state__icon" aria-hidden="true">
              <span class="material-symbols-outlined icon-lg">group_add</span>
            </span>
            <div class="stack-xs">
              <h3 class="type-headline-md text-primary">No diners yet</h3>
              <p class="type-body-md text-muted">
                Add a diner to begin entering items and building the split.
              </p>
            </div>
            <button class="button button--primary" type="button" @click="addDiner">
              Add Diner
            </button>
          </article>

          <article v-for="diner in diners" :key="diner.id" class="manual-diner-card">
            <div class="split-row">
              <label class="quiet-field manual-diner-card__name">
                <span class="field__label">Diner Name</span>
                <input
                  v-model="diner.name"
                  class="input input--stationery type-headline-md"
                  placeholder="Enter name..."
                />
              </label>
              <button
                class="button button--ghost button--icon"
                type="button"
                aria-label="Remove diner"
                @click="removeDiner(diner.id)"
              >
                <span class="material-symbols-outlined" aria-hidden="true">close</span>
              </button>
            </div>

            <div class="stack-sm">
              <p v-if="diner.items.length === 0" class="type-body-md text-muted">
                No items assigned to this diner yet.
              </p>

              <div v-for="item in diner.items" :key="item.id" class="manual-item-row">
                <input v-model="item.name" class="manual-item-row__name" placeholder="Item name" />
                <span class="manual-item-row__price">
                  <span class="text-muted">{{ currencySymbol }}</span>
                  <input
                    v-model="item.amount"
                    inputmode="decimal"
                    min="0"
                    placeholder="0.00"
                    step="0.01"
                    type="number"
                    @keydown="blockInvalidNumberKey"
                  />
                </span>
                <button
                  class="inline-icon-action"
                  type="button"
                  aria-label="Remove item"
                  @click="removeItem(diner, item.id)"
                >
                  <span class="material-symbols-outlined" aria-hidden="true">close</span>
                </button>
              </div>

              <button class="inline-text-action type-label" type="button" @click="addItem(diner)">
                <span class="material-symbols-outlined" aria-hidden="true">add</span>
                Add Item
              </button>
            </div>
          </article>

          <section class="manual-shared-section stack-md" aria-labelledby="shared-items-title">
            <div class="split-row manual-section-title">
              <h2 id="shared-items-title" class="type-headline-md text-primary">Shared Items</h2>
              <button class="inline-text-action type-label" type="button" @click="addSharedItem">
                <span class="material-symbols-outlined" aria-hidden="true">add</span>
                Add Shared Item
              </button>
            </div>

            <p v-if="sharedItems.length === 0" class="type-body-md text-muted">
              Add items that should be split across multiple diners.
            </p>

            <article v-for="item in sharedItems" :key="item.id" class="manual-diner-card">
              <div class="manual-item-row manual-item-row--active">
                <input
                  v-model="item.name"
                  class="manual-item-row__name type-headline-md"
                  placeholder="Shared item name"
                />
                <span class="manual-item-row__price">
                  <span class="text-muted">{{ currencySymbol }}</span>
                  <input
                    v-model="item.amount"
                    inputmode="decimal"
                    min="0"
                    placeholder="0.00"
                    step="0.01"
                    type="number"
                    @keydown="blockInvalidNumberKey"
                  />
                </span>
                <button
                  class="inline-icon-action"
                  type="button"
                  aria-label="Remove shared item"
                  @click="removeSharedItem(item.id)"
                >
                  <span class="material-symbols-outlined" aria-hidden="true">close</span>
                </button>
              </div>

              <div class="stack-xs">
                <p class="shared-participant-label type-label text-muted">Participating Diners</p>
                <p v-if="diners.length === 0" class="type-body-md text-muted">
                  Add diners to choose who participates.
                </p>
                <div v-else class="shared-participant-list">
                  <button
                    v-for="(diner, index) in diners"
                    :key="diner.id"
                    class="shared-participant"
                    :class="{
                      'shared-participant--active': item.participantIds.includes(diner.id),
                    }"
                    type="button"
                    @click="toggleSharedParticipant(item, diner.id)"
                  >
                    {{ getDinerLabel(diner, index) }}
                  </button>
                </div>
              </div>
            </article>
          </section>
        </section>

        <aside class="manual-summary stack-lg" aria-label="Bill summary">
          <section class="stack-md">
            <h2 class="type-label text-muted">Adjustments</h2>
            <label class="summary-input-row">
              <span>Service Charge</span>
              <span>
                <input
                  v-model="serviceCharge"
                  inputmode="decimal"
                  min="0"
                  placeholder="0"
                  step="0.01"
                  type="number"
                  @keydown="blockInvalidNumberKey"
                />%
              </span>
            </label>
            <label class="summary-input-row">
              <span>VAT / Tax</span>
              <span>
                <input
                  v-model="taxRate"
                  inputmode="decimal"
                  min="0"
                  placeholder="0"
                  step="0.01"
                  type="number"
                  @keydown="blockInvalidNumberKey"
                />%
              </span>
            </label>
            <div class="summary-input-row">
              <span>Discount</span>
              <span class="discount-control">
                <button
                  class="discount-control__unit"
                  :class="{ 'discount-control__unit--active': discountUnit === 'fixed' }"
                  type="button"
                  aria-label="Use fixed discount"
                  :aria-pressed="discountUnit === 'fixed'"
                  @click="setDiscountUnit('fixed')"
                >
                  {{ currencySymbol }}
                </button>
                <input
                  v-model="discount"
                  inputmode="decimal"
                  min="0"
                  placeholder="0.00"
                  step="0.01"
                  type="number"
                  @keydown="blockInvalidNumberKey"
                />
                <button
                  class="discount-control__unit"
                  :class="{ 'discount-control__unit--active': discountUnit === 'percentage' }"
                  type="button"
                  aria-label="Use percentage discount"
                  :aria-pressed="discountUnit === 'percentage'"
                  @click="setDiscountUnit('percentage')"
                >
                  %
                </button>
              </span>
            </div>
            <div
              v-for="adjustment in adjustments"
              :key="adjustment.id"
              class="summary-input-row summary-input-row--editable"
            >
              <input v-model="adjustment.label" class="summary-label-input" placeholder="Label" />
              <span class="discount-control">
                <span class="discount-control__unit discount-control__unit--active">
                  {{ currencySymbol }}
                </span>
                <input
                  v-model="adjustment.amount"
                  inputmode="decimal"
                  min="0"
                  placeholder="0.00"
                  step="0.01"
                  type="number"
                  @keydown="blockInvalidNumberKey"
                />
                <button
                  class="discount-control__unit discount-control__unit--remove"
                  type="button"
                  aria-label="Remove adjustment"
                  @click="removeAdjustment(adjustment.id)"
                >
                  ×
                </button>
              </span>
            </div>
            <button
              class="inline-text-action inline-text-action--muted type-label"
              type="button"
              @click="addAdjustment"
            >
              <span class="material-symbols-outlined" aria-hidden="true">add</span>
              Add Adjustment
            </button>
          </section>

          <div class="divider"></div>

          <section class="stack-sm">
            <div class="totals-row">
              <span class="type-body-md text-muted">Subtotal</span>
              <span class="type-number-md text-primary">{{ formatCurrency(subtotal) }}</span>
            </div>
            <div class="totals-row">
              <span class="type-body-md text-muted">Tax &amp; Fees</span>
              <span class="type-number-md text-primary">{{ formatCurrency(taxAndFees) }}</span>
            </div>
            <div v-if="additionalAdjustmentsTotal > 0" class="totals-row">
              <span class="type-body-md text-muted">Adjustments</span>
              <span class="type-number-md text-primary">
                {{ formatCurrency(additionalAdjustmentsTotal) }}
              </span>
            </div>
            <div class="totals-row totals-row--total">
              <span class="type-headline-md text-primary">Total</span>
              <span class="manual-total-value text-primary">{{ formatCurrency(total) }}</span>
            </div>
          </section>

          <button
            class="button button--primary manual-summary__action"
            type="button"
            :disabled="!hasItems"
          >
            Generate Receipt
            <span class="material-symbols-outlined" aria-hidden="true">receipt_long</span>
          </button>
        </aside>
      </div>
    </main>
  </PublicLayout>
</template>
