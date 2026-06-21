import type { ReceiptCalculation } from '@/lib/receipt-calculator'

export interface ClassicReceiptSummaryProps {
  calculation: ReceiptCalculation
  formatCurrency: (amount: number) => string
  formatSignedCurrency: (amount: number) => string
  isRoundingEnabled: boolean
  qrCodeImageUrl: string | null
}
