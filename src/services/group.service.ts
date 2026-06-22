import { authService } from './auth.service'

export interface GroupRecord {
  _id: string
  createdAt: string
  creatorId: string
  name: string
  people: string[]
  updatedAt: string
}

export interface GroupResponse {
  group: GroupRecord
}

interface ErrorResponse {
  error?: string
}

export class GroupService {
  /**
   * Gets the authenticated user's dinner group.
   *
   * @returns Group response, or null when no group exists.
   */
  public async getGroup(): Promise<GroupResponse | null> {
    const response = await authService.sendAuthenticatedRequest('/groups')

    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      throw new Error(await this.getErrorMessage(response))
    }

    return response.json() as Promise<GroupResponse>
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

      return body.error ?? 'Unable to update your dinner group. Please try again.'
    } catch {
      return 'Unable to update your dinner group. Please try again.'
    }
  }
}

export const groupService = new GroupService()
