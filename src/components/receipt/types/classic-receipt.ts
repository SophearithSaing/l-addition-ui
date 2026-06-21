import type { ReceiptCalculation } from '@/lib/receipt-calculator'

export interface ClassicReceiptEmits {
  'toggle-all-diners': []
  'toggle-diner': [dinerId: number]
}

export interface ClassicReceiptExpose {
  getElement(): HTMLElement | null
}

export interface ClassicReceiptProps {
  areAllDinersExpanded: boolean
  calculation: ReceiptCalculation
  expandedDinerIds: number[]
  formatCurrency: (amount: number) => string
  formatSignedCurrency: (amount: number) => string
  isRoundingEnabled: boolean
  qrCodeImageUrl: string | null
  receiptDate: string
  restaurantName: string
}
