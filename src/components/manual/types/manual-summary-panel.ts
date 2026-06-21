import type { DiscountUnit } from './discount-control'

export interface ManualSummaryAdjustment {
  amount: string
  id: number
  label: string
}

export interface ManualSummaryPanelEmits {
  'add-adjustment': []
  'amount-keydown': [event: KeyboardEvent]
  'clear-bill': []
  'generate-receipt': []
  'remove-adjustment': [adjustmentId: number]
  'update:discount': [discount: string]
  'update:discountUnit': [discountUnit: DiscountUnit]
  'update:isRoundingEnabled': [isRoundingEnabled: boolean]
  'update:serviceCharge': [serviceCharge: string]
  'update:taxRate': [taxRate: string]
}

export interface ManualSummaryPanelProps {
  additionalAdjustmentsTotal: string
  adjustments: ManualSummaryAdjustment[]
  currencySymbol: string
  discount: string
  discountUnit: DiscountUnit
  hasBillData: boolean
  hasItems: boolean
  isRoundingEnabled: boolean
  serviceCharge: string
  subtotal: string
  taxAndFees: string
  taxRate: string
  total: string
}
