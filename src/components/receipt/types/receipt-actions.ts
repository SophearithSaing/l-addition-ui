export interface ReceiptActionsEmits {
  download: []
  'remove-qr': []
  'upload-qr': [event: Event]
}

export interface ReceiptActionsProps {
  hasQrCode: boolean
  isDownloading: boolean
}
