import type { SharedParticipantSelectorDiner } from './shared-participant-selector'

export interface SharedItemsSectionItem {
  amount: string
  id: number
  name: string
  participantIds: number[]
}

export interface SharedItemsSectionProps {
  addLabel?: string
  currencySymbol: string
  diners: SharedParticipantSelectorDiner[]
  emptyText?: string
  namePlaceholder?: string
  participantLabel?: string
  removeLabel?: string
  sharedItems: SharedItemsSectionItem[]
  title?: string
}
