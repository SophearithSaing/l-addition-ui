<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthField from '@/components/auth/AuthField.vue'
import AuthShell from '@/components/auth/AuthShell.vue'
import AuthSwitch from '@/components/auth/AuthSwitch.vue'
import { AuthFieldType } from '@/components/auth/types/auth-field'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

/**
 * Creates an account and opens the app on success.
 */
async function submitSignUp(): Promise<void> {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    const user = await authStore.register(email.value, password.value)

    if (user.email) {
      await router.push('/manual')
    }
  } catch (error) {
    errorMessage.value = error instanceof Error
      ? error.message
      : 'Unable to create your account. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <AuthShell title="Join the Table" description="Elevate your dining experience.">
    <form class="auth-form stack-lg" @submit.prevent="submitSignUp">
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
          autocomplete="new-password"
          placeholder="••••••••"
          :type="AuthFieldType.Password"
        />
      </div>

      <button
        class="button button--gold-leaf button--full"
        type="submit"
        :disabled="isSubmitting || !email || password.length < 8"
      >
        <span>{{ isSubmitting ? 'Creating Account' : 'Create Account' }}</span>
        <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
      </button>
    </form>

    <AuthSwitch prompt="Already have an account?" label="Log in" to="/login" />
  </AuthShell>
</template>
