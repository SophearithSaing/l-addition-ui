export interface SharedParticipantSelectorDiner {
  id: number
  name: string
}

export interface SharedParticipantSelectorProps {
  diners: SharedParticipantSelectorDiner[]
  participantIds: number[]
}
