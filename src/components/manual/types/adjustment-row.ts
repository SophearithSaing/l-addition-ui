export interface AdjustmentRowEmits {
  'amount-keydown': [event: KeyboardEvent]
  remove: []
  'update:amount': [amount: string]
  'update:label': [label: string]
}

export interface AdjustmentRowProps {
  amount: string
  currencySymbol: string
  label: string
}
