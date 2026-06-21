export enum PageHeroType {
  Home = 'home',
  Standard = 'standard',
}

export interface PageHeroProps {
  description?: string
  eyebrow?: string
  title: string
  titleId: string
  type?: PageHeroType
}
