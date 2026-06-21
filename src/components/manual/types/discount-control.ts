export type DiscountUnit = 'fixed' | 'percentage'

export interface DiscountControlProps {
  currencySymbol: string
  discount: string
  discountUnit: DiscountUnit
}
