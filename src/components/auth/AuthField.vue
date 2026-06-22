<script setup lang="ts">
import { ref } from 'vue'
import { AuthFieldType, type AuthFieldProps } from './types/auth-field'

const model = defineModel<string>({ required: true })

withDefaults(defineProps<AuthFieldProps>(), {
  required: true,
  type: AuthFieldType.Text,
})

const showPassword = ref(false)
</script>

<template>
  <div class="field">
    <label class="field__label" :for="id">{{ label }}</label>

    <div class="field__control auth-field__control">
      <input
        :id="id"
        v-model="model"
        class="input input--stationery auth-field__input"
        :class="{ 'auth-field__input--with-action': type === AuthFieldType.Password }"
        :type="type === AuthFieldType.Password && showPassword ? 'text' : type"
        :name="id"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        :required="required"
      />

      <button
        v-if="type === AuthFieldType.Password"
        class="auth-field__action"
        type="button"
        :aria-label="showPassword ? 'Hide password' : 'Show password'"
        @click="showPassword = !showPassword"
      >
        <span class="material-symbols-outlined" aria-hidden="true">
          {{ showPassword ? 'visibility' : 'visibility_off' }}
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.auth-field__control {
  display: flex;
  align-items: center;
}

.auth-field__input {
  padding-inline: 0;
}

.auth-field__input--with-action {
  padding-right: var(--space-lg);
}

.auth-field__action {
  position: absolute;
  right: 0;
  display: inline-flex;
  width: var(--space-lg);
  height: var(--space-lg);
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--color-on-surface-variant);
  cursor: pointer;
  transition: color var(--motion-smooth);
}

.auth-field__action:hover {
  color: var(--color-primary);
}

.auth-field__action .material-symbols-outlined {
  font-size: var(--type-headline-sm-size);
}
</style>
