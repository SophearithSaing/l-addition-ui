import type { ReceiptDinerTotal } from '@/lib/receipt-calculator'

export interface ClassicReceiptDinerCardEmits {
  toggle: [dinerId: number]
}

export interface ClassicReceiptDinerCardProps {
  diner: ReceiptDinerTotal
  dinerIndex: number
  formatCurrency: (amount: number) => string
  formatSignedCurrency: (amount: number) => string
  isExpanded: boolean
  isRoundingEnabled: boolean
}
