<script setup lang="ts">
import { toPng } from 'html-to-image'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import ConfirmDialog from '@/components/public/ConfirmDialog.vue'
import QrCropDialog from '@/components/public/QrCropDialog.vue'
import DinerSection from '@/components/manual/DinerSection.vue'
import ManualContextForm from '@/components/manual/ManualContextForm.vue'
import ManualSummaryPanel from '@/components/manual/ManualSummaryPanel.vue'
import PageHero from '@/components/common/PageHero.vue'
import SharedItemsSection from '@/components/manual/SharedItemsSection.vue'
import { CurrencyCode } from '@/components/manual/types/currency-selector'
import PublicLayout from '@/components/public/PublicLayout.vue'
import ClassicReceipt from '@/components/receipt/ClassicReceipt.vue'
import type { ClassicReceiptExpose } from '@/components/receipt/types/classic-receipt'
import ReceiptActions from '@/components/receipt/ReceiptActions.vue'
import PolishedReceipt from '@/components/receipt/PolishedReceipt.vue'
import type { PolishedReceiptExpose } from '@/components/receipt/types/polished-receipt'
import ReceiptExportFrame from '@/components/receipt/ReceiptExportFrame.vue'
import type { ReceiptExportFrameExpose } from '@/components/receipt/types/receipt-export-frame'
import ReceiptVariantSwitch from '@/components/receipt/ReceiptVariantSwitch.vue'
import { ReceiptVariant } from '@/components/receipt/types/receipt-variant-switch'
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
const receiptVariant = ref<ReceiptVariant>(ReceiptVariant.Classic)
const qrCodeImageUrl = ref<string | null>(null)
const qrCropImageSrc = ref<string | null>(null)
const isQrCropDialogOpen = ref(false)
const expandedDinerIds = ref<number[]>([])
const receiptPanel = ref<ClassicReceiptExpose | PolishedReceiptExpose | null>(null)
const receiptExportFrame = ref<ReceiptExportFrameExpose | null>(null)
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
    getReceiptPanelElement()?.scrollIntoView({
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
 * Gets the generated receipt panel element.
 *
 * @returns Receipt panel element, or null when unavailable.
 */
function getReceiptPanelElement(): HTMLElement | null {
  const panel = receiptPanel.value

  if (!panel) {
    return null
  }

  return panel.getElement()
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
  const node = receiptExportFrame.value?.getElement()

  if (!node || isReceiptDownloading.value) {
    return
  }

  isReceiptDownloading.value = true

  try {
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

        <ManualSummaryPanel
          v-model:service-charge="serviceCharge"
          v-model:tax-rate="taxRate"
          v-model:discount="discount"
          v-model:discount-unit="discountUnit"
          v-model:is-rounding-enabled="isRoundingEnabled"
          :adjustments="adjustments"
          :additional-adjustments-total="
            additionalAdjustmentsTotal > 0 ? formatCurrency(additionalAdjustmentsTotal) : ''
          "
          :currency-symbol="currencySymbol"
          :has-bill-data="hasBillData"
          :has-items="hasItems"
          :subtotal="formatCurrency(subtotal)"
          :tax-and-fees="formatCurrency(taxAndFees)"
          :total="formatCurrency(total)"
          @amount-keydown="blockInvalidNumberKey"
          @add-adjustment="addAdjustment"
          @remove-adjustment="removeAdjustment"
          @generate-receipt="generateReceipt"
          @clear-bill="openClearDialog"
        />
      </div>

      <ReceiptVariantSwitch v-if="isReceiptGenerated" v-model="receiptVariant" />

      <ReceiptExportFrame
        v-if="isReceiptGenerated"
        ref="receiptExportFrame"
        :is-polished="receiptVariant === ReceiptVariant.Polished"
      >
        <ClassicReceipt
          v-if="receiptVariant === ReceiptVariant.Classic"
          ref="receiptPanel"
          :are-all-diners-expanded="areAllReceiptDinersExpanded"
          :calculation="receiptCalculation"
          :expanded-diner-ids="expandedDinerIds"
          :format-currency="formatCurrency"
          :format-signed-currency="formatSignedCurrency"
          :is-rounding-enabled="isRoundingEnabled"
          :qr-code-image-url="qrCodeImageUrl"
          :receipt-date="receiptDate"
          :restaurant-name="restaurantName"
          @toggle-all-diners="toggleAllReceiptDiners"
          @toggle-diner="toggleReceiptDiner"
        />

        <PolishedReceipt
          v-else
          ref="receiptPanel"
          :calculation="receiptCalculation"
          :format-currency="formatCurrency"
          :format-signed-currency="formatSignedCurrency"
          :is-rounding-enabled="isRoundingEnabled"
          :qr-code-image-url="qrCodeImageUrl"
          :receipt-date="receiptDate"
          :restaurant-name="restaurantName"
        />
      </ReceiptExportFrame>

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

      <ReceiptActions
        v-if="isReceiptGenerated"
        :has-qr-code="Boolean(qrCodeImageUrl)"
        :is-downloading="isReceiptDownloading"
        @upload-qr="uploadQrCodeImage"
        @remove-qr="clearQrCodeImage"
        @download="downloadReceiptImage"
      />
    </main>
  </PublicLayout>
</template>
