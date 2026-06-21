export enum ReceiptVariant {
  Classic = 'classic',
  Polished = 'polished',
}

export interface ReceiptVariantSwitchEmits {
  'update:modelValue': [modelValue: ReceiptVariant]
}

export interface ReceiptVariantSwitchProps {
  modelValue: ReceiptVariant
}
