export enum ManualItemRowType {
  Default = 'default',
  Active = 'active',
}

export interface ManualItemRowProps {
  amount: string
  amountPlaceholder?: string
  currencySymbol: string
  name: string
  namePlaceholder: string
  removeLabel: string
  type?: ManualItemRowType
}
