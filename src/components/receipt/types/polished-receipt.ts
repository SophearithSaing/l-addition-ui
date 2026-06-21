import type { ReceiptCalculation } from '@/lib/receipt-calculator'

export interface PolishedReceiptExpose {
  getElement(): HTMLElement | null
}

export interface PolishedReceiptProps {
  calculation: ReceiptCalculation
  formatCurrency: (amount: number) => string
  formatSignedCurrency: (amount: number) => string
  isRoundingEnabled: boolean
  qrCodeImageUrl: string | null
  receiptDate: string
  restaurantName: string
}
