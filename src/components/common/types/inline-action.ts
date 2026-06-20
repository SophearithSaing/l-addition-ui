export enum InlineActionType {
  Accent = 'accent',
  Muted = 'muted',
  Icon = 'icon',
}

export interface InlineActionProps {
  ariaLabel?: string
  disabled?: boolean
  icon?: string
  text?: string
  type?: InlineActionType
}
