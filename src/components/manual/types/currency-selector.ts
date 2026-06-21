export enum CurrencyCode {
  Custom = 'custom',
  Thb = 'THB',
  Usd = 'USD',
}

export interface CurrencySelectorProps {
  currency: CurrencyCode
  customCurrency: string
  label: string
}
