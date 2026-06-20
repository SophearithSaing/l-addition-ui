import type { ManualItemRowType } from './manual-item-row'

export interface DinerCardItem {
  amount: string
  id: number
  name: string
}

export interface DinerCardDiner {
  id: number
  items: DinerCardItem[]
  name: string
}

export interface DinerCardProps {
  currencySymbol: string
  diner: DinerCardDiner
  itemRowType?: ManualItemRowType
}
