<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthField from '@/components/auth/AuthField.vue'
import AuthShell from '@/components/auth/AuthShell.vue'
import AuthSwitch from '@/components/auth/AuthSwitch.vue'
import { AuthFieldType } from '@/components/auth/types/auth-field'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)
const redirectPath = computed(() => {
  const redirect = route.query.redirect

  if (typeof redirect !== 'string' || !redirect.startsWith('/') || redirect.startsWith('//')) {
    return '/manual'
  }

  return redirect
})

/**
 * Authenticates the user and opens the app on success.
 */
async function submitLogin(): Promise<void> {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    const user = await authStore.login(email.value, password.value)

    if (user.email) {
      await router.push(redirectPath.value)
    }
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Unable to log in. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <AuthShell title="Welcome Back" description="Return to your table with ease.">
    <form class="auth-form stack-lg" @submit.prevent="submitLogin">
      <div v-if="errorMessage" class="form-message form-message--error" role="alert">
        {{ errorMessage }}
      </div>

      <div class="stack-md">
        <AuthField
          id="email"
          v-model="email"
          label="Email Address"
          autocomplete="email"
          placeholder="jean@example.com"
          :type="AuthFieldType.Email"
        />

        <AuthField
          id="password"
          v-model="password"
          label="Password"
          autocomplete="current-password"
          placeholder="••••••••"
          :type="AuthFieldType.Password"
        />
      </div>

      <button
        class="button button--gold-leaf button--full"
        type="submit"
        :disabled="isSubmitting || !email || !password"
      >
        <span>{{ isSubmitting ? 'Opening Table' : 'Log In' }}</span>
        <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
      </button>
    </form>

    <AuthSwitch prompt="Need a seat at the table?" label="Create Account" to="/sign-up" />
  </AuthShell>
</template>
