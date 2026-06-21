<script setup lang="ts">
import { toPng } from 'html-to-image'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import ConfirmDialog from '@/components/public/ConfirmDialog.vue'
import QrCropDialog from '@/components/public/QrCropDialog.vue'
import InlineAction from '@/components/common/InlineAction.vue'
import DinerSection from '@/components/manual/DinerSection.vue'
import ManualContextForm from '@/components/manual/ManualContextForm.vue'
import PageHero from '@/components/common/PageHero.vue'
import SectionHeader from '@/components/common/SectionHeader.vue'
import SharedItemsSection from '@/components/manual/SharedItemsSection.vue'
import { InlineActionType } from '@/components/common/types/inline-action'
import {
  SectionHeaderLevel,
  SectionHeaderType,
} from '@/components/common/types/section-header'
import TotalRow from '@/components/common/TotalRow.vue'
import { TotalRowType } from '@/components/common/types/total-row'
import { CurrencyCode } from '@/components/manual/types/currency-selector'
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
  currency: CurrencyCode
  customCurrency: string
  serviceCharge: string
  taxRate: string
  discount: string
  discountUnit: 'fixed' | 'percentage'
  isRoundingEnabled: boolean
  diners: ManualDiner[]
  sharedItems: SharedItem[]
  adjustments: ManualAdjustment[]
}

const manualDraftStorageKey = 'l-addition.manual-draft'
const restaurantName = ref('')
const currency = ref<CurrencyCode>(CurrencyCode.Thb)
const customCurrency = ref('')
const serviceCharge = ref('')
const taxRate = ref('')
const discount = ref('')
const discountUnit = ref<'fixed' | 'percentage'>('fixed')
const isRoundingEnabled = ref(true)
const diners = ref<ManualDiner[]>([])
const sharedItems = ref<SharedItem[]>([])
const adjustments = ref<ManualAdjustment[]>([])
const isReceiptGenerated = ref(false)
const isReceiptDownloading = ref(false)
const isClearDialogOpen = ref(false)
const shouldSkipNextDraftSave = ref(false)
const receiptVariant = ref<'classic' | 'polished'>('classic')
const qrCodeImageUrl = ref<string | null>(null)
const qrCropImageSrc = ref<string | null>(null)
const isQrCropDialogOpen = ref(false)
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
    rounding: isRoundingEnabled.value ? { unit: 1 } : undefined,
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
const hasBillData = computed(() => {
  return (
    restaurantName.value.trim().length > 0 ||
    customCurrency.value.trim().length > 0 ||
    Number(serviceCharge.value) > 0 ||
    Number(taxRate.value) > 0 ||
    Number(discount.value) > 0 ||
    isRoundingEnabled.value !== true ||
    currency.value !== CurrencyCode.Thb ||
    diners.value.length > 0 ||
    sharedItems.value.length > 0 ||
    adjustments.value.length > 0 ||
    isReceiptGenerated.value
  )
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
  if (currency.value === CurrencyCode.Thb) {
    return '฿'
  }

  if (currency.value === CurrencyCode.Custom) {
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
 * Formats a numeric amount with an explicit sign.
 *
 * @param amount Amount to format.
 * @returns Signed formatted currency label.
 */
function formatSignedCurrency(amount: number): string {
  if (amount < 0) {
    return `-${formatCurrency(Math.abs(amount))}`
  }

  return `+${formatCurrency(amount)}`
}

/**
 * Gets the sign for an amount.
 *
 * @param amount Amount to inspect.
 * @returns Minus sign for negative amounts, otherwise plus sign.
 */
function getAmountSign(amount: number): string {
  if (amount < 0) {
    return '-'
  }

  return '+'
}

/**
 * Formats an absolute amount without a currency symbol.
 *
 * @param amount Amount to format.
 * @returns Absolute formatted amount label.
 */
function formatAbsoluteAmount(amount: number): string {
  return Math.abs(amount).toFixed(2)
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
    isRoundingEnabled: isRoundingEnabled.value,
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
  currency.value = draft.currency || CurrencyCode.Thb
  customCurrency.value = draft.customCurrency ?? ''
  diners.value = draft.diners ?? []
  discount.value = draft.discount ?? ''
  discountUnit.value = draft.discountUnit ?? 'fixed'
  isRoundingEnabled.value = draft.isRoundingEnabled ?? true
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
 * Opens the clear bill confirmation dialog.
 */
function openClearDialog(): void {
  if (!hasBillData.value) {
    return
  }

  isClearDialogOpen.value = true
}

/**
 * Closes the clear bill confirmation dialog.
 */
function closeClearDialog(): void {
  isClearDialogOpen.value = false
}

/**
 * Clears the current manual bill and saved draft.
 */
function confirmClearBill(): void {
  shouldSkipNextDraftSave.value = true
  restaurantName.value = ''
  currency.value = CurrencyCode.Thb
  customCurrency.value = ''
  serviceCharge.value = ''
  taxRate.value = ''
  discount.value = ''
  discountUnit.value = 'fixed'
  isRoundingEnabled.value = true
  diners.value = []
  sharedItems.value = []
  adjustments.value = []
  isReceiptGenerated.value = false
  expandedDinerIds.value = []
  clearQrCodeImage()
  nextDinerId = 1
  nextItemId = 1
  nextSharedItemId = 1
  nextAdjustmentId = 1
  localStorage.removeItem(manualDraftStorageKey)
  isClearDialogOpen.value = false
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
 * Reads a QR code image and opens the crop dialog.
 *
 * @param event File input change event.
 */
function uploadQrCodeImage(event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    return
  }

  const reader = new FileReader()

  reader.addEventListener('load', () => {
    qrCropImageSrc.value = String(reader.result)
    isQrCropDialogOpen.value = true
  })
  reader.readAsDataURL(file)
  input.value = ''
}

/**
 * Applies the cropped QR code image to the receipt.
 *
 * @param croppedDataUrl Cropped image data URL.
 */
function confirmQrCrop(croppedDataUrl: string): void {
  qrCodeImageUrl.value = croppedDataUrl
  isQrCropDialogOpen.value = false
  qrCropImageSrc.value = null
}

/**
 * Cancels the QR code crop and closes the dialog.
 */
function cancelQrCrop(): void {
  isQrCropDialogOpen.value = false
  qrCropImageSrc.value = null
}

/**
 * Clears the local QR code image preview.
 */
function clearQrCodeImage(): void {
  qrCodeImageUrl.value = null
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
    const node = receiptExportFrame.value
    const rect = node.getBoundingClientRect()
    const dataUrl = await toPng(node, {
      cacheBust: true,
      height: rect.height,
      pixelRatio: 2,
      style: {
        margin: '0',
        width: `${rect.width}px`,
      },
      width: rect.width,
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

onUnmounted(() => {
  clearQrCodeImage()
})

watch(
  getManualDraftState,
  () => {
    if (shouldSkipNextDraftSave.value) {
      shouldSkipNextDraftSave.value = false
      localStorage.removeItem(manualDraftStorageKey)
      return
    }

    saveManualDraft()
  },
  { deep: true },
)
</script>

<template>
  <PublicLayout>
    <main class="manual-page app-container">
      <PageHero title-id="manual-title" title="The Art of the Split" />

      <div class="manual-layout">
        <section class="manual-diners stack-lg" aria-labelledby="diners-title">
          <ManualContextForm
            v-model:restaurant-name="restaurantName"
            v-model:currency="currency"
            v-model:custom-currency="customCurrency"
          />

          <DinerSection
            :diners="diners"
            :currency-symbol="currencySymbol"
            @add-diner="addDiner"
            @remove-last-diner="removeLastDiner"
            @remove-diner="removeDiner"
            @add-item="addItem"
            @remove-item="removeItem"
            @amount-keydown="blockInvalidNumberKey"
          />

          <SharedItemsSection
            :diners="diners"
            :shared-items="sharedItems"
            :currency-symbol="currencySymbol"
            @add-shared-item="addSharedItem"
            @remove-shared-item="removeSharedItem"
            @toggle-participant="toggleSharedParticipant"
            @amount-keydown="blockInvalidNumberKey"
          />
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
            <InlineAction
              icon="add"
              text="Add Adjustment"
              :type="InlineActionType.Muted"
              @click="addAdjustment"
            />
            <label class="summary-toggle-row summary-toggle-row--switch">
              <span>Round Totals</span>
              <span class="summary-switch-control">
                <small>Nearest {{ currencySymbol }}</small>
                <input v-model="isRoundingEnabled" type="checkbox" />
                <span aria-hidden="true"></span>
              </span>
            </label>
          </section>

          <section class="stack-sm">
            <TotalRow label="Subtotal" :value="formatCurrency(subtotal)" />
            <TotalRow label="VAT &amp; Fees" :value="formatCurrency(taxAndFees)" />
            <TotalRow
              v-if="additionalAdjustmentsTotal > 0"
              label="Adjustments"
              :value="formatCurrency(additionalAdjustmentsTotal)"
            />
            <TotalRow label="Total" :value="formatCurrency(total)" :type="TotalRowType.Total" />
          </section>

          <div class="manual-summary__actions">
            <button
              class="button button--primary manual-summary__action"
              type="button"
              :disabled="!hasItems"
              @click="generateReceipt"
            >
              Generate Receipt
              <span class="material-symbols-outlined" aria-hidden="true">receipt_long</span>
            </button>
            <button
              class="button button--outline manual-summary__action"
              type="button"
              :disabled="!hasBillData"
              @click="openClearDialog"
            >
              Clear
              <span class="material-symbols-outlined" aria-hidden="true">delete</span>
            </button>
          </div>
        </aside>
      </div>

      <div v-if="isReceiptGenerated" class="receipt-variant-controls">
        <div class="receipt-variant-switch" aria-label="Receipt style">
          <button
            class="receipt-variant-switch__option"
            :class="{ 'receipt-variant-switch__option--active': receiptVariant === 'classic' }"
            type="button"
            :aria-pressed="receiptVariant === 'classic'"
            @click="receiptVariant = 'classic'"
          >
            Classic
          </button>
          <button
            class="receipt-variant-switch__option"
            :class="{ 'receipt-variant-switch__option--active': receiptVariant === 'polished' }"
            type="button"
            :aria-pressed="receiptVariant === 'polished'"
            @click="receiptVariant = 'polished'"
          >
            Polished
          </button>
        </div>
      </div>

      <div
        v-if="isReceiptGenerated"
        ref="receiptExportFrame"
        class="receipt-export-frame"
        :class="{ 'receipt-export-frame--polished': receiptVariant === 'polished' }"
      >
        <article
          v-if="receiptVariant === 'classic'"
          ref="receiptPanel"
          class="receipt-panel"
          aria-labelledby="receipt-title"
        >
          <header class="receipt-panel__header stack-sm">
            <img class="receipt-panel__logo" src="/receipt-logo.png" alt="L'Addition" />
            <h2 id="receipt-title" class="type-display-lg text-primary">
              {{ restaurantName || "L'Addition Receipt" }}
            </h2>
            <div class="receipt-panel__meta type-label text-muted">
              <span>{{ receiptDate }}</span>
            </div>
          </header>

          <section class="receipt-section stack-md" aria-labelledby="receipt-breakdown-title">
            <SectionHeader
              title-id="receipt-breakdown-title"
              title="Guest Breakdown"
              :level="SectionHeaderLevel.Three"
              :type="SectionHeaderType.Receipt"
            >
              <template #actions>
                <InlineAction
                  :text="areAllReceiptDinersExpanded ? 'Collapse All' : 'Expand All'"
                  @click="toggleAllReceiptDiners"
                />
              </template>
            </SectionHeader>

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
                  <li v-if="isRoundingEnabled" class="receipt-line">
                    <span>Rounding</span>
                    <span aria-hidden="true"></span>
                    <span>{{ formatSignedCurrency(diner.rounding) }}</span>
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
                    <li v-if="isRoundingEnabled" class="receipt-line receipt-line--itemized">
                      <span>Rounding</span>
                      <span aria-hidden="true"></span>
                      <span>{{ formatSignedCurrency(diner.rounding) }}</span>
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

          <section
            class="receipt-summary"
            :class="{ 'receipt-summary--with-qr': qrCodeImageUrl }"
            aria-label="Receipt total summary"
          >
            <aside v-if="qrCodeImageUrl" class="receipt-qr" aria-label="Payment QR code">
              <img :src="qrCodeImageUrl" alt="Uploaded payment QR code" />
            </aside>
            <div class="receipt-summary__inner stack-sm">
              <TotalRow label="Subtotal" :value="formatCurrency(receiptCalculation.subtotal)" />
              <TotalRow label="Service" :value="formatCurrency(receiptCalculation.service)" />
              <TotalRow label="VAT" :value="formatCurrency(receiptCalculation.tax)" />
              <TotalRow
                v-if="receiptCalculation.adjustments > 0"
                label="Adjustments"
                :value="formatCurrency(receiptCalculation.adjustments)"
              />
              <TotalRow
                v-if="receiptCalculation.discount > 0"
                label="Discount"
                :value="`-${formatCurrency(receiptCalculation.discount)}`"
              />
              <TotalRow
                v-if="isRoundingEnabled"
                label="Rounding"
                :value="formatSignedCurrency(receiptCalculation.rounding)"
              />
              <TotalRow
                label="Grand Total"
                :value="formatCurrency(receiptCalculation.total)"
                :type="TotalRowType.GrandTotal"
              />
            </div>
          </section>

          <footer class="receipt-signature">
            <span aria-hidden="true"></span>
            <p>L'Addition</p>
            <span aria-hidden="true"></span>
          </footer>
        </article>

        <article
          v-else
          ref="receiptPanel"
          class="receipt-polished"
          aria-labelledby="polished-title"
        >
          <header class="receipt-polished__header">
            <img class="receipt-polished__logo" src="/receipt-logo.png" alt="L'Addition" />
            <h2 id="polished-title" class="receipt-polished__title">
              {{ restaurantName || "L'Addition" }}
            </h2>
            <div class="receipt-polished__header-divider type-label text-muted">
              <span aria-hidden="true"></span>
              <span>{{ receiptDate }}</span>
              <span aria-hidden="true"></span>
            </div>
          </header>

          <section class="receipt-polished__guest-list" aria-label="Guest totals">
            <div class="receipt-polished__guest receipt-polished__guest--header">
              <span>Name</span>
              <span>Details</span>
              <span>Subtotal</span>
            </div>
            <article
              v-for="(diner, index) in receiptCalculation.diners"
              :key="diner.id"
              class="receipt-polished__guest"
            >
              <h3>{{ diner.name || `Diner ${index + 1}` }}</h3>
              <p>
                {{ diner.subtotal.toFixed(2) }}
                <span v-if="diner.fees !== 0" class="receipt-polished__detail-adjustment">
                  <span>{{ getAmountSign(diner.fees) }}</span>
                  <span>{{ formatAbsoluteAmount(diner.fees) }}</span>
                </span>
                <span v-if="isRoundingEnabled" class="receipt-polished__detail-adjustment">
                  <span>{{ getAmountSign(diner.rounding) }}</span>
                  <span>{{ formatAbsoluteAmount(diner.rounding) }}</span>
                </span>
              </p>
              <strong>{{ formatCurrency(diner.total) }}</strong>
            </article>
          </section>

          <section class="receipt-polished__summary" aria-label="Receipt summary">
            <div>
              <span>Subtotal</span>
              <strong>{{ formatCurrency(receiptCalculation.subtotal) }}</strong>
            </div>
            <div>
              <span>Service &amp; VAT</span>
              <strong>{{
                formatCurrency(receiptCalculation.service + receiptCalculation.tax)
              }}</strong>
            </div>
            <div v-if="receiptCalculation.adjustments > 0">
              <span>Adjustments</span>
              <strong>{{ formatCurrency(receiptCalculation.adjustments) }}</strong>
            </div>
            <div v-if="receiptCalculation.discount > 0">
              <span>Discount</span>
              <strong>-{{ formatCurrency(receiptCalculation.discount) }}</strong>
            </div>
            <div v-if="isRoundingEnabled">
              <span>Rounding</span>
              <strong>{{ formatSignedCurrency(receiptCalculation.rounding) }}</strong>
            </div>
          </section>

          <div
            class="receipt-polished__settlement"
            :class="{ 'receipt-polished__settlement--with-qr': qrCodeImageUrl }"
          >
            <aside v-if="qrCodeImageUrl" class="receipt-qr" aria-label="Payment QR code">
              <img :src="qrCodeImageUrl" alt="Uploaded payment QR code" />
            </aside>

            <section class="receipt-polished__hero" aria-label="Grand total">
              <span class="receipt-polished__hero-label">Grand Total</span>
              <strong>{{ formatCurrency(receiptCalculation.total) }}</strong>
            </section>
          </div>

          <footer class="receipt-polished__footer">
            <span aria-hidden="true"></span>
            <p>L'Addition</p>
            <span aria-hidden="true"></span>
          </footer>
        </article>
      </div>

      <ConfirmDialog
        :is-open="isClearDialogOpen"
        title="Clear Bill"
        message="This will remove the current bill, generated receipt, and saved draft from this device."
        confirm-label="Clear"
        cancel-label="Keep"
        @confirm="confirmClearBill"
        @cancel="closeClearDialog"
      />

      <QrCropDialog
        :is-open="isQrCropDialogOpen"
        :image-src="qrCropImageSrc ?? ''"
        @confirm="confirmQrCrop"
        @cancel="cancelQrCrop"
      />

      <div v-if="isReceiptGenerated" class="receipt-actions">
        <label class="button button--outline receipt-qr-upload">
          Upload QR Code
          <span class="material-symbols-outlined" aria-hidden="true">qr_code_2</span>
          <input accept="image/*" type="file" @change="uploadQrCodeImage" />
        </label>
        <button
          v-if="qrCodeImageUrl"
          class="button button--ghost"
          type="button"
          @click="clearQrCodeImage"
        >
          Remove QR
          <span class="material-symbols-outlined" aria-hidden="true">close</span>
        </button>
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
