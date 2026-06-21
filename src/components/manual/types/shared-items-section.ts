import type { SharedParticipantSelectorDiner } from './shared-participant-selector'

export interface SharedItemsSectionItem {
  amount: string
  id: number
  name: string
  participantIds: number[]
}

export interface SharedItemsSectionProps {
  currencySymbol: string
  diners: SharedParticipantSelectorDiner[]
  sharedItems: SharedItemsSectionItem[]
}
