export interface SwitchControlEmits {
  'update:modelValue': [modelValue: boolean]
}

export interface SwitchControlProps {
  detail?: string
  modelValue: boolean
}
