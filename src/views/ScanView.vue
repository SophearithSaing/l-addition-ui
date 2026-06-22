<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import PageHero from '@/components/common/PageHero.vue'
import ManualSummaryPanel from '@/components/manual/ManualSummaryPanel.vue'
import SharedItemsSection from '@/components/manual/SharedItemsSection.vue'
import PublicLayout from '@/components/public/PublicLayout.vue'
import ClassicReceipt from '@/components/receipt/ClassicReceipt.vue'
import PolishedReceipt from '@/components/receipt/PolishedReceipt.vue'
import ReceiptExportFrame from '@/components/receipt/ReceiptExportFrame.vue'
import ReceiptVariantSwitch from '@/components/receipt/ReceiptVariantSwitch.vue'
import UploadZone from '@/components/scan/UploadZone.vue'
import { ReceiptVariant } from '@/components/receipt/types/receipt-variant-switch'
import { aiService } from '@/services/ai.service'
import { groupService } from '@/services/group.service'
import { calculateReceipt } from '@/lib/receipt-calculator'
import type { DiscountUnit } from '@/components/manual/types/discount-control'
import type { ClassicReceiptExpose } from '@/components/receipt/types/classic-receipt'
import type { PolishedReceiptExpose } from '@/components/receipt/types/polished-receipt'

interface ScanDiner {
  id: number
  isClientAdded: boolean
  name: string
}

interface ScanSharedItem {
  amount: string
  id: number
  name: string
  participantIds: number[]
}

interface ScanAdjustment {
  amount: string
  id: number
  label: string
}

type ScanProcessingState = 'idle' | 'processing' | 'success' | 'failure'

const currencySymbol = '฿'
const maxUploadSize = 10 * 1024 * 1024
const acceptedUploadTypes = ['image/jpeg', 'image/png']
const diners = ref<ScanDiner[]>([])
const sharedItems = ref<ScanSharedItem[]>([])
const adjustments = ref<ScanAdjustment[]>([])
const serviceCharge = ref('')
const taxRate = ref('')
const discount = ref('')
const discountUnit = ref<DiscountUnit>('fixed')
const isRoundingEnabled = ref(true)
const newPersonName = ref('')
const errorMessage = ref('')
const scanErrorMessage = ref('')
const scanState = ref<ScanProcessingState>('idle')
const isGroupLoading = ref(false)
const isGroupSaving = ref(false)
const isUploading = ref(false)
const isReceiptGenerated = ref(false)
const receiptVariant = ref<ReceiptVariant>(ReceiptVariant.Classic)
const expandedDinerIds = ref<number[]>([])
const receiptPanel = ref<ClassicReceiptExpose | PolishedReceiptExpose | null>(null)
const assignmentSection = ref<HTMLElement | null>(null)
let nextDinerId = 1
let nextSharedItemId = 1
let nextAdjustmentId = 1
let successScrollTimeoutId: number | undefined

const selectedDinerIds = computed(() => {
  return new Set(sharedItems.value.flatMap((item) => item.participantIds))
})
const activeDiners = computed(() => {
  return diners.value.filter((diner) => selectedDinerIds.value.has(diner.id))
})
const receiptCalculation = computed(() => {
  return calculateReceipt({
    adjustments: adjustments.value.map((adjustment) => ({
      amount: parseAmount(adjustment.amount),
      id: adjustment.id,
      label: adjustment.label,
    })),
    diners: activeDiners.value.map((diner) => ({
      id: diner.id,
      items: [],
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
const hasItems = computed(() => activeDiners.value.length > 0)
const hasBillData = computed(() => {
  return (
    diners.value.length > 0 ||
    sharedItems.value.length > 0 ||
    adjustments.value.length > 0 ||
    Number(serviceCharge.value) > 0 ||
    Number(taxRate.value) > 0 ||
    Number(discount.value) > 0 ||
    isRoundingEnabled.value !== true ||
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
const areAllReceiptDinersExpanded = computed(() => {
  return (
    receiptCalculation.value.diners.length > 0 &&
    expandedDinerIds.value.length === receiptCalculation.value.diners.length
  )
})
const extractedItemCount = computed(() => sharedItems.value.length)
const hasClientAddedDiners = computed(() => {
  return diners.value.some((diner) => diner.isClientAdded)
})
const scanFailureMessage = computed(() => {
  return scanErrorMessage.value || 'Please ensure the receipt is well-lit and clearly visible.'
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
 * Formats a numeric amount with the scan page currency symbol.
 *
 * @param amount Amount to format.
 * @returns Formatted currency label.
 */
function formatCurrency(amount: number): string {
  return `${currencySymbol}${amount.toFixed(2)}`
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
 * Loads the user's saved group people for receipt assignment.
 */
async function loadGroupPeople(): Promise<void> {
  isGroupLoading.value = true
  errorMessage.value = ''

  try {
    const response = await groupService.getGroup()

    if (!response) {
      return
    }

    diners.value = response.group.people.map((person) => ({
      id: nextDinerId++,
      isClientAdded: false,
      name: person,
    }))
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Unable to load your dinner group.'
  } finally {
    isGroupLoading.value = false
  }
}

/**
 * Adds a person to the local assignment list.
 */
async function addPerson(): Promise<void> {
  const name = newPersonName.value.trim()

  if (!name) {
    return
  }

  diners.value.push({
    id: nextDinerId,
    isClientAdded: true,
    name,
  })
  nextDinerId += 1
  newPersonName.value = ''
  isReceiptGenerated.value = false
}

/**
 * Removes the most recently added person from the assignment list.
 */
async function removeLastPerson(): Promise<void> {
  const diner = [...diners.value].reverse().find((currentDiner) => currentDiner.isClientAdded)

  if (!diner) {
    return
  }

  await removePerson(diner.id)
}

/**
 * Removes a person from the assignment list and all item assignments.
 *
 * @param dinerId Diner id to remove.
 */
async function removePerson(dinerId: number): Promise<void> {
  const dinerToRemove = diners.value.find((diner) => diner.id === dinerId)

  if (!dinerToRemove?.isClientAdded) {
    return
  }

  diners.value = diners.value.filter((diner) => diner.id !== dinerId)
  sharedItems.value.forEach((item) => {
    item.participantIds = item.participantIds.filter((id) => id !== dinerId)
  })
  expandedDinerIds.value = expandedDinerIds.value.filter((id) => id !== dinerId)
  isReceiptGenerated.value = false
}

/**
 * Handles receipt image selection and extraction.
 *
 * @param event Upload input change event.
 */
async function uploadReceipt(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  input.value = ''

  if (!file || !validateReceiptFile(file)) {
    return
  }

  clearSuccessScrollTimeout()
  isUploading.value = true
  errorMessage.value = ''
  scanErrorMessage.value = ''
  scanState.value = 'processing'
  isReceiptGenerated.value = false

  try {
    const response = await aiService.extractReceipt(file)

    sharedItems.value = response.result.extractedObject.map((item) => ({
      amount: String(item.amount),
      id: nextSharedItemId++,
      name: item.name,
      participantIds: [],
    }))
    scanState.value = 'success'
    scrollAfterSuccessAnimation()
  } catch (error) {
    scanErrorMessage.value =
      error instanceof Error ? error.message : 'Unable to scan this receipt. Please try again.'
    scanState.value = 'failure'
  } finally {
    isUploading.value = false
  }
}

/**
 * Validates a selected receipt image before upload.
 *
 * @param file Selected file.
 * @returns Whether the file is valid.
 */
function validateReceiptFile(file: File): boolean {
  clearSuccessScrollTimeout()

  if (!acceptedUploadTypes.includes(file.type)) {
    scanErrorMessage.value = 'Please upload a JPG or PNG receipt image.'
    scanState.value = 'failure'
    return false
  }

  if (file.size > maxUploadSize) {
    scanErrorMessage.value = 'Please upload an image smaller than 10MB.'
    scanState.value = 'failure'
    return false
  }

  return true
}

/**
 * Adds a blank missing item row for manual correction.
 */
function addSharedItem(): void {
  sharedItems.value.unshift({
    amount: '',
    id: nextSharedItemId,
    name: '',
    participantIds: [],
  })
  nextSharedItemId += 1
  isReceiptGenerated.value = false
}

/**
 * Removes a scanned or missing item row.
 *
 * @param itemId Shared item id to remove.
 */
function removeSharedItem(itemId: number): void {
  sharedItems.value = sharedItems.value.filter((item) => item.id !== itemId)
  isReceiptGenerated.value = false
}

/**
 * Toggles whether a diner participates in a scanned item.
 *
 * @param item Shared item to update.
 * @param dinerId Diner id to toggle.
 */
function toggleSharedParticipant(item: ScanSharedItem, dinerId: number): void {
  if (item.participantIds.includes(dinerId)) {
    item.participantIds = item.participantIds.filter((id) => id !== dinerId)
    isReceiptGenerated.value = false
    return
  }

  item.participantIds.push(dinerId)
  isReceiptGenerated.value = false
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
  isReceiptGenerated.value = false
}

/**
 * Removes an additional adjustment row.
 *
 * @param adjustmentId Adjustment id to remove.
 */
function removeAdjustment(adjustmentId: number): void {
  adjustments.value = adjustments.value.filter((adjustment) => adjustment.id !== adjustmentId)
  isReceiptGenerated.value = false
}

/**
 * Clears the current scanned bill state.
 */
function clearBill(): void {
  sharedItems.value = []
  adjustments.value = []
  serviceCharge.value = ''
  taxRate.value = ''
  discount.value = ''
  discountUnit.value = 'fixed'
  isRoundingEnabled.value = true
  isReceiptGenerated.value = false
  expandedDinerIds.value = []
  errorMessage.value = ''
  scanErrorMessage.value = ''
  scanState.value = 'idle'
  clearSuccessScrollTimeout()
  nextSharedItemId = 1
  nextAdjustmentId = 1
}

/**
 * Scrolls slightly after the success animation completes.
 */
function scrollAfterSuccessAnimation(): void {
  clearSuccessScrollTimeout()
  successScrollTimeoutId = window.setTimeout(() => {
    window.scrollBy({
      behavior: 'smooth',
      top: 500,
    })
    successScrollTimeoutId = undefined
  }, 1800)
}

/**
 * Clears any pending success-state scroll timer.
 */
function clearSuccessScrollTimeout(): void {
  if (successScrollTimeoutId === undefined) {
    return
  }

  window.clearTimeout(successScrollTimeoutId)
  successScrollTimeoutId = undefined
}

/**
 * Shows the generated receipt preview.
 */
function generateReceipt(): void {
  isReceiptGenerated.value = true
  expandedDinerIds.value = []
  void nextTick(() => {
    receiptPanel.value?.getElement()?.scrollIntoView({
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
 * Toggles all diner itemized receipt breakdowns.
 */
function toggleAllReceiptDiners(): void {
  if (areAllReceiptDinersExpanded.value) {
    expandedDinerIds.value = []
    return
  }

  expandedDinerIds.value = receiptCalculation.value.diners.map((diner) => diner.id)
}

onMounted(() => {
  void loadGroupPeople()
})

onUnmounted(() => {
  clearSuccessScrollTimeout()
})
</script>

<template>
  <PublicLayout>
    <main class="scan-page app-container">
      <PageHero
        title-id="scan-title"
        title="The Digital Concierge awaits."
        description="Upload your receipt, review the scanned items, then assign each dish to the table."
      />

      <section class="scan-upload" aria-label="Receipt upload">
        <UploadZone
          input-id="file-upload"
          icon="receipt_long"
          title="Upload Receipt"
          helper-text="JPG or PNG only (Max 10MB)"
          action-label="Browse Files"
          accept="image/jpeg, image/png"
          @change="uploadReceipt"
        />

        <div
          v-if="scanState === 'processing'"
          class="scan-state scan-state--processing"
          role="status"
          aria-live="polite"
        >
          <div class="scan-state__receipt" aria-hidden="true">
            <span class="scan-state__line"></span>
            <span class="scan-state__glow"></span>
            <span class="scan-state__receipt-lines">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
          <div class="stack-xs">
            <h2 class="type-headline-md text-primary">Reading the menu...</h2>
            <p class="type-body-md text-muted">
              Our digital concierge is itemizing your experience.
            </p>
          </div>
        </div>

        <div
          v-else-if="scanState === 'success'"
          class="scan-state scan-state--success"
          role="status"
          aria-live="polite"
        >
          <svg
            class="scan-state__success-icon"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <circle class="scan-state__draw-circle" cx="50" cy="50" r="48"></circle>
            <path class="scan-state__draw-check" d="M30 50 L45 65 L70 35"></path>
          </svg>
          <div class="stack-xs">
            <h2 class="type-headline-lg text-primary">Cuisine Deciphered</h2>
            <p class="type-body-lg text-muted">
              We've successfully extracted {{ extractedItemCount }} items from your receipt.
            </p>
          </div>
          <div class="scan-state__actions">
            <label
              class="button button--primary button--compact scan-state__action"
              for="file-upload"
            >
              Re Upload
            </label>
            <button
              class="button button--outline button--compact scan-state__action"
              type="button"
              disabled
            >
              Upload Another
            </button>
          </div>
        </div>

        <div
          v-else-if="scanState === 'failure'"
          class="scan-state scan-state--failure"
          role="alert"
        >
          <div class="scan-state__failure-icon" aria-hidden="true">
            <span class="material-symbols-outlined">info</span>
          </div>
          <div class="stack-xs">
            <h2 class="type-headline-lg text-primary">A Momentary Pause</h2>
            <p class="type-body-lg text-muted">
              {{ scanFailureMessage }}
            </p>
          </div>
          <div class="scan-state__actions">
            <label class="button button--primary scan-state__action" for="file-upload">
              Try Again
            </label>
            <RouterLink class="button button--outline scan-state__action" to="/manual">
              Enter Manually
            </RouterLink>
          </div>
        </div>
      </section>

      <div v-if="errorMessage" class="form-message form-message--error" role="alert">
        {{ errorMessage }}
      </div>

      <div ref="assignmentSection" class="scan-layout">
        <section class="scan-workspace stack-lg" aria-label="Receipt assignment">
          <SharedItemsSection
            title="Scanned Items"
            add-label="Add Missing Item"
            empty-text="Upload a receipt to begin, or add a missing item manually."
            name-placeholder="Item name"
            participant-label="Assign To"
            remove-label="Remove item"
            :diners="diners"
            :shared-items="sharedItems"
            :currency-symbol="currencySymbol"
            @add-shared-item="addSharedItem"
            @remove-shared-item="removeSharedItem"
            @toggle-participant="toggleSharedParticipant"
            @amount-keydown="blockInvalidNumberKey"
          />
        </section>

        <aside class="scan-side-panel stack-lg" aria-label="Diners and bill summary">
          <section class="people-panel stack-md" aria-labelledby="people-title">
            <div class="people-panel__header">
              <div class="stack-xs">
                <h2 id="people-title" class="type-headline-md text-primary">Diners</h2>
                <p class="type-label text-muted">Only selected diners are calculated</p>
              </div>
              <span v-if="isGroupLoading || isGroupSaving" class="type-label text-muted">
                {{ isGroupLoading ? 'Loading' : 'Saving' }}
              </span>
            </div>

            <form class="people-panel__form" @submit.prevent="addPerson">
              <input
                v-model="newPersonName"
                class="people-panel__input"
                placeholder="Add diner"
                aria-label="Add diner"
              />
              <div class="people-panel__controls">
                <button
                  class="people-panel__control"
                  type="button"
                  aria-label="Remove last diner"
                  :disabled="!hasClientAddedDiners || isGroupSaving"
                  @click="removeLastPerson"
                >
                  <span class="material-symbols-outlined" aria-hidden="true">remove</span>
                </button>
                <button
                  class="people-panel__control"
                  type="submit"
                  aria-label="Add diner"
                  :disabled="!newPersonName.trim() || isGroupSaving"
                >
                  <span class="material-symbols-outlined" aria-hidden="true">add</span>
                </button>
              </div>
            </form>

            <div v-if="diners.length === 0" class="type-body-md text-muted">
              Add diners before assigning scanned items.
            </div>
            <div v-else class="people-panel__grid">
              <div
                v-for="diner in diners"
                :key="diner.id"
                class="people-panel__diner"
                :class="{
                  'people-panel__diner--active': selectedDinerIds.has(diner.id),
                }"
              >
                <span class="people-panel__avatar">
                  {{ diner.name.trim().charAt(0) || '?' }}
                  <span
                    v-if="selectedDinerIds.has(diner.id)"
                    class="people-panel__check"
                    aria-hidden="true"
                  >
                    <span class="material-symbols-outlined">check</span>
                  </span>
                </span>
                <span class="people-panel__name">{{ diner.name }}</span>
              </div>
            </div>
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
            @clear-bill="clearBill"
          />
        </aside>
      </div>

      <ReceiptVariantSwitch v-if="isReceiptGenerated" v-model="receiptVariant" />

      <ReceiptExportFrame
        v-if="isReceiptGenerated"
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
          :qr-code-image-url="null"
          :receipt-date="receiptDate"
          restaurant-name="Scanned Receipt"
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
          :qr-code-image-url="null"
          :receipt-date="receiptDate"
          restaurant-name="Scanned Receipt"
        />
      </ReceiptExportFrame>
    </main>
  </PublicLayout>
</template>

<style scoped>
.scan-page {
  width: 100%;
  padding-block: var(--space-section);
}

.scan-upload {
  position: relative;
  margin-bottom: var(--space-section);
}

.scan-upload :deep(.upload-zone) {
  margin-bottom: 0;
}

.scan-state {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-lg);
  overflow: hidden;
  border: 2px dashed var(--color-outline-variant);
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  background: var(--color-surface);
  text-align: center;
}

.scan-state--processing {
  background:
    radial-gradient(rgb(68 71 72 / 3%) 1px, transparent 1px), var(--color-surface-container-low);
  background-size: var(--space-sm) var(--space-sm);
}

.scan-state__receipt {
  position: relative;
  width: calc(var(--space-xl) + var(--space-lg));
  height: calc(var(--space-2xl) + var(--space-xl));
  overflow: hidden;
  border-inline: var(--border-subtle);
  background: var(--color-surface-container-lowest);
  box-shadow: var(--shadow-ambient);
}

.scan-state__line,
.scan-state__glow {
  position: absolute;
  left: 0;
  width: 100%;
  animation: scanSweep 3000ms ease-in-out infinite;
}

.scan-state__line {
  z-index: 2;
  height: var(--radius-sm);
  background: var(--color-on-surface);
  box-shadow: var(--shadow-elevated);
}

.scan-state__glow {
  z-index: 1;
  height: var(--space-xl);
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--color-on-surface) 8%, transparent),
    transparent
  );
}

.scan-state__receipt-lines {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  opacity: 0.3;
}

.scan-state__receipt-lines span {
  height: var(--radius-sm);
  background: var(--color-on-surface-variant);
}

.scan-state__receipt-lines span:nth-child(odd) {
  width: var(--space-lg);
}

.scan-state__receipt-lines span:nth-child(even) {
  width: var(--space-xl);
}

.scan-state__success-icon {
  width: calc(var(--space-2xl) * 2);
  height: calc(var(--space-2xl) * 2);
  color: var(--color-secondary);
}

.scan-state__draw-circle {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: drawStroke 1500ms ease-out forwards;
}

.scan-state__draw-check {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: drawStroke 1000ms ease-out 800ms forwards;
}

.scan-state__failure-icon {
  display: inline-flex;
  width: calc(var(--space-2xl) + var(--space-lg));
  height: calc(var(--space-2xl) + var(--space-lg));
  align-items: center;
  justify-content: center;
  border: var(--border-subtle);
  border-radius: var(--radius-pill);
  background: var(--color-surface-container-high);
  color: var(--color-outline);
  box-shadow: var(--shadow-ambient);
}

.scan-state__failure-icon .material-symbols-outlined {
  font-size: var(--space-xl);
  font-variation-settings: 'wght' 200;
}

.scan-state__actions {
  display: flex;
  width: min(100%, var(--container-auth));
  flex-direction: row;
  gap: var(--space-sm);
}

.scan-state__action {
  flex: 1;
  justify-content: center;
  text-decoration: none;
}

.scan-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-gutter);
  align-items: start;
}

@keyframes scanSweep {
  0%,
  100% {
    top: var(--space-xs);
  }

  50% {
    top: calc(100% - var(--space-xs));
  }
}

@keyframes drawStroke {
  to {
    stroke-dashoffset: 0;
  }
}

.scan-workspace,
.scan-side-panel,
.people-panel {
  min-width: 0;
}

.scan-side-panel {
  align-self: start;
}

.scan-side-panel :deep(.manual-summary) {
  position: static;
}

.people-panel {
  border: var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: var(--space-sm);
  background: var(--color-surface-container);
  box-shadow: var(--shadow-ambient);
}

.people-panel__header,
.people-panel__form,
.people-panel__controls {
  display: flex;
  gap: var(--space-sm);
}

.people-panel__header {
  align-items: flex-start;
  justify-content: space-between;
}

.people-panel__form {
  align-items: center;
}

.people-panel__input {
  min-width: 0;
  flex: 1;
  border: 0;
  border-bottom: var(--border-subtle);
  padding: var(--space-xs) var(--space-sm);
  background: transparent;
  color: var(--color-primary);
}

.people-panel__input:focus {
  outline: none;
  border-bottom-color: var(--color-primary);
}

.people-panel__control {
  width: calc(var(--space-xl) - var(--space-xs));
  height: calc(var(--space-xl) - var(--space-xs));
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: var(--border-subtle);
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--color-on-surface-variant);
  cursor: pointer;
  transition:
    background var(--motion-smooth),
    color var(--motion-smooth),
    border-color var(--motion-smooth);
}

.people-panel__control:hover:not(:disabled) {
  border-color: var(--color-outline);
  background: var(--color-surface);
  color: var(--color-primary);
}

.people-panel__control:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.people-panel__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-md) var(--space-sm);
}

.people-panel__diner {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  color: var(--color-on-surface-variant);
  text-align: center;
}

.people-panel__avatar {
  position: relative;
  width: var(--space-2xl);
  height: var(--space-2xl);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: var(--border-subtle);
  border-radius: var(--radius-pill);
  background: var(--color-surface);
  color: var(--color-primary);
  font-family: var(--font-display);
  font-size: var(--type-headline-md-size);
  line-height: var(--type-headline-md-line);
  text-transform: uppercase;
  transition:
    background var(--motion-smooth),
    color var(--motion-smooth),
    border-color var(--motion-smooth),
    box-shadow var(--motion-smooth);
}

.people-panel__diner--active .people-panel__avatar {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: var(--color-on-primary);
  box-shadow:
    0 0 0 var(--space-2xs) var(--color-surface-container),
    0 0 0 var(--space-xs) var(--color-primary);
}

.people-panel__check {
  position: absolute;
  right: calc(var(--space-2xs) * -1);
  bottom: calc(var(--space-2xs) * -1);
  width: var(--space-md);
  height: var(--space-md);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-pill);
  background: var(--color-surface-container);
  color: var(--color-primary);
}

.people-panel__check .material-symbols-outlined {
  font-size: var(--type-label-sm-size);
  font-variation-settings: 'wght' 700;
}

.people-panel__name {
  max-width: 100%;
  overflow: hidden;
  color: inherit;
  font-size: var(--type-body-sm-size);
  line-height: var(--type-body-sm-line);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.people-panel__diner--active .people-panel__name {
  color: var(--color-primary);
}

@media (min-width: 768px) {
  .people-panel {
    padding: var(--space-lg);
  }
}

@media (min-width: 1024px) {
  .scan-layout {
    grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
  }

  .scan-side-panel {
    position: sticky;
    top: calc(var(--top-bar-height) + var(--space-lg));
  }
}
</style>
