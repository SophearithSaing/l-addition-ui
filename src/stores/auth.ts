import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { authService, type AuthUser } from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const isCheckingSession = ref(false)

  const isAuthenticated = computed(() => user.value !== null)

  /**
   * Registers a user and stores the authenticated session state.
   *
   * @param email User email address.
   * @param password User password.
   * @returns Authenticated user.
   */
  async function register(email: string, password: string): Promise<AuthUser> {
    const response = await authService.register(email, password)
    user.value = response.user

    return response.user
  }

  /**
   * Logs in a user and stores the authenticated session state.
   *
   * @param email User email address.
   * @param password User password.
   * @returns Authenticated user.
   */
  async function login(email: string, password: string): Promise<AuthUser> {
    const response = await authService.login(email, password)
    user.value = response.user

    return response.user
  }

  /**
   * Loads the authenticated user from existing auth cookies.
   */
  async function loadSession(): Promise<void> {
    if (isCheckingSession.value) {
      return
    }

    isCheckingSession.value = true

    try {
      const response = await authService.getCurrentUser()
      user.value = response.user
    } catch {
      user.value = null
    } finally {
      isCheckingSession.value = false
    }
  }

  /**
   * Logs out the current user and clears local auth state.
   */
  async function logout(): Promise<void> {
    await authService.logout()
    user.value = null
  }

  return {
    isAuthenticated,
    isCheckingSession,
    loadSession,
    login,
    logout,
    register,
    user,
  }
})
