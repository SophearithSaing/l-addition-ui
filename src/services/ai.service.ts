import { authService } from './auth.service'

export interface ExtractedReceiptItem {
  amount: number
  name: string
}

export interface ExtractReceiptRecord {
  _id: string
  createdAt: string
  extractedObject: ExtractedReceiptItem[]
  fileName: string
  mimeType: string
  userId: string
}

export interface ExtractReceiptResponse {
  result: ExtractReceiptRecord
}

interface ErrorResponse {
  error?: string
}

export class AiService {
  /**
   * Uploads a receipt image and returns extracted receipt line items.
   *
   * @param file Receipt image file.
   * @returns Extracted receipt response.
   */
  public async extractReceipt(file: File): Promise<ExtractReceiptResponse> {
    const formData = new FormData()

    formData.append('image', file)

    const response = await authService.sendAuthenticatedRequest('/ai/extract-receipt', {
      body: formData,
      method: 'POST',
    })

    if (!response.ok) {
      throw new Error(await this.getErrorMessage(response))
    }

    return response.json() as Promise<ExtractReceiptResponse>
  }

  /**
   * Reads the backend error payload when available.
   *
   * @param response Failed fetch response.
   * @returns User-facing error message.
   */
  private async getErrorMessage(response: Response): Promise<string> {
    try {
      const body = (await response.json()) as ErrorResponse

      return body.error ?? 'Unable to scan this receipt. Please try again.'
    } catch {
      return 'Unable to scan this receipt. Please try again.'
    }
  }
}

export const aiService = new AiService()
