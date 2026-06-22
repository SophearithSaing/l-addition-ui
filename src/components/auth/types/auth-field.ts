export enum AuthFieldType {
  Email = 'email',
  Password = 'password',
  Text = 'text',
}

export interface AuthFieldProps {
  autocomplete: string
  id: string
  label: string
  placeholder: string
  required?: boolean
  type?: AuthFieldType
}
