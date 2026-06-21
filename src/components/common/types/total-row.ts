export enum TotalRowType {
  Default = 'default',
  Total = 'total',
  GrandTotal = 'grand-total',
}

export interface TotalRowProps {
  label: string
  type?: TotalRowType
  value: string
}
