export enum SectionHeaderLevel {
  Two = 'h2',
  Three = 'h3',
}

export enum SectionHeaderType {
  Default = 'default',
  Baseline = 'baseline',
  Receipt = 'receipt',
}

export interface SectionHeaderProps {
  level?: SectionHeaderLevel
  title: string
  titleId: string
  type?: SectionHeaderType
}
