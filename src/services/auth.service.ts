const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export interface AuthUser {
  email: string
  id?: string
  userId?: string
}

export interface AuthResponse {
  user: AuthUser
}

export interface LogoutResponse {
  ok: boolean
}

interface AuthPayload {
  email: string
  password: string
}

interface ErrorResponse {
  error?: string
}

export class AuthService {
  private readonly baseUrl: string

  /**
   * Creates an auth service client.
   *
   * @param baseUrl API base URL.
   */
  public constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  /**
   * Registers a new account with the backend auth API.
   *
   * @param email User email address.
   * @param password User password.
   * @returns Authenticated user response.
   */
  public register(email: string, password: string): Promise<AuthResponse> {
    return this.sendAuthRequest('/auth/register', { email, password })
  }

  /**
   * Logs in an existing account with the backend auth API.
   *
   * @param email User email address.
   * @param password User password.
   * @returns Authenticated user response.
   */
  public login(email: string, password: string): Promise<AuthResponse> {
    return this.sendAuthRequest('/auth/login', { email, password })
  }

  /**
   * Gets the currently authenticated user from the backend.
   *
   * @returns Authenticated user response.
   */
  public async getCurrentUser(): Promise<AuthResponse> {
    const response = await this.sendAuthenticatedRequest('/me')

    if (!response.ok) {
      throw new Error(await this.getErrorMessage(response))
    }

    return this.parseAuthResponse(response)
  }

  /**
   * Rotates the refresh token and gets a new access token.
   *
   * @returns Authenticated user response.
   */
  public async refreshSession(): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(await this.getErrorMessage(response))
    }

    return this.parseAuthResponse(response)
  }

  /**
   * Logs out the current user and clears auth cookies.
   *
   * @returns Logout response.
   */
  public async logout(): Promise<LogoutResponse> {
    const response = await fetch(`${this.baseUrl}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(await this.getErrorMessage(response))
    }

    return response.json() as Promise<LogoutResponse>
  }

  /**
   * Sends an authenticated request and refreshes once when access expires.
   *
   * @param path API path to request.
   * @param init Fetch options.
   * @returns Fetch response after optional refresh retry.
   */
  public async sendAuthenticatedRequest(path: string, init: RequestInit = {}): Promise<Response> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      credentials: 'include',
    })

    if (response.status !== 401) {
      return response
    }

    await this.refreshSession()

    return fetch(`${this.baseUrl}${path}`, {
      ...init,
      credentials: 'include',
    })
  }

  /**
   * Sends an authentication request with credentials enabled.
   *
   * @param path API path to request.
   * @param payload Auth request body.
   * @returns Authenticated user response.
   */
  private async sendAuthRequest(path: string, payload: AuthPayload): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
      }),
    })

    if (!response.ok) {
      throw new Error(await this.getErrorMessage(response))
    }

    return this.parseAuthResponse(response)
  }

  /**
   * Parses and validates an auth response payload.
   *
   * @param response Successful fetch response.
   * @returns Authenticated user response.
   */
  private async parseAuthResponse(response: Response): Promise<AuthResponse> {
    const body = (await response.json()) as Partial<AuthResponse>

    if (!body.user?.email) {
      throw new Error('Authentication failed. Please try again.')
    }

    return body as AuthResponse
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

      return body.error ?? 'Something went wrong. Please try again.'
    } catch {
      return 'Something went wrong. Please try again.'
    }
  }
}

export const authService = new AuthService()
