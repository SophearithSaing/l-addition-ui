export enum HomeChoiceCardType {
  Default = 'default',
  Scan = 'scan',
}

export interface HomeChoiceCardProps {
  description: string
  disabled?: boolean
  icon: string
  title: string
  to?: string
  type?: HomeChoiceCardType
}
