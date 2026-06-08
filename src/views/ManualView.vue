<script setup lang="ts">
import { toPng } from 'html-to-image'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import PublicLayout from '@/components/public/PublicLayout.vue'
import { calculateReceipt } from '@/lib/receipt-calculator'

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

interface ManualDraftState {
  restaurantName: string
  currency: string
  customCurrency: string
  serviceCharge: string
  taxRate: string
  discount: string
  discountUnit: 'fixed' | 'percentage'
  diners: ManualDiner[]
  sharedItems: SharedItem[]
  adjustments: ManualAdjustment[]
}

const manualDraftStorageKey = 'l-addition.manual-draft'
const restaurantName = ref('')
const currency = ref('THB')
const customCurrency = ref('')
const serviceCharge = ref('')
const taxRate = ref('')
const discount = ref('')
const discountUnit = ref<'fixed' | 'percentage'>('fixed')
const diners = ref<ManualDiner[]>([])
const sharedItems = ref<SharedItem[]>([])
const adjustments = ref<ManualAdjustment[]>([])
const isReceiptGenerated = ref(false)
const isReceiptDownloading = ref(false)
const expandedDinerIds = ref<number[]>([])
const receiptPanel = ref<HTMLElement | null>(null)
const receiptExportFrame = ref<HTMLElement | null>(null)
let nextDinerId = 1
let nextItemId = 1
let nextSharedItemId = 1
let nextAdjustmentId = 1

const receiptCalculation = computed(() => {
  return calculateReceipt({
    adjustments: adjustments.value.map((adjustment) => ({
      amount: parseAmount(adjustment.amount),
      id: adjustment.id,
      label: adjustment.label,
    })),
    diners: diners.value.map((diner) => ({
      id: diner.id,
      items: diner.items.map((item) => ({
        amount: parseAmount(item.amount),
        id: item.id,
        name: item.name,
      })),
      name: diner.name,
    })),
    discount: {
      amount: parseAmount(discount.value),
      unit: discountUnit.value,
    },
    serviceRate: parseAmount(serviceCharge.value),
    sharedItems: sharedItems.value.map((item) => ({
      amount: parseAmount(item.amount),
      id: item.id,
      name: item.name,
      participantIds: item.participantIds,
    })),
    taxRate: parseAmount(taxRate.value),
  })
})
const subtotal = computed(() => receiptCalculation.value.subtotal)
const taxAndFees = computed(() => receiptCalculation.value.service + receiptCalculation.value.tax)
const additionalAdjustmentsTotal = computed(() => receiptCalculation.value.adjustments)
const total = computed(() => receiptCalculation.value.total)
const hasItems = computed(() => {
  return diners.value.some((diner) => diner.items.length > 0) || sharedItems.value.length > 0
})
const receiptDate = computed(() => {
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date())
})
const receiptImageFileName = computed(() => {
  const restaurant = restaurantName.value.trim() || 'l-addition-receipt'
  const date = new Date().toISOString().slice(0, 10)
  const slug = restaurant
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  return `${slug || 'l-addition-receipt'}-${date}.png`
})
const areAllReceiptDinersExpanded = computed(() => {
  return (
    receiptCalculation.value.diners.length > 0 &&
    expandedDinerIds.value.length === receiptCalculation.value.diners.length
  )
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
 * Builds the current manual bill draft for persistence.
 *
 * @returns Serializable manual bill draft.
 */
function getManualDraftState(): ManualDraftState {
  return {
    adjustments: adjustments.value,
    currency: currency.value,
    customCurrency: customCurrency.value,
    diners: diners.value,
    discount: discount.value,
    discountUnit: discountUnit.value,
    restaurantName: restaurantName.value,
    serviceCharge: serviceCharge.value,
    sharedItems: sharedItems.value,
    taxRate: taxRate.value,
  }
}

/**
 * Restores manual bill draft state.
 *
 * @param draft Saved manual bill draft.
 */
function restoreManualDraftState(draft: ManualDraftState): void {
  adjustments.value = draft.adjustments ?? []
  currency.value = draft.currency || 'THB'
  customCurrency.value = draft.customCurrency ?? ''
  diners.value = draft.diners ?? []
  discount.value = draft.discount ?? ''
  discountUnit.value = draft.discountUnit ?? 'fixed'
  restaurantName.value = draft.restaurantName ?? ''
  serviceCharge.value = draft.serviceCharge ?? ''
  sharedItems.value = draft.sharedItems ?? []
  taxRate.value = draft.taxRate ?? ''
  syncNextIds()
}

/**
 * Synchronizes id counters after restoring saved data.
 */
function syncNextIds(): void {
  nextDinerId = Math.max(0, ...diners.value.map((diner) => diner.id)) + 1
  nextItemId =
    Math.max(0, ...diners.value.flatMap((diner) => diner.items.map((item) => item.id))) + 1
  nextSharedItemId = Math.max(0, ...sharedItems.value.map((item) => item.id)) + 1
  nextAdjustmentId = Math.max(0, ...adjustments.value.map((adjustment) => adjustment.id)) + 1
}

/**
 * Loads a saved manual bill draft from local storage.
 */
function loadManualDraft(): void {
  const savedDraft = localStorage.getItem(manualDraftStorageKey)

  if (!savedDraft) {
    return
  }

  try {
    restoreManualDraftState(JSON.parse(savedDraft) as ManualDraftState)
  } catch {
    localStorage.removeItem(manualDraftStorageKey)
  }
}

/**
 * Saves the current manual bill draft to local storage.
 */
function saveManualDraft(): void {
  localStorage.setItem(manualDraftStorageKey, JSON.stringify(getManualDraftState()))
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

/**
 * Shows the generated receipt and opens all diner breakdowns.
 */
function generateReceipt(): void {
  isReceiptGenerated.value = true
  expandedDinerIds.value = []
  nextTick(() => {
    receiptPanel.value?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  })
}

/**
 * Toggles a diner itemized receipt breakdown.
 *
 * @param dinerId Diner id to toggle.
 */
function toggleReceiptDiner(dinerId: number): void {
  if (expandedDinerIds.value.includes(dinerId)) {
    expandedDinerIds.value = expandedDinerIds.value.filter((id) => id !== dinerId)
    return
  }

  expandedDinerIds.value.push(dinerId)
}

/**
 * Checks whether a diner receipt breakdown is expanded.
 *
 * @param dinerId Diner id to check.
 * @returns Whether the diner breakdown is expanded.
 */
function isReceiptDinerExpanded(dinerId: number): boolean {
  return expandedDinerIds.value.includes(dinerId)
}

/**
 * Expands or collapses every diner receipt breakdown.
 */
function toggleAllReceiptDiners(): void {
  if (areAllReceiptDinersExpanded.value) {
    expandedDinerIds.value = []
    return
  }

  expandedDinerIds.value = receiptCalculation.value.diners.map((diner) => diner.id)
}

/**
 * Downloads the generated receipt as a PNG image.
 */
async function downloadReceiptImage(): Promise<void> {
  if (!receiptExportFrame.value || isReceiptDownloading.value) {
    return
  }

  isReceiptDownloading.value = true

  try {
    const dataUrl = await toPng(receiptExportFrame.value, {
      cacheBust: true,
      pixelRatio: 2,
    })
    const link = document.createElement('a')

    link.download = receiptImageFileName.value
    link.href = dataUrl
    link.click()
  } finally {
    isReceiptDownloading.value = false
  }
}

onMounted(() => {
  loadManualDraft()
})

watch(
  getManualDraftState,
  () => {
    saveManualDraft()
  },
  { deep: true },
)
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
              <span>VAT</span>
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
              <span class="type-body-md text-muted">VAT &amp; Fees</span>
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
            @click="generateReceipt"
          >
            Generate Receipt
            <span class="material-symbols-outlined" aria-hidden="true">receipt_long</span>
          </button>
        </aside>
      </div>

      <div v-if="isReceiptGenerated" ref="receiptExportFrame" class="receipt-export-frame">
        <article ref="receiptPanel" class="receipt-panel" aria-labelledby="receipt-title">
          <header class="receipt-panel__header stack-sm">
            <h2 id="receipt-title" class="type-display-lg text-primary">
              {{ restaurantName || "L'Addition Receipt" }}
            </h2>
            <div class="receipt-panel__meta type-label text-muted">
              <span>{{ receiptDate }}</span>
              <span aria-hidden="true"></span>
              <span>{{ currency === 'custom' ? 'Custom' : currency }}</span>
            </div>
          </header>

          <section class="receipt-section stack-md" aria-labelledby="receipt-breakdown-title">
            <div class="receipt-section__header">
              <h3 id="receipt-breakdown-title" class="type-headline-md text-primary">
                Guest Breakdown
              </h3>
              <button
                class="inline-text-action type-label"
                type="button"
                @click="toggleAllReceiptDiners"
              >
                {{ areAllReceiptDinersExpanded ? 'Collapse All' : 'Expand All' }}
              </button>
            </div>

            <div class="receipt-diner-grid">
              <section
                v-for="(diner, index) in receiptCalculation.diners"
                :key="diner.id"
                class="receipt-diner-card"
              >
                <button
                  class="receipt-diner-card__header"
                  type="button"
                  :aria-expanded="isReceiptDinerExpanded(diner.id)"
                  @click="toggleReceiptDiner(diner.id)"
                >
                  <span>{{ diner.name || `Diner ${index + 1}` }}</span>
                  <span class="material-symbols-outlined" aria-hidden="true">
                    {{ isReceiptDinerExpanded(diner.id) ? 'expand_less' : 'expand_more' }}
                  </span>
                </button>

                <ul class="receipt-line-list">
                  <li class="receipt-line">
                    <span>Food Total</span>
                    <span aria-hidden="true"></span>
                    <span>{{ formatCurrency(diner.subtotal) }}</span>
                  </li>
                  <li class="receipt-line">
                    <span>Fees &amp; VAT</span>
                    <span aria-hidden="true"></span>
                    <span>{{ formatCurrency(diner.fees) }}</span>
                  </li>
                  <template v-if="isReceiptDinerExpanded(diner.id)">
                    <li
                      v-for="item in diner.items"
                      :key="`${item.source}-${item.id}`"
                      class="receipt-line receipt-line--itemized"
                    >
                      <span>{{ item.name || 'Untitled item' }}</span>
                      <span aria-hidden="true"></span>
                      <span>{{ formatCurrency(item.amount) }}</span>
                    </li>
                    <li class="receipt-line receipt-line--itemized">
                      <span>Service</span>
                      <span aria-hidden="true"></span>
                      <span>{{ formatCurrency(diner.service) }}</span>
                    </li>
                    <li class="receipt-line receipt-line--itemized">
                      <span>VAT</span>
                      <span aria-hidden="true"></span>
                      <span>{{ formatCurrency(diner.tax) }}</span>
                    </li>
                    <li v-if="diner.adjustments > 0" class="receipt-line receipt-line--itemized">
                      <span>Adjustments</span>
                      <span aria-hidden="true"></span>
                      <span>{{ formatCurrency(diner.adjustments) }}</span>
                    </li>
                    <li v-if="diner.discount > 0" class="receipt-line receipt-line--itemized">
                      <span>Discount</span>
                      <span aria-hidden="true"></span>
                      <span>-{{ formatCurrency(diner.discount) }}</span>
                    </li>
                  </template>
                </ul>

                <div class="receipt-diner-card__total type-label text-primary">
                  <span>Total</span>
                  <span>{{ formatCurrency(diner.total) }}</span>
                </div>
              </section>
            </div>
          </section>

          <section class="receipt-summary" aria-label="Receipt total summary">
            <div class="receipt-summary__inner stack-sm">
              <div class="totals-row">
                <span class="type-body-md text-muted">Subtotal</span>
                <span class="type-number-md text-primary">{{
                  formatCurrency(receiptCalculation.subtotal)
                }}</span>
              </div>
              <div class="totals-row">
                <span class="type-body-md text-muted">Service</span>
                <span class="type-number-md text-primary">{{
                  formatCurrency(receiptCalculation.service)
                }}</span>
              </div>
              <div class="totals-row">
                <span class="type-body-md text-muted">VAT</span>
                <span class="type-number-md text-primary">{{
                  formatCurrency(receiptCalculation.tax)
                }}</span>
              </div>
              <div v-if="receiptCalculation.adjustments > 0" class="totals-row">
                <span class="type-body-md text-muted">Adjustments</span>
                <span class="type-number-md text-primary">{{
                  formatCurrency(receiptCalculation.adjustments)
                }}</span>
              </div>
              <div v-if="receiptCalculation.discount > 0" class="totals-row">
                <span class="type-body-md text-muted">Discount</span>
                <span class="type-number-md text-primary"
                  >-{{ formatCurrency(receiptCalculation.discount) }}</span
                >
              </div>
              <div class="totals-row totals-row--total receipt-summary__total">
                <span class="type-label text-primary">Grand Total</span>
                <span class="manual-total-value text-primary">{{
                  formatCurrency(receiptCalculation.total)
                }}</span>
              </div>
            </div>
          </section>

          <p class="receipt-signature">L'Addition</p>
        </article>
      </div>

      <div v-if="isReceiptGenerated" class="receipt-actions">
        <button
          class="button button--outline"
          type="button"
          :disabled="isReceiptDownloading"
          @click="downloadReceiptImage"
        >
          {{ isReceiptDownloading ? 'Preparing Image…' : 'Download Image' }}
          <span class="material-symbols-outlined" aria-hidden="true">download</span>
        </button>
      </div>
    </main>
  </PublicLayout>
</template>
